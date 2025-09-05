import { Suspense } from 'react';
import { OrganizationPageHeader } from '@/components/organization-page-header';
import { OrganizationPageContent } from '@/components/organization-page-content';
import { OrganizationPageSkeleton } from '@/components/organization-page-skeleton';
import { getorganizations } from '@/server';
import { getRecentActivities } from '@/server/activity';

export default async function OrganizationPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Suspense fallback={<OrganizationPageSkeleton />}>
          <OrganizationPageAsync />
        </Suspense>
      </div>
    </div>
  );
}

async function OrganizationPageAsync() {
  try {
    // Fetch organizations and recent activities in parallel
    const [organizations, recentActivitiesResponse] = await Promise.all([
      getorganizations(),
      getRecentActivities(5), // Get 5 recent activities for the sidebar
    ]);

    return (
      <div className="space-y-8">
        {/* Page Header */}
        <OrganizationPageHeader
          organizationCount={organizations.length}
          className="mb-8"
        />

        {/* Main Content */}
        <OrganizationPageContent
          organizations={organizations}
          recentActivities={recentActivitiesResponse.activities}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading organization page:', error);

    // Fallback to basic layout on error
    return (
      <div className="space-y-8">
        <OrganizationPageHeader organizationCount={0} className="mb-8" />
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">
            Unable to load organizations
          </h3>
          <p className="text-muted-foreground">
            Please try refreshing the page. If the problem persists, contact
            support.
          </p>
        </div>
      </div>
    );
  }
}
