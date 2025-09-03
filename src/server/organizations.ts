'use server';

import { db } from '@/db';
import { member, organization } from '@/db/schema';

import { eq, inArray, and } from 'drizzle-orm/sql/expressions/conditions';
import { getCurrentUser } from './users';

export async function getorganizations() {
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
  return organizations;
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
