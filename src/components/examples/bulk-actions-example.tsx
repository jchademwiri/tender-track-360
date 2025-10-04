'use client';

import { OrganizationMembersSection } from '@/components/organization-members-section';
import { Member } from '@/db/schema';
import { PendingInvitation } from '@/server/organizations';

// Example usage of the BulkActionsToolbar component
export function BulkActionsExample() {
  // Mock data for demonstration
  const mockMembers: Member[] = [
    {
      id: 'member1',
      userId: 'user1',
      organizationId: 'org1',
      role: 'member',
      createdAt: new Date(),
      user: {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        image: null,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      id: 'member2',
      userId: 'user2',
      organizationId: 'org1',
      role: 'admin',
      createdAt: new Date(),
      user: {
        id: 'user2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        image: null,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ];

  const mockInvitations: PendingInvitation[] = [
    {
      id: 'inv1',
      email: 'pending1@example.com',
      role: 'member',
      status: 'pending',
      invitedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      inviterName: 'Admin User',
    },
    {
      id: 'inv2',
      email: 'pending2@example.com',
      role: 'member',
      status: 'pending',
      invitedAt: new Date(),
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      inviterName: 'Admin User',
    },
  ];

  const handleInviteClick = () => {
    console.log('Invite member clicked');
    // This would typically open an invite modal
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Organization Members Management
      </h1>
      <p className="text-muted-foreground mb-6">
        This example demonstrates the BulkActionsToolbar component in action.
        Select multiple members or invitations to see the bulk actions toolbar
        appear at the bottom.
      </p>

      <OrganizationMembersSection
        members={mockMembers}
        pendingInvitations={mockInvitations}
        onInviteClick={handleInviteClick}
        isLoading={false}
      />
    </div>
  );
}

export default BulkActionsExample;
