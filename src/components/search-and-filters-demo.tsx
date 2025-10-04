'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchAndFilters } from '@/components/search-and-filters';
import { MembersAndInvitationsWithSearch } from '@/components/members-and-invitations-with-search';
import type { MemberWithUser } from '@/lib/filter-utils';
import type { PendingInvitation } from '@/server/organizations';

// Mock data for demonstration
const mockMembers: MemberWithUser[] = [
  {
    id: '1',
    organizationId: 'org1',
    userId: 'user1',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    user: {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      image: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      emailVerified: true,
    },
    status: 'active',
    joinedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    organizationId: 'org1',
    userId: 'user2',
    role: 'member',
    createdAt: new Date('2024-01-02'),
    user: {
      id: 'user2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      image: null,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      emailVerified: true,
    },
    status: 'active',
    joinedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    organizationId: 'org1',
    userId: 'user3',
    role: 'owner',
    createdAt: new Date('2024-01-03'),
    user: {
      id: 'user3',
      name: 'Bob Johnson',
      email: 'bob@company.com',
      image: null,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
      emailVerified: true,
    },
    status: 'inactive',
    joinedAt: new Date('2024-01-03'),
  },
];

const mockInvitations: PendingInvitation[] = [
  {
    id: '1',
    email: 'alice@example.com',
    role: 'member',
    status: 'pending',
    expiresAt: new Date('2025-12-31'),
    invitedAt: new Date('2024-01-01'),
    inviterName: 'John Doe',
  },
  {
    id: '2',
    email: 'charlie@example.com',
    role: 'admin',
    status: 'pending',
    expiresAt: new Date('2023-12-31'), // Expired
    invitedAt: new Date('2023-12-01'),
    inviterName: 'Jane Smith',
  },
];

export function SearchAndFiltersDemo() {
  const [showDemo, setShowDemo] = useState(false);

  const handleInviteMember = () => {
    console.log('Invite member clicked');
  };

  const handleMemberAction = (memberId: string, action: string) => {
    console.log('Member action:', memberId, action);
  };

  const handleInvitationAction = (invitationId: string, action: string) => {
    console.log('Invitation action:', invitationId, action);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Search and Filters Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This demo shows the search and filtering functionality for members
            and invitations. Click the button below to see it in action.
          </p>
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {showDemo ? 'Hide Demo' : 'Show Demo'}
          </button>
        </CardContent>
      </Card>

      {showDemo && (
        <MembersAndInvitationsWithSearch
          members={mockMembers}
          invitations={mockInvitations}
          onInviteMember={handleInviteMember}
          onMemberAction={handleMemberAction}
          onInvitationAction={handleInvitationAction}
        />
      )}
    </div>
  );
}
