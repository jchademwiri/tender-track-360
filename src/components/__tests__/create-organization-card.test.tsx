import { render, screen, fireEvent } from '@testing-library/react';
import { CreateOrganizationCard } from '../create-organization-card';
import { it } from 'zod/v4/locales';
import { it } from 'zod/v4/locales';
import { it } from 'zod/v4/locales';
import { it } from 'zod/v4/locales';
import { it } from 'zod/v4/locales';
import { it } from 'zod/v4/locales';
import { describe } from 'node:test';

describe('CreateOrganizationCard', () => {
  it('renders the create organization content', () => {
    render(<CreateOrganizationCard />);

    expect(screen.getByText('Create Organization')).toBeInTheDocument();
    expect(
      screen.getByText('Start a new organization to collaborate with your team')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /get started/i })
    ).toBeInTheDocument();
  });

  it('calls onClick handler when button is clicked', () => {
    const mockOnClick = jest.fn();
    render(<CreateOrganizationCard onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /get started/i });
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not throw error when clicked without onClick handler', () => {
    render(<CreateOrganizationCard />);

    const button = screen.getByRole('button', { name: /get started/i });

    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <CreateOrganizationCard className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has proper dashed border styling', () => {
    const { container } = render(<CreateOrganizationCard />);

    expect(container.firstChild).toHaveClass('border-dashed');
  });

  it('displays plus icon', () => {
    render(<CreateOrganizationCard />);

    // Check for plus icons by looking for SVG elements with the lucide-plus class
    const plusIcons = document.querySelectorAll('.lucide-plus');

    expect(plusIcons.length).toBeGreaterThan(0);
  });
});
