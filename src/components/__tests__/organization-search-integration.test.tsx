import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrganizationSearchExample } from '../organization-search-example';
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

describe('OrganizationSearchExample Integration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render all organizations initially', () => {
    render(<OrganizationSearchExample organizations={mockOrganizations} />);

    // Should show all organization cards
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
    expect(screen.getByText('Tech Innovations Inc')).toBeInTheDocument();
    expect(screen.getByText('Global Solutions Ltd')).toBeInTheDocument();
    expect(screen.getByText('Digital Dynamics')).toBeInTheDocument();
    expect(screen.getByText('Future Systems')).toBeInTheDocument();
  });

  it('should show search input when there are more than 3 organizations', () => {
    render(<OrganizationSearchExample organizations={mockOrganizations} />);

    expect(
      screen.getByPlaceholderText('Search organizations...')
    ).toBeInTheDocument();
  });

  it('should not show search input when there are 3 or fewer organizations', () => {
    const threeOrgs = mockOrganizations.slice(0, 3);
    render(<OrganizationSearchExample organizations={threeOrgs} />);

    expect(
      screen.queryByPlaceholderText('Search organizations...')
    ).not.toBeInTheDocument();
  });

  it('should filter organizations when searching', async () => {
    render(<OrganizationSearchExample organizations={mockOrganizations} />);

    const searchInput = screen.getByPlaceholderText('Search organizations...');

    // Search for "tech"
    fireEvent.change(searchInput, { target: { value: 'tech' } });
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      // Should only show Tech Innovations Inc
      expect(screen.getByText('Tech Innovations Inc')).toBeInTheDocument();
      expect(screen.queryByText('Acme Corporation')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Global Solutions Ltd')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Digital Dynamics')).not.toBeInTheDocument();
      expect(screen.queryByText('Future Systems')).not.toBeInTheDocument();
    });
  });

  it('should show empty state when no organizations match search', async () => {
    render(<OrganizationSearchExample organizations={mockOrganizations} />);

    const searchInput = screen.getByPlaceholderText('Search organizations...');

    // Search for something that doesn't exist
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      // Should show empty search results component
      expect(screen.getByText('No organizations found')).toBeInTheDocument();
      expect(screen.getByText('"nonexistent"')).toBeInTheDocument();

      // Should not show any organization cards
      expect(screen.queryByText('Acme Corporation')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Tech Innovations Inc')
      ).not.toBeInTheDocument();
    });
  });

  it('should restore all organizations when search is cleared', async () => {
    render(<OrganizationSearchExample organizations={mockOrganizations} />);

    const searchInput = screen.getByPlaceholderText('Search organizations...');

    // Search first
    fireEvent.change(searchInput, { target: { value: 'tech' } });
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText('Tech Innovations Inc')).toBeInTheDocument();
      expect(screen.queryByText('Acme Corporation')).not.toBeInTheDocument();
    });

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      // Should show all organizations again
      expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      expect(screen.getByText('Tech Innovations Inc')).toBeInTheDocument();
      expect(screen.getByText('Global Solutions Ltd')).toBeInTheDocument();
      expect(screen.getByText('Digital Dynamics')).toBeInTheDocument();
      expect(screen.getByText('Future Systems')).toBeInTheDocument();
    });
  });

  it('should handle empty organizations array', () => {
    render(<OrganizationSearchExample organizations={[]} />);

    // Should not show search input
    expect(
      screen.queryByPlaceholderText('Search organizations...')
    ).not.toBeInTheDocument();

    // Should not show empty search results (since there were no orgs to begin with)
    expect(
      screen.queryByText('No organizations found')
    ).not.toBeInTheDocument();
  });
});
