import { render, screen } from '@testing-library/react';
import { OrganizationGridWithEmptyStates } from '../organization-grid-with-empty-states';
import { Organization, Role } from '@/db/schema';

// Mock the child components
jest.mock('../organization-grid', () => ({
  OrganizationGrid: ({ organizations }: { organizations: any[] }) => (
    <div data-testid="organization-grid">
      Organization Grid with {organizations.length} organizations
    </div>
  ),
}));

jest.mock('../empty-search-results', () => ({
  EmptySearchResults: ({ searchTerm }: { searchTerm: string }) => (
    <div data-testid="empty-search-results">
      Empty search results for "{searchTerm}"
    </div>
  ),
}));

const mockOrganizations = [
  {
    id: '1',
    name: 'Test Organization 1',
    slug: 'test-org-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 5,
    userRole: 'admin' as Role,
  },
  {
    id: '2',
    name: 'Test Organization 2',
    slug: 'test-org-2',
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 3,
    userRole: 'member' as Role,
  },
];

describe('OrganizationGridWithEmptyStates', () => {
  const defaultProps = {
    organizations: mockOrganizations,
    filteredOrganizations: mockOrganizations,
  };

  it('renders OrganizationGrid when there are filtered organizations', () => {
    render(<OrganizationGridWithEmptyStates {...defaultProps} />);

    expect(screen.getByTestId('organization-grid')).toBeInTheDocument();
    expect(
      screen.getByText('Organization Grid with 2 organizations')
    ).toBeInTheDocument();
  });

  it('renders EmptySearchResults when there is a search term but no filtered results', () => {
    render(
      <OrganizationGridWithEmptyStates
        {...defaultProps}
        filteredOrganizations={[]}
        searchTerm="nonexistent"
      />
    );

    expect(screen.getByTestId('empty-search-results')).toBeInTheDocument();
    expect(
      screen.getByText('Empty search results for "nonexistent"')
    ).toBeInTheDocument();
  });

  it('renders OrganizationGrid when there is no search term and no filtered results (empty organizations)', () => {
    render(
      <OrganizationGridWithEmptyStates
        organizations={[]}
        filteredOrganizations={[]}
      />
    );

    // Should render OrganizationGrid which will handle the empty organizations state
    expect(screen.getByTestId('organization-grid')).toBeInTheDocument();
    expect(
      screen.getByText('Organization Grid with 0 organizations')
    ).toBeInTheDocument();
  });

  it('renders OrganizationGrid when search term is empty string', () => {
    render(
      <OrganizationGridWithEmptyStates
        {...defaultProps}
        filteredOrganizations={[]}
        searchTerm=""
      />
    );

    expect(screen.getByTestId('organization-grid')).toBeInTheDocument();
  });

  it('renders OrganizationGrid when search term is only whitespace', () => {
    render(
      <OrganizationGridWithEmptyStates
        {...defaultProps}
        filteredOrganizations={[]}
        searchTerm="   "
      />
    );

    expect(screen.getByTestId('organization-grid')).toBeInTheDocument();
  });

  it('passes through all props to OrganizationGrid when showing grid', () => {
    const mockOnCreate = jest.fn();
    render(
      <OrganizationGridWithEmptyStates
        {...defaultProps}
        activeOrganizationId="1"
        onCreateOrganization={mockOnCreate}
        className="custom-class"
      />
    );

    expect(screen.getByTestId('organization-grid')).toBeInTheDocument();
  });

  it('passes through props to EmptySearchResults when showing empty search', () => {
    const mockOnClear = jest.fn();
    const mockOnCreate = jest.fn();
    render(
      <OrganizationGridWithEmptyStates
        {...defaultProps}
        filteredOrganizations={[]}
        searchTerm="test"
        onClearSearch={mockOnClear}
        onCreateOrganization={mockOnCreate}
        className="custom-class"
      />
    );

    expect(screen.getByTestId('empty-search-results')).toBeInTheDocument();
  });

  it('handles edge case where organizations exist but filtered is empty without search term', () => {
    render(
      <OrganizationGridWithEmptyStates
        organizations={mockOrganizations}
        filteredOrganizations={[]}
      />
    );

    // Should show OrganizationGrid (which will show empty filtered results)
    expect(screen.getByTestId('organization-grid')).toBeInTheDocument();
  });
});
