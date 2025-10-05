'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trash2,
  UserX,
  Download,
  AlertTriangle,
  Clock,
  Shield,
  Users,
} from 'lucide-react';
import { OrganizationDeletionModal } from './deletion-modal';
import { OwnershipTransferModal } from './transfer-ownership-modal';
import { DataExportModal } from './data-export-modal';
import type { Role } from '@/db/schema';
import {
  initiateOrganizationDeletion,
  initiateOwnershipTransfer,
  exportOrganizationData,
} from '@/server/organization-advanced-actions';
import { toast } from 'sonner';

interface DangerZoneProps {
  organizationId: string;
  userRole: Role;
  organizationName: string;
  memberCount: number;
  hasActiveContracts: boolean;
}

export function DangerZone({
  organizationId,
  userRole,
  organizationName,
  memberCount,
  hasActiveContracts,
}: DangerZoneProps) {
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const isOwner = userRole === 'owner';

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Organization Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Export all organization data including members, tenders, contracts,
            and settings. This is recommended before performing any destructive
            operations.
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Badge variant="secondary" className="text-xs">
              Safe Operation
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Ownership Transfer */}
      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5" />
              Transfer Ownership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Transfer ownership of this organization to another admin or
              manager. You will become an admin after the transfer is completed.
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowTransferModal(true)}
                className="flex items-center gap-2"
              >
                <UserX className="h-4 w-4" />
                Transfer Ownership
              </Button>
              <Badge variant="secondary" className="text-xs">
                Reversible
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Organization Deletion */}
      {isOwner && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <Trash2 className="h-5 w-5" />
              Delete Organization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Permanently delete this organization and all associated data.
                This action cannot be undone after the grace period expires.
              </p>

              {/* Organization Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {memberCount} member{memberCount !== 1 ? 's' : ''}
                </div>
                {hasActiveContracts && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    Active contracts
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                onClick={() => setShowDeletionModal(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Organization
              </Button>
              <Badge variant="destructive" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                30-day grace period
              </Badge>
            </div>

            {hasActiveContracts && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-700 dark:text-amber-300">
                  <p className="font-medium">
                    Warning: Active contracts detected
                  </p>
                  <p>
                    Deleting this organization may affect ongoing contracts and
                    business relationships.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Access Restriction Message for Non-Owners */}
      {!isOwner && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <Shield className="h-5 w-5" />
              Limited Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-600 dark:text-amber-300">
              Some dangerous operations are restricted to organization owners.
              Contact your organization owner if you need to perform ownership
              transfer or organization deletion.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <OrganizationDeletionModal
        isOpen={showDeletionModal}
        onClose={() => setShowDeletionModal(false)}
        organization={{
          id: organizationId,
          name: organizationName,
          memberCount,
          tenderCount: 0, // This would be fetched from actual data
          contractCount: 0, // This would be fetched from actual data
        }}
        onConfirm={async (confirmation) => {
          try {
            const result = await initiateOrganizationDeletion(
              organizationId,
              confirmation
            );

            if (result.success) {
              toast.success(
                confirmation.deletionType === 'soft'
                  ? 'Organization soft deletion initiated. You have 30 days to restore it.'
                  : 'Organization permanently deleted.'
              );
              setShowDeletionModal(false);
              // Redirect to organizations list after successful deletion
              window.location.href = '/dashboard/settings/organisation';
            } else {
              toast.error(
                result.error?.message || 'Failed to delete organization'
              );
            }
          } catch (error) {
            console.error('Error deleting organization:', error);
            toast.error(
              'An unexpected error occurred while deleting the organization'
            );
          }
        }}
      />

      <OwnershipTransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        organizationId={organizationId}
        eligibleMembers={[]} // This would be fetched from actual data
        onTransfer={async (request) => {
          try {
            const result = await initiateOwnershipTransfer(request);

            if (result.success) {
              toast.success(
                'Ownership transfer initiated. The new owner will receive an email to confirm.'
              );
              setShowTransferModal(false);
            } else {
              toast.error(
                result.error?.message || 'Failed to initiate ownership transfer'
              );
            }
          } catch (error) {
            console.error('Error initiating ownership transfer:', error);
            toast.error(
              'An unexpected error occurred while initiating the transfer'
            );
          }
        }}
      />

      <DataExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        organizationId={organizationId}
        organizationName={organizationName}
        onExport={async (format) => {
          try {
            const result = await exportOrganizationData(organizationId, format);

            if (result.success && result.data?.exportUrl) {
              toast.success('Data export completed successfully');
              // Open the export URL in a new tab
              window.open(result.data.exportUrl, '_blank');
              setShowExportModal(false);
            } else {
              toast.error(
                result.error?.message || 'Failed to export organization data'
              );
            }
          } catch (error) {
            console.error('Error exporting organization data:', error);
            toast.error('An unexpected error occurred while exporting data');
          }
        }}
      />
    </div>
  );
}
