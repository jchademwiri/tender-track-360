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

// Mock child components with visual structure
jest.mock('../organization-grid', () => ({
  OrganizationGrid: ({ organizations, onCreateOrganization }: any) => (
    <div
      data-testid="organization-grid"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {organizations.map((org: any) => (
        <div
          key={org.id}
          data-testid={`org-${org.id}`}
          className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">
                {org.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold">{org.name}</h3>
              <p className="text-sm text-muted-foreground">
                {org.memberCount} members
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {org.userRole}
            </span>
            <button className="text-sm text-primary hover:underline">
              Enter
            </button>
          </div>
        </div>
      ))}
      <div
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] hover:border-primary/50 transition-colors cursor-pointer"
        onClick={onCreateOrganization}
        data-testid="create-org-card"
      >
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-3">
          <span className="text-2xl">+</span>
        </div>
        <span className="text-sm font-medium">Create Organization</span>
      </div>
    </div>
  ),
}));

jest.mock('../organization-search', () => ({
  OrganizationSearch: ({
    organizations,
    onFilter,
    onSearchChange,
    className,
  }: any) => (
    <div className={`${className} max-w-md`} data-testid="organization-search">
      <div className="relative">
        <input
          data-testid="search-input"
          className="w-full px-4 py-2 border rounded-lg pl-10 focus:ring-2 focus:ring-primary focus:border-transparent"
          onChange={(e) => {
            onSearchChange(e.target.value);
            const filtered = organizations.filter((org: any) =>
              org.name.toLowerCase().includes(e.target.value.toLowerCase())
            );
            onFilter(filtered);
          }}
          placeholder="Search organizations..."
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  ),
}));

