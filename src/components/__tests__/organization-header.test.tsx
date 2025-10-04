import { render, screen, fireEvent } from '@testing-library/react';
import { OrganizationHeader } from '../organization-header';
import { Organization, Role } from '@/db/schema';

// Mock console.log to avoid noise in tests
const mockConsoleLog = jest.fn();
console.log = mockConsoleLog;

const mockOrganization: Organization & { memberCount: number; userRole: Role } =
  {
    id: 'org-1',
    name: 'Test Organization',
    slug: 'test-org',
    logo: 'https://example.com/logo.png',
    createdAt: new Date('2024-01-01'),
    metadata: 'A test organization for testing purposes',
    memberCount: 5,
    userRole: 'admin',
  };

describe('OrganizationHeader', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  it('renders organization name and basic info', () => {
    render(<OrganizationHeader organization={mockOrganization} />);

    expect(screen.getByText('Test Organization')).toBeInTheDocument();
    expect(screen.getByText('5 members')).toBeInTheDocument();
    expect(screen.getByText('Created January 1, 2024')).toBeInTheDocument();
    expect(
      screen.getByText('A test organization for testing purposes')
    ).toBeInTheDocument();
  });

  it('displays user role badge', () => {
    render(<OrganizationHeader organization={mockOrganization} />);

    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('shows edit and settings buttons for admin users', () => {
    render(<OrganizationHeader organization={mockOrganization} />);

    expect(screen.getByLabelText('Edit Test Organization')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Test Organization settings')
    ).toBeInTheDocument();
  });

  it('does not show edit buttons for member users', () => {
    const memberOrg = { ...mockOrganization, userRole: 'member' as Role };
    render(<OrganizationHeader organization={memberOrg} />);

    expect(
      screen.queryByLabelText('Edit Test Organization')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Test Organization settings')
    ).not.toBeInTheDocument();
  });

  it('shows edit buttons for owner users', () => {
    const ownerOrg = { ...mockOrganization, userRole: 'owner' as Role };
    render(<OrganizationHeader organization={ownerOrg} />);

    expect(screen.getByLabelText('Edit Test Organization')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Test Organization settings')
    ).toBeInTheDocument();
  });

  it('handles edit button click', () => {
    render(<OrganizationHeader organization={mockOrganization} />);

    const editButton = screen.getByLabelText('Edit Test Organization');
    fireEvent.click(editButton);

    expect(mockConsoleLog).toHaveBeenCalledWith('Edit organization clicked');
  });

  it('handles settings button click', () => {
    render(<OrganizationHeader organization={mockOrganization} />);

    const settingsButton = screen.getByLabelText('Test Organization settings');
    fireEvent.click(settingsButton);

    expect(mockConsoleLog).toHaveBeenCalledWith(
      'Organization settings clicked'
    );
  });

  it('displays avatar with fallback initials', () => {
    const orgWithoutLogo = { ...mockOrganization, logo: null };
    render(<OrganizationHeader organization={orgWithoutLogo} />);

    expect(screen.getByText('TO')).toBeInTheDocument(); // Test Organization -> TO
  });

  it('shows singular member text for one member', () => {
    const singleMemberOrg = { ...mockOrganization, memberCount: 1 };
    render(<OrganizationHeader organization={singleMemberOrg} />);

    expect(screen.getByText('1 member')).toBeInTheDocument();
  });

  it('shows add description prompt when no metadata and user can edit', () => {
    const orgWithoutMetadata = { ...mockOrganization, metadata: null };
    render(<OrganizationHeader organization={orgWithoutMetadata} />);

    expect(screen.getByText('No description added yet')).toBeInTheDocument();
    expect(screen.getByText('Add description')).toBeInTheDocument();
  });

  it('does not show add description prompt for non-admin users', () => {
    const memberOrgWithoutMetadata = {
      ...mockOrganization,
      metadata: null,
      userRole: 'member' as Role,
    };
    render(<OrganizationHeader organization={memberOrgWithoutMetadata} />);

    expect(
      screen.queryByText('No description added yet')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Add description')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <OrganizationHeader
        organization={mockOrganization}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles organization without userRole', () => {
    const orgWithoutRole = {
      ...mockOrganization,
      userRole: undefined,
    } as Organization & { memberCount: number; userRole?: Role };

    render(<OrganizationHeader organization={orgWithoutRole} />);

    expect(screen.getByText('Test Organization')).toBeInTheDocument();
    expect(screen.queryByText('admin')).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Edit Test Organization')
    ).not.toBeInTheDocument();
  });
});
