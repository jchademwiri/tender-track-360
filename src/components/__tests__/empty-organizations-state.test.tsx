import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyOrganizationsState } from '../empty-organizations-state';

describe('EmptyOrganizationsState', () => {
  it('renders the empty state with correct content', () => {
    render(<EmptyOrganizationsState />);

    // Check main heading
    expect(screen.getByText('Welcome to Organizations')).toBeInTheDocument();

    // Check description
    expect(
      screen.getByText(/Organizations help you collaborate with your team/)
    ).toBeInTheDocument();

    // Check benefits
    expect(screen.getByText('Team collaboration')).toBeInTheDocument();
    expect(screen.getByText('Project management')).toBeInTheDocument();

    // Check call-to-action button
    expect(
      screen.getByRole('button', { name: /create your first organization/i })
    ).toBeInTheDocument();

    // Check secondary text
    expect(
      screen.getByText('It only takes a few seconds to set up')
    ).toBeInTheDocument();
  });

  it('calls onCreateOrganization when button is clicked', () => {
    const mockOnCreate = jest.fn();
    render(<EmptyOrganizationsState onCreateOrganization={mockOnCreate} />);

    const createButton = screen.getByRole('button', {
      name: /create your first organization/i,
    });
    fireEvent.click(createButton);

    expect(mockOnCreate).toHaveBeenCalledTimes(1);
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <EmptyOrganizationsState className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has proper visual elements', () => {
    const { container } = render(<EmptyOrganizationsState />);

    // Check for icons by their SVG elements and classes
    const buildingIcons = container.querySelectorAll('.lucide-building-2');
    expect(buildingIcons.length).toBeGreaterThan(0);

    const sparklesIcon = container.querySelector('.lucide-sparkles');
    expect(sparklesIcon).toBeInTheDocument();

    const usersIcon = container.querySelector('.lucide-users');
    expect(usersIcon).toBeInTheDocument();

    const plusIcon = container.querySelector('.lucide-plus');
    expect(plusIcon).toBeInTheDocument();
  });

  it('has proper card structure', () => {
    const { container } = render(<EmptyOrganizationsState />);

    // Should have dashed border card
    const card = container.querySelector('.border-dashed');
    expect(card).toBeInTheDocument();
  });

  it('handles missing onCreateOrganization prop gracefully', () => {
    render(<EmptyOrganizationsState />);

    const createButton = screen.getByRole('button', {
      name: /create your first organization/i,
    });

    // Should not throw error when clicked without handler
    expect(() => fireEvent.click(createButton)).not.toThrow();
  });
});
