import {
  FileTextIcon,
  FolderIcon,
  DollarSignIcon,
  UsersIcon,
  BuildingIcon,
  BarChartIcon,
  ActivityIcon,
} from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';
import { Button } from '@/components/ui/button';

// StatCard component (copied from projects page)
type StatCardProps = {
  title: string;
  value: string | number;
  icon: FC<{ className?: string }>;
  description: string;
};

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
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

// ReportSectionCard component
interface ReportSectionCardProps {
  icon: FC<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}

function ReportSectionCard({
  icon: Icon,
  title,
  description,
  href,
}: ReportSectionCardProps) {
  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded p-6 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">{title}</span>
      </div>
      <p className="text-sm text-muted-foreground flex-1">{description}</p>
      <Link href={href} className="mt-2">
        <Button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">
          View Details
        </Button>
      </Link>
    </div>
  );
}

export default function ReportsPage() {
  // TODO: Replace these with real async data from report queries
  const stats = {
    totalTenders: 128, // await getTendersByStatus().then(...)
    totalProjects: 42, // await getProjectsByStatus().then(...)
    totalAwardedValue: 12000000, // await getTotalAwardedTenderValue().then(...)
    activeUsers: 7, // await getActiveUsersLast30Days().then(...)
    mostActiveClient: 'Acme Corp', // await getMostActiveClients().then(...)
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(value);
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-2">Reports & Analytics</h1>
      <p className="text-muted-foreground mb-6">
        Overview of key metrics and insights
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Tenders"
          value={stats.totalTenders}
          icon={FileTextIcon}
          description="All tenders in the system"
        />
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderIcon}
          description="All awarded projects"
        />
        <StatCard
          title="Total Awarded Value"
          value={formatCurrency(stats.totalAwardedValue)}
          icon={DollarSignIcon}
          description="Combined value of awarded tenders"
        />
        <StatCard
          title="Active Users (30d)"
          value={stats.activeUsers}
          icon={UsersIcon}
          description="Users active in the last 30 days"
        />
        <StatCard
          title="Most Active Client"
          value={stats.mostActiveClient}
          icon={BuildingIcon}
          description="Client with most tenders"
        />
      </div>

      {/* Report Sections Grid */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Report Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ReportSectionCard
            icon={FileTextIcon}
            title="Tenders"
            description="Status, category, client, deadlines"
            href="/dashboard/admin/reports/tenders"
          />
          <ReportSectionCard
            icon={FolderIcon}
            title="Projects"
            description="Status, client, value, recent awards"
            href="/dashboard/admin/reports/projects"
          />
          <ReportSectionCard
            icon={DollarSignIcon}
            title="Financial"
            description="Awarded value, by client, by category, monthly trends"
            href="/dashboard/admin/reports/financial"
          />
          <ReportSectionCard
            icon={BarChartIcon}
            title="Performance"
            description="Average days to award, completion rate, manager stats"
            href="/dashboard/admin/reports/performance"
          />
          <ReportSectionCard
            icon={ActivityIcon}
            title="User Activity"
            description="Active users, actions by role, recent logins"
            href="/dashboard/admin/reports/user-activity"
          />
          <ReportSectionCard
            icon={BuildingIcon}
            title="Client Engagement"
            description="Most active clients, awarded tenders"
            href="/dashboard/admin/reports/client-engagement"
          />
        </div>
      </div>
    </div>
  );
}
