import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrganizationPageContent } from '../organization-page-content';
import { authClient } from '@/lib/auth-client';
import type { OrganizationWithStats } from '@/server/organizations';
import type { RecentActivity } from '@/types/activity';

// Mock auth client
jest.mock('@/lib/auth-client', () => ({
  authClient: {
    useActiveOrganization: jest.fn(),
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock child components
jest.mock('../organization-grid', () => ({
  OrganizationGrid: ({ organizations, onCreateOrganization }: any) => (
    <div data-testid="organization-grid">
      {organizations.map((org: any) => (
        <div key={org.id} data-testid={`org-${org.id}`}>
          {org.name}
        </div>
      ))}
      <button onClick={onCreateOrganization} data-testid="create-org-button">
        Create Organization
      </button>
    </div>
  ),
}));

jest.mock('../organization-search', () => ({
  OrganizationSearch: ({ organizations, onFilter, onSearchChange }: any) => (
    <div data-testid="organization-search">
      <input
        data-testid="search-input"
        onChange={(e) => {
          onSearchChange(e.target.value);
          const filtered = organizations.filter((org: any) =>
            org.name.toLowerCase().includes(e.target.value.toLowerCase())
          );
          onFilter(filtered);
        }}
        placeholder="Search organizations..."
      />
    </div>
  ),
}));

jest.mock('../recent-activity-section', () => ({
  RecentActivitySection: ({ activities, onViewAll }: any) => (
    <div data-testid="recent-activity">
      <h3>Recent Activity</h3>
      {activities.map((activity: any) => (
        <div key={activity.id} data-testid={`activity-${activity.id}`}>
          {activity.description}
        </div>
      ))}
      {activities.length > 0 && (
        <button onClick={onViewAll} data-testid="view-all-button">
          View All
        </button>
      )}
    </div>
  ),
}));

jest.mock('@/components/forms', () => ({
  CreateorganizationForm: () => (
    <form data-testid="create-org-form">
      <input data-testid="org-name-input" placeholder="Organization name" />
      <button type="submit" data-testid="submit-button">
        Create
      </button>
    </form>
  ),
}));

const mockOrganizations: OrganizationWithStats[] = [
  {
    id: '1',
    name: 'Test Organization 1',
    slug: 'test-org-1',
    logo: null,
    createdAt: new Date('2024-01-01'),
    metadata: null,
    memberCount: 5,
    userRole: 'admin' as const,
    lastActivity: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Test Organization 2',
    slug: 'test-org-2',
    logo: null,
    createdAt: new Date('2024-02-01'),
    metadata: null,
    memberCount: 3,
    userRole: 'member' as const,
    lastActivity: new Date('2024-02-10'),
  },
];

const mockRecentActivities: RecentActivity[] = [
  {
    id: '1',
    organizationId: '1',
    type: 'member_joined',
    description: 'John Doe joined Test Organization 1',
    timestamp: new Date('2024-01-15'),
    user: { id: '1', name: 'John Doe', email: 'john@example.com' },
  },
  {
    id: '2',
    organizationId: '2',
    type: 'project_created',
    description: 'New project created in Test Organization 2',
    timestamp: new Date('2024-02-10'),
    user: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  },
];

describe('OrganizationPageContent Integration Tests', () => {
  const mockUseActiveOrganization =
    authClient.useActiveOrganization as jest.Mock;

  beforeEach(() => {
    mockUseActiveOrganization.mockReturnValue({
      data: mockOrganizations[0],
      isPending: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading States', () => {
    it('shows loading spinner when checking active organization', () => {
      mockUseActiveOrganization.mockReturnValue({
        data: null,
        isPending: true,
      });

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      expect(
        screen.getByText('Loading your organizations...')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('status', { name: /loading/i })
      ).toBeInTheDocument();
    });

    // Note: Client-side loading state test removed as it tests implementation details
  });

  describe('Empty State', () => {
    it('shows create organization prompt when no organizations exist', async () => {
      render(
        <OrganizationPageContent organizations={[]} recentActivities={[]} />
      );

      await waitFor(() => {
        expect(
          screen.getByText('Create Your First Organization')
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Get started by creating an organization/)
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: /create organization/i })
        ).toBeInTheDocument();
      });
    });

    it('opens create dialog when create button is clicked in empty state', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent organizations={[]} recentActivities={[]} />
      );

      await waitFor(() => {
        const createButton = screen.getByRole('button', {
          name: /create organization/i,
        });
        expect(createButton).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', {
        name: /create organization/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.getByTestId('create-org-form')).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Main Layout with Organizations', () => {
    it('renders all main sections when organizations exist', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('organization-search')).toBeInTheDocument();
        expect(screen.getByTestId('organization-grid')).toBeInTheDocument();
        expect(screen.getByTestId('recent-activity')).toBeInTheDocument();
        expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      });
    });

    it('displays correct organization count in search results', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('org-1')).toBeInTheDocument();
        expect(screen.getByTestId('org-2')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality Integration', () => {
    it('filters organizations based on search input', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('search-input')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'Test Organization 1');

      await waitFor(() => {
        expect(
          screen.getByText('Showing 1 of 2 organizations')
        ).toBeInTheDocument();
        expect(screen.getByTestId('org-1')).toBeInTheDocument();
        expect(screen.queryByTestId('org-2')).not.toBeInTheDocument();
      });
    });

    it('shows no results message when search yields no matches', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('search-input')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'Nonexistent Organization');

      await waitFor(() => {
        expect(screen.getByText('No organizations found')).toBeInTheDocument();
        expect(
          screen.getByText(/Try adjusting your search terms/)
        ).toBeInTheDocument();
      });
    });

    it('clears search results when input is cleared', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      const searchInput = screen.getByTestId('search-input');

      // First search
      await user.type(searchInput, 'Test Organization 1');
      await waitFor(() => {
        expect(
          screen.getByText('Showing 1 of 2 organizations')
        ).toBeInTheDocument();
      });

      // Clear search
      await user.clear(searchInput);
      await waitFor(() => {
        expect(
          screen.queryByText('Showing 1 of 2 organizations')
        ).not.toBeInTheDocument();
        expect(screen.getByTestId('org-1')).toBeInTheDocument();
        expect(screen.getByTestId('org-2')).toBeInTheDocument();
      });
    });
  });

  describe('Create Organization Dialog Integration', () => {
    it('opens create dialog from grid create button', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('create-org-button')).toBeInTheDocument();
      });

      const createButton = screen.getByTestId('create-org-button');
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.getByTestId('create-org-form')).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('opens create dialog from quick actions', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const quickActionButtons = screen.getAllByRole('button', {
          name: /create organization/i,
        });
        expect(quickActionButtons.length).toBeGreaterThan(0);
      });

      const quickActionButtons = screen.getAllByRole('button', {
        name: /create organization/i,
      });
      // Click the second button (quick actions button, not the grid button)
      await user.click(quickActionButtons[1]);

      await waitFor(() => {
        expect(screen.getByTestId('create-org-form')).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Recent Activity Integration', () => {
    it('displays recent activities correctly', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('activity-1')).toBeInTheDocument();
        expect(screen.getByTestId('activity-2')).toBeInTheDocument();
        expect(
          screen.getByText('John Doe joined Test Organization 1')
        ).toBeInTheDocument();
        expect(
          screen.getByText('New project created in Test Organization 2')
        ).toBeInTheDocument();
      });
    });

    it('shows view all button when activities exist', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('view-all-button')).toBeInTheDocument();
      });
    });

    it('handles view all activity action', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('view-all-button')).toBeInTheDocument();
      });

      const viewAllButton = screen.getByTestId('view-all-button');
      await user.click(viewAllButton);

      expect(consoleSpy).toHaveBeenCalledWith('Navigate to full activity page');
      consoleSpy.mockRestore();
    });
  });

  describe('Quick Actions Integration', () => {
    it('shows dashboard link when active organization exists', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const dashboardButton = screen.getByLabelText(
          'Go to Test Organization 1 dashboard'
        );
        expect(dashboardButton).toBeInTheDocument();
      });
    });

    it('navigates to dashboard when dashboard button is clicked', async () => {
      const user = userEvent.setup();

      // Mock window.location.href
      delete (window as any).location;
      window.location = { href: '' } as any;

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const dashboardButton = screen.getByLabelText(
          'Go to Test Organization 1 dashboard'
        );
        expect(dashboardButton).toBeInTheDocument();
      });

      const dashboardButton = screen.getByLabelText(
        'Go to Test Organization 1 dashboard'
      );
      await user.click(dashboardButton);

      expect(window.location.href).toBe('/organization/test-org-1/dashboard');
    });

    it('hides dashboard link when no active organization', async () => {
      mockUseActiveOrganization.mockReturnValue({
        data: null,
        isPending: false,
      });

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(
          screen.queryByLabelText('Go to Test Organization 1 dashboard')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Responsive Layout', () => {
    it('maintains proper grid structure', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const mainGrid = screen
          .getByTestId('organization-grid')
          .closest('.lg\\:col-span-3');
        const sidebar = screen
          .getByTestId('recent-activity')
          .closest('.lg\\:col-span-1');

        expect(mainGrid).toBeInTheDocument();
        expect(sidebar).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles missing active organization gracefully', async () => {
      mockUseActiveOrganization.mockReturnValue({
        data: undefined,
        isPending: false,
      });

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('organization-grid')).toBeInTheDocument();
        expect(
          screen.queryByLabelText('Go to Test Organization 1 dashboard')
        ).not.toBeInTheDocument();
      });
    });

    it('handles empty recent activities gracefully', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('recent-activity')).toBeInTheDocument();
        expect(screen.queryByTestId('view-all-button')).not.toBeInTheDocument();
      });
    });
  });
});
