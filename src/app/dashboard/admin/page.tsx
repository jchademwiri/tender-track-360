import Link from 'next/link';
import {
  FileText,
  Users,
  Building,
  BarChart3,
  Tag,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { getAdminStats } from '@/db/queries/dashboard';

// Function to calculate growth percentage (mock calculation)
function calculateGrowth(): string {
  // In a real app, you'd compare with previous period data
  // For now, using a simple mock calculation
  const mockGrowth = Math.floor(Math.random() * 30) + 1;
  return `+${mockGrowth}%`;
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  // Calculate derived stats
  const statsCards = [
    {
      title: 'Total Tenders',
      value: stats.totalTenders.toString(),
      change: calculateGrowth(),
      trend: 'up' as const,
      icon: FileText,
      color: 'blue' as const,
      subtitle: `${stats.activeTenders} active`,
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toString(),
      change: calculateGrowth(),
      trend: 'up' as const,
      icon: Users,
      color: 'green' as const,
      subtitle: `${stats.totalUsers} total`,
    },
    {
      title: 'Client Organizations',
      value: stats.activeClients.toString(),
      change: calculateGrowth(),
      trend: 'up' as const,
      icon: Building,
      color: 'purple' as const,
      subtitle: `${stats.totalClients} total`,
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks.toString(),
      change: '-5%', // Tasks should ideally decrease
      trend: 'down' as const,
      icon: Clock,
      color: 'orange' as const,
      subtitle: 'Need attention',
    },
  ];

  // Format recent activities
  const formattedActivities =
    stats.recentActivities.length > 0
      ? stats.recentActivities.map((activity) => ({
          id: activity.id,
          action: activity.action,
          description:
            activity.details ||
            `Action by ${
              activity.userName || activity.userEmail || 'Unknown user'
            }`,
          time: formatTimeAgo(activity.createdAt),
          status: getActivityStatus(activity.action),
          icon: getActivityIcon(activity.action),
        }))
      : [
          // Mock data when no activities available
          {
            id: '1',
            action: 'New tender published',
            description: 'IT Infrastructure Upgrade - City of Cape Town',
            time: '2 hours ago',
            status: 'published',
            icon: FileText,
          },
          {
            id: '2',
            action: 'User registered',
            description: 'TechCorp Solutions joined the platform',
            time: '4 hours ago',
            status: 'new',
            icon: Users,
          },
          {
            id: '3',
            action: 'Tender closed',
            description: 'Road Maintenance Project - Tender deadline reached',
            time: '6 hours ago',
            status: 'closed',
            icon: Clock,
          },
          {
            id: '4',
            action: 'Report generated',
            description: 'Monthly analytics report completed',
            time: '1 day ago',
            status: 'completed',
            icon: BarChart3,
          },
        ];

  const quickActions = [
    {
      title: 'Tenders',
      description: 'View and manage all tenders',
      href: '/dashboard/admin/tenders',
      icon: FileText,
      color: 'bg-blue-500',
      stats: `${stats.totalTenders} total, ${stats.activeTenders} active`,
    },
    {
      title: 'Clients',
      description: 'View and manage client organizations',
      href: '/dashboard/admin/clients',
      icon: Building,
      color: 'bg-purple-500',
      stats: `${stats.activeClients} active organizations`,
    },
    {
      title: 'Users',
      description: 'View and manage users',
      href: '/dashboard/admin/users',
      icon: Users,
      color: 'bg-green-500',
      stats: `${stats.activeUsers} active users`,
    },
    {
      title: 'Reports',
      description: 'Access reports and analytics',
      href: '/dashboard/admin/reports',
      icon: BarChart3,
      color: 'bg-orange-500',
      stats: 'Latest: Today',
    },
    {
      title: 'Categories',
      description: 'Manage tender categories',
      href: '/dashboard/admin/categories',
      icon: Tag,
      color: 'bg-pink-500',
      stats: `${stats.activeCategories} active categories`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Development Notice */}
      {stats.recentActivities.length === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Development Note:</strong> Using mock data for recent
              activities. Real database queries are working for stats (tenders:{' '}
              {stats.totalTenders}, users: {stats.totalUsers}, clients:{' '}
              {stats.totalClients}).
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your platform
            today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Eye className="w-4 h-4 inline mr-2" />
            View Site
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.subtitle}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    stat.color === 'blue'
                      ? 'bg-blue-100 dark:bg-blue-900/20'
                      : stat.color === 'green'
                      ? 'bg-green-100 dark:bg-green-900/20'
                      : stat.color === 'purple'
                      ? 'bg-purple-100 dark:bg-purple-900/20'
                      : 'bg-orange-100 dark:bg-orange-900/20'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      stat.color === 'blue'
                        ? 'text-blue-600 dark:text-blue-400'
                        : stat.color === 'green'
                        ? 'text-green-600 dark:text-green-400'
                        : stat.color === 'purple'
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-orange-600 dark:text-orange-400'
                    }`}
                  />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp
                  className={`w-4 h-4 mr-1 ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    stat.trend === 'up'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                  from last month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  href={action.href}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {action.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {action.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                        {action.stats}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6">
              <div className="space-y-4">
                {formattedActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          activity.status === 'published'
                            ? 'bg-blue-100 dark:bg-blue-900/20'
                            : activity.status === 'new'
                            ? 'bg-green-100 dark:bg-green-900/20'
                            : activity.status === 'closed'
                            ? 'bg-gray-100 dark:bg-gray-700'
                            : 'bg-orange-100 dark:bg-orange-900/20'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            activity.status === 'published'
                              ? 'text-blue-600 dark:text-blue-400'
                              : activity.status === 'new'
                              ? 'text-green-600 dark:text-green-400'
                              : activity.status === 'closed'
                              ? 'text-gray-600 dark:text-gray-400'
                              : 'text-orange-600 dark:text-orange-400'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3">
              <Link
                href="/dashboard/admin/activity"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                View all activity →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          System Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Database
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Operational
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                API Services
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Operational
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {stats.unreadNotifications > 5 ? (
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Notifications
              </p>
              <p
                className={`text-xs ${
                  stats.unreadNotifications > 5
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-green-600 dark:text-green-400'
                }`}
              >
                {stats.unreadNotifications} unread
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {stats.pendingTasks > 10 ? (
              <AlertCircle className="w-5 h-5 text-orange-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Tasks
              </p>
              <p
                className={`text-xs ${
                  stats.pendingTasks > 10
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-green-600 dark:text-green-400'
                }`}
              >
                {stats.pendingTasks} pending
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

function getActivityStatus(action: string): string {
  if (action.includes('publish') || action.includes('create'))
    return 'published';
  if (action.includes('register') || action.includes('new')) return 'new';
  if (action.includes('close') || action.includes('deadline')) return 'closed';
  return 'completed';
}

function getActivityIcon(action: string) {
  if (action.includes('tender')) return FileText;
  if (action.includes('user')) return Users;
  if (action.includes('report')) return BarChart3;
  if (action.includes('task')) return Clock;
  return FileText;
}
