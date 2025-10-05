'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  ConfirmationDialog,
  CancelInvitationConfirmationDialog,
} from '@/components/ui/confirmation-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Mail,
  Send,
  RefreshCw,
  X,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Crown,
  UserCheck,
  UserCog,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Role } from '@/db/schema';

interface InvitationsTabProps {
  organization: {
    id: string;
    name: string;
  };
  userRole: Role;
  currentUser: {
    id: string;
    name: string;
    email: string;
  };
}

// Mock invitation data - in real implementation, this would come from server
interface PendingInvitation {
  id: string;
  email: string;
  role: Role;
  status: 'pending' | 'expired' | 'accepted' | 'declined';
  invitedAt: Date;
  expiresAt: Date;
  inviterName: string;
}

// Form schema for new invitation
const invitationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['owner', 'admin', 'manager', 'member'] as const, {
    required_error: 'Please select a role',
  }),
});

type InvitationFormData = z.infer<typeof invitationSchema>;

// Helper function to get role display info
function getRoleDisplay(role: Role) {
  switch (role) {
    case 'owner':
      return {
        color:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        icon: Crown,
        label: 'Owner',
      };
    case 'admin':
      return {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        icon: UserCheck,
        label: 'Admin',
      };
    case 'manager':
      return {
        color:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: UserCog,
        label: 'Manager',
      };
    case 'member':
      return {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        icon: User,
        label: 'Member',
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        icon: User,
        label: 'Member',
      };
  }
}

// Helper function to get status display info
function getStatusDisplay(status: string) {
  switch (status) {
    case 'pending':
      return {
        color:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        icon: Clock,
        label: 'Pending',
      };
    case 'accepted':
      return {
        color:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: CheckCircle,
        label: 'Accepted',
      };
    case 'declined':
      return {
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        icon: XCircle,
        label: 'Declined',
      };
    case 'expired':
      return {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        icon: XCircle,
        label: 'Expired',
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        icon: Clock,
        label: 'Unknown',
      };
  }
}

// Helper function to check if user can manage invitations
function canManageInvitations(role: Role): boolean {
  return ['owner', 'admin', 'manager'].includes(role);
}

