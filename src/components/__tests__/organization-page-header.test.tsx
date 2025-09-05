import { render, screen } from '@testing-library/react';
import { OrganizationPageHeader } from '../organization-page-header';
import { Organization } from '@/db/schema';

const mockOrganization: Organization = {
  id: '1',
  name: 'Active Organization',
  slug: 'active-org',
  logo: null,
  createdAt: new Date('2024-01-01'),
  metadata: null,
};

describe('OrganizationPageHeader', () => {
  it('renders the main title', () => {
    render(<OrganizationPageHeader organizationCount={0} />);

    expect(screen.getByText('Tender Track 360')).toBeInTheDocument();
  });

  it('shows correct subtitle for zero organizations', () => {
    render(<OrganizationPageHeader organizationCount={0} />);

    expect(
      screen.getByText('Create your first organization to get started')
    ).toBeInTheDocument();
  });

  it('shows correct subtitle for one organization', () => {
    render(<OrganizationPageHeader organizationCount={1} />);

    expect(screen.getByText('Manage your organization')).toBeInTheDocument();
  });

  it('shows correct subtitle for multiple organizations', () => {
    render(<OrganizationPageHeader organizationCount={5} />);

    expect(screen.getByText('Choose from 5 organizations')).toBeInTheDocument();
  });

  it('displays active organization indicator when provided', () => {
    render(
      <OrganizationPageHeader
        organizationCount={3}
        activeOrganization={mockOrganization}
      />
    );

    expect(
      screen.getByText('Currently in Active Organization')
    ).toBeInTheDocument();
  });

  it('does not display active organization indicator when not provided', () => {
    render(<OrganizationPageHeader organizationCount={3} />);

    expect(screen.queryByText(/Currently in/)).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <OrganizationPageHeader organizationCount={1} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
