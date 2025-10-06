'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteTender, updateTenderStatus } from '@/server/tenders';
import Link from 'next/link';

interface TenderWithClient {
  id: string;
  tenderNumber: string;
  description: string | null;
  submissionDate: Date | null;
  value: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  client: {
    id: string;
    name: string;
    contactName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
  } | null;
}

interface TenderDetailsProps {
  tender: TenderWithClient;
  organizationId: string;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

const statusLabels = {
  draft: 'Draft',
  submitted: 'Submitted',
  won: 'Won',
  lost: 'Lost',
  pending: 'Pending',
};

export function TenderDetails({ tender, organizationId }: TenderDetailsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleEdit = () => {
    router.push(`/dashboard/tenders/${tender.id}/edit`);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this tender? This action cannot be undone.'
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteTender(organizationId, tender.id);
      if (result.success) {
        router.push('/dashboard/tenders');
        router.refresh();
      } else {
        alert(result.error || 'Failed to delete tender');
      }
    });
  };

  const handleStatusUpdate = async (
    newStatus: 'draft' | 'submitted' | 'won' | 'lost' | 'pending'
  ) => {
    startTransition(async () => {
      const result = await updateTenderStatus(organizationId, tender.id, {
        status: newStatus,
      });
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Failed to update tender status');
      }
    });
  };

  const handleBack = () => {
    router.push('/dashboard/tenders');
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not set';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatValue = (value: string | null) => {
    if (!value) return 'Not set';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numValue);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tenders
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <h1 className="text-xl text-gray-600 font-bold">
            {tender.tenderNumber.toUpperCase()}
          </h1>

          <Button
            variant="outline"
            onClick={handleEdit}
            className="cursor-pointer"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Tender
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                Edit Tender
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 cursor-pointer"
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Tender
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Information */}
        <div className="xl:col-span-3 space-y-6">
          {/* Basic Information */}
          <Card className="rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Tender Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Tender Number
                  </label>
                  <p className="text-lg font-medium text-blue-600">
                    {tender.tenderNumber.toUpperCase()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      className={
                        statusColors[tender.status as keyof typeof statusColors]
                      }
                    >
                      {statusLabels[tender.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Tender Value
                  </label>
                  <p className="text-lg font-medium">
                    {formatValue(tender.value)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Submission Date
                  </label>
                  <p className="text-gray-900">
                    {formatDate(tender.submissionDate)}
                  </p>
                </div>
              </div>

              {tender.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {tender.description}
                  </p>
                </div>
              )}

              {!tender.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <p className="text-gray-400 italic">No description added</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card className="rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Building className="h-5 w-5 mr-2 text-green-600" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tender.client ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Client Name
                      </label>
                      <p className="text-lg font-medium">
                        {tender.client.name}
                      </p>
                    </div>
                    <Link href={`/dashboard/clients/${tender.client.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                      >
                        View Client
                      </Button>
                    </Link>
                  </div>

                  {(tender.client.contactName ||
                    tender.client.contactEmail ||
                    tender.client.contactPhone) && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">
                        Contact Information
                      </h4>
                      <div className="space-y-3">
                        {tender.client.contactName && (
                          <div className="flex items-center space-x-3">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <label className="text-sm font-medium text-gray-500">
                                Contact Person
                              </label>
                              <p className="text-gray-900">
                                {tender.client.contactName}
                              </p>
                            </div>
                          </div>
                        )}

                        {tender.client.contactEmail && (
                          <div className="flex items-center space-x-3">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <div>
                              <label className="text-sm font-medium text-gray-500">
                                Email Address
                              </label>
                              <p className="text-gray-900">
                                <Link
                                  href={`mailto:${tender.client.contactEmail}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {tender.client.contactEmail}
                                </Link>
                              </p>
                            </div>
                          </div>
                        )}

                        {tender.client.contactPhone && (
                          <div className="flex items-center space-x-3">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <div>
                              <label className="text-sm font-medium text-gray-500">
                                Phone Number
                              </label>
                              <p className="text-gray-900">
                                <Link
                                  href={`tel:${tender.client.contactPhone}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {tender.client.contactPhone}
                                </Link>
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Client Information
                  </h3>
                  <p className="text-gray-500">
                    Client information is not available for this tender.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start cursor-pointer"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Tender
              </Button>
              {tender.client?.contactEmail && (
                <Button
                  variant="outline"
                  className="w-full justify-start cursor-pointer"
                  onClick={() =>
                    window.open(
                      `mailto:${tender.client?.contactEmail}`,
                      '_blank'
                    )
                  }
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Client
                </Button>
              )}
              {tender.client?.contactPhone && (
                <Button
                  variant="outline"
                  className="w-full justify-start cursor-pointer"
                  onClick={() =>
                    window.open(`tel:${tender.client?.contactPhone}`, '_blank')
                  }
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Client
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card className="rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Status Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-gray-500 mb-3">
                Current Status:{' '}
                <span className="font-medium">
                  {statusLabels[tender.status as keyof typeof statusLabels]}
                </span>
              </div>

              {tender.status !== 'submitted' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start cursor-pointer"
                  onClick={() => handleStatusUpdate('submitted')}
                  disabled={isPending}
                >
                  Mark as Submitted
                </Button>
              )}

              {tender.status !== 'won' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start cursor-pointer"
                  onClick={() => handleStatusUpdate('won')}
                  disabled={isPending}
                >
                  Mark as Won
                </Button>
              )}

              {tender.status !== 'lost' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start cursor-pointer"
                  onClick={() => handleStatusUpdate('lost')}
                  disabled={isPending}
                >
                  Mark as Lost
                </Button>
              )}

              {tender.status !== 'pending' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start cursor-pointer"
                  onClick={() => handleStatusUpdate('pending')}
                  disabled={isPending}
                >
                  Mark as Pending
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Created
                </label>
                <p className="text-sm text-gray-900">
                  {formatDate(tender.createdAt)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Last Updated
                </label>
                <p className="text-sm text-gray-900">
                  {formatDate(tender.updatedAt)}
                </p>
              </div>
              {tender.submissionDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Submission Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(tender.submissionDate)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
