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
  try {
    const { slug } = await params;

    // Fetch organization data with user role
    const organization = await getOrganizationBySlugWithUserRole(slug);

    if (!organization) {
      return (
        <section className="grid place-items-center min-h-[600px] text-center px-4">
          <Card className="max-w-md border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">
                Organization Not Found
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The organization you&apos;re looking for doesn&apos;t exist or
                you don&apos;t have access to it.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => (window.location.href = '/organization')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
                >
                  View All Organizations
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-md text-sm hover:bg-muted/80"
                >
                  Go Back
                </button>
              </div>
            </CardContent>
          </Card>
        </section>
      );
    }

    // Get pending invitations for the organization (with enhanced error handling)
    let pendingInvitations: Awaited<ReturnType<typeof getPendingInvitations>> =
      [];
    let invitationsError: string | null = null;

    try {
      if (organization?.id) {
        pendingInvitations = await getPendingInvitations(organization.id);
      }
    } catch (error) {
      // Log the error but don't break the page
      console.error('Could not fetch pending invitations:', error);
      invitationsError =
        error instanceof Error ? error.message : 'Failed to load invitations';

      // Handle specific error cases
      if (error instanceof Error && error.message.includes('permission')) {
        invitationsError = null; // Don't show error for permission issues, just show empty state
      }
    }

    return (
      <DashboardErrorBoundary>
        <section className="flex max-w-5xl gap-6 flex-col py-8 mx-auto px-4">
          {/* Organization Header */}
          <ComponentErrorBoundary componentName="Organization Header">
            <OrganizationHeader organization={organization} />
          </ComponentErrorBoundary>

          {/* Organization Statistics */}
          <ComponentErrorBoundary componentName="Organization Statistics">
            <Suspense fallback={<OrganizationStatsLoading />}>
              <OrganizationStats organizationId={organization.id} />
            </Suspense>
          </ComponentErrorBoundary>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Members Management */}
            <ComponentErrorBoundary componentName="Members Table">
              <Suspense fallback={<MembersTableSkeleton rows={4} />}>
                <MembersTableWrapper members={organization?.members || []} />
              </Suspense>
            </ComponentErrorBoundary>

            {/* Pending Invitations */}
            <ComponentErrorBoundary componentName="Pending Invitations">
              <Suspense fallback={<InvitationsTableSkeleton rows={2} />}>
                <PendingInvitationsSection
                  invitations={pendingInvitations}
                  error={invitationsError}
                />
              </Suspense>
            </ComponentErrorBoundary>
          </div>
        </section>
      </DashboardErrorBoundary>
    );
  } catch (error) {
    // Enhanced error logging
    handleError(error as Error, {
      title: 'Dashboard Loading Error',
      fallbackMessage: 'Failed to load organization dashboard',
      showToast: false, // Don't show toast on server-side errors
      logError: true,
    });

    return (
      <DashboardErrorFallback
        error={error as Error}
        resetError={() => window.location.reload()}
      />
    );
  }
}
