import {
  filterMembers,
  filterInvitations,
  getInvitationDisplayStatus,
  hasActiveFilters,
  getFilterSummary,
  getNoResultsMessage,
} from '../filter-utils';
import type { MemberWithUser } from '../filter-utils';
import type { PendingInvitation } from '@/server/organizations';
import type { FilterState } from '@/components/search-and-filters';

// Mock data
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
    },
    status: 'active',
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
    },
    status: 'inactive',
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
      email: 'bob@organization.com',
      image: null,
    },
    status: 'active',
  },
];

const mockInvitations: PendingInvitation[] = [
  {
    id: '1',
    email: 'alice@example.com',
    role: 'member',
    status: 'pending',
    expiresAt: new Date('2025-12-31'), // Future date
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

describe('filterMembers', () => {
  it('returns all members when no filters are applied', () => {
    const filters: FilterState = { search: '', role: 'all', status: 'all' };
    const result = filterMembers(mockMembers, filters);
    expect(result).toHaveLength(3);
  });

  it('filters members by search term (name)', () => {
    const filters: FilterState = { search: 'jane', role: 'all', status: 'all' };
    const result = filterMembers(mockMembers, filters);
    expect(result).toHaveLength(1);
    expect(result[0].user.name).toBe('Jane Smith');
  });

  it('filters members by search term (email)', () => {
    const filters: FilterState = {
      search: 'organization.com',
      role: 'all',
      status: 'all',
    };
    const result = filterMembers(mockMembers, filters);
    expect(result).toHaveLength(1);
    expect(result[0].user.email).toBe('bob@organization.com');
  });

  it('filters members by role', () => {
    const filters: FilterState = { search: '', role: 'admin', status: 'all' };
    const result = filterMembers(mockMembers, filters);
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe('admin');
  });

  it('filters members by status', () => {
    const filters: FilterState = { search: '', role: 'all', status: 'active' };
    const result = filterMembers(mockMembers, filters);
    expect(result).toHaveLength(2);
    expect(result.every((m) => m.status === 'active')).toBe(true);
  });

  it('combines multiple filters', () => {
    const filters: FilterState = {
      search: 'john',
      role: 'admin',
      status: 'active',
    };
    const result = filterMembers(mockMembers, filters);
    expect(result).toHaveLength(1);
    expect(result[0].user.name).toBe('John Doe');
  });
});

describe('filterInvitations', () => {
  it('returns all invitations when no filters are applied', () => {
    const filters: FilterState = { search: '', role: 'all', status: 'all' };
    const result = filterInvitations(mockInvitations, filters);
    expect(result).toHaveLength(2);
  });

  it('filters invitations by search term (email)', () => {
    const filters: FilterState = {
      search: 'alice',
      role: 'all',
      status: 'all',
    };
    const result = filterInvitations(mockInvitations, filters);
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('alice@example.com');
  });

  it('filters invitations by search term (inviter name)', () => {
    const filters: FilterState = { search: 'jane', role: 'all', status: 'all' };
    const result = filterInvitations(mockInvitations, filters);
    expect(result).toHaveLength(1);
    expect(result[0].inviterName).toBe('Jane Smith');
  });

  it('filters invitations by role', () => {
    const filters: FilterState = { search: '', role: 'admin', status: 'all' };
    const result = filterInvitations(mockInvitations, filters);
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe('admin');
  });

  it('filters invitations by status (pending)', () => {
    const filters: FilterState = { search: '', role: 'all', status: 'pending' };
    const result = filterInvitations(mockInvitations, filters);
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('alice@example.com');
  });

  it('filters invitations by status (expired)', () => {
    const filters: FilterState = { search: '', role: 'all', status: 'expired' };
    const result = filterInvitations(mockInvitations, filters);
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('charlie@example.com');
  });
});

describe('getInvitationDisplayStatus', () => {
  it('returns "pending" for non-expired pending invitations', () => {
    const invitation: PendingInvitation = {
      id: '1',
      email: 'test@example.com',
      role: 'member',
      status: 'pending',
      expiresAt: new Date('2025-12-31'), // Future date
      invitedAt: new Date('2024-01-01'),
      inviterName: 'Test User',
    };
    expect(getInvitationDisplayStatus(invitation)).toBe('pending');
  });

  it('returns "expired" for expired pending invitations', () => {
    const invitation: PendingInvitation = {
      id: '1',
      email: 'test@example.com',
      role: 'member',
      status: 'pending',
      expiresAt: new Date('2023-12-31'),
      invitedAt: new Date('2023-01-01'),
      inviterName: 'Test User',
    };
    expect(getInvitationDisplayStatus(invitation)).toBe('expired');
  });

  it('returns the original status for non-pending invitations', () => {
    const invitation: PendingInvitation = {
      id: '1',
      email: 'test@example.com',
      role: 'member',
      status: 'accepted',
      expiresAt: new Date('2024-12-31'),
      invitedAt: new Date('2024-01-01'),
      inviterName: 'Test User',
    };
    expect(getInvitationDisplayStatus(invitation)).toBe('accepted');
  });
});

describe('hasActiveFilters', () => {
  it('returns false when no filters are active', () => {
    const filters: FilterState = { search: '', role: 'all', status: 'all' };
    expect(hasActiveFilters(filters)).toBe(false);
  });

  it('returns true when search filter is active', () => {
    const filters: FilterState = { search: 'test', role: 'all', status: 'all' };
    expect(hasActiveFilters(filters)).toBe(true);
  });

  it('returns true when role filter is active', () => {
    const filters: FilterState = { search: '', role: 'admin', status: 'all' };
    expect(hasActiveFilters(filters)).toBe(true);
  });

  it('returns true when status filter is active', () => {
    const filters: FilterState = { search: '', role: 'all', status: 'active' };
    expect(hasActiveFilters(filters)).toBe(true);
  });
});

describe('getFilterSummary', () => {
  it('returns empty string when no filters are active', () => {
    const filters: FilterState = { search: '', role: 'all', status: 'all' };
    expect(getFilterSummary(filters)).toBe('');
  });

  it('returns search filter summary', () => {
    const filters: FilterState = { search: 'test', role: 'all', status: 'all' };
    expect(getFilterSummary(filters)).toBe('search: "test"');
  });

  it('returns combined filter summary', () => {
    const filters: FilterState = {
      search: 'test',
      role: 'admin',
      status: 'active',
    };
    expect(getFilterSummary(filters)).toBe(
      'search: "test", role: admin, status: active'
    );
  });
});

describe('getNoResultsMessage', () => {
  it('returns appropriate message when no filters are active', () => {
    const filters: FilterState = { search: '', role: 'all', status: 'all' };
    expect(getNoResultsMessage(filters, 'members')).toBe(
      'No members found. Invite some people to get started!'
    );
  });

  it('returns appropriate message when filters are active', () => {
    const filters: FilterState = { search: 'test', role: 'all', status: 'all' };
    expect(getNoResultsMessage(filters, 'members')).toBe(
      'No members found matching search: "test". Try adjusting your filters.'
    );
  });
});
