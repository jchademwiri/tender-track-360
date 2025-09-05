/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import { OrganizationGrid } from '../organization-grid';
import { Organization, Role } from '@/db/schema';
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
];

// Mock window.matchMedia for responsive testing
const mockMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(), // deprecated
  removeListener: jest.fn(), // deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

describe('OrganizationGrid Responsive Behavior', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(mockMatchMedia),
    });
  });

  it('applies correct responsive grid classes', () => {
    const { container } = render(
      <OrganizationGrid organizations={mockOrganizations} />
    );

    const gridElement = container.firstChild as HTMLElement;

    // Test that all responsive classes are applied
    expect(gridElement).toHaveClass('grid');
    expect(gridElement).toHaveClass('gap-6');

    // Mobile (default)
    expect(gridElement).toHaveClass('grid-cols-1');

    // Tablet
    expect(gridElement).toHaveClass('sm:grid-cols-2');

    // Desktop
    expect(gridElement).toHaveClass(
      'lg:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]'
    );

    // Extra large
    expect(gridElement).toHaveClass(
      'xl:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]'
    );
    expect(gridElement).toHaveClass('xl:max-w-[1400px]');

    // Layout utilities
    expect(gridElement).toHaveClass('w-full');
    expect(gridElement).toHaveClass('mx-auto');
  });

  it('maintains proper spacing and gap management', () => {
    const { container } = render(
      <OrganizationGrid organizations={mockOrganizations} />
    );

    const gridElement = container.firstChild as HTMLElement;

    // Check gap class is applied
    expect(gridElement).toHaveClass('gap-6');
  });

  it('ensures grid adapts to different screen sizes with CSS Grid', () => {
    const { container } = render(
      <OrganizationGrid organizations={mockOrganizations} />
    );

    const gridElement = container.firstChild as HTMLElement;

    // Verify CSS Grid is used
    expect(gridElement).toHaveClass('grid');

    // Verify auto-fit behavior for desktop
    expect(gridElement).toHaveClass(
      'lg:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]'
    );

    // This ensures cards will automatically wrap to new rows when screen width
    // cannot accommodate more cards at the minimum 320px width
  });

  it('maintains consistent card heights with h-full class', () => {
    const { container } = render(
      <OrganizationGrid organizations={mockOrganizations} />
    );

    // Check that all cards (organization cards + create card) have h-full
    const gridCells = container.querySelectorAll('[role="gridcell"] > div');
    gridCells.forEach((card) => {
      expect(card).toHaveClass('h-full');
    });
  });

  it('handles maximum width constraint on extra large screens', () => {
    const { container } = render(
      <OrganizationGrid organizations={mockOrganizations} />
    );

    const gridElement = container.firstChild as HTMLElement;

    // Check max width constraint
    expect(gridElement).toHaveClass('xl:max-w-[1400px]');

    // Check centering
    expect(gridElement).toHaveClass('mx-auto');
  });

  it('works correctly with many organizations', () => {
    const manyOrganizations: OrganizationWithStats[] = Array.from(
      { length: 12 },
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

    const { container } = render(
      <OrganizationGrid organizations={manyOrganizations} />
    );

    const gridElement = container.firstChild as HTMLElement;
    const gridCells = container.querySelectorAll('[role="gridcell"]');

    // Should have 12 organizations + 1 create card = 13 total
    expect(gridCells).toHaveLength(13);

    // Grid should still have proper responsive classes
    expect(gridElement).toHaveClass('grid');
    expect(gridElement).toHaveClass(
      'lg:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]'
    );
  });
});
