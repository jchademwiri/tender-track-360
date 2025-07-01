'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { TenderActions } from './TenderActions';
import Link from 'next/link';
import { TenderStatusToggle } from './TenderStatusToggle';

export default function TendersTable({ allTenders }: { allTenders: any[] }) {
  return (
    <div className="border rounded-lg">
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
          {allTenders.map((tender) => (
            <TableRow key={tender.id}>
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
                />
              </TableCell>
              <TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
