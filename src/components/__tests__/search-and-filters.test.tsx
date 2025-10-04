import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchAndFilters } from '../search-and-filters';

describe('SearchAndFilters', () => {
  const mockOnFiltersChange = jest.fn();

  beforeEach(() => {
    mockOnFiltersChange.mockClear();
  });

  it('renders search input with placeholder', () => {
    render(
      <SearchAndFilters
        onFiltersChange={mockOnFiltersChange}
        placeholder="Search test..."
      />
    );

    expect(screen.getByPlaceholderText('Search test...')).toBeInTheDocument();
  });

  it('renders role and status filters by default', () => {
    render(<SearchAndFilters onFiltersChange={mockOnFiltersChange} />);

    expect(screen.getByText('All Roles')).toBeInTheDocument();
    expect(screen.getByText('All Status')).toBeInTheDocument();
  });

  it('can hide role filter when showRoleFilter is false', () => {
    render(
      <SearchAndFilters
        onFiltersChange={mockOnFiltersChange}
        showRoleFilter={false}
      />
    );

    expect(screen.queryByText('All Roles')).not.toBeInTheDocument();
  });

  it('can hide status filter when showStatusFilter is false', () => {
    render(
      <SearchAndFilters
        onFiltersChange={mockOnFiltersChange}
        showStatusFilter={false}
      />
    );

    expect(screen.queryByText('All Status')).not.toBeInTheDocument();
  });

  it('calls onFiltersChange when search input changes', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilters onFiltersChange={mockOnFiltersChange} />);

    const searchInput = screen.getByPlaceholderText(
      'Search members and invitations...'
    );
    await user.type(searchInput, 'test search');

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenLastCalledWith({
        search: 'test search',
        role: 'all',
        status: 'all',
      });
    });
  });

  it('shows active filters as badges', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilters onFiltersChange={mockOnFiltersChange} />);

    // Type in search
    const searchInput = screen.getByPlaceholderText(
      'Search members and invitations...'
    );
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByText('Active filters:')).toBeInTheDocument();
      expect(screen.getByText('Search:')).toBeInTheDocument();
      expect(screen.getByText('test')).toBeInTheDocument();
    });
  });

  it('shows clear filters button when filters are active', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilters onFiltersChange={mockOnFiltersChange} />);

    // Type in search
    const searchInput = screen.getByPlaceholderText(
      'Search members and invitations...'
    );
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    });
  });

  it('clears all filters when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilters onFiltersChange={mockOnFiltersChange} />);

    // Add some filters
    const searchInput = screen.getByPlaceholderText(
      'Search members and invitations...'
    );
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    });

    // Click clear
    await user.click(screen.getByText('Clear Filters'));

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenLastCalledWith({
        search: '',
        role: 'all',
        status: 'all',
      });
    });
  });

  it('can remove individual filter badges', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilters onFiltersChange={mockOnFiltersChange} />);

    // Add search filter
    const searchInput = screen.getByPlaceholderText(
      'Search members and invitations...'
    );
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByText('Search:')).toBeInTheDocument();
    });

    // Find and click the X button in the search badge
    const searchBadge = screen.getByText('Search:').closest('.flex');
    const removeButton = searchBadge?.querySelector('button');

    if (removeButton) {
      await user.click(removeButton);
    }

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenLastCalledWith({
        search: '',
        role: 'all',
        status: 'all',
      });
    });
  });
});
