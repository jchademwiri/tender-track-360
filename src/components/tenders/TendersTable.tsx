'use client';

import React, { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Search,
  Building,
  FilePen,
  CheckCircle,
  Loader,
  Send,
  Award,
  XCircle,
  Ban,
} from 'lucide-react';

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
    case 'rejected':
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
  }
};

export const formatCurrency = (value: number | null) => {
  if (!value) return 'Not specified';
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: Date | string | null) => {
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

export type Tender = {
  id: string;
  referenceNumber: string;
  title: string;
  status: string;
  submissionDeadline: Date | string | null;
  estimatedValue: number | null;
  department: string | null;
  description?: string | null;
  createdAt?: Date;
};

// Add a status display map for pretty labels
const statusDisplayMap: Record<string, string> = {
  open: 'Open',
  closed: 'Closed',
  submitted: 'Submitted',
  evaluation: 'Evaluation',
  awarded: 'Awarded',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

// Add a status icon map for pretty icons
const statusIconMap: Record<string, React.ReactNode> = {
  open: <CheckCircle className="inline w-4 h-4 mr-1 align-text-bottom" />,
  closed: <XCircle className="inline w-4 h-4 mr-1 align-text-bottom" />,
  submitted: <Send className="inline w-4 h-4 mr-1 align-text-bottom" />,
  evaluation: (
    <Search className="inline w-4 h-4 mr-1 align-text-bottom animate-spin" />
  ),
  awarded: <Award className="inline w-4 h-4 mr-1 align-text-bottom" />,
  cancelled: <Ban className="inline w-4 h-4 mr-1 align-text-bottom" />,
  rejected: <XCircle className="inline w-4 h-4 mr-1 align-text-bottom" />,
};

// Client-only currency formatting to avoid hydration mismatch
export function ClientCurrency({ value }: { value: number | null }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  if (typeof value !== 'number' || isNaN(value)) return <>Not specified</>;
  return <>{formatCurrency(value)}</>;
}

export default function TendersTable({
  allTenders,
}: {
  allTenders: Tender[];
  totalValue: number;
}) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [department, setDepartment] = useState('all');

  const departmentOptions = useMemo(
    () => [
      ...new Set(allTenders.map((t) => t.department || '').filter(Boolean)),
    ],
    [allTenders]
  );

  const filteredTenders = useMemo(() => {
    return allTenders.filter((t) => {
      if (status !== 'all' && t.status?.toLowerCase() !== status.toLowerCase())
        return false;
      if (department !== 'all' && t.department !== department) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !(
            t.referenceNumber?.toLowerCase().includes(s) ||
            t.title?.toLowerCase().includes(s) ||
            (t.department || '').toLowerCase().includes(s)
          )
        ) {
          return false;
        }
      }
      return true;
    });
  }, [allTenders, search, status, department]);

  return (
    <>
      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search tenders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-auto">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="evaluation">Evaluation</SelectItem>
              <SelectItem value="awarded">Awarded</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-full sm:w-auto">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departmentOptions.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              {filteredTenders.map((tender) => (
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
                      {statusIconMap[tender.status?.toLowerCase?.()]}
                      {statusDisplayMap[tender.status?.toLowerCase?.()] ||
                        (tender.status
                          ? tender.status
                              .replace(/_/g, ' ')
                              .replace(/\b\w/g, (c) => c.toUpperCase())
                          : 'Unknown')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {formatDate(tender.submissionDeadline)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <ClientCurrency
                      value={
                        typeof tender.estimatedValue === 'number'
                          ? tender.estimatedValue
                          : null
                      }
                    />
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

        {filteredTenders.length === 0 && (
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
    </>
  );
}