export function InvitationsTab({
  organization,
  userRole,
  currentUser,
}: InvitationsTabProps) {
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [selectedInvitations, setSelectedInvitations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [invitationToCancel, setInvitationToCancel] =
    useState<PendingInvitation | null>(null);
  const [showBulkCancelDialog, setShowBulkCancelDialog] = useState(false);

  const canManage = canManageInvitations(userRole);

  const form = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      email: '',
      role: 'member',
    },
  });

  // Mock data - in real implementation, fetch from server
  useEffect(() => {
    const mockInvitations: PendingInvitation[] = [
      {
        id: '1',
        email: 'john@example.com',
        role: 'admin',
        status: 'pending',
        invitedAt: new Date('2024-12-15'),
        expiresAt: new Date('2024-12-22'),
        inviterName: currentUser.name,
      },
      {
        id: '2',
        email: 'sarah@example.com',
        role: 'member',
        status: 'pending',
        invitedAt: new Date('2024-12-10'),
        expiresAt: new Date('2024-12-17'),
        inviterName: currentUser.name,
      },
      {
        id: '3',
        email: 'mike@example.com',
        role: 'manager',
        status: 'expired',
        invitedAt: new Date('2024-12-01'),
        expiresAt: new Date('2024-12-08'),
        inviterName: 'Jane Smith',
      },
    ];

    setTimeout(() => {
      setInvitations(mockInvitations);
      setIsLoading(false);
    }, 500);
  }, [currentUser.name]);

  const onSubmit = async (data: InvitationFormData) => {
    if (!canManage) {
      toast.error('You do not have permission to send invitations');
      return;
    }

    setIsSending(true);
    try {
      // TODO: Implement inviteMember server action
      console.log('Sending invitation:', {
        organizationId: organization.id,
        email: data.email,
        role: data.role,
      });

      // Mock successful invitation
      const newInvitation: PendingInvitation = {
        id: Date.now().toString(),
        email: data.email,
        role: data.role,
        status: 'pending',
        invitedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        inviterName: currentUser.name,
      };

      setInvitations((prev) => [newInvitation, ...prev]);
      form.reset();
      toast.success('Invitation sent successfully', {
        description: `An invitation has been sent to ${data.email}`,
      });
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      // TODO: Implement resendInvitation server action
      console.log('Resending invitation:', invitationId);

      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id === invitationId
            ? {
                ...inv,
                invitedAt: new Date(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              }
            : inv
        )
      );

      toast.success('Invitation resent successfully');
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast.error('Failed to resend invitation');
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      // TODO: Implement cancelInvitation server action
      console.log('Cancelling invitation:', invitationId);

      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      toast.success('Invitation cancelled successfully');
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast.error('Failed to cancel invitation');
    }
  };

  const handleBulkCancel = async () => {
    if (selectedInvitations.length === 0) return;

    try {
      // TODO: Implement bulkCancelInvitations server action
      console.log('Bulk cancelling invitations:', selectedInvitations);

      setInvitations((prev) =>
        prev.filter((inv) => !selectedInvitations.includes(inv.id))
      );
      setSelectedInvitations([]);
      toast.success(
        `${selectedInvitations.length} invitations cancelled successfully`
      );
    } catch (error) {
      console.error('Error bulk cancelling invitations:', error);
      toast.error('Failed to cancel invitations');
    }
  };

  const toggleInvitationSelection = (invitationId: string) => {
    setSelectedInvitations((prev) =>
      prev.includes(invitationId)
        ? prev.filter((id) => id !== invitationId)
        : [...prev, invitationId]
    );
  };

  const selectAllInvitations = () => {
    const selectableInvitations = invitations.filter(
      (inv) => inv.status === 'pending'
    );
    setSelectedInvitations(selectableInvitations.map((inv) => inv.id));
  };

  const clearSelection = () => {
    setSelectedInvitations([]);
  };

  return (
    <div className="space-y-6">
      {/* Send New Invitation */}
      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Invitation
            </CardTitle>
            <CardDescription>
              Invite new members to join your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The email address of the person you want to invite.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="owner">
                              <div className="flex items-center gap-2">
                                <Crown className="h-4 w-4" />
                                Owner
                              </div>
                            </SelectItem>
                            <SelectItem value="admin">
                              <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4" />
                                Admin
                              </div>
                            </SelectItem>
                            <SelectItem value="manager">
                              <div className="flex items-center gap-2">
                                <UserCog className="h-4 w-4" />
                                Manager
                              </div>
                            </SelectItem>
                            <SelectItem value="member">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Member
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The role the invited person will have in the
                          organization.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isSending}>
                  {isSending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Pending Invitations
              </CardTitle>
              <CardDescription>
                Manage sent invitations and their status
              </CardDescription>
            </div>
            {canManage && selectedInvitations.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedInvitations.length} selected
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowBulkCancelDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancel Selected
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                  </div>
                  <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Invitations</h3>
              <p className="text-muted-foreground">
                {canManage
                  ? 'Send your first invitation to add members to your organization.'
                  : 'No pending invitations at this time.'}
              </p>
            </div>
          ) : (
            <>
              {canManage && (
                <div className="flex items-center gap-2 mb-4">
                  <Checkbox
                    checked={
                      selectedInvitations.length ===
                      invitations.filter((inv) => inv.status === 'pending')
                        .length
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        selectAllInvitations();
                      } else {
                        clearSelection();
                      }
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    Select all pending invitations
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {invitations.map((invitation) => {
                  const roleDisplay = getRoleDisplay(invitation.role);
                  const statusDisplay = getStatusDisplay(invitation.status);
                  const RoleIcon = roleDisplay.icon;
                  const StatusIcon = statusDisplay.icon;
                  const isExpired = invitation.expiresAt < new Date();
                  const canResend =
                    invitation.status === 'pending' || isExpired;

                  return (
                    <div
                      key={invitation.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      {canManage && invitation.status === 'pending' && (
                        <Checkbox
                          checked={selectedInvitations.includes(invitation.id)}
                          onCheckedChange={() =>
                            toggleInvitationSelection(invitation.id)
                          }
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">
                            {invitation.email}
                          </p>
                          <Badge className={roleDisplay.color}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {roleDisplay.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Invited by {invitation.inviterName}</span>
                          <span>
                            {new Intl.DateTimeFormat('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }).format(invitation.invitedAt)}
                          </span>
                          <span>
                            Expires{' '}
                            {new Intl.DateTimeFormat('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }).format(invitation.expiresAt)}
                          </span>
                        </div>
                      </div>

                      <Badge className={statusDisplay.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusDisplay.label}
                      </Badge>

                      {canManage && (
                        <div className="flex items-center gap-2">
                          {canResend && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleResendInvitation(invitation.id)
                              }
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}

                          {invitation.status === 'pending' && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setInvitationToCancel(invitation)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {!canManage && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg mt-4">
              You have read-only access to invitation information. Contact an
              admin or owner to manage invitations.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialogs */}
      <CancelInvitationConfirmationDialog
        isOpen={!!invitationToCancel}
        onClose={() => setInvitationToCancel(null)}
        onConfirm={async () => {
          if (invitationToCancel) {
            await handleCancelInvitation(invitationToCancel.id);
            setInvitationToCancel(null);
          }
        }}
        email={invitationToCancel?.email || ''}
      />

      <ConfirmationDialog
        isOpen={showBulkCancelDialog}
        onClose={() => setShowBulkCancelDialog(false)}
        onConfirm={async () => {
          await handleBulkCancel();
          setShowBulkCancelDialog(false);
        }}
        title="Cancel Invitations"
        description={`Are you sure you want to cancel ${selectedInvitations.length} invitation(s)? This action cannot be undone.`}
        confirmText="Cancel Invitations"
        variant="destructive"
        icon="cancel"
      />
    </div>
  );
}
