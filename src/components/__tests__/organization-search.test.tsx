import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrganizationSearch } from '../organization-search';
import { Organization } from '@/db/schema';

// Mock organizations data
const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    logo: null,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Tech Innovations Inc',
    slug: 'tech-innovations',
    logo: null,
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01'),
  },
  {
    id: '3',
    name: 'Global Solutions Ltd',
    slug: 'global-solutions',
    logo: null,
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-03-01'),
  },
  {
    id: '4',
    name: 'Digital Dynamics',
    slug: 'digital-dynamics',
    logo: null,
    createdAt: new Date('2023-04-01'),
    updatedAt: new Date('2023-04-01'),
  },
  {
    id: '5',
    name: 'Future Systems',
    slug: 'future-systems',
    logo: null,
    createdAt: new Date('2023-05-01'),
    updatedAt: new Date('2023-05-01'),
  },
];

describe('OrganizationSearch', () => {
  let mockOnFilter: jest.Mock;

  beforeEach(() => {
    mockOnFilter = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('Conditional Rendering', () => {
    it('should not render when there are 3 or fewer organizations', () => {
      const threeOrgs = mockOrganizations.slice(0, 3);
      render(
        <OrganizationSearch organizations={threeOrgs} onFilter={mockOnFilter} />
      );

      expect(
        screen.queryByPlaceholderText('Search organizations...')
      ).not.toBeInTheDocument();
    });

    it('should render when there are more than 3 organizations', () => {
      render(
        <OrganizationSearch
          organizations={mockOrganizations}
          onFilter={mockOnFilter}
        />
      );

      expect(
        screen.getByPlaceholderText('Search organizations...')
      ).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      render(
        <OrganizationSearch
          organizations={mockOrganizations}
          onFilter={mockOnFilter}
        />
      );
    });

    it('should display search input with correct placeholder', () => {
      const searchInput = screen.getByPlaceholderText(
        'Search organizations...'
      );
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('aria-label', 'Search organizations');
    });

    it('should update search term when typing', () => {
      const searchInput = screen.getByPlaceholderText(
        'Search organizations...'
      );

      fireEvent.change(searchInput, { target: { value: 'Acme' } });

      expect(searchInput).toHaveValue('Acme');
    });

    it('should show clear button when search term is entered', () => {
      const searchInput = screen.getByPlaceholderText(
        'Search organizations...'
      );

      fireEvent.change(searchInput, { target: { value: 'Acme' } });

      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toBeInTheDocument();
    });

    it('should clear search term when clear button is clicked', () => {
      const searchInput = screen.getByPlaceholderText(
        'Search organizations...'
      );

      fireEvent.change(searchInput, { target: { value: 'Acme' } });

      const clearButton = screen.getByLabelText('Clear search');
      fireEvent.click(clearButton);

      expect(searchInput).toHaveValue('');
    });
  });

  describe('Debounced Filtering', () => {
    beforeEach(() => {
      render(
        <OrganizationSearch
          organizations={mockOrganizations}
          onFilter={mockOnFilter}
        />
      );
    });

    it('should call onFilter with all organizations initially', () => {
      expect(mockOnFilter).toHaveBeenCalledWith(mockOrganizations);
    });

    it('should debounce search and call onFilter after delay', async () => {
      const searchInput = screen.getByPlaceholderText(
        'Search organizations...'
      );

      // Type in search input
      fireEvent.change(searchInput, { target: { value: 'Acme' } });

      // Should not call onFilter immediately
      expect(mockOnFilter).toHaveBeenCalledTimes(1); // Only initial call

      // Fast-forward time to trigger debounce
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnFilter).toHaveBeenCalledWith([mockOrganizations[0]]);
      });
    });
  });

  describe('Search Results', () => {
    beforeEach(() => {
      render(
        <OrganizationSearch
          organizations={mockOrganizations}
          onFilter={mockOnFilter}
        />
      );
    });

    it('should filter organizations by name (case insensitive)', async () => {
      const searchInput = screen.getByPlaceholderText(
        'Search organizations...'
      );

      fireEvent.change(searchInput, { target: { value: 'tech' } });
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnFilter).toHaveBeenCalledWith([mockOrganizations[1]]);
      });
    });

    it('should show no results message when no matches', async () => {
      const searchInput = screen.getByPlaceholderText(
        'Search organizations...'
      );

      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(
          screen.getByText('No organizations found matching "nonexistent"')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty organizations array', () => {
      render(<OrganizationSearch organizations={[]} onFilter={mockOnFilter} />);

      // Should not render with empty array
      expect(
        screen.queryByPlaceholderText('Search organizations...')
      ).not.toBeInTheDocument();
    });

    it('should handle whitespace-only search terms', async () => {
      render(
        <OrganizationSearch
          organizations={mockOrganizations}
          onFilter={mockOnFilter}
        />
      );

      const searchInput = screen.getByPlaceholderText(
        'Search organizations...'
      );

      fireEvent.change(searchInput, { target: { value: '   ' } });
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnFilter).toHaveBeenCalledWith(mockOrganizations);
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(
        <OrganizationSearch
          organizations={mockOrganizations}
          onFilter={mockOnFilter}
        />
      );
    });

    it('should have proper aria-label for search input', () => {
      const searchInput = screen.getByPlaceholderText(
        'Search organizations...'
      );
      expect(searchInput).toHaveAttribute('aria-label', 'Search organizations');
    });

    it('should have proper aria-label for clear button', () => {
      const searchInput = screen.getByPlaceholderText(
        'Search organizations...'
      );
      fireEvent.change(searchInput, { target: { value: 'test' } });

      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toHaveAttribute('aria-label', 'Clear search');
    });
  });
});
