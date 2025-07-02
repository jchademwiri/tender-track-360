import { db } from '@/db';
import {
  tenders,
  projects,
  tenderCategories,
  clients,
  users,
  activityLogs,
} from '@/db/schema';
import { eq, gte, desc, and, sql } from 'drizzle-orm';

// 1. Tenders Overview Report
export async function getTendersByStatus() {
  return db
    .select({
      status: tenders.status,
      count: sql<number>`count(*)`,
    })
    .from(tenders)
    .where(eq(tenders.isDeleted, false))
    .groupBy(tenders.status);
}

export async function getTendersByCategory() {
  return db
    .select({
      category: tenderCategories.name,
      count: sql<number>`count(*)`,
    })
    .from(tenders)
    .innerJoin(tenderCategories, eq(tenders.categoryId, tenderCategories.id))
    .where(eq(tenders.isDeleted, false))
    .groupBy(tenderCategories.name);
}

export async function getTendersByClient() {
  return db
    .select({ client: clients.name, count: sql<number>`count(*)` })
    .from(tenders)
    .innerJoin(clients, eq(tenders.clientId, clients.id))
    .where(eq(tenders.isDeleted, false))
    .groupBy(clients.name);
}

export async function getUpcomingTenderDeadlines() {
  return db
    .select({
      id: tenders.id,
      title: tenders.title,
      submissionDeadline: tenders.submissionDeadline,
    })
    .from(tenders)
    .where(
      and(
        eq(tenders.isDeleted, false),
        gte(tenders.submissionDeadline, new Date())
      )
    )
    .orderBy(tenders.submissionDeadline)
    .limit(10);
}

// 2. Projects Overview Report
export async function getProjectsByStatus() {
  return db
    .select({
      status: projects.status,
      count: sql<number>`count(*)`,
    })
    .from(projects)
    .groupBy(projects.status);
}

export async function getProjectsByClient() {
  return db
    .select({ client: clients.name, count: sql<number>`count(*)` })
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .groupBy(clients.name);
}

export async function getTopProjectsByValue(limit = 10) {
  return db
    .select({
      id: projects.id,
      title: projects.title,
      estimatedValue: projects.estimatedValue,
    })
    .from(projects)
    .orderBy(desc(projects.estimatedValue))
    .limit(limit);
}

export async function getRecentProjectAwards(limit = 10) {
  return db
    .select({
      id: projects.id,
      title: projects.title,
      awardDate: projects.awardDate,
    })
    .from(projects)
    .orderBy(desc(projects.awardDate))
    .limit(limit);
}

// 3. Financial Report
export async function getTotalAwardedTenderValue() {
  return db
    .select({ totalValue: sql<number>`sum(${tenders.estimatedValue})` })
    .from(tenders)
    .where(and(eq(tenders.isDeleted, false), eq(tenders.status, 'awarded')));
}

export async function getAwardedTenderValueByClient() {
  return db
    .select({
      client: clients.name,
      totalValue: sql<number>`sum(${tenders.estimatedValue})`,
    })
    .from(tenders)
    .innerJoin(clients, eq(tenders.clientId, clients.id))
    .where(and(eq(tenders.isDeleted, false), eq(tenders.status, 'awarded')))
    .groupBy(clients.name);
}

export async function getAwardedTenderValueByCategory() {
  return db
    .select({
      category: tenderCategories.name,
      totalValue: sql<number>`sum(${tenders.estimatedValue})`,
    })
    .from(tenders)
    .innerJoin(tenderCategories, eq(tenders.categoryId, tenderCategories.id))
    .where(and(eq(tenders.isDeleted, false), eq(tenders.status, 'awarded')))
    .groupBy(tenderCategories.name);
}

export async function getMonthlyAwardedTenderValue() {
  return db
    .select({
      month: sql<string>`date_trunc('month', ${tenders.awardDate})`,
      totalValue: sql<number>`sum(${tenders.estimatedValue})`,
    })
    .from(tenders)
    .where(and(eq(tenders.isDeleted, false), eq(tenders.status, 'awarded')))
    .groupBy(sql`date_trunc('month', ${tenders.awardDate})`)
    .orderBy(sql`date_trunc('month', ${tenders.awardDate})`);
}

// 4. Performance Report
export async function getAverageDaysToAward() {
  return db
    .select({
      avgDaysToAward: sql<number>`avg(${tenders.awardDate} - ${tenders.submissionDeadline})`,
    })
    .from(tenders)
    .where(and(eq(tenders.isDeleted, false), eq(tenders.status, 'awarded')));
}

export async function getTendersHandledPerManager() {
  return db
    .select({ manager: users.fullName, count: sql<number>`count(*)` })
    .from(tenders)
    .innerJoin(users, eq(tenders.updatedById, users.id))
    .where(eq(tenders.isDeleted, false))
    .groupBy(users.fullName);
}

export async function getProjectCompletionRate() {
  const [{ completed = 0 }] = await db
    .select({ completed: sql<number>`count(*)` })
    .from(projects)
    .where(eq(projects.status, 'completed'));

  const [{ total = 0 }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(projects);

  return total === 0 ? 0 : completed / total;
}

// 5. User Activity Report
export async function getActiveUsersLast30Days() {
  return db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(
      and(
        eq(users.isActive, true),
        gte(users.lastLogin, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      )
    );
}

export async function getActionsByUserRole() {
  return db
    .select({
      fullName: users.fullName,
      role: users.role,
      actions: sql<number>`count(*)`,
    })
    .from(activityLogs)
    .innerJoin(users, eq(activityLogs.userId, users.id))
    .groupBy(users.fullName, users.role)
    .orderBy(desc(sql`count(*)`));
}

export async function getRecentLogins() {
  return db
    .select({
      fullName: users.fullName,
      email: users.email,
      lastLogin: users.lastLogin,
    })
    .from(users)
    .where(eq(users.isActive, true))
    .orderBy(desc(users.lastLogin))
    .limit(10);
}

// 6. Client Engagement Report
export async function getMostActiveClients() {
  return db
    .select({ name: clients.name, tenderCount: sql<number>`count(*)` })
    .from(tenders)
    .innerJoin(clients, eq(tenders.clientId, clients.id))
    .where(eq(tenders.isDeleted, false))
    .groupBy(clients.name)
    .orderBy(desc(sql`count(*)`))
    .limit(10);
}

export async function getClientsWithMostAwardedTenders() {
  return db
    .select({ name: clients.name, awardedCount: sql<number>`count(*)` })
    .from(tenders)
    .innerJoin(clients, eq(tenders.clientId, clients.id))
    .where(and(eq(tenders.isDeleted, false), eq(tenders.status, 'awarded')))
    .groupBy(clients.name)
    .orderBy(desc(sql`count(*)`))
    .limit(10);
}
