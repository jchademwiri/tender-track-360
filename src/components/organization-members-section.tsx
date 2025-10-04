'use client';

import { useState } from 'react';
import { MembersTable } from '@/components/tables/members-table';
import { PendingInvitationsSection } from '@/components/pending-invitations-section';
import { BulkActionsToolbar } from '@/components/bulk-actions-toolbar';
import { Member } from '@/db/schema';
import { PendingInvitation } from '@/server/organizations';

interface OrganizationMembersSectionProps {
  members: Member[];
  pendingInvitations: PendingInvitation[];
  isLoading?: boolean;
  onInviteClick?: () => void;
}

export function OrganizationMembersSection({
  members,
  pendingInvitations,
  isLoading = false,
  onInviteClick,
}: OrganizationMembersSectionProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedInvitations, setSelectedInvitations] = useState<string[]>([]);

  const handleMemberSelectionChange = (memberIds: string[]) => {
    setSelectedMembers(memberIds);
  };

  const handleInvitationSelectionChange = (invitationIds: string[]) => {
    setSelectedInvitations(invitationIds);
  };

  const handleClearSelection = () => {
    setSelectedMembers([]);
    setSelectedInvitations([]);
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
    <div className="space-y-6">
      {/* Members Table */}
      <MembersTable
        members={members}
        selectedMembers={selectedMembers}
        onSelectionChange={handleMemberSelectionChange}
        onInviteClick={handleInviteClickInternal}
        isLoading={isLoading}
      />

      {/* Pending Invitations Section */}
      <PendingInvitationsSection
        invitations={pendingInvitations}
        selectedInvitations={selectedInvitations}
        onSelectionChange={handleInvitationSelectionChange}
        isLoading={isLoading}
      />

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedMembers={selectedMembers}
        selectedInvitations={selectedInvitations}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
}
