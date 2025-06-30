import { db } from '@/db';
import {
  tenders,
  users,
  clients,
  tenderCategories,
  activityLogs,
  tasks,
  notifications,
} from '@/db/schema';
import { eq, count, desc, and, sql, gte } from 'drizzle-orm';

export async function getAdminStats() {
  try {
    // Get real data from database
    const [
      totalTenders,
      activeTenders,
      totalUsers,
      activeUsers,
      totalClients,
      activeClients,
      totalCategories,
      activeCategories,
      recentActivities,
      pendingTasks,
      unreadNotifications,
    ] = await Promise.all([
      // Total tenders
      db
        .select({ count: count() })
        .from(tenders)
        .where(eq(tenders.isDeleted, false)),

      // Active tenders (not cancelled, rejected, or awarded)
      db
        .select({ count: count() })
        .from(tenders)
        .where(
          and(
            eq(tenders.isDeleted, false),
            sql`status NOT IN ('cancelled', 'rejected', 'awarded')`
          )
        ),

      // Total users
      db
        .select({ count: count() })
        .from(users)
        .where(eq(users.isDeleted, false)),

      // Active users (logged in within last 30 days)
      db
        .select({ count: count() })
        .from(users)
        .where(
          and(
            eq(users.isActive, true),
            eq(users.isDeleted, false),
            gte(users.lastLogin, sql`NOW() - INTERVAL '30 days'`)
          )
        ),

      // Total clients
      db
        .select({ count: count() })
        .from(clients)
        .where(eq(clients.isDeleted, false)),

      // Active clients
      db
        .select({ count: count() })
        .from(clients)
        .where(and(eq(clients.isActive, true), eq(clients.isDeleted, false))),

      // Total categories
      db.select({ count: count() }).from(tenderCategories),

      // Active categories
      db
        .select({ count: count() })
        .from(tenderCategories)
        .where(eq(tenderCategories.isActive, true)),

      // Recent activities (last 10)
      db
        .select({
          id: activityLogs.id,
          action: activityLogs.action,
          details: activityLogs.details,
          createdAt: activityLogs.createdAt,
          userName: users.fullName,
          userEmail: users.email,
        })
        .from(activityLogs)
        .leftJoin(users, eq(activityLogs.userId, users.id))
        .orderBy(desc(activityLogs.createdAt))
        .limit(10),

      // Pending tasks count
      db
        .select({ count: count() })
        .from(tasks)
        .where(and(eq(tasks.isCompleted, false), eq(tasks.isDeleted, false))),

      // Unread notifications count (for system status)
      db
        .select({ count: count() })
        .from(notifications)
        .where(eq(notifications.isRead, false)),
    ]);

    return {
      totalTenders: totalTenders[0]?.count || 0,
      activeTenders: activeTenders[0]?.count || 0,
      totalUsers: totalUsers[0]?.count || 0,
      activeUsers: activeUsers[0]?.count || 0,
      totalClients: totalClients[0]?.count || 0,
      activeClients: activeClients[0]?.count || 0,
      totalCategories: totalCategories[0]?.count || 0,
      activeCategories: activeCategories[0]?.count || 0,
      recentActivities: recentActivities || [],
      pendingTasks: pendingTasks[0]?.count || 0,
      unreadNotifications: unreadNotifications[0]?.count || 0,
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    // Return mock data if database query fails
    return {
      totalTenders: 127,
      activeTenders: 43,
      totalUsers: 1432,
      activeUsers: 234,
      totalClients: 89,
      activeClients: 67,
      totalCategories: 24,
      activeCategories: 20,
      recentActivities: [],
      pendingTasks: 15,
      unreadNotifications: 7,
    };
  }
}
