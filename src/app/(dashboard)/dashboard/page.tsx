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
import { Plus, TrendingUp, DollarSign, Target, Calendar } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
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
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/projects/purchase-orders/create">
              <Plus className="mr-2 h-4 w-4" />
              Create PO
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/projects/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Link>
          </Button>
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
          icon={<DollarSign className="h-4 w-4" />}
          trend={{
            value: 12.5,
            isPositive: true,
          }}
        />
        <MetricCard
          title="Win Rate"
          value={formatPercentage(dashboardData.tenderStats.winRate)}
          description="Percentage of won tenders"
          icon={<Target className="h-4 w-4" />}
          trend={{
            value: 5.2,
            isPositive: true,
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
              {Object.entries(dashboardData.tenderStats.statusCounts).map(([status, count]) => {
                if (count === 0) return null;
                const percentage = dashboardData.tenderStats.totalTenders > 0
                  ? (count / dashboardData.tenderStats.totalTenders) * 100
                  : 0;
                const width = `${Math.max(percentage, 5)}%`;

                return (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize font-medium">{status}</span>
                      <span className="text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          status === 'won' ? 'bg-green-500' :
                          status === 'lost' ? 'bg-red-500' :
                          status === 'submitted' ? 'bg-blue-500' :
                          status === 'pending' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width }}
                      />
                    </div>
                  </div>
                );
              })}
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
            <div className="space-y-4">
              {/* Simple bar chart using CSS */}
              <div className="flex items-end justify-between h-32 gap-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => {
                  const height = `${Math.floor(Math.random() * 60) + 20}%`; // Sample data
                  return (
                    <div key={month} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-primary/80 rounded-t-sm transition-all duration-500 hover:bg-primary"
                        style={{ height }}
                      />
                      <span className="text-xs text-muted-foreground mt-2">{month}</span>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">+12.5%</div>
                  <div className="text-xs text-muted-foreground">Value Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+8.3%</div>
                  <div className="text-xs text-muted-foreground">Win Rate</div>
                </div>
              </div>
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
              <CardDescription>Latest project and tender activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New tender created</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Project status updated to Active</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tender deadline approaching</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
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
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Tender #12345</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        5 days
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Office Supplies Procurement
                    </p>
                    <div className="text-sm font-medium">$25,000</div>
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
