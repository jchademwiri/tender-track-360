'use client';

import { useState } from 'react';
import { MembersTable } from '@/components/tables/members-table';
import { BulkActionsToolbar } from '@/components/bulk-actions-toolbar';
import { Member } from '@/db/schema';

interface MembersTableWrapperProps {
  members: Member[];
  isLoading?: boolean;
  error?: string | null;
  onInviteClick?: () => void;
  onRetry?: () => void;
}

export function MembersTableWrapper({
  members,
  isLoading = false,
  error = null,
  onInviteClick,
  onRetry,
}: MembersTableWrapperProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleSelectionChange = (memberIds: string[]) => {
    setSelectedMembers(memberIds);
  };

  const handleClearSelection = () => {
    setSelectedMembers([]);
  };

  const handleInviteClickInternal = () => {
    if (onInviteClick) {
      onInviteClick();
    } else {
      // TODO: Implement invite modal functionality
      console.log('Invite member clicked');
    }
  };

  return (
    <>
      <MembersTable
        members={members}
        selectedMembers={selectedMembers}
        onSelectionChange={handleSelectionChange}
        onInviteClick={handleInviteClickInternal}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
      />

      <BulkActionsToolbar
        selectedMembers={selectedMembers}
        selectedInvitations={[]}
        onClearSelection={handleClearSelection}
      />
    </>
  );
}
