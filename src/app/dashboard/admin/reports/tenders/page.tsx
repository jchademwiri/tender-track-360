import {
  FileTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  UsersIcon,
  FilterIcon,
  BarChartIcon,
  ArrowLeftIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded p-4 flex flex-col gap-2 shadow-sm hover:border-primary/50 transition-colors">
      <div className="flex flex-row items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <span className="text-xs text-muted-foreground">{description}</span>
    </div>
  );
}

export default function TendersReportPage() {
  // Placeholder stats
  const stats = [
    {
      title: 'Total Tenders',
      value: 128,
      icon: FileTextIcon,
      description: 'All tenders in the system',
    },
    {
      title: 'Awarded',
      value: 32,
      icon: CheckCircleIcon,
      description: 'Tenders awarded',
    },
    {
      title: 'In Progress',
      value: 54,
      icon: ClockIcon,
      description: 'Tenders in progress',
    },
    {
      title: 'Rejected',
      value: 12,
      icon: XCircleIcon,
      description: 'Tenders rejected',
    },
    {
      title: 'Upcoming Deadlines',
      value: 5,
      icon: UsersIcon,
      description: 'Tenders with soon deadlines',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Back Button */}
      <div className="mb-4">
        <Link href="/dashboard/admin/reports">
          <Button
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back to Reports Overview
          </Button>
        </Link>
      </div>

      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold mb-1">Tenders Report</h1>
          <p className="text-muted-foreground">
            Status, category, client, deadlines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
          >
            <FilterIcon className="h-4 w-4" /> Filters
          </Button>
          {/* Add more filter controls here */}
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChartIcon className="h-5 w-5 text-primary" /> Tenders Overview
          Charts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded p-6 h-64 flex items-center justify-center">
            <span className="text-muted-foreground">
              [Placeholder for Tenders by Status Chart]
            </span>
          </div>
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded p-6 h-64 flex items-center justify-center">
            <span className="text-muted-foreground">
              [Placeholder for Tenders by Category Chart]
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">
          Upcoming Tender Deadlines
        </h2>
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded p-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Client</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Submission Deadline</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder rows */}
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 px-4">Tender {i}</td>
                  <td className="py-2 px-4">Client {i}</td>
                  <td className="py-2 px-4">Category {i}</td>
                  <td className="py-2 px-4">2024-07-0{i}</td>
                  <td className="py-2 px-4">In Progress</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
