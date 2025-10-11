import { getCurrentUser } from '@/server';
import { getProjectStats } from '@/server/projects';

export const dynamic = 'force-dynamic';

export default async function ProjectsOverviewPage() {
  const { session } = await getCurrentUser();

  if (!session.activeOrganizationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            No Organization Selected
          </h2>
          <p className="text-gray-600">
            Please select an organization to view project overview.
          </p>
        </div>
      </div>
    );
  }

  const statsResult = await getProjectStats(session.activeOrganizationId);
  const stats = statsResult.success ? statsResult.stats : {
    totalProjects: 0,
    statusCounts: { active: 0, completed: 0, cancelled: 0 },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Project Management Overview
        </h1>
        <p className="text-muted-foreground">
          Manage active projects, contracts, and purchase orders.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Active Projects</h2>
          <p className="text-3xl font-bold text-green-600">{stats.statusCounts.active}</p>
          <p className="text-sm text-muted-foreground">In progress</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Completed Projects</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.statusCounts.completed}</p>
          <p className="text-sm text-muted-foreground">Finished</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Total Projects</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.totalProjects}</p>
          <p className="text-sm text-muted-foreground">All projects</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Cancelled Projects</h2>
          <p className="text-3xl font-bold text-red-600">{stats.statusCounts.cancelled}</p>
          <p className="text-sm text-muted-foreground">Cancelled</p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Project Status Overview</h2>
        <div className="space-y-3">
          <div className="bg-background rounded-lg p-4 border">
            <p className="text-sm">
              <span className="font-medium">{stats.statusCounts.active} Active Projects</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <p className="text-sm">
              <span className="font-medium">{stats.statusCounts.completed} Completed Projects</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Successfully finished
            </p>
          </div>

          {stats.statusCounts.cancelled > 0 && (
            <div className="bg-background rounded-lg p-4 border">
              <p className="text-sm">
                <span className="font-medium">{stats.statusCounts.cancelled} Cancelled Projects</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Terminated projects
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
