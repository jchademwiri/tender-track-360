import { getProjects } from '@/db/queries/projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  CalendarIcon,
  DollarSignIcon,
  BuildingIcon,
  ArrowLeftIcon,
  PencilIcon,
} from 'lucide-react';

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { projects } = await getProjects();
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
        <p className="mb-4 text-muted-foreground">
          The project you are looking for does not exist.
        </p>
        <Link href="/dashboard/admin/projects">
          <Button variant="outline">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      useGrouping: true,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const detailItem = (label: string, value: React.ReactNode) => (
    <div className="flex flex-col">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-lg text-gray-900 dark:text-white">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {project.title || 'Untitled Project'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Reference: {project.referenceNumber || 'N/A'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/admin/projects">
              <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/admin/projects/${project.id}/edit`}>
              <PencilIcon className="mr-2 h-4 w-4" /> Edit Project
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {detailItem(
            'Status',
            project.status && <Badge variant="outline">{project.status}</Badge>
          )}
          {detailItem(
            'Client',
            <span className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-blue-400" />
              {project.clientName || 'N/A'}
            </span>
          )}
          {detailItem(
            'Award Date',
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-green-400" />
              {formatDate(project.awardDate)}
            </span>
          )}
          {detailItem(
            'Estimated Value',
            <span className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4 text-yellow-500" />
              {formatCurrency(project.estimatedValue)}
            </span>
          )}
        </CardContent>
      </Card>

      {project.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {project.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
