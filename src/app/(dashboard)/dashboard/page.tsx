import { redirect } from 'next/navigation';

import { checkUserSession } from '@/lib/session-check';
import {
  getDashboardData,
  formatCurrency,
  formatPercentage,
  formatNumber,
} from '@/lib/dashboard-data';
import { MetricCard } from '@/components/ui/metric-card';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Banknote, Target, Calendar } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { auth } = await import('@/lib/auth');
  const { headers } = await import('next/headers');
  const headersList = await headers();

  // Check if user has an organization
  const sessionCheck = await checkUserSession();

  if (!sessionCheck.hasSession) {
    redirect('/login');
  }

  if (!sessionCheck.hasOrganization) {
    redirect('/onboarding');
  }

  // Fetch dashboard data
  const dashboardData = await getDashboardData(
    sessionCheck.activeOrganizationId!
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your tender management
            activities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/tenders/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Tender
            </Link>
          </Button>
          {(
            await auth.api.hasPermission({
              headers: headersList,
              body: {
                permissions: {
                  purchase_order: ['create'],
                },
              },
            })
          ).success && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/projects/purchase-orders/create">
                <Plus className="mr-2 h-4 w-4" />
                Create PO
              </Link>
            </Button>
          )}

          {(
            await auth.api.hasPermission({
              headers: headersList,
              body: {
                permissions: {
                  project: ['create'],
                },
              },
            })
          ).success && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/projects/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Link>
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/clients/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Client
            </Link>
          </Button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Pipeline Value"
          value={formatCurrency(dashboardData.tenderStats.totalValue)}
          description="Combined value of all tenders"
          icon={<Banknote className="h-4 w-4" />}
          trend={{
            value: dashboardData.tenderStats.trends?.value || 0,
            isPositive: (dashboardData.tenderStats.trends?.value || 0) >= 0,
          }}
        />
        <MetricCard
          title="Win Rate"
          value={formatPercentage(dashboardData.tenderStats.winRate)}
          description="Percentage of won tenders"
          icon={<Target className="h-4 w-4" />}
          trend={{
            value: dashboardData.tenderStats.trends?.winRate || 0,
            isPositive: (dashboardData.tenderStats.trends?.winRate || 0) >= 0,
          }}
        />
        <MetricCard
          title="Active Projects"
          value={formatNumber(dashboardData.projectStats.totalProjects)}
          description="Currently active projects"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{
            value: dashboardData.projectStats.growth,
            isPositive: dashboardData.projectStats.growth > 0,
          }}
        />
        <MetricCard
          title="Upcoming Deadlines"
          value={formatNumber(dashboardData.tenderStats.upcomingDeadlines)}
          description="Due in next 30 days"
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Tenders"
          value={formatNumber(dashboardData.tenderStats.totalTenders)}
          description={`${dashboardData.tenderStats.statusCounts.draft} draft, ${dashboardData.tenderStats.statusCounts.submitted} submitted`}
        />
        <MetricCard
          title="Client Engagement"
          value={`${dashboardData.clientStats.clientsWithContact}/${dashboardData.clientStats.totalClients}`}
          description="Clients with complete contact info"
        />
        <MetricCard
          title="Purchase Orders"
          value={formatNumber(dashboardData.projectStats.activePOs)}
          description={`Total: ${formatCurrency(dashboardData.projectStats.totalPOAmount)}`}
        />
        <MetricCard
          title="Overdue Items"
          value={formatNumber(dashboardData.tenderStats.overdueCount)}
          description="Tenders past submission date"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tender Status Distribution</CardTitle>
            <CardDescription>
              Current breakdown of tender statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(dashboardData.tenderStats.statusCounts).map(
                ([status, count]) => {
                  if (count === 0) return null;
                  const percentage =
                    dashboardData.tenderStats.totalTenders > 0
                      ? (count / dashboardData.tenderStats.totalTenders) * 100
                      : 0;
                  const width = `${Math.max(percentage, 5)}%`;

                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize font-medium">{status}</span>
                        <span className="text-muted-foreground">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            status === 'won'
                              ? 'bg-green-500'
                              : status === 'lost'
                                ? 'bg-red-500'
                                : status === 'submitted'
                                  ? 'bg-blue-500'
                                  : status === 'pending'
                                    ? 'bg-yellow-500'
                                    : 'bg-gray-500'
                          }`}
                          style={{ width }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>
              Tender activity over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <p>Not enough data for trends yet</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest project and tender activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentActivity.length > 0 ? (
                  dashboardData.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type.includes('created')
                            ? 'bg-green-500'
                            : activity.type.includes('status')
                              ? 'bg-blue-500'
                              : 'bg-gray-500'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>Tenders due in the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.tenderStats.upcomingDeadlines > 0 ? (
                  // TODO: The API currently returns a count, we need the actual items.
                  // For MVP stability without changing the backend return type in this task,
                  // we'll show a summary message or simply links to the tenders page.
                  <div className="text-center py-4">
                    <p className="text-sm font-medium mb-2">
                      {dashboardData.tenderStats.upcomingDeadlines} tenders due
                      soon
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/tenders?sort=deadline">
                        View Tenders
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No upcoming deadlines</p>
                    <p className="text-xs">All tenders are up to date</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
