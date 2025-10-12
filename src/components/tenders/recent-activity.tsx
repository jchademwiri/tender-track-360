'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, TrendingUp, CheckCircle } from 'lucide-react';

interface RecentTender {
  id: string;
  tenderNumber: string;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  client: {
    name: string;
  } | null;
}

interface RecentActivityProps {
  recentTenders: RecentTender[];
  recentChanges: RecentTender[];
  className?: string;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    case 'submitted':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'won':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'lost':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
}

export function RecentActivity({
  recentTenders,
  recentChanges,
  className = '',
}: RecentActivityProps) {
  const hasRecentTenders = recentTenders.length > 0;
  const hasRecentChanges = recentChanges.length > 0;

  if (!hasRecentTenders && !hasRecentChanges) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No recent activity to display
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recent Tenders */}
        {hasRecentTenders && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <FileText className="h-3 w-3" />
              New Tenders
            </h4>
            <div className="space-y-3">
              {recentTenders.slice(0, 5).map((tender) => (
                <div
                  key={tender.id}
                  className="flex items-start justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">
                        {tender.tenderNumber}
                      </span>
                      <Badge className={getStatusColor(tender.status)}>
                        {tender.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {tender.description || 'No description'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tender.client?.name || 'Unknown Client'}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">
                    {formatTimeAgo(tender.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Changes */}
        {hasRecentChanges && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              Status Changes
            </h4>
            <div className="space-y-3">
              {recentChanges.slice(0, 5).map((tender) => (
                <div
                  key={`${tender.id}-change`}
                  className="flex items-start justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">
                        {tender.tenderNumber}
                      </span>
                      <Badge className={getStatusColor(tender.status)}>
                        {tender.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {tender.description || 'No description'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tender.client?.name || 'Unknown Client'}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">
                    {formatTimeAgo(tender.updatedAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show more link if there are more items */}
        {(recentTenders.length > 5 || recentChanges.length > 5) && (
          <div className="text-center pt-2">
            <button className="text-sm text-primary hover:underline">
              View all activity
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}