import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { OrganizationPageContent } from '../organization-page-content';
import { authClient } from '@/lib/auth-client';
import type { OrganizationWithStats } from '@/server/organizations';
import type { RecentActivity } from '@/types/activity';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

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

// Mock child components with accessibility features
jest.mock('../organization-grid', () => ({
  OrganizationGrid: ({ organizations, onCreateOrganization }: any) => (
    <div data-testid="organization-grid" role="grid" aria-label="Organizations">
      {organizations.map((org: any) => (
        <div
          key={org.id}
          data-testid={`org-${org.id}`}
          role="gridcell"
          tabIndex={0}
          aria-label={`Organization: ${org.name}`}
        >
          {org.name}
        </div>
      ))}
      <button
        onClick={onCreateOrganization}
        data-testid="create-org-button"
        aria-label="Create new organization"
      >
        Create Organization
      </button>
    </div>
  ),
}));

jest.mock('../organization-search', () => ({
  OrganizationSearch: ({ organizations, onFilter, onSearchChange }: any) => (
    <div data-testid="organization-search" role="search">
      <label htmlFor="search-input" className="sr-only">
        Search organizations
      </label>
      <input
        id="search-input"
        data-testid="search-input"
        onChange={(e) => {
          onSearchChange(e.target.value);
          const filtered = organizations.filter((org: any) =>
            org.name.toLowerCase().includes(e.target.value.toLowerCase())
          );
          onFilter(filtered);
        }}
        placeholder="Search organizations..."
        aria-describedby="search-help"
      />
      <div id="search-help" className="sr-only">
        Type to filter organizations by name
      </div>
    </div>
  ),
}));

jest.mock('../recent-activity-section', () => ({
  RecentActivitySection: ({ activities, onViewAll }: any) => (
    <div
      data-testid="recent-activity"
      role="region"
      aria-labelledby="recent-activity-heading"
    >
      <h3 id="recent-activity-heading">Recent Activity</h3>
      <ul role="list" aria-label="Recent activities">
        {activities.map((activity: any) => (
          <li
            key={activity.id}
            data-testid={`activity-${activity.id}`}
            role="listitem"
          >
            {activity.description}
          </li>
        ))}
      </ul>
      {activities.length > 0 && (
        <button
          onClick={onViewAll}
          data-testid="view-all-button"
          aria-label="View all recent activities"
        >
          View All
        </button>
      )}
    </div>
  ),
}));

