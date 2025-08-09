import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { hasMinimumRole, type UserRole } from '@/lib/roles';

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/sign-in');
  }

  return session;
}

export async function requireRole(requiredRole: string) {
  const session = await requireAuth();

  // Get user's role in the active organization
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  const activeOrg = organizations.data?.find(
    (org) => org.id === session.user.activeOrganizationId
  );

  if (!activeOrg || !hasRole(activeOrg.role, requiredRole)) {
    throw new Error('Insufficient permissions');
  }

  return session;
}

export function hasRole(userRole: string, requiredRole: string): boolean {
  return hasMinimumRole(userRole as UserRole, requiredRole as UserRole);
}

export async function getActiveOrganization() {
  const session = await requireAuth();

  if (!session.user.activeOrganizationId) {
    throw new Error('No active organization');
  }

  const organization = await auth.api.getFullOrganization({
    query: {
      organizationId: session.user.activeOrganizationId,
    },
    headers: await headers(),
  });

  if (!organization.data) {
    throw new Error('Organization not found');
  }

  return organization.data;
}

export async function switchOrganization(organizationId: string) {
  const session = await requireAuth();

  // Verify user is a member of the organization
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  const targetOrg = organizations.data?.find(
    (org) => org.id === organizationId
  );

  if (!targetOrg) {
    throw new Error('Organization not found or access denied');
  }

  // Update active organization in session
  await auth.api.setActiveOrganization({
    body: {
      organizationId,
    },
    headers: await headers(),
  });

  return targetOrg;
}
