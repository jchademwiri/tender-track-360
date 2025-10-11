import { getCurrentUser } from '@/server';
import { getProjects } from '@/server/projects';
import { ProjectList } from '@/components/projects/project-list';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const { session } = await getCurrentUser();

  if (!session.activeOrganizationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            No Organization Selected
          </h2>
          <p className="text-gray-600">
            Please select an organization to view projects.
          </p>
        </div>
      </div>
    );
  }

  // Fetch initial projects
  const result = await getProjects(session.activeOrganizationId, '', 1, 10);

  const initialProjects = result.projects;
  const initialTotalCount = result.totalCount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Manage and track all your construction projects.
        </p>
      </div>

      <ProjectList
        organizationId={session.activeOrganizationId}
        initialProjects={initialProjects}
        initialTotalCount={initialTotalCount}
      />
    </div>
  );
}
