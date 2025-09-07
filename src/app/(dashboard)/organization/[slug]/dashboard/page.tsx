import { Suspense } from 'react';
import { MembersTableWrapper } from '@/components/members-table-wrapper';
import { PendingInvitationsSection } from '@/components/pending-invitations-section';
import { OrganizationHeader } from '@/components/organization-header';
import {
  OrganizationStats,
  OrganizationStatsLoading,
} from '@/components/organization-stats';
import {
  getOrganizationBySlugWithUserRole,
  getPendingInvitations,
} from '@/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DashboardErrorBoundary,
  ComponentErrorBoundary,
} from '@/components/dashboard-error-boundary';
import {
  MembersTableSkeleton,
  InvitationsTableSkeleton,
} from '@/components/ui/enhanced-skeleton';
import { handleError } from '@/lib/error-handler';

type Params = Promise<{ slug: string }>;

// Enhanced error boundary component for dashboard
function DashboardErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <section className="flex max-w-5xl gap-6 flex-col py-8 mx-auto px-4">
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <span>Dashboard Error</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {error.message ||
              'An unexpected error occurred while loading the dashboard.'}
          </p>
          <p className="text-sm text-muted-foreground">
            This error has been logged. Please try refreshing the page or
            contact support if the problem persists.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs bg-muted p-3 rounded border">
              <summary className="cursor-pointer font-medium mb-2">
                Error Details (Development)
              </summary>
              <pre className="whitespace-pre-wrap text-destructive text-xs">
                {error.stack}
              </pre>
            </details>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={resetError}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = '/organization')}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-md text-sm hover:bg-muted/80"
            >
              Go to Organizations
            </button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default async function Dashboard({ params }: { params: Params }) {
  // Dashboard intentionally left empty for now for all roles
  return null;
}
