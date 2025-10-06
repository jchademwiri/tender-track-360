import { getCurrentUser } from '@/server';
import { getTenderStats } from '@/server/tenders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TendersOverviewPage() {
  const { session } = await getCurrentUser();

  if (!session.activeOrganizationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            No Organization Selected
          </h2>
          <p className="text-gray-600">
            Please select an organization to view tender overview.
          </p>
        </div>
      </div>
    );
  }

  // Fetch tender statistics
  const statsResult = await getTenderStats(session.activeOrganizationId);
  const stats = statsResult.success
    ? statsResult.stats
    : {
        totalTenders: 0,
        statusCounts: {
          draft: 0,
          submitted: 0,
          won: 0,
          lost: 0,
          pending: 0,
        },
        totalValue: 0,
      };

  const winRate =
    stats.totalTenders > 0
      ? Math.round((stats.statusCounts.won / stats.totalTenders) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Tender Management Overview
        </h1>
        <p className="text-muted-foreground">
          Manage your tender applications and track submission progress.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenders}</div>
            <p className="text-xs text-muted-foreground">
              All tender applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.statusCounts.draft +
                stats.statusCounts.submitted +
                stats.statusCounts.pending}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.statusCounts.won}
            </div>
            <p className="text-xs text-muted-foreground">Successful tenders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{winRate}%</div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {stats.statusCounts.draft}
              </div>
              <p className="text-sm text-muted-foreground">Draft</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.statusCounts.submitted}
              </div>
              <p className="text-sm text-muted-foreground">Submitted</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.statusCounts.pending}
              </div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.statusCounts.won}
              </div>
              <p className="text-sm text-muted-foreground">Won</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.statusCounts.lost}
              </div>
              <p className="text-sm text-muted-foreground">Lost</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Value */}
      <Card>
        <CardHeader>
          <CardTitle>Total Tender Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${stats.totalValue.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">
            Combined value of all tenders
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
