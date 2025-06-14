import Link from 'next/link';
import {
  FolderOpen,
  Building2,
  Bell,
  BarChart3,
  CheckSquare,
  FileText,
  Calendar,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { db } from '@/db';
import { tenders, tasks, clients, activityLogs } from '@/db/schema';
import { count, eq, and, desc, sql, gte, lte } from 'drizzle-orm';

// Data fetching functions
async function getDashboardStats() {
  const [
    activeTendersCount,
    pendingTasksCount,
    upcomingDeadlinesCount,
    totalClientsCount,
  ] = await Promise.all([
    // Active tenders (not cancelled, rejected, or completed)
    db
      .select({ count: count() })
      .from(tenders)
      .where(
        and(
          eq(tenders.isDeleted, false),
          sql`${tenders.status} NOT IN ('cancelled', 'rejected', 'awarded')`
        )
      ),

    // Pending tasks (not completed)
    db
      .select({ count: count() })
      .from(tasks)
      .where(and(eq(tasks.isDeleted, false), eq(tasks.isCompleted, false))),

    // Upcoming deadlines (next 30 days)
    db
      .select({ count: count() })
      .from(tenders)
      .where(
        and(
          eq(tenders.isDeleted, false),
          gte(tenders.submissionDeadline, new Date()),
          lte(
            tenders.submissionDeadline,
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          )
        )
      ),

    // Total active clients
    db
      .select({ count: count() })
      .from(clients)
      .where(and(eq(clients.isDeleted, false), eq(clients.isActive, true))),
  ]);

  return {
    activeTenders: activeTendersCount[0]?.count || 0,
    pendingTasks: pendingTasksCount[0]?.count || 0,
    upcomingDeadlines: upcomingDeadlinesCount[0]?.count || 0,
    totalClients: totalClientsCount[0]?.count || 0,
  };
}

async function getRecentActivity() {
  const activities = await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      details: activityLogs.details,
      createdAt: activityLogs.createdAt,
      tenderTitle: tenders.title,
      tenderReferenceNumber: tenders.referenceNumber,
    })
    .from(activityLogs)
    .leftJoin(tenders, eq(activityLogs.tenderId, tenders.id))
    .orderBy(desc(activityLogs.createdAt))
    .limit(5);

  return activities.map((activity) => ({
    id: activity.id,
    action: activity.action,
    tender:
      activity.tenderTitle ||
      activity.tenderReferenceNumber ||
      'System Activity',
    time: getRelativeTime(activity.createdAt),
    details: activity.details,
  }));
}

async function getUpcomingDeadlines() {
  const deadlines = await db
    .select({
      id: tenders.id,
      title: tenders.title,
      referenceNumber: tenders.referenceNumber,
      submissionDeadline: tenders.submissionDeadline,
      status: tenders.status,
    })
    .from(tenders)
    .where(
      and(
        eq(tenders.isDeleted, false),
        gte(tenders.submissionDeadline, new Date()),
        sql`${tenders.status} NOT IN ('cancelled', 'rejected', 'awarded')`
      )
    )
    .orderBy(tenders.submissionDeadline)
    .limit(5);

  return deadlines.map((tender) => ({
    id: tender.id,
    tender: tender.title || tender.referenceNumber,
    deadline: tender.submissionDeadline?.toISOString().split('T')[0] || '',
    daysLeft: tender.submissionDeadline
      ? Math.ceil(
          (tender.submissionDeadline.getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      : 0,
    status: tender.status,
  }));
}

// Helper function to format relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays === 1) {
    return '1 day ago';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export default async function DashboardPage() {
  // Fetch all dashboard data
  const [dashboardStats, recentActivity, upcomingDeadlines] = await Promise.all(
    [getDashboardStats(), getRecentActivity(), getUpcomingDeadlines()]
  );
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here&apos;s what&apos;s happening with your tenders
            today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Tenders
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardStats.activeTenders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <CheckSquare className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Tasks
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardStats.pendingTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <Clock className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Urgent Deadlines
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardStats.upcomingDeadlines}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Clients
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardStats.totalClients}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/dashboard/admin"
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                    Admin Dashboard
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Manage tenders, clients, users, and system settings
                </p>
              </Link>

              <Link
                href="/tenders"
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-green-300 dark:hover:border-green-600 transition-all duration-200"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                    <FolderOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                    View Tenders
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Browse and manage all tender submissions
                </p>
              </Link>

              <Link
                href="/tasks"
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                    <CheckSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                    My Tasks
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  View and complete assigned tasks
                </p>
              </Link>

              <Link
                href="/clients"
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                    <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                    Clients
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Manage client relationships and contacts
                </p>
              </Link>

              <Link
                href="/documents"
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                    Documents
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Access and organize tender documents
                </p>
              </Link>

              <Link
                href="/reports"
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-200"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg group-hover:bg-teal-200 dark:group-hover:bg-teal-800 transition-colors">
                    <TrendingUp className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                    Reports
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Generate performance and analytics reports
                </p>
              </Link>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {activity.tender}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/activity"
                className="block mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                View all activity →
              </Link>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-3">
                {upcomingDeadlines.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.tender}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Due: {new Date(item.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.daysLeft <= 7
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {item.daysLeft}d left
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/deadlines"
                className="block mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                View all deadlines →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