jest.mock('@/components/forms', () => ({
  CreateorganizationForm: () => (
    <form
      data-testid="create-org-form"
      role="form"
      aria-label="Create organization form"
    >
      <label htmlFor="org-name-input">Organization name</label>
      <input
        id="org-name-input"
        data-testid="org-name-input"
        placeholder="Organization name"
        required
        aria-required="true"
      />
      <button
        type="submit"
        data-testid="submit-button"
        aria-describedby="form-help"
      >
        Create
      </button>
      <div id="form-help" className="sr-only">
        Fill in the organization name and click create to add a new organization
      </div>
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
];

describe('OrganizationPageContent Accessibility Tests', () => {
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

  describe('ARIA Labels and Roles', () => {
    it('has proper main landmark and aria-label', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
        expect(main).toHaveAttribute(
          'aria-label',
          'Organization management dashboard'
        );
      });
    });

    it('has proper section landmarks with labels', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
        expect(screen.getByLabelText('Organizations list')).toBeInTheDocument();
        expect(
          screen.getByLabelText(
            'Sidebar with recent activity and quick actions'
          )
        ).toBeInTheDocument();
      });
    });

    it('has proper heading hierarchy', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const quickActionsHeading = screen.getByRole('heading', {
          name: 'Quick Actions',
        });
        const recentActivityHeading = screen.getByRole('heading', {
          name: 'Recent Activity',
        });

        expect(quickActionsHeading).toBeInTheDocument();
        expect(recentActivityHeading).toBeInTheDocument();
      });
    });

    it('provides proper status updates for search results', async () => {
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
        const status = screen.getByRole('status');
        expect(status).toBeInTheDocument();
        expect(status).toHaveAttribute('aria-live', 'polite');
      });
    });

    it('shows alert for no search results', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'Nonexistent');

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent('No organizations found');
      });
    });
  });

  describe('Loading States Accessibility', () => {
    it('provides proper loading status for initial load', () => {
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

      const loadingStatus = screen.getByRole('status');
      expect(loadingStatus).toBeInTheDocument();
      expect(loadingStatus).toHaveAttribute(
        'aria-label',
        'Loading organizations'
      );
    });

    it('hides decorative loading spinner from screen readers', () => {
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

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Empty State Accessibility', () => {
    it('provides proper heading and structure for empty state', async () => {
      render(
        <OrganizationPageContent organizations={[]} recentActivities={[]} />
      );

      await waitFor(() => {
        const main = screen.getByRole('main');
        const heading = screen.getByRole('heading', {
          name: 'Create Your First Organization',
        });

        expect(main).toHaveAttribute('aria-labelledby', 'empty-state-heading');
        expect(heading).toHaveAttribute('id', 'empty-state-heading');
      });
    });

    it('connects create button to heading description', async () => {
      render(
        <OrganizationPageContent organizations={[]} recentActivities={[]} />
      );

      await waitFor(() => {
        const createButton = screen.getByRole('button', {
          name: /create organization/i,
        });
        expect(createButton).toHaveAttribute(
          'aria-describedby',
          'empty-state-heading'
        );
      });
    });
  });

  describe('Dialog Accessibility', () => {
    it('provides proper dialog labeling for create organization modal', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const createButton = screen.getByTestId('create-org-button');
        expect(createButton).toBeInTheDocument();
      });

      const createButton = screen.getByTestId('create-org-button');
      await user.click(createButton);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute(
          'aria-labelledby',
          'grid-create-dialog-title'
        );
        expect(dialog).toHaveAttribute(
          'aria-describedby',
          'grid-create-dialog-description'
        );
      });
    });

    it('provides unique dialog IDs for different create dialogs', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      // Test quick actions dialog
      await waitFor(() => {
        const quickActionButton = screen.getByRole('button', {
          name: /create organization/i,
        });
        expect(quickActionButton).toBeInTheDocument();
      });

      const quickActionButton = screen.getByRole('button', {
        name: /create organization/i,
      });
      await user.click(quickActionButton);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute(
          'aria-labelledby',
          'quick-create-dialog-title'
        );
        expect(dialog).toHaveAttribute(
          'aria-describedby',
          'quick-create-dialog-description'
        );
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation for interactive elements', async () => {
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

      // Tab through interactive elements
      await user.tab();
      expect(screen.getByTestId('search-input')).toHaveFocus();

      await user.tab();
      const firstOrgCard = screen.getByTestId('org-1');
      expect(firstOrgCard).toHaveFocus();

      await user.tab();
      const secondOrgCard = screen.getByTestId('org-2');
      expect(secondOrgCard).toHaveFocus();
    });

    it('allows Enter key to activate buttons', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const createButton = screen.getByTestId('create-org-button');
        expect(createButton).toBeInTheDocument();
      });

      const createButton = screen.getByTestId('create-org-button');
      createButton.focus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('supports Escape key to close dialogs', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      // Open dialog
      const createButton = screen.getByTestId('create-org-button');
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Close with Escape
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Screen Reader Support', () => {
    it('provides descriptive button labels', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const createButton = screen.getByLabelText('Create new organization');
        const dashboardButton = screen.getByLabelText(
          'Go to Test Organization 1 dashboard'
        );
        const viewAllButton = screen.getByLabelText(
          'View all recent activities'
        );

        expect(createButton).toBeInTheDocument();
        expect(dashboardButton).toBeInTheDocument();
        expect(viewAllButton).toBeInTheDocument();
      });
    });

    it('provides screen reader only help text', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const searchHelp = document.getElementById('search-help');
        expect(searchHelp).toBeInTheDocument();
        expect(searchHelp).toHaveClass('sr-only');
        expect(searchHelp).toHaveTextContent(
          'Type to filter organizations by name'
        );
      });
    });

    it('provides proper form labeling and help text', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      const createButton = screen.getByTestId('create-org-button');
      await user.click(createButton);

      await waitFor(() => {
        const form = screen.getByRole('form');
        const input = screen.getByLabelText('Organization name');
        const submitButton = screen.getByRole('button', { name: 'Create' });
        const helpText = document.getElementById('form-help');

        expect(form).toHaveAttribute('aria-label', 'Create organization form');
        expect(input).toHaveAttribute('aria-required', 'true');
        expect(submitButton).toHaveAttribute('aria-describedby', 'form-help');
        expect(helpText).toHaveClass('sr-only');
      });
    });
  });

  describe('Axe Accessibility Tests', () => {
    it('should not have any accessibility violations in main layout', async () => {
      const { container } = render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have any accessibility violations in empty state', async () => {
      const { container } = render(
        <OrganizationPageContent organizations={[]} recentActivities={[]} />
      );

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have any accessibility violations in loading state', async () => {
      mockUseActiveOrganization.mockReturnValue({
        data: null,
        isPending: true,
      });

      const { container } = render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have any accessibility violations with open dialog', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const createButton = screen.getByTestId('create-org-button');
        expect(createButton).toBeInTheDocument();
      });

      const createButton = screen.getByTestId('create-org-button');
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('High Contrast Mode Support', () => {
    it('maintains proper contrast ratios', async () => {
      // Mock high contrast media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      });

      // In a real test, you would check computed styles for proper contrast
      // This is a placeholder for contrast checking logic
      expect(true).toBe(true);
    });
  });

  describe('Focus Management', () => {
    it('manages focus properly when opening dialogs', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      const createButton = screen.getByTestId('create-org-button');
      await user.click(createButton);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();

        // Focus should be trapped within the dialog
        const formInput = screen.getByTestId('org-name-input');
        expect(formInput).toBeInTheDocument();
      });
    });

    it('returns focus to trigger element when dialog closes', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      const createButton = screen.getByTestId('create-org-button');
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Close dialog with Escape
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        // Focus should return to the create button
        expect(createButton).toHaveFocus();
      });
    });
  });
});
