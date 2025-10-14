import { redirect } from 'next/navigation';

import { checkUserSession } from '@/lib/session-check';
import {
  getDashboardData,
  formatCurrency,
  formatPercentage,
  formatNumber,
} from '@/lib/dashboard-data';
import { MetricCard } from '@/components/ui/metric-card';
import { ActivityTimeline } from '@/components/dashboard/widgets/activity-timeline';
import { UpcomingDeadlines } from '@/components/dashboard/widgets/upcoming-deadlines';
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
              Charts will be available after fixing build issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Chart component temporarily disabled
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>
              Charts will be available after fixing build issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Chart component temporarily disabled
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityTimeline activities={[]} />
        </div>
        <div>
          <UpcomingDeadlines deadlines={[]} />
        </div>
      </div>
    </div>
  );
}
