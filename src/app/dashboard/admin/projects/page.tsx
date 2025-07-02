import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CalendarIcon,
  DollarSignIcon,
  BuildingIcon,
  FileTextIcon,
  ChevronDownIcon,
  SearchIcon,
  FilterIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from 'lucide-react';
import { Suspense } from 'react';
import { getProjects } from '@/db/queries/projects';
import Link from 'next/link';
import EmptyState from '@/components/ui/EmptyState';

type TenderStatus =
  | 'in_progress'
  | 'submitted'
  | 'awarded'
  | 'rejected'
  | 'completed'
  | 'cancelled'
  | 'evaluation';

interface Project {
  id: string;
  referenceNumber: string | null;
  title: string | null;
  awardDate: Date | null;
  estimatedValue: number | null;
  clientName: string | null;
  description: string | null;
  status: TenderStatus | null;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

function ProjectTableSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            <Skeleton className="h-12 w-12" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default async function ProjectsPage() {
  const { projects, stats } = await getProjects();

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(value);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section with Search and Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Overview of all awarded projects and their current status
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/projects/new">
            <Button className="flex items-center gap-2" variant="default">
              <PlusIcon className="w-4 h-4" /> Create Project
            </Button>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8 w-full sm:w-[250px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[120px]">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filter
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem>Highest Value</DropdownMenuItem>
              <DropdownMenuItem>Recent Awards</DropdownMenuItem>
              <DropdownMenuItem>Client Name</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FileTextIcon}
          description="Active awarded projects"
        />
        <StatCard
          title="Total Value"
          value={formatCurrency(stats.totalValue)}
          icon={DollarSignIcon}
          description="Combined project value"
        />
        <StatCard
          title="Unique Clients"
          value={stats.uniqueClients}
          icon={BuildingIcon}
          description="Active client relationships"
        />
      </div>

      {/* Projects Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Detailed information about all awarded projects
              </CardDescription>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ProjectTableSkeleton />}>
            {projects.length === 0 ? (
              <EmptyState
                icon={<FileTextIcon className="h-16 w-16 text-blue-300 dark:text-blue-700 mb-4" />}
                title="No projects found"
                description={
                  <>There are currently no awarded projects to display.<br />Start by creating a new project.</>
                }
                action={
                  <Link href="/dashboard/admin/projects/new">
                    <Button variant="default" className="mt-2">
                      Create Project
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Title</TableHead>
                        <TableHead className="w-[120px]">Reference</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead className="w-[120px]">Award Date</TableHead>
                        <TableHead className="text-right w-[140px]">
                          Estimated Value
                        </TableHead>
                        <TableHead className="text-right w-[120px]">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow
                          key={project.id}
                          className="hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group"
                        >
                          <TableCell>
                            <Link
                              href={`/dashboard/admin/projects/${project.id}`}
                              className="font-medium hover:text-primary transition-colors"
                              style={{ textDecoration: 'none' }}
                            >
                              {project.title || 'Untitled Project'}
                            </Link>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            <Badge
                              variant="outline"
                              className="hover:bg-primary/5"
                            >
                              {project.referenceNumber || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BuildingIcon className="h-4 w-4 text-blue-400" />
                              <span className="hover:text-primary">
                                {project.clientName || 'N/A'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-green-400" />
                              {formatDate(project.awardDate)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            <div className="flex items-center justify-end gap-1">
                              <DollarSignIcon className="h-4 w-4 text-yellow-500" />
                              {formatCurrency(project.estimatedValue)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="hover:text-primary"
                                title="Edit"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="hover:text-destructive"
                                title="Delete"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
