'use client';

import { OrganizationGrid } from './organization-grid';
import { EmptySearchResults } from './empty-search-results';
import type { OrganizationWithStats } from '@/server/organizations';

interface OrganizationGridWithEmptyStatesProps {
  organizations: OrganizationWithStats[];
  filteredOrganizations: OrganizationWithStats[];
  activeOrganizationId?: string;
  onCreateOrganization?: () => void;
  searchTerm?: string;
  onClearSearch?: () => void;
  className?: string;
}

export function OrganizationGridWithEmptyStates({
  organizations,
  filteredOrganizations,
  activeOrganizationId,
  onCreateOrganization,
  searchTerm,
  onClearSearch,
  className,
}: OrganizationGridWithEmptyStatesProps) {
  // Show empty search results when there's a search term but no filtered results
  if (
    searchTerm &&
    searchTerm.trim() &&
    filteredOrganizations.length === 0 &&
    organizations.length > 0
  ) {
    return (
      <EmptySearchResults
        searchTerm={searchTerm}
        onClearSearch={onClearSearch}
        onCreateOrganization={onCreateOrganization}
        className={className}
      />
    );
  }

  // Use the regular organization grid (which handles the no organizations empty state)
  return (
    <OrganizationGrid
      organizations={filteredOrganizations}
      activeOrganizationId={activeOrganizationId}
      onCreateOrganization={onCreateOrganization}
      className={className}
    />
  );
}
