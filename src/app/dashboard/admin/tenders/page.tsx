import { Button } from '@/components/ui/button';
import { Plus, Calendar, DollarSign, Building } from 'lucide-react';
import TendersTable, {
  ClientCurrency,
} from '@/components/tenders/TendersTable';
import { db } from '@/db';
import { tenders } from '@/db/schema/tenders';

// Define Tender type for this file
interface Tender {
  id: string;
  referenceNumber: string;
  title: string;
  status: string;
  submissionDeadline: Date | string | null;
  estimatedValue: number | null;
  department: string | null;
  description?: string | null;
  createdAt?: Date;
}

export default async function TendersPage() {
  // Fetch and normalize tenders
  const allTendersRaw = await db.select().from(tenders);
  const allTenders: Tender[] = allTendersRaw.map((t) => ({
    ...t,
    estimatedValue:
      typeof t.estimatedValue === 'string'
        ? parseFloat(t.estimatedValue)
        : t.estimatedValue,
    description: typeof t.description === 'string' ? t.description : undefined,
  }));

  const stats = {
    total: allTenders.length,
    open: allTenders.filter((t) => t.status?.toLowerCase() === 'open').length,
    closed: allTenders.filter((t) => t.status?.toLowerCase() === 'closed')
      .length,
    totalValue: allTenders.reduce(
      (sum, t) =>
        sum + (typeof t.estimatedValue === 'number' ? t.estimatedValue : 0),
      0
    ),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tenders
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and monitor all tender processes
          </p>
        </div>
        <Button
          size="lg"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Tender
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tenders
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Open Tenders
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.open}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <Calendar className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Closed Tenders
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.closed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <span className="sr-only">Total Value</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Value
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <ClientCurrency value={stats.totalValue} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters, Search, and Table */}
      <TendersTable allTenders={allTenders} totalValue={stats.totalValue} />
    </div>
  );
}
