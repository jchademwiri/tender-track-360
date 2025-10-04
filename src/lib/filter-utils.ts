import type { FilterState } from '@/components/search-and-filters';
import type { Member, Role } from '@/db/schema';
import type { PendingInvitation } from '@/server/organizations';

export interface MemberWithUser extends Member {
  status?: 'active' | 'inactive';
  joinedAt?: Date;
}

/**
 * Filters members based on search and filter criteria
 */
export function filterMembers(
  members: MemberWithUser[],
  filters: FilterState
): MemberWithUser[] {
  return members.filter((member) => {
    // Search filter - check name and email
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesName = member.user.name.toLowerCase().includes(searchTerm);
      const matchesEmail = member.user.email.toLowerCase().includes(searchTerm);

      if (!matchesName && !matchesEmail) {
        return false;
      }
    }

    // Role filter
    if (filters.role !== 'all' && member.role !== filters.role) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all') {
      const memberStatus = member.status || 'active'; // Default to active if not specified
      if (memberStatus !== filters.status) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Filters pending invitations based on search and filter criteria
 */
export function filterInvitations(
  invitations: PendingInvitation[],
  filters: FilterState
): PendingInvitation[] {
  return invitations.filter((invitation) => {
    // Search filter - check email and inviter name
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesEmail = invitation.email.toLowerCase().includes(searchTerm);
      const matchesInviter = invitation.inviterName
        .toLowerCase()
        .includes(searchTerm);

      if (!matchesEmail && !matchesInviter) {
        return false;
      }
    }

    // Role filter
    if (filters.role !== 'all' && invitation.role !== filters.role) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all') {
      let invitationStatus: string;

      // Determine invitation status
      if (invitation.status === 'pending') {
        // Check if expired
        const now = new Date();
        invitationStatus = invitation.expiresAt < now ? 'expired' : 'pending';
      } else {
        invitationStatus = invitation.status;
      }

      if (invitationStatus !== filters.status) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Gets the display status for an invitation
 */
export function getInvitationDisplayStatus(
  invitation: PendingInvitation
): string {
  if (invitation.status === 'pending') {
    const now = new Date();
    return invitation.expiresAt < now ? 'expired' : 'pending';
  }
  return invitation.status;
}

/**
 * Checks if there are any active filters applied
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.search !== '' || filters.role !== 'all' || filters.status !== 'all'
  );
}

/**
 * Gets a summary of applied filters for display
 */
export function getFilterSummary(filters: FilterState): string {
  const parts: string[] = [];

  if (filters.search) {
    parts.push(`search: "${filters.search}"`);
  }

  if (filters.role !== 'all') {
    parts.push(`role: ${filters.role}`);
  }

  if (filters.status !== 'all') {
    parts.push(`status: ${filters.status}`);
  }

  return parts.join(', ');
}

/**
 * Creates a "no results" message based on active filters
 */
export function getNoResultsMessage(
  filters: FilterState,
  type: 'members' | 'invitations' | 'both' = 'both'
): string {
  const hasFilters = hasActiveFilters(filters);

  if (!hasFilters) {
    switch (type) {
      case 'members':
        return 'No members found. Invite some people to get started!';
      case 'invitations':
        return 'No pending invitations.';
      case 'both':
        return 'No members or invitations found.';
    }
  }

  const filterSummary = getFilterSummary(filters);

  switch (type) {
    case 'members':
      return `No members found matching ${filterSummary}. Try adjusting your filters.`;
    case 'invitations':
      return `No invitations found matching ${filterSummary}. Try adjusting your filters.`;
    case 'both':
      return `No results found matching ${filterSummary}. Try adjusting your filters.`;
  }
}
