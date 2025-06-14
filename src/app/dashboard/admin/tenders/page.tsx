import { db } from '@/db';
import { tenders } from '@/db/schema';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  DollarSign,
  Building,
} from 'lucide-react';

interface Tender {
  id: string;
  referenceNumber: string;
  title: string;
  status: string;
  submissionDeadline: Date | null;
  estimatedValue: number | null;
  department: string | null;
  description?: string;
  createdAt?: Date;
}

const getStatusBadgeClass = (status: string) => {
  const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
  switch (status?.toLowerCase()) {
    case 'open':
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
    case 'closed':
      return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
    case 'draft':
      return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
    case 'awarded':
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
  }
};

const formatCurrency = (value: number | null) => {
  if (!value) return 'Not specified';
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: Date | null) => {
  if (!date) return 'Not set';
  const now = new Date();
  const deadline = new Date(date);
  const isOverdue = deadline < now;

  const formatted = deadline.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <span
      className={isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}
    >
      {formatted}
      {isOverdue && ' (Overdue)'}
    </span>
  );
};

export default async function TendersPage() {
  const allTenders = await db.select().from(tenders);

  const stats = {
    total: allTenders.length,
    open: allTenders.filter((t) => t.status?.toLowerCase() === 'open').length,
    closed: allTenders.filter((t) => t.status?.toLowerCase() === 'closed')
      .length,
    totalValue: allTenders.reduce((sum, t) => sum + (t.estimatedValue || 0), 0),
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
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create Tender
        </button>
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
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Value
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tenders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
            <option value="awarded">Awarded</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            <option value="">All Departments</option>
            {[
              ...new Set(allTenders.map((t) => t.department).filter(Boolean)),
            ].map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Reference & Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {allTenders.map((tender) => (
                <tr
                  key={tender.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {tender.referenceNumber}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {tender.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadgeClass(tender.status)}>
                      {tender.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {formatDate(tender.submissionDeadline)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {formatCurrency(tender.estimatedValue)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {tender.department || 'Not assigned'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {allTenders.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No tenders
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new tender.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
