/**
 * Integration test for OrganizationHeader component in dashboard context
 * This test verifies that the OrganizationHeader component integrates correctly
 * with the organization dashboard page.
 */

import { render, screen } from '@testing-library/react';
import { OrganizationHeader } from '../organization-header';

// Mock organization data that matches the expected structure from getOrganizationBySlugWithUserRole
const mockOrganizationData = {
  id: 'org-123',
  name: 'Test Organization',
  slug: 'test-org',
  logo: null,
  createdAt: new Date('2024-01-01'),
  metadata: 'A test organization for integration testing',
  userRole: 'admin' as const,
  memberCount: 10,
  members: [
    {
      id: 'member-1',
      organizationId: 'org-123',
      userId: 'user-1',
      role: 'admin' as const,
      createdAt: new Date(),
      user: {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ],
};

describe('OrganizationHeader Dashboard Integration', () => {
  it('renders correctly with organization data from dashboard', () => {
    render(<OrganizationHeader organization={mockOrganizationData} />);

    // Verify organization name is displayed
    expect(screen.getByText('Test Organization')).toBeInTheDocument();

    // Verify member count is displayed
    expect(screen.getByText('10 members')).toBeInTheDocument();

    // Verify creation date is displayed
    expect(screen.getByText('Created January 1, 2024')).toBeInTheDocument();

    // Verify user role badge is displayed
    expect(screen.getByText('admin')).toBeInTheDocument();

    // Verify description is displayed
    expect(
      screen.getByText('A test organization for integration testing')
    ).toBeInTheDocument();

    // Verify admin controls are available
    expect(screen.getByLabelText('Edit Test Organization')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Test Organization settings')
    ).toBeInTheDocument();
  });

  it('handles organization without metadata correctly', () => {
    const orgWithoutMetadata = {
      ...mockOrganizationData,
      metadata: null,
    };

    render(<OrganizationHeader organization={orgWithoutMetadata} />);

    // Should show add description prompt for admin users
    expect(screen.getByText('No description added yet')).toBeInTheDocument();
    expect(screen.getByText('Add description')).toBeInTheDocument();
  });

  it('handles member role correctly', () => {
    const memberOrg = {
      ...mockOrganizationData,
      userRole: 'member' as const,
    };

    render(<OrganizationHeader organization={memberOrg} />);

    // Should show member badge
    expect(screen.getByText('member')).toBeInTheDocument();

    // Should not show admin controls
    expect(
      screen.queryByLabelText('Edit Test Organization')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Test Organization settings')
    ).not.toBeInTheDocument();
  });

  it('handles owner role correctly', () => {
    const ownerOrg = {
      ...mockOrganizationData,
      userRole: 'owner' as const,
    };

    render(<OrganizationHeader organization={ownerOrg} />);

    // Should show owner badge with default variant
    expect(screen.getByText('owner')).toBeInTheDocument();

    // Should show admin controls for owner
    expect(screen.getByLabelText('Edit Test Organization')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Test Organization settings')
    ).toBeInTheDocument();
  });

  it('displays avatar fallback correctly', () => {
    render(<OrganizationHeader organization={mockOrganizationData} />);

    // Should show initials as fallback (Test Organization -> TO)
    expect(screen.getByText('TO')).toBeInTheDocument();
  });

  it('handles single member count correctly', () => {
    const singleMemberOrg = {
      ...mockOrganizationData,
      memberCount: 1,
    };

    render(<OrganizationHeader organization={singleMemberOrg} />);

    // Should show singular form
    expect(screen.getByText('1 member')).toBeInTheDocument();
  });
});
