import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InviteMemberModal } from '../invite-member-modal';
import { inviteMember } from '@/server/invitations';
import { toast } from 'sonner';

// Mock the server action
jest.mock('@/server/invitations', () => ({
  inviteMember: jest.fn(),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockInviteMember = inviteMember as jest.MockedFunction<
  typeof inviteMember
>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe('InviteMemberModal', () => {
  const defaultProps = {
    organizationId: 'org-123',
    isOpen: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with form elements when open', () => {
    render(<InviteMemberModal {...defaultProps} />);

    expect(screen.getByText('Invite Member')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Send Invite' })
    ).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<InviteMemberModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Invite Member')).not.toBeInTheDocument();
  });

  it('validates email field', async () => {
    render(<InviteMemberModal {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: 'Send Invite' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    // Test invalid email
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid email address')
      ).toBeInTheDocument();
    });
  });

  it('validates role field', async () => {
    render(<InviteMemberModal {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = screen.getByRole('button', { name: 'Send Invite' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Role is required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    mockInviteMember.mockResolvedValue({
      success: true,
      data: { invitationId: 'inv-123' },
    });

    render(<InviteMemberModal {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Select role
    const roleSelect = screen.getByRole('combobox');
    fireEvent.click(roleSelect);
    const memberOption = screen.getByText('Member');
    fireEvent.click(memberOption);

    const submitButton = screen.getByRole('button', { name: 'Send Invite' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockInviteMember).toHaveBeenCalledWith(
        'org-123',
        'test@example.com',
        'member'
      );
    });

    expect(mockToast.success).toHaveBeenCalledWith(
      'Invitation sent successfully!',
      {
        description: 'An invitation has been sent to test@example.com',
      }
    );

    expect(defaultProps.onSuccess).toHaveBeenCalled();
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('handles server errors', async () => {
    mockInviteMember.mockResolvedValue({
      success: false,
      error: {
        code: 'ALREADY_MEMBER',
        message: 'This user is already a member of the organization',
      },
    });

    render(<InviteMemberModal {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Select role
    const roleSelect = screen.getByRole('combobox');
    fireEvent.click(roleSelect);
    const memberOption = screen.getByText('Member');
    fireEvent.click(memberOption);

    const submitButton = screen.getByRole('button', { name: 'Send Invite' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('This user is already a member of the organization')
      ).toBeInTheDocument();
    });

    expect(defaultProps.onSuccess).not.toHaveBeenCalled();
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('shows loading state during submission', async () => {
    mockInviteMember.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<InviteMemberModal {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Select role
    const roleSelect = screen.getByRole('combobox');
    fireEvent.click(roleSelect);
    const memberOption = screen.getByText('Member');
    fireEvent.click(memberOption);

    const submitButton = screen.getByRole('button', { name: 'Send Invite' });
    fireEvent.click(submitButton);

    expect(screen.getByText('Sending...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('resets form when modal closes', () => {
    const { rerender } = render(<InviteMemberModal {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Close modal
    rerender(<InviteMemberModal {...defaultProps} isOpen={false} />);

    // Reopen modal
    rerender(<InviteMemberModal {...defaultProps} isOpen={true} />);

    const newEmailInput = screen.getByLabelText('Email Address');
    expect(newEmailInput).toHaveValue('');
  });

  it('clears validation errors when user fixes input', async () => {
    render(<InviteMemberModal {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: 'Send Invite' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    // Fix email
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await waitFor(() => {
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });
});
