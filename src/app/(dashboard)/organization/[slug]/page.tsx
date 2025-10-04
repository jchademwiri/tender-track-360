import { AllUsers } from '@/components/tables';
import { MembersTableWrapper } from '@/components/members-table-wrapper';
import { PendingInvitationsSection } from '@/components/pending-invitations-section';
import { OrganizationHeader } from '@/components/organization-header';
import { OrganizationStats } from '@/components/organization-stats';
import { ErrorBoundary } from '@/components/error-boundary';
import { PageLoadingSkeleton } from '@/components/loading-states';
import {
  getAllUsers,
  getOrganizationBySlugWithUserRole,
  getPendingInvitations,
} from '@/server';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

// Force dynamic rendering since we use headers() in server functions
export const dynamic = 'force-dynamic';

type Params = Promise<{ slug: string }>;

// Error fallback component for organization not found
function OrganizationNotFound({ slug }: { slug: string }) {
  return (
    <div className="min-h-[600px] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-destructive/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-destructive">
            Organization Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            The organization &quot;{slug}&quot; could not be found or you
            don&apos;t have access to it.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={() => (window.location.href = '/')}
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main organization content component
async function OrganizationContent({ slug }: { slug: string }) {
  let organization;
  let users: Awaited<ReturnType<typeof getAllUsers>> = [];
  let pendingInvitations: Awaited<ReturnType<typeof getPendingInvitations>> =
    [];
  const membersError: string | null = null;
  let invitationsError: string | null = null;
  let usersError: string | null = null;

  try {
    organization = await getOrganizationBySlugWithUserRole(slug);
  } catch (error) {
    console.error('Failed to fetch organization:', error);
    throw new Error('Failed to load organization details. Please try again.');
  }

  if (!organization) {
    return <OrganizationNotFound slug={slug} />;
  }

  // Fetch users with error handling
  try {
    users = await getAllUsers(organization.id);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    users = [];
    usersError = 'Failed to load users. Please try refreshing the page.';
  }

  // Fetch pending invitations with error handling
  try {
    if (organization.id) {
      pendingInvitations = await getPendingInvitations(organization.id);
    }
  } catch (error) {
    console.error('Failed to fetch pending invitations:', error);
    pendingInvitations = [];
    invitationsError =
      'Failed to load pending invitations. You may not have permission to view them.';
  }

  return (
    <section className="flex max-w-5xl gap-6 flex-col py-8 mx-auto px-4">
      {/* Organization Header */}
      <ErrorBoundary>
        <OrganizationHeader organization={organization} />
      </ErrorBoundary>

      {/* Organization Statistics */}
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                      </div>
                      <div className="h-5 w-12 bg-muted animate-pulse rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <OrganizationStats organizationId={organization.id} />
        </Suspense>
      </ErrorBoundary>

      {/* Main Content */}
      <div className="space-y-6">
        <ErrorBoundary>
          <MembersTableWrapper
            members={organization?.members || []}
            error={membersError}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <PendingInvitationsSection
            invitations={pendingInvitations}
            error={invitationsError}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <AllUsers
            users={users}
            organizationId={organization?.id || ''}
            error={usersError}
          />
        </ErrorBoundary>
      </div>
    </section>
  );
}

export default async function organizationDetails({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoadingSkeleton />}>
        <OrganizationContent slug={slug} />
      </Suspense>
    </ErrorBoundary>
  );
}
