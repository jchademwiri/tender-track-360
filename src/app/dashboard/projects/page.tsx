import { Card, CardContent } from '@/components/ui/card';
import { FolderOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Active Projects</h1>
        <p className="text-muted-foreground">
          Manage and track all your active construction projects.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Projects Yet
          </h3>
          <p className="text-gray-500 text-center">
            Project management functionality will be available once implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
