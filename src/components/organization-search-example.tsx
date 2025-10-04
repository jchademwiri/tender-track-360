'use client';

import { useState } from 'react';
import { organization } from '@/db/schema';
import { OrganizationSearch } from './organization-search';
import { OrganizationCard } from './organization-card';
import { EmptySearchResults } from './empty-search-results';

interface OrganizationSearchExampleProps {
  organizations: (typeof organization.$inferSelect)[];
  onCreateOrganization?: () => void;
}

export function OrganizationSearchExample({
  organizations,
  onCreateOrganization,
}: OrganizationSearchExampleProps) {
  const [filteredOrganizations, setFilteredOrganizations] =
    useState(organizations);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilter = (filtered: (typeof organization.$inferSelect)[]) => {
    setFilteredOrganizations(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredOrganizations(organizations);
  };

  return (
    <div className="space-y-6">
      {/* Search component - only shows when >3 organizations */}
      <OrganizationSearch
        organizations={organizations}
        onFilter={handleFilter}
        onSearchChange={setSearchTerm}
      />

      {/* Show empty search results when there's a search term but no filtered results */}
      {searchTerm &&
      searchTerm.trim() &&
      filteredOrganizations.length === 0 &&
      organizations.length > 0 ? (
        <EmptySearchResults
          searchTerm={searchTerm}
          onClearSearch={handleClearSearch}
          onCreateOrganization={onCreateOrganization}
        />
      ) : (
        /* Organization grid */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrganizations.map((org) => (
            <OrganizationCard
              key={org.id}
              organization={org}
              memberCount={Math.floor(Math.random() * 20) + 1} // Mock member count
              userRole="member"
            />
          ))}
        </div>
      )}
    </div>
  );
}
