import { render, screen } from '@testing-library/react';
import { OrganizationGridSkeleton } from '../organization-grid-skeleton';

describe('OrganizationGridSkeleton', () => {
  it('renders default number of skeleton cards', () => {
    const { container } = render(<OrganizationGridSkeleton />);

    // Default count is 6
    const gridCells = container.querySelectorAll('[role="gridcell"]');
    expect(gridCells).toHaveLength(6);
  });

  it('renders custom number of skeleton cards', () => {
    const { container } = render(<OrganizationGridSkeleton count={3} />);

    const gridCells = container.querySelectorAll('[role="gridcell"]');
    expect(gridCells).toHaveLength(3);
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <OrganizationGridSkeleton className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has proper grid structure and accessibility', () => {
    render(<OrganizationGridSkeleton />);

    const grid = screen.getByRole('grid', { name: /loading organizations/i });
    expect(grid).toBeInTheDocument();
  });

  it('has responsive grid classes', () => {
    const { container } = render(<OrganizationGridSkeleton />);

    expect(container.firstChild).toHaveClass(
      'grid',
      'gap-6',
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'xl:grid-cols-4'
    );
  });
});
