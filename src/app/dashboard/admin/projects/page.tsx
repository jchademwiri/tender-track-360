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
} from 'lucide-react';
import { Suspense } from 'react';
import { getProjects } from '@/db/queries/projects';

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
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileTextIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No projects found
                </h3>
                <p className="text-muted-foreground">
                  There are currently no awarded projects to display.
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Reference</TableHead>
                        <TableHead>Project Title</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead className="w-[120px]">Award Date</TableHead>
                        <TableHead className="text-right w-[140px]">
                          Estimated Value
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow
                          key={project.id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-mono text-sm">
                            <Badge
                              variant="outline"
                              className="hover:bg-primary/5"
                            >
                              {project.referenceNumber || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <HoverCard>
                              <HoverCardTrigger className="font-medium hover:text-primary cursor-pointer">
                                {project.title || 'Untitled Project'}
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-semibold">
                                    {project.title || 'Untitled Project'}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {project.description ||
                                      'No description available.'}
                                  </p>
                                  <div className="flex items-center pt-2">
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
                                    <span className="text-sm text-muted-foreground">
                                      Awarded {formatDate(project.awardDate)}
                                    </span>
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="hover:text-primary">
                                {project.clientName || 'N/A'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              {formatDate(project.awardDate)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(project.estimatedValue)}
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
