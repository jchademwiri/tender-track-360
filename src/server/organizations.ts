'use server';

import { db } from '@/db';
import { member, organization } from '@/db/schema';
import type { Organization, Role } from '@/db/schema';

import { eq, inArray, and } from 'drizzle-orm/sql/expressions/conditions';
import { count } from 'drizzle-orm';
import { getCurrentUser } from './users';

// Enhanced organization data with member counts and user roles
export interface OrganizationWithStats extends Organization {
  memberCount: number;
  userRole: Role;
  lastActivity?: Date;
}

export async function getorganizations(): Promise<OrganizationWithStats[]> {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }

    // Get user's memberships with role information
    const userMemberships = await db.query.member.findMany({
      where: eq(member.userId, currentUser.id),
      with: {
        organization: true,
      },
    });

    if (userMemberships.length === 0) {
      return [];
    }

    // Get organizations with enhanced data
    const organizationsWithStats: OrganizationWithStats[] = await Promise.all(
      userMemberships.map(async (membership) => {
        // Get member count for this organization
        const memberCountResult = await db
          .select({ count: count() })
          .from(member)
          .where(eq(member.organizationId, membership.organizationId));

        const memberCount = memberCountResult[0]?.count || 0;

        return {
          ...membership.organization,
          memberCount,
          userRole: membership.role as Role,
          lastActivity: membership.organization.createdAt, // Placeholder for now
        };
      })
    );

    return organizationsWithStats;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw new Error('Failed to fetch organizations');
  }
}

export async function getOrganizationsForProvider() {
  const { currentUser } = await getCurrentUser();
  const members = await db.query.member.findMany({
    where: eq(member.userId, currentUser?.id),
  });
  const organizations = await db.query.organization.findMany({
    where: inArray(
      organization.id,
      members.map((m) => m.organizationId)
    ),
  });
  // Filter and map to match the expected type for OrganizationProvider
  return organizations.map((org) => ({
    id: org.id,
    slug: org.slug || org.id, // Use ID as fallback if slug is null
    name: org.name,
  }));
}

export async function getActiveOrganization(userId: string) {
  const memberUser = await db.query.member.findFirst({
    where: eq(member.userId, userId),
  });

  if (!memberUser) {
    return null;
  }

  const activeOrganization = await db.query.organization.findFirst({
    where: eq(organization.id, memberUser.organizationId),
  });

  return activeOrganization;
}

export async function getUserOrganizationMembership(
  userId: string,
  organizationId: string
) {
  const membership = await db.query.member.findFirst({
    where: and(
      eq(member.userId, userId),
      eq(member.organizationId, organizationId)
    ),
    with: {
      organization: true,
    },
  });

  return membership;
}

export async function getOrganizationBySlug(slug: string) {
  try {
    const organizationBySlug = await db.query.organization.findFirst({
      where: eq(organization.slug, slug),
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
    });
    return organizationBySlug;
  } catch (error) {
    console.error('Error fetching organization by slug:', error);
    return null;
  }
}

// Organization statistics interface
export interface OrganizationStats {
  memberCount: number;
  lastActivity: Date;
  activeProjects?: number;
  recentUpdates?: number;
}

// Get detailed statistics for a specific organization
export async function getOrganizationStats(
  organizationId: string
): Promise<OrganizationStats | null> {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }

    // Verify user has access to this organization
    const userMembership = await db.query.member.findFirst({
      where: and(
        eq(member.userId, currentUser.id),
        eq(member.organizationId, organizationId)
      ),
    });

    if (!userMembership) {
      throw new Error('User does not have access to this organization');
    }

    // Get member count
    const memberCountResult = await db
      .select({ count: count() })
      .from(member)
      .where(eq(member.organizationId, organizationId));

    const memberCount = memberCountResult[0]?.count || 0;

    // Get organization details for last activity
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, organizationId),
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    return {
      memberCount,
      lastActivity: org.createdAt, // Placeholder - in real app this would be actual last activity
      activeProjects: 0, // Placeholder - would be calculated from projects table
      recentUpdates: 0, // Placeholder - would be calculated from activity logs
    };
  } catch (error) {
    console.error('Error fetching organization stats:', error);
    return null;
  }
}

// Get statistics for multiple organizations
export async function getOrganizationsStats(
  organizationIds: string[]
): Promise<Record<string, OrganizationStats>> {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }

    // Verify user has access to these organizations
    const userMemberships = await db.query.member.findMany({
      where: and(
        eq(member.userId, currentUser.id),
        inArray(member.organizationId, organizationIds)
      ),
    });

    const accessibleOrgIds = userMemberships.map((m) => m.organizationId);
    const stats: Record<string, OrganizationStats> = {};

    // Get stats for each accessible organization
    await Promise.all(
      accessibleOrgIds.map(async (orgId) => {
        const orgStats = await getOrganizationStats(orgId);
        if (orgStats) {
          stats[orgId] = orgStats;
        }
      })
    );

    return stats;
  } catch (error) {
    console.error('Error fetching organizations stats:', error);
    return {};
  }
}