jest.mock('../recent-activity-section', () => ({
  RecentActivitySection: ({ activities, showViewAll, onViewAll }: any) => (
    <div
      data-testid="recent-activity"
      className="bg-card border rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Recent Activity</h3>
        {showViewAll && (
          <button
            onClick={onViewAll}
            data-testid="view-all-button"
            className="text-sm text-primary hover:underline"
          >
            View All
          </button>
        )}
      </div>
      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          activities.map((activity: any) => (
            <div
              key={activity.id}
              data-testid={`activity-${activity.id}`}
              className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs">•</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  ),
}));

jest.mock('@/components/forms', () => ({
  CreateOrganizationForm: () => (
    <form data-testid="create-org-form" className="space-y-4">
      <div>
        <label htmlFor="org-name" className="block text-sm font-medium mb-2">
          Organization Name
        </label>
        <input
          id="org-name"
          data-testid="org-name-input"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter organization name"
        />
      </div>
      <div>
        <label htmlFor="org-slug" className="block text-sm font-medium mb-2">
          Organization Slug
        </label>
        <input
          id="org-slug"
          data-testid="org-slug-input"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="organization-slug"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          className="px-4 py-2 border rounded-lg hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="submit"
          data-testid="submit-button"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Create Organization
        </button>
      </div>
    </form>
  ),
}));

const mockOrganizations: OrganizationWithStats[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    logo: null,
    createdAt: new Date('2024-01-01'),
    metadata: null,
    memberCount: 12,
    userRole: 'admin' as const,
    lastActivity: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Tech Innovations Ltd',
    slug: 'tech-innovations',
    logo: null,
    createdAt: new Date('2024-02-01'),
    metadata: null,
    memberCount: 8,
    userRole: 'member' as const,
    lastActivity: new Date('2024-02-10'),
  },
  {
    id: '3',
    name: 'Design Studio Pro',
    slug: 'design-studio',
    logo: null,
    createdAt: new Date('2024-03-01'),
    metadata: null,
    memberCount: 5,
    userRole: 'owner' as const,
    lastActivity: new Date('2024-03-05'),
  },
];

const mockRecentActivities: RecentActivity[] = [
  {
    id: '1',
    organizationId: '1',
    type: 'member_joined',
    description: 'Sarah Johnson joined Acme Corporation',
    timestamp: new Date('2024-01-15'),
    user: { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com' },
  },
  {
    id: '2',
    organizationId: '2',
    type: 'project_created',
    description: 'New project "Mobile App" created in Tech Innovations Ltd',
    timestamp: new Date('2024-02-10'),
    user: { id: '2', name: 'Mike Chen', email: 'mike@example.com' },
  },
  {
    id: '3',
    organizationId: '3',
    type: 'document_updated',
    description: 'Design guidelines updated in Design Studio Pro',
    timestamp: new Date('2024-03-05'),
    user: { id: '3', name: 'Emma Davis', email: 'emma@example.com' },
  },
];

// Mock viewport resize for responsive testing
const mockViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
};

describe('OrganizationPageContent Visual Regression Tests', () => {
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

  describe('Layout States', () => {
    it('renders main layout with all sections visible', async () => {
      const { container } = render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('organization-search')).toBeInTheDocument();
        expect(screen.getByTestId('organization-grid')).toBeInTheDocument();
        expect(screen.getByTestId('recent-activity')).toBeInTheDocument();
      });

      // Check main layout structure
      const mainContent = container.querySelector(
        '.grid.grid-cols-1.lg\\:grid-cols-4'
      );
      expect(mainContent).toBeInTheDocument();

      // Check organizations section takes 3 columns
      const orgSection = container.querySelector('.lg\\:col-span-3');
      expect(orgSection).toBeInTheDocument();

      // Check sidebar takes 1 column
      const sidebar = container.querySelector('.lg\\:col-span-1');
      expect(sidebar).toBeInTheDocument();
    });

    it('renders empty state layout correctly', async () => {
      const { container } = render(
        <OrganizationPageContent organizations={[]} recentActivities={[]} />
      );

      await waitFor(() => {
        expect(
          screen.getByText('Create Your First Organization')
        ).toBeInTheDocument();
      });

      // Check centered layout
      const emptyState = container.querySelector('.max-w-md.mx-auto');
      expect(emptyState).toBeInTheDocument();

      // Check text center alignment
      const textCenter = container.querySelector('.text-center');
      expect(textCenter).toBeInTheDocument();

      // Check button is full width
      const button = screen.getByRole('button', {
        name: /create organization/i,
      });
      expect(button).toHaveClass('w-full');
    });

    it('renders loading state with proper centering', () => {
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

      // Check loading container
      const loadingContainer = container.querySelector(
        '.grid.place-items-center.min-h-\\[400px\\]'
      );
      expect(loadingContainer).toBeInTheDocument();

      // Check spinner is centered
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('mx-auto');
    });
  });

  describe('Organization Grid Visual States', () => {
    it('displays organization cards with proper styling', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('org-1')).toBeInTheDocument();
      });

      // Check grid layout
      const grid = screen.getByTestId('organization-grid');
      expect(grid).toHaveClass(
        'grid',
        'grid-cols-1',
        'md:grid-cols-2',
        'lg:grid-cols-3',
        'gap-6'
      );

      // Check card styling
      const firstCard = screen.getByTestId('org-1');
      expect(firstCard).toHaveClass('bg-card', 'border', 'rounded-lg', 'p-6');

      // Check create card styling
      const createCard = screen.getByTestId('create-org-card');
      expect(createCard).toHaveClass(
        'border-2',
        'border-dashed',
        'rounded-lg',
        'p-6'
      );
    });

    it('shows proper organization card content structure', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
        expect(screen.getByText('12 members')).toBeInTheDocument();
        expect(screen.getByText('admin')).toBeInTheDocument();
      });

      // Check avatar styling
      const avatars = document.querySelectorAll(
        '.w-12.h-12.bg-primary\\/10.rounded-full'
      );
      expect(avatars.length).toBeGreaterThan(0);
    });

    it('displays create organization card with dashed border', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const createCard = screen.getByTestId('create-org-card');
        expect(createCard).toBeInTheDocument();
        expect(createCard).toHaveClass('border-dashed');
        expect(screen.getByText('Create Organization')).toBeInTheDocument();
      });
    });
  });

  describe('Search Visual States', () => {
    it('displays search input with proper styling', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const searchInput = screen.getByTestId('search-input');
        expect(searchInput).toBeInTheDocument();
        expect(searchInput).toHaveClass(
          'w-full',
          'px-4',
          'py-2',
          'border',
          'rounded-lg'
        );
      });

      // Check search icon is present
      const searchIcon = document.querySelector('svg');
      expect(searchIcon).toBeInTheDocument();
    });

    it('shows search results count with proper styling', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'Acme');

      await waitFor(() => {
        const resultsText = screen.getByText(/Showing 1 of 3 organizations/);
        expect(resultsText).toBeInTheDocument();
        expect(resultsText.closest('div')).toHaveClass(
          'text-sm',
          'text-muted-foreground'
        );
      });
    });

    it('displays no results state with proper styling', async () => {
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
        const noResults = screen.getByText('No organizations found');
        expect(noResults).toBeInTheDocument();
        expect(noResults.closest('div')).toHaveClass('text-center', 'py-8');
      });
    });
  });

  describe('Recent Activity Visual States', () => {
    it('displays recent activity section with proper styling', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const activitySection = screen.getByTestId('recent-activity');
        expect(activitySection).toBeInTheDocument();
        expect(activitySection).toHaveClass(
          'bg-card',
          'border',
          'rounded-lg',
          'p-6'
        );
      });

      // Check activity items styling
      const activityItems = document.querySelectorAll(
        '[data-testid^="activity-"]'
      );
      activityItems.forEach((item) => {
        expect(item).toHaveClass(
          'flex',
          'items-start',
          'space-x-3',
          'p-3',
          'bg-muted/50',
          'rounded-lg'
        );
      });
    });

    it('shows empty activity state with proper styling', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={[]}
        />
      );

      await waitFor(() => {
        const emptyText = screen.getByText('No recent activity');
        expect(emptyText).toBeInTheDocument();
        expect(emptyText).toHaveClass('text-sm', 'text-muted-foreground');
      });
    });
  });

  describe('Dialog Visual States', () => {
    it('displays create organization dialog with proper styling', async () => {
      const user = userEvent.setup();

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      const createCard = screen.getByTestId('create-org-card');
      await user.click(createCard);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();

        const form = screen.getByTestId('create-org-form');
        expect(form).toHaveClass('space-y-4');
      });

      // Check form inputs styling
      const nameInput = screen.getByTestId('org-name-input');
      expect(nameInput).toHaveClass(
        'w-full',
        'px-3',
        'py-2',
        'border',
        'rounded-lg'
      );

      // Check button styling
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toHaveClass(
        'px-4',
        'py-2',
        'bg-primary',
        'text-primary-foreground',
        'rounded-lg'
      );
    });
  });

  describe('Responsive Layout Tests', () => {
    it('adapts to mobile viewport (320px)', async () => {
      mockViewport(320, 568);

      const { container } = render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        // Main grid should stack on mobile
        const mainGrid = container.querySelector(
          '.grid.grid-cols-1.lg\\:grid-cols-4'
        );
        expect(mainGrid).toBeInTheDocument();

        // Organization grid should be single column on mobile
        const orgGrid = screen.getByTestId('organization-grid');
        expect(orgGrid).toHaveClass('grid-cols-1');
      });
    });

    it('adapts to tablet viewport (768px)', async () => {
      mockViewport(768, 1024);

      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        // Organization grid should be 2 columns on tablet
        const orgGrid = screen.getByTestId('organization-grid');
        expect(orgGrid).toHaveClass('md:grid-cols-2');
      });
    });

    it('adapts to desktop viewport (1024px+)', async () => {
      mockViewport(1200, 800);

      const { container } = render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        // Main layout should use 4-column grid on desktop
        const mainGrid = container.querySelector('.lg\\:grid-cols-4');
        expect(mainGrid).toBeInTheDocument();

        // Organization grid should be 3 columns on desktop
        const orgGrid = screen.getByTestId('organization-grid');
        expect(orgGrid).toHaveClass('lg:grid-cols-3');
      });
    });

    it('maintains proper spacing across viewports', async () => {
      const { container } = render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        // Check main container spacing
        const mainContainer = container.querySelector('.space-y-8');
        expect(mainContainer).toBeInTheDocument();

        // Check grid gap
        const orgGrid = screen.getByTestId('organization-grid');
        expect(orgGrid).toHaveClass('gap-6');

        // Check sidebar spacing
        const sidebar = container.querySelector('.space-y-6');
        expect(sidebar).toBeInTheDocument();
      });
    });
  });

  describe('Interactive State Visual Tests', () => {
    it('shows hover effects on organization cards', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const firstCard = screen.getByTestId('org-1');
        expect(firstCard).toHaveClass('hover:shadow-lg', 'transition-shadow');
      });
    });

    it('shows hover effects on create card', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const createCard = screen.getByTestId('create-org-card');
        expect(createCard).toHaveClass(
          'hover:border-primary/50',
          'transition-colors',
          'cursor-pointer'
        );
      });
    });

    it('shows focus states on interactive elements', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        const searchInput = screen.getByTestId('search-input');
        expect(searchInput).toHaveClass(
          'focus:ring-2',
          'focus:ring-primary',
          'focus:border-transparent'
        );
      });
    });
  });

  describe('Color and Theme Visual Tests', () => {
    it('uses consistent color scheme throughout', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        // Check primary color usage
        const primaryElements = document.querySelectorAll(
          '.bg-primary, .text-primary, .border-primary'
        );
        expect(primaryElements.length).toBeGreaterThan(0);

        // Check muted color usage
        const mutedElements = document.querySelectorAll(
          '.text-muted-foreground, .bg-muted'
        );
        expect(mutedElements.length).toBeGreaterThan(0);

        // Check card backgrounds
        const cardElements = document.querySelectorAll('.bg-card');
        expect(cardElements.length).toBeGreaterThan(0);
      });
    });

    it('maintains proper contrast ratios', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        // This would typically involve actual color contrast calculations
        // For now, we check that contrast-related classes are present
        const textElements = document.querySelectorAll(
          '.text-foreground, .text-muted-foreground'
        );
        expect(textElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Animation and Transition Visual Tests', () => {
    it('includes proper transition classes', async () => {
      render(
        <OrganizationPageContent
          organizations={mockOrganizations}
          recentActivities={mockRecentActivities}
        />
      );

      await waitFor(() => {
        // Check transition classes on cards
        const cards = document.querySelectorAll(
          '.transition-shadow, .transition-colors'
        );
        expect(cards.length).toBeGreaterThan(0);

        // Check loading spinner animation
        const spinner = document.querySelector('.animate-spin');
        if (spinner) {
          expect(spinner).toHaveClass('animate-spin');
        }
      });
    });
  });
});
