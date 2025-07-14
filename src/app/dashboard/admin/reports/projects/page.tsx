import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProjectsReportPage() {
  return (
    <div className="p-8">
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
      <h1 className="text-2xl font-bold mb-4">Projects Report</h1>
      <p className="text-muted-foreground mb-2">
        Status, client, value, recent awards
      </p>
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded p-6">
        <p className="text-gray-700 dark:text-gray-200">
          Projects analytics and charts will be displayed here.
        </p>
      </div>
    </div>
  );
}
