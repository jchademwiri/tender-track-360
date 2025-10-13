import { redirect } from 'next/navigation';

import { checkUserSession } from '@/lib/session-check';

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
  return (
    <>
      {/* Statistics Cards */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
          <span className="text-muted-foreground">Statistics Card 1</span>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
          <span className="text-muted-foreground">Statistics Card 2</span>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
          <span className="text-muted-foreground">Statistics Card 3</span>
        </div>
      </div>
      {/* Quick Action Navigation */}
      {/* <nav className="flex flex-wrap justify-end gap-4 my-6">
        <Button variant="outline" size="lg" asChild>
          <Link href="/dashboard/tenders/create" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Tender
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/dashboard/clients/create" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Client
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link
            href="/dashboard/projects/purchase-orders"
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create PO
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/dashboard/projects" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link
            href="/dashboard/organization/create"
            className="flex items-center"
          >
            <Building2 className="mr-2 h-4 w-4" />
            Create Organization
          </Link>
        </Button>
      </nav> */}
      {/* Quick Actions & Recent Activities */}
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min flex items-center justify-center">
        <span className="text-muted-foreground">
          {/* <CreateOrg organizations={[]} /> */}
        </span>
      </div>
    </>
  );
}
