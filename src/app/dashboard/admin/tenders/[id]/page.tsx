import { getTenderById } from '@/db/queries/tenders';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PencilIcon } from 'lucide-react';
import { ClientCurrency } from '@/components/tenders/ClientCurrency';
import { format } from 'date-fns';

interface TenderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function TenderDetailPage({
  params,
}: TenderDetailPageProps) {
  const tender = await getTenderById(params.id);

  if (!tender) {
    notFound();
  }

  const detailItem = (label: string, value: React.ReactNode) => (
    <div className="flex flex-col">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-lg text-gray-900 dark:text-white">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {tender.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Reference: {tender.referenceNumber}
          </p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/admin/tenders/${tender.id}/edit`}>
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit Tender
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tender Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {detailItem(
            'Status',
            <Badge variant="outline">{tender.status}</Badge>
          )}
          {detailItem('Client', tender.client?.name)}
          {detailItem('Category', tender.category?.name)}
          {detailItem(
            'Publication Date',
            tender.publicationDate
              ? format(new Date(tender.publicationDate), 'PPP')
              : 'N/A'
          )}
          {detailItem(
            'Submission Deadline',
            tender.submissionDeadline
              ? format(new Date(tender.submissionDeadline), 'PPP p')
              : 'N/A'
          )}
          {detailItem(
            'Evaluation Date',
            tender.evaluationDate
              ? format(new Date(tender.evaluationDate), 'PPP')
              : 'N/A'
          )}
          {detailItem(
            'Award Date',
            tender.awardDate ? format(new Date(tender.awardDate), 'PPP') : 'N/A'
          )}
          {detailItem(
            'Estimated Value',
            <ClientCurrency
              value={
                tender.estimatedValue ? parseFloat(tender.estimatedValue) : null
              }
            />
          )}
          {detailItem(
            'Actual Value',
            <ClientCurrency
              value={tender.actualValue ? parseFloat(tender.actualValue) : null}
            />
          )}
          {detailItem('Department', tender.department)}
        </CardContent>
      </Card>

      {tender.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {tender.description}
            </p>
          </CardContent>
        </Card>
      )}

      {tender.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {tender.notes}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Audit Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {detailItem('Created By', tender.createdByUser?.fullName)}
          {detailItem(
            'Created At',
            format(new Date(tender.createdAt), 'PPP p')
          )}
          {detailItem('Last Updated By', tender.updatedByUser?.fullName)}
          {detailItem(
            'Last Updated At',
            format(new Date(tender.updatedAt), 'PPP p')
          )}
        </CardContent>
      </Card>
    </div>
  );
}
