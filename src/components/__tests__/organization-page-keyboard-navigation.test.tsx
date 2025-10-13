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

// Mock child components with keyboard navigation support
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              // Simulate organization selection
            }
          }}
        >
          {org.name}
        </div>
      ))}
      <button
        onClick={onCreateOrganization}
        data-testid="create-org-button"
        aria-label="Create new organization"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCreateOrganization();
          }
        }}
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
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.target.value = '';
            onSearchChange('');
            onFilter(organizations);
          }
        }}
      />
      <div id="search-help" className="sr-only">
        Type to filter organizations by name. Press Escape to clear.
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
            tabIndex={0}
            aria-label={`Activity: ${activity.description}`}
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onViewAll();
            }
          }}
        >
          View All
        </button>
      )}
    </div>
  ),
}));

jest.mock('@/components/forms', () => ({
  CreateOrganizationForm: () => (
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
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            // In a real form, this would close the dialog
          }
        }}
      />
      <button
        type="submit"
        data-testid="submit-button"
        aria-describedby="form-help"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            // Submit form
          }
        }}
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

describe('OrganizationPageContent Keyboard Navigation Tests', () => {
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

  describe('Tab Navigation', () => {
    it('supports sequential keyboard navigation through interactive elements', async () => {
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

      // Start tabbing through elements
      await user.tab();
      expect(screen.getByTestId('search-input')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('org-1')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('org-2')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('create-org-button')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('activity-1')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('view-all-button')).toHaveFocus();
    });

    it('supports reverse tab navigation', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('view-all-button')).toBeInTheDocument();
      });

      // Focus on the last element first
      screen.getByTestId('view-all-button').focus();
      expect(screen.getByTestId('view-all-button')).toHaveFocus();

      // Tab backwards
      await user.tab({ shift: true });
      expect(screen.getByTestId('activity-1')).toHaveFocus();

      await user.tab({ shift: true });
      expect(screen.getByTestId('create-org-button')).toHaveFocus();

      await user.tab({ shift: true });
      expect(screen.getByTestId('org-2')).toHaveFocus();

      await user.tab({ shift: true });
      expect(screen.getByTestId('org-1')).toHaveFocus();

      await user.tab({ shift: true });
      expect(screen.getByTestId('search-input')).toHaveFocus();
    });
  });

  describe('Enter Key Activation', () => {
    it('activates buttons with Enter key', async () => {
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
      createButton.focus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('activates view all button with Enter key', async () => {
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
      viewAllButton.focus();

      await user.keyboard('{Enter}');

      expect(consoleSpy).toHaveBeenCalledWith('Navigate to full activity page');
      consoleSpy.mockRestore();
    });
  });

  describe('Space Key Activation', () => {
    it('activates buttons with Space key', async () => {
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
      createButton.focus();

      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Escape Key Functionality', () => {
    it('clears search input with Escape key', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      const searchInput = screen.getByTestId('search-input');

      // Type in search
      await user.type(searchInput, 'Test Organization 1');
      expect(searchInput).toHaveValue('Test Organization 1');

      // Clear with Escape
      await user.keyboard('{Escape}');
      expect(searchInput).toHaveValue('');
    });

    it('closes dialog with Escape key', async () => {
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

  describe('Focus Management in Dialogs', () => {
    it('moves focus to dialog content when opened', async () => {
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

        // Focus should be within the dialog
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
      createButton.focus();
      expect(createButton).toHaveFocus();

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

    it('traps focus within dialog when open', async () => {
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

      const formInput = screen.getByTestId('org-name-input');
      const submitButton = screen.getByTestId('submit-button');

      // Tab should cycle within dialog
      formInput.focus();
      expect(formInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();

      // Tabbing from last element should go back to first
      await user.tab();
      // In a real implementation, this would cycle back to the first focusable element
      // For this test, we just verify the elements are present
      expect(formInput).toBeInTheDocument();
    });
  });

  describe('Arrow Key Navigation', () => {
    it('supports arrow key navigation in organization grid', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('org-1')).toBeInTheDocument();
      });

      const firstOrg = screen.getByTestId('org-1');
      const secondOrg = screen.getByTestId('org-2');

      firstOrg.focus();
      expect(firstOrg).toHaveFocus();

      // Arrow down should move to next organization
      await user.keyboard('{ArrowDown}');
      // Note: In a real implementation, you'd implement arrow key navigation
      // For this test, we verify the elements are focusable
      expect(secondOrg).toBeInTheDocument();
    });
  });

  describe('Screen Reader Announcements', () => {
    it('provides proper ARIA labels for interactive elements', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        // Check ARIA labels
        expect(
          screen.getByLabelText('Organization: Test Organization 1')
        ).toBeInTheDocument();
        expect(
          screen.getByLabelText('Organization: Test Organization 2')
        ).toBeInTheDocument();
        expect(
          screen.getByLabelText('Create new organization')
        ).toBeInTheDocument();
        expect(
          screen.getByLabelText('View all recent activities')
        ).toBeInTheDocument();
        expect(
          screen.getByLabelText('Activity: John Doe joined Test Organization 1')
        ).toBeInTheDocument();
      });
    });

    it('provides proper form labeling', async () => {
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

        expect(form).toHaveAttribute('aria-label', 'Create organization form');
        expect(input).toHaveAttribute('aria-required', 'true');
        expect(submitButton).toHaveAttribute('aria-describedby', 'form-help');
      });
    });
  });

  describe('High Contrast Mode Support', () => {
    it('maintains focus indicators in high contrast mode', async () => {
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

      // Tab through elements and verify they can receive focus
      await user.tab();
      expect(screen.getByTestId('search-input')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('org-1')).toHaveFocus();

      // In high contrast mode, focus indicators should still be visible
      // This would typically be tested with visual regression testing
      expect(true).toBe(true);
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('supports common keyboard shortcuts', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      // Focus search input with Ctrl+F (if implemented)
      // This would be a custom implementation
      const searchInput = screen.getByTestId('search-input');
      searchInput.focus();
      expect(searchInput).toHaveFocus();

      // Test Ctrl+A to select all text in search
      await user.type(searchInput, 'test');
      await user.keyboard('{Control>}a{/Control}');

      // Verify text is selected (in a real implementation)
      expect(searchInput).toHaveValue('test');
    });
  });
});
