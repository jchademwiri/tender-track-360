import { render, screen, fireEvent } from '@testing-library/react';
import { EmptySearchResults } from '../empty-search-results';

describe('EmptySearchResults', () => {
  const defaultProps = {
    searchTerm: 'test search',
  };

  it('renders the empty search results with correct content', () => {
    render(<EmptySearchResults {...defaultProps} />);

    // Check main heading
    expect(screen.getByText('No organizations found')).toBeInTheDocument();

    // Check description with search term
    expect(
      screen.getByText(/We couldn't find any organizations matching/)
    ).toBeInTheDocument();
    expect(screen.getByText('"test search"')).toBeInTheDocument();

    // Check search suggestions
    expect(screen.getByText('Try searching for:')).toBeInTheDocument();
    expect(screen.getByText('organization name')).toBeInTheDocument();
    expect(screen.getByText('team name')).toBeInTheDocument();
    expect(screen.getByText('project name')).toBeInTheDocument();
  });

  it('shows clear search button when onClearSearch is provided', () => {
    const mockOnClear = jest.fn();
    render(
      <EmptySearchResults {...defaultProps} onClearSearch={mockOnClear} />
    );

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('shows create organization button when onCreateOrganization is provided', () => {
    const mockOnCreate = jest.fn();
    render(
      <EmptySearchResults
        {...defaultProps}
        onCreateOrganization={mockOnCreate}
      />
    );

    const createButton = screen.getByRole('button', { name: /create new/i });
    expect(createButton).toBeInTheDocument();

    fireEvent.click(createButton);
    expect(mockOnCreate).toHaveBeenCalledTimes(1);
  });

  it('shows both buttons when both callbacks are provided', () => {
    const mockOnClear = jest.fn();
    const mockOnCreate = jest.fn();
    render(
      <EmptySearchResults
        {...defaultProps}
        onClearSearch={mockOnClear}
        onCreateOrganization={mockOnCreate}
      />
    );

    expect(
      screen.getByRole('button', { name: /clear search/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create new/i })
    ).toBeInTheDocument();
  });

  it('does not show buttons when callbacks are not provided', () => {
    render(<EmptySearchResults {...defaultProps} />);

    expect(
      screen.queryByRole('button', { name: /clear search/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /create new/i })
    ).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <EmptySearchResults {...defaultProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has proper visual elements', () => {
    const { container } = render(<EmptySearchResults {...defaultProps} />);

    // Check for search icon
    const searchIcon = container.querySelector('.lucide-search');
    expect(searchIcon).toBeInTheDocument();
  });

  it('handles different search terms correctly', () => {
    const { rerender } = render(
      <EmptySearchResults searchTerm="first search" />
    );

    expect(screen.getByText('"first search"')).toBeInTheDocument();

    rerender(<EmptySearchResults searchTerm="second search" />);
    expect(screen.getByText('"second search"')).toBeInTheDocument();
    expect(screen.queryByText('"first search"')).not.toBeInTheDocument();
  });

  it('has proper card structure', () => {
    const { container } = render(<EmptySearchResults {...defaultProps} />);

    // Should have card structure
    const card = container.querySelector('.border-muted');
    expect(card).toBeInTheDocument();
  });
});
