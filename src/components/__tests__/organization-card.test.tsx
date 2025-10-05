import { render, screen } from '@testing-library/react';
import { OrganizationCard } from '../organization-card';
import { Organization } from '@/db/schema';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const mockOrganization: Organization = {
  id: '1',
  name: 'Test Organization',
  slug: 'test-org',
  logo: null,
  createdAt: new Date('2024-01-01'),
  metadata: null,
};

describe('OrganizationCard', () => {
  it('renders organization name and basic info', () => {
    render(<OrganizationCard organization={mockOrganization} />);

    expect(screen.getByText('Test Organization')).toBeInTheDocument();
    expect(screen.getByText('member')).toBeInTheDocument();
    expect(screen.getByText('0 members')).toBeInTheDocument();
    expect(screen.getByText('Created Jan 2024')).toBeInTheDocument();
  });

  it('displays member count correctly', () => {
    render(
      <OrganizationCard organization={mockOrganization} memberCount={5} />
    );

    expect(screen.getByText('5 members')).toBeInTheDocument();
  });

  it('displays singular member text for count of 1', () => {
    render(
      <OrganizationCard organization={mockOrganization} memberCount={1} />
    );

    expect(screen.getByText('1 member')).toBeInTheDocument();
  });

  it('shows active badge when organization is active', () => {
    render(
      <OrganizationCard organization={mockOrganization} isActive={true} />
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('displays user role correctly', () => {
    render(
      <OrganizationCard organization={mockOrganization} userRole="admin" />
    );

    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('shows settings button for admin and owner roles', () => {
    const { rerender } = render(
      <OrganizationCard organization={mockOrganization} userRole="admin" />
    );

    // Check for settings link by href attribute
    const settingsLink = document.querySelector(
      'a[href="/organization/test-org/settings"]'
    );
    expect(settingsLink).toBeInTheDocument();

    rerender(
      <OrganizationCard organization={mockOrganization} userRole="owner" />
    );
    const settingsLinkOwner = document.querySelector(
      'a[href="/organization/test-org/settings"]'
    );
    expect(settingsLinkOwner).toBeInTheDocument();
  });

  it('hides settings button for member role', () => {
    render(
      <OrganizationCard organization={mockOrganization} userRole="member" />
    );

    // Check that settings link is not present
    const settingsLink = document.querySelector(
      'a[href="/organization/test-org/settings"]'
    );
    expect(settingsLink).not.toBeInTheDocument();
  });

  it('generates correct initials for organization name', () => {
    const orgWithLongName: Organization = {
      ...mockOrganization,
      name: 'My Test Organisation',
    };

    render(<OrganizationCard organization={orgWithLongName} />);

    // Check that avatar fallback contains initials (MT for "My Test")
    expect(screen.getByText('MT')).toBeInTheDocument();
  });

  it('renders enter link with correct href', () => {
    render(<OrganizationCard organization={mockOrganization} />);

    const enterLink = screen.getByRole('link', { name: /enter/i });
    expect(enterLink).toHaveAttribute(
      'href',
      '/organization/test-org/dashboard'
    );
  });

  it('has proper hover effect classes', () => {
    const { container } = render(
      <OrganizationCard organization={mockOrganization} />
    );

    const card = container.firstChild;
    expect(card).toHaveClass(
      'group',
      'relative',
      'overflow-hidden',
      'transition-all',
      'duration-300',
      'ease-out',
      'hover:shadow-xl',
      'hover:shadow-primary/10',
      'hover:scale-[1.03]',
      'hover:-translate-y-1',
      'cursor-pointer'
    );
  });

  it('applies active state styling correctly', () => {
    const { container } = render(
      <OrganizationCard organization={mockOrganization} isActive={true} />
    );

    const card = container.firstChild;
    expect(card).toHaveClass(
      'ring-2',
      'ring-primary',
      'ring-offset-2',
      'shadow-lg'
    );
  });

  it('has proper animation classes on interactive elements', () => {
    const { container } = render(
      <OrganizationCard organization={mockOrganization} userRole="admin" />
    );

    // Check avatar has transition classes
    const avatar = container.querySelector('.size-12');
    expect(avatar).toHaveClass(
      'transition-transform',
      'duration-300',
      'group-hover:scale-110'
    );

    // Check buttons have proper transition classes
    const enterButton = container.querySelector(
      'a[href*="dashboard"]'
    )?.parentElement;
    expect(enterButton).toHaveClass(
      'transition-all',
      'duration-200',
      'hover:scale-105'
    );
  });
});
