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

export default function TendersTable({ allTenders }: { allTenders: any[] }) {
  // Map status to badge variant
  const statusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'default'; // primary color
      case 'closed':
        return 'destructive'; // red
      case 'cancelled':
        return 'outline'; // neutral/gray
      case 'rejected':
        return 'outline';
      case 'awarded':
        return 'secondary'; // secondary color
      default:
        return 'outline';
    }
  };

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
          {allTenders.map((tender) => {
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
