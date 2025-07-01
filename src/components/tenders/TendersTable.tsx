'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, isBefore, isAfter, addDays, isWithinInterval } from 'date-fns';
import { TenderActions } from './TenderActions';
import Link from 'next/link';
import { TenderStatusToggle } from './TenderStatusToggle';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Hourglass,
  Send,
  XCircle,
  Lock,
  FileText,
  Ban,
  Circle,
} from 'lucide-react';

export default function TendersTable({ allTenders }: { allTenders: any[] }) {
  // Map status to badge variant
  const statusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'default'; // primary color
      case 'closed':
        return 'outline'; // gray
      case 'cancelled':
        return 'outline'; // gray
      case 'rejected':
        return 'destructive'; // red
      case 'awarded':
        return 'success'; // green
      case 'evaluation':
        return 'warning'; // green (hopeful)
      case 'submitted':
        return 'warning'; // green (hopeful)
      default:
        return 'outline';
    }
  };

  // Map status to icon with color
  const statusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'awarded':
        return <CheckCircle className="w-3 h-3 text-green-100" />;
      case 'evaluation':
        return <Hourglass className="w-3 h-3 text-green-100" />;
      case 'submitted':
        return <Send className="w-3 h-3 text-green-100" />;
      case 'rejected':
        return <XCircle className="w-3 h-3 text-red-100" />;
      case 'closed':
        return <Lock className="w-3 h-3 text-gray-200" />;
      case 'cancelled':
        return <Ban className="w-3 h-3 text-gray-200" />;
      case 'open':
        return <Circle className="w-3 h-3 text-blue-100" />;
      default:
        return <FileText className="w-3 h-3 text-gray-200" />;
    }
  };

  // Sort tenders: all open tenders at the top (by closing date), then others (by closing date)
  const sortedTenders = [...allTenders].sort((a, b) => {
    const aOpen = a.status && a.status.toLowerCase() === 'open' ? 0 : 1;
    const bOpen = b.status && b.status.toLowerCase() === 'open' ? 0 : 1;
    if (aOpen !== bOpen) return aOpen - bOpen;
    const aDate = a.submissionDeadline
      ? new Date(a.submissionDeadline).getTime()
      : Infinity;
    const bDate = b.submissionDeadline
      ? new Date(b.submissionDeadline).getTime()
      : Infinity;
    return aDate - bDate;
  });

  return (
    <div className="border rounded-lg">
      <style jsx>{`
        .tt360-row-hover:hover {
          background: #f9fafb;
        }
        .tt360-deadline-past {
          color: #dc2626; /* red-600 */
          font-weight: bold;
        }
        .tt360-deadline-soon {
          color: #ea580c; /* orange-600 */
          font-weight: bold;
        }
      `}</style>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTenders.map((tender) => {
            let deadlineClass = '';
            let deadlineDate = tender.submissionDeadline
              ? new Date(tender.submissionDeadline)
              : null;
            if (deadlineDate) {
              const now = new Date();
              if (isBefore(deadlineDate, now)) {
                deadlineClass = 'tt360-deadline-past';
              } else if (
                isWithinInterval(deadlineDate, {
                  start: now,
                  end: addDays(now, 7),
                })
              ) {
                deadlineClass = 'tt360-deadline-soon';
              }
            }
            return (
              <TableRow key={tender.id} className="tt360-row-hover">
                <TableCell className="font-medium">
                  <Link
                    href={`/dashboard/admin/tenders/${tender.id}`}
                    className="hover:underline"
                  >
                    {tender.title}
                  </Link>
                </TableCell>
                <TableCell>{tender.client}</TableCell>
                <TableCell>{tender.category}</TableCell>
                <TableCell>
                  <TenderStatusToggle
                    tenderId={tender.id}
                    currentStatus={tender.status}
                    badgeVariant={statusVariant(tender.status)}
                    icon={statusIcon(tender.status)}
                  />
                </TableCell>
                <TableCell className={deadlineClass}>
                  {tender.submissionDeadline
                    ? format(new Date(tender.submissionDeadline), 'PPP')
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <TenderActions
                    tenderId={tender.id}
                    tenderTitle={tender.title}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
