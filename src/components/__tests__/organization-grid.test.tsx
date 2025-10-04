import { render, screen, fireEvent } from '@testing-library/react';
import { OrganizationGrid } from '../organization-grid';
import { Role } from '@/db/schema';
import type { OrganizationWithStats } from '@/server/organizations';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const mockOrganizations: OrganizationWithStats[] = [
  {
    id: '1',
    name: 'Test Organization 1',
    slug: 'test-org-1',
    logo: null,
    createdAt: new Date('2024-01-01'),
    metadata: null,
    memberCount: 5,
    userRole: 'admin',
  },
  {
    id: '2',
    name: 'Test Organization 2',
    slug: 'test-org-2',
    logo: null,
    createdAt: new Date('2024-02-01'),
    metadata: null,
    memberCount: 3,
    userRole: 'member',
  },
  {
    id: '3',
    name: 'Test Organization 3',
    slug: 'test-org-3',
    logo: null,
    createdAt: new Date('2024-03-01'),
    metadata: null,
    memberCount: 8,
    userRole: 'owner',
  },
];

describe('OrganizationGrid', () => {
  it('renders all organizations in a grid layout', () => {
    render(<OrganizationGrid organizations={mockOrganizations} />);

    expect(screen.getByText('Test Organization 1')).toBeInTheDocument();
    expect(screen.getByText('Test Organization 2')).toBeInTheDocument();
    expect(screen.getByText('Test Organization 3')).toBeInTheDocument();
  });

  it('renders create organization card', () => {
    render(<OrganizationGrid organizations={mockOrganizations} />);

    expect(screen.getByText('Create Organization')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('applies correct grid CSS classes for responsive layout', () => {
    const { container } = render(
      <OrganizationGrid organizations={mockOrganizations} />
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid');
    expect(gridElement).toHaveClass('gap-6');
    expect(gridElement).toHaveClass('grid-cols-1'); // Mobile
    expect(gridElement).toHaveClass('sm:grid-cols-2'); // Tablet
    expect(gridElement).toHaveClass(
      'lg:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]'
    ); // Desktop
  });

  it('marks active organization correctly', () => {
    render(
      <OrganizationGrid
        organizations={mockOrganizations}
        activeOrganizationId="2"
      />
    );

    // Check that the active organization has the "Active" badge
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('displays correct member counts and roles', () => {
    render(<OrganizationGrid organizations={mockOrganizations} />);

    expect(screen.getByText('5 members')).toBeInTheDocument();
    expect(screen.getByText('3 members')).toBeInTheDocument();
    expect(screen.getByText('8 members')).toBeInTheDocument();

    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('member')).toBeInTheDocument();
    expect(screen.getByText('owner')).toBeInTheDocument();
  });

  it('calls onCreateOrganization when create card is clicked', () => {
    const mockOnCreate = jest.fn();
    render(
      <OrganizationGrid
        organizations={mockOrganizations}
        onCreateOrganization={mockOnCreate}
      />
    );

    const createButton = screen.getByText('Get Started');
    fireEvent.click(createButton);

    expect(mockOnCreate).toHaveBeenCalledTimes(1);
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <OrganizationGrid
        organizations={mockOrganizations}
        className="custom-class"
      />
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('custom-class');
  });

  it('renders empty organizations state when no organizations', () => {
    render(<OrganizationGrid organizations={[]} />);

    expect(screen.getByText('Welcome to Organizations')).toBeInTheDocument();
    expect(
      screen.getByText('Create Your First Organization')
    ).toBeInTheDocument();
    expect(screen.queryByText('Test Organization 1')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<OrganizationGrid organizations={mockOrganizations} />);

    const gridElement = screen.getByRole('grid');
    expect(gridElement).toHaveAttribute('aria-label', 'Organization grid');

    // Check that each organization card is in a gridcell
    const gridCells = screen.getAllByRole('gridcell');
    expect(gridCells).toHaveLength(4); // 3 organizations + 1 create card
  });

  it('ensures all cards have equal height with h-full class', () => {
    const { container } = render(
      <OrganizationGrid organizations={mockOrganizations} />
    );

    // Check that organization cards have h-full class
    const organizationCards = container.querySelectorAll(
      '[role="gridcell"] > div'
    );
    organizationCards.forEach((card) => {
      expect(card).toHaveClass('h-full');
    });
  });

  it('handles large number of organizations correctly', () => {
    const manyOrganizations: OrganizationWithStats[] = Array.from(
      { length: 10 },
      (_, i) => ({
        id: `org-${i}`,
        name: `Organization ${i + 1}`,
        slug: `org-${i}`,
        logo: null,
        createdAt: new Date('2024-01-01'),
        metadata: null,
        memberCount: i + 1,
        userRole: 'member' as Role,
      })
    );

    render(<OrganizationGrid organizations={manyOrganizations} />);

    // Should render all organizations plus create card
    const gridCells = screen.getAllByRole('gridcell');
    expect(gridCells).toHaveLength(11); // 10 organizations + 1 create card

    // Check that first and last organizations are rendered
    expect(screen.getByText('Organization 1')).toBeInTheDocument();
    expect(screen.getByText('Organization 10')).toBeInTheDocument();
  });

  it('maintains responsive behavior with different screen sizes', () => {
    const { container } = render(
      <OrganizationGrid organizations={mockOrganizations} />
    );

    const gridElement = container.firstChild as HTMLElement;

    // Check that responsive classes are applied
    expect(gridElement).toHaveClass('grid-cols-1'); // Mobile default
    expect(gridElement).toHaveClass('sm:grid-cols-2'); // Tablet
    expect(gridElement).toHaveClass(
      'lg:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]'
    ); // Desktop
    expect(gridElement).toHaveClass(
      'xl:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]'
    ); // Extra large
    expect(gridElement).toHaveClass('xl:max-w-[1400px]'); // Max width constraint
  });
});
