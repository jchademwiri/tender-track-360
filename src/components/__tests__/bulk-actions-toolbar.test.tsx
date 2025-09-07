import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BulkActionsToolbar } from '../bulk-actions-toolbar';
import { bulkCancelInvitations, bulkRemoveMembers } from '@/server/invitations';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/server/invitations', () => ({
  bulkCancelInvitations: jest.fn(),
  bulkRemoveMembers: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockBulkCancelInvitations = bulkCancelInvitations as jest.MockedFunction<
  typeof bulkCancelInvitations
>;
const mockBulkRemoveMembers = bulkRemoveMembers as jest.MockedFunction<
  typeof bulkRemoveMembers
>;
const mockToast = toast as jest.Mocked<typeof toast>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('BulkActionsToolbar', () => {
  const mockRouter = {
    refresh: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  };

  const defaultProps = {
    selectedMembers: [],
    selectedInvitations: [],
    onClearSelection: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
  });

  it('does not render when nothing is selected', () => {
    render(<BulkActionsToolbar {...defaultProps} />);

    expect(screen.queryByText('selected')).not.toBeInTheDocument();
  });

  it('renders toolbar when members are selected', () => {
    render(
      <BulkActionsToolbar
        {...defaultProps}
        selectedMembers={['member1', 'member2']}
      />
    );

    expect(screen.getByText('2 selected')).toBeInTheDocument();
    expect(screen.getByText('2 members')).toBeInTheDocument();
    expect(screen.getByText('Remove Members')).toBeInTheDocument();
  });

  it('renders toolbar when invitations are selected', () => {
    render(
      <BulkActionsToolbar
        {...defaultProps}
        selectedInvitations={['inv1', 'inv2', 'inv3']}
      />
    );

    expect(screen.getByText('3 selected')).toBeInTheDocument();
    expect(screen.getByText('3 invitations')).toBeInTheDocument();
    expect(screen.getByText('Cancel Invitations')).toBeInTheDocument();
  });

  it('renders toolbar when both members and invitations are selected', () => {
    render(
      <BulkActionsToolbar
        {...defaultProps}
        selectedMembers={['member1']}
        selectedInvitations={['inv1', 'inv2']}
      />
    );

    expect(screen.getByText('3 selected')).toBeInTheDocument();
    expect(screen.getByText('1 member')).toBeInTheDocument();
    expect(screen.getByText('2 invitations')).toBeInTheDocument();
    expect(screen.getByText('Remove Members')).toBeInTheDocument();
    expect(screen.getByText('Cancel Invitations')).toBeInTheDocument();
  });

  it('calls onClearSelection when clear button is clicked', () => {
    const onClearSelection = jest.fn();

    render(
      <BulkActionsToolbar
        {...defaultProps}
        selectedMembers={['member1']}
        onClearSelection={onClearSelection}
      />
    );

    fireEvent.click(screen.getByText('Clear'));
    expect(onClearSelection).toHaveBeenCalled();
  });

  it('opens remove members confirmation dialog', () => {
    render(
      <BulkActionsToolbar
        {...defaultProps}
        selectedMembers={['member1', 'member2']}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Remove Members/ }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to remove 2 members/)
    ).toBeInTheDocument();
  });

  it('opens cancel invitations confirmation dialog', () => {
    render(
      <BulkActionsToolbar
        {...defaultProps}
        selectedInvitations={['inv1', 'inv2']}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel Invitations/ }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to cancel 2 invitations/)
    ).toBeInTheDocument();
  });

  it('successfully removes members', async () => {
    mockBulkRemoveMembers.mockResolvedValue({
      success: true,
      data: { removedCount: 2 },
    });

    render(
      <BulkActionsToolbar
        {...defaultProps}
        selectedMembers={['member1', 'member2']}
      />
    );

    // Open dialog
    fireEvent.click(screen.getByText('Remove Members'));

    // Confirm removal
    const confirmButton = screen.getByRole('button', {
      name: /Remove 2 Members/,
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockBulkRemoveMembers).toHaveBeenCalledWith([
        'member1',
        'member2',
      ]);
    });

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        'Success',
        expect.objectContaining({
          description: expect.stringContaining(
            'selected members have been removed'
          ),
        })
      );
    });

    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it('successfully cancels invitations', async () => {
    mockBulkCancelInvitations.mockResolvedValue({
      success: true,
      data: { cancelledCount: 3 },
    });

    render(
      <BulkActionsToolbar
        {...defaultProps}
        selectedInvitations={['inv1', 'inv2', 'inv3']}
      />
    );

    // Open dialog
    fireEvent.click(screen.getByText('Cancel Invitations'));

    // Confirm cancellation
    const confirmButton = screen.getByRole('button', {
      name: /Cancel 3 Invitations/,
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockBulkCancelInvitations).toHaveBeenCalledWith([
        'inv1',
        'inv2',
        'inv3',
      ]);
    });

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        'Success',
        expect.objectContaining({
          description: expect.stringContaining(
            'selected invitations have been cancelled'
          ),
        })
      );
    });

    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it('handles remove members error', async () => {
    mockBulkRemoveMembers.mockResolvedValue({
      success: false,
      error: {
        code: 'INSUFFICIENT_PERMISSIONS',
        message: 'You do not have permission to remove members',
      },
    });

    render(
      <BulkActionsToolbar {...defaultProps} selectedMembers={['member1']} />
    );

    // Open dialog and confirm
    fireEvent.click(screen.getByText('Remove Members'));
    fireEvent.click(screen.getByRole('button', { name: /Remove Member/ }));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'Bulk Remove Failed',
        expect.objectContaining({
          description: expect.stringContaining('permission'),
        })
      );
    });
  });

  it('handles cancel invitations error', async () => {
    mockBulkCancelInvitations.mockResolvedValue({
      success: false,
      error: {
        code: 'INVITATIONS_NOT_FOUND',
        message: 'No valid invitations found',
      },
    });

    render(
      <BulkActionsToolbar {...defaultProps} selectedInvitations={['inv1']} />
    );

    // Open dialog and confirm
    fireEvent.click(screen.getByText('Cancel Invitations'));
    fireEvent.click(screen.getByRole('button', { name: /Cancel Invitation/ }));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'Bulk Cancel Failed',
        expect.objectContaining({
          description: expect.stringContaining('No valid invitations found'),
        })
      );
    });
  });

  it('meets requirement 5.1 - provides checkboxes for selecting multiple items', () => {
    // This requirement is tested through the parent components (MembersTable and PendingInvitationsSection)
    // The toolbar receives the selected items and displays the count
    render(
      <BulkActionsToolbar
        {...defaultProps}
        selectedMembers={['member1', 'member2']}
        selectedInvitations={['inv1']}
      />
    );

    expect(screen.getByText('3 selected')).toBeInTheDocument();
  });

  it('meets requirement 5.2 - shows bulk actions toolbar when items are selected', () => {
    render(
      <BulkActionsToolbar {...defaultProps} selectedMembers={['member1']} />
    );

    // Toolbar should be visible with actions
    expect(screen.getByText('Remove Members')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('meets requirement 5.3 - supports bulk member removal and invitation cancellation', () => {
    render(
      <BulkActionsToolbar
        {...defaultProps}
        selectedMembers={['member1']}
        selectedInvitations={['inv1']}
      />
    );

    expect(screen.getByText('Remove Members')).toBeInTheDocument();
    expect(screen.getByText('Cancel Invitations')).toBeInTheDocument();
  });

  it('meets requirement 5.4 - shows progress indicators during bulk operations', async () => {
    mockBulkRemoveMembers.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ success: true, data: { removedCount: 1 } }),
            2000 // Longer delay to ensure progress is visible
          )
        )
    );

    render(
      <BulkActionsToolbar {...defaultProps} selectedMembers={['member1']} />
    );

    // Open dialog and start operation
    fireEvent.click(screen.getByText('Remove Members'));
    fireEvent.click(screen.getByRole('button', { name: /Remove Member/ }));

    // Should show progress indicator (look for spinner or progress bar)
    await waitFor(
      () => {
        // Look for the loading spinner or progress elements
        const progressElements = screen.queryAllByRole('progressbar');
        const spinnerElements = document.querySelectorAll('.animate-spin');
        expect(progressElements.length > 0 || spinnerElements.length > 0).toBe(
          true
        );
      },
      { timeout: 3000 }
    );
  });

  it('meets requirement 5.5 - shows summary results after bulk operations complete', async () => {
    mockBulkRemoveMembers.mockResolvedValue({
      success: true,
      data: { removedCount: 2 },
    });

    render(
      <BulkActionsToolbar
        {...defaultProps}
        selectedMembers={['member1', 'member2']}
      />
    );

    // Open dialog and confirm
    fireEvent.click(screen.getByText('Remove Members'));
    fireEvent.click(screen.getByRole('button', { name: /Remove 2 Members/ }));

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        'Success',
        expect.objectContaining({
          description: expect.stringContaining(
            'selected members have been removed'
          ),
        })
      );
    });
  });

  it('meets requirement 7.3 - displays toast notifications', async () => {
    mockBulkRemoveMembers.mockResolvedValue({
      success: true,
      data: { removedCount: 1 },
    });

    render(
      <BulkActionsToolbar {...defaultProps} selectedMembers={['member1']} />
    );

    // Perform operation
    fireEvent.click(screen.getByText('Remove Members'));
    fireEvent.click(screen.getByRole('button', { name: /Remove Member/ }));

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        'Success',
        expect.objectContaining({
          description: expect.stringContaining(
            'selected members have been removed'
          ),
        })
      );
    });
  });
});
