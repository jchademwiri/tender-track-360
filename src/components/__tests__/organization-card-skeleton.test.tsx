import { render, screen } from '@testing-library/react';
import { OrganizationCardSkeleton } from '../organization-card-skeleton';

describe('OrganizationCardSkeleton', () => {
  it('renders skeleton elements correctly', () => {
    const { container } = render(<OrganizationCardSkeleton />);

    // Check that skeleton elements are present
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <OrganizationCardSkeleton className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has proper card structure', () => {
    const { container } = render(<OrganizationCardSkeleton />);

    // Check for card structure
    expect(
      container.querySelector('[role="presentation"]')
    ).toBeInTheDocument();
  });

  it('includes animate-pulse class for loading animation', () => {
    const { container } = render(<OrganizationCardSkeleton />);

    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});
