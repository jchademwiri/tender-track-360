'use server';

import { db } from '@/db';
import { member, organization } from '@/db/schema';

import { eq, inArray } from 'drizzle-orm/sql/expressions/conditions';
import { getCurrentUser } from './users';

export async function getOrganisations() {
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
// https://youtu.be/grvwy4qySVI?list=PLb3Vtl4F8GHTUJ_RmNINhE6GxB97otFzS&t=863
