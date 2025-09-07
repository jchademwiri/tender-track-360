import { render, screen } from '@testing-library/react';
import {
  OrganizationStats,
  OrganizationStatsLoading,
} from '../organization-stats';

// Mock the server function
jest.mock('@/server/organizations', () => ({
  getOrganizationStats: jest.fn(),
}));

const mockGetOrganizationStats =
  require('@/server/organizations').getOrganizationStats;

describe('OrganizationStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton when stats are null', async () => {
    mockGetOrganizationStats.mockResolvedValue(null);

    const component = await OrganizationStats({
      organizationId: 'test-org-id',
    });
    render(component);

    // Should render 4 skeleton cards
    const skeletonCards = screen.getAllByTestId(/skeleton/i);
    expect(skeletonCards.length).toBeGreaterThan(0);
  });

  it('renders stats cards with correct data', async () => {
    const mockStats = {
      memberCount: 5,
      lastActivity: new Date('2024-01-01'),
      activeProjects: 3,
      recentUpdates: 2,
    };

    mockGetOrganizationStats.mockResolvedValue(mockStats);

    const component = await OrganizationStats({
      organizationId: 'test-org-id',
    });
    render(component);

    // Check if member count is displayed
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Total Members')).toBeInTheDocument();

    // Check if active projects is displayed
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Active Projects')).toBeInTheDocument();

    // Check if recent updates is displayed
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Recent Updates')).toBeInTheDocument();
  });

  it('renders OrganizationStatsLoading component', () => {
    render(<OrganizationStatsLoading />);

    // Should render skeleton elements
    const skeletons = screen.getAllByTestId(/skeleton/i);
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('handles recent activity correctly', async () => {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 2); // 2 days ago

    const mockStats = {
      memberCount: 1,
      lastActivity: recentDate,
    };

    mockGetOrganizationStats.mockResolvedValue(mockStats);

    const component = await OrganizationStats({
      organizationId: 'test-org-id',
    });
    render(component);

    expect(screen.getByText('2 days ago')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('handles old activity correctly', async () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 30); // 30 days ago

    const mockStats = {
      memberCount: 1,
      lastActivity: oldDate,
    };

    mockGetOrganizationStats.mockResolvedValue(mockStats);

    const component = await OrganizationStats({
      organizationId: 'test-org-id',
    });
    render(component);

    expect(screen.getByText('1 month ago')).toBeInTheDocument();
    expect(screen.getByText('Quiet')).toBeInTheDocument();
  });
});
