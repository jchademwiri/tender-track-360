'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Briefcase, TrendingUp, Banknote } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

interface ReportStatsProps {
  stats: {
    totalTenders: number;
    wonTenders: number;
    lostTenders: number;
    pendingTenders: number;
    activeProjects: number;
    winRate: number;
    pipelineValue: number;
    revenueSecured: number;
  };
}

export function ReportStatsCards({ stats }: ReportStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Win Rate Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          <Trophy className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.winRate}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.wonTenders} won / {stats.lostTenders} lost
          </p>
        </CardContent>
      </Card>

      {/* Revenue Secured Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue Secured</CardTitle>
          <Banknote className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.revenueSecured)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total value of won tenders
          </p>
        </CardContent>
      </Card>

      {/* Pipeline Value Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
          <Target className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.pipelineValue)}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingTenders} tenders pending decision
          </p>
        </CardContent>
      </Card>

      {/* Active Projects Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <Briefcase className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeProjects}</div>
          <p className="text-xs text-muted-foreground">Currently in progress</p>
        </CardContent>
      </Card>
    </div>
  );
}
