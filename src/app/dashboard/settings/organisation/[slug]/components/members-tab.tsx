'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ConfirmationDialog,
  RemoveMemberConfirmationDialog,
} from '@/components/ui/confirmation-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Users,
  Crown,
  UserCheck,
  UserCog,
  User,
  Trash2,
  UserMinus,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Role } from '@/db/schema';

interface MembersTabProps {
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

// Mock member data - in real implementation, this would come from server
interface Member {
  id: string;
  userId: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  joinedAt: Date;
  lastActive?: Date;
}

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

// Helper function to get user initials
function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Helper function to check if user can manage members
function canManageMembers(role: Role): boolean {
  return ['owner', 'admin', 'manager'].includes(role);
}

// Helper function to check if user can change roles
function canChangeRole(
  userRole: Role,
  targetRole: Role,
  isCurrentUser: boolean
): boolean {
  if (isCurrentUser) return false; // Can't change own role
  if (targetRole === 'owner') return userRole === 'owner'; // Only owners can change owner role
  return ['owner', 'admin'].includes(userRole); // Owners and admins can change other roles
}

// Helper function to check if user can remove member
function canRemoveMember(
  userRole: Role,
  targetRole: Role,
  isCurrentUser: boolean
): boolean {
  if (isCurrentUser) return false; // Can't remove self
  if (targetRole === 'owner') return false; // Can't remove owner
  return ['owner', 'admin', 'manager'].includes(userRole);
}

export function MembersTab({
  organization,
  userRole,
  currentUser,
}: MembersTabProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [showBulkRemoveDialog, setShowBulkRemoveDialog] = useState(false);

  const canManage = canManageMembers(userRole);

  // Mock data - in real implementation, fetch from server
  useEffect(() => {
    const mockMembers: Member[] = [
      {
        id: '1',
        userId: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: userRole,
        joinedAt: new Date('2024-01-15'),
        lastActive: new Date(),
      },
      {
        id: '2',
        userId: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'admin',
        joinedAt: new Date('2024-02-01'),
        lastActive: new Date('2024-12-18'),
      },
      {
        id: '3',
        userId: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'manager',
        joinedAt: new Date('2024-03-10'),
        lastActive: new Date('2024-12-17'),
      },
      {
        id: '4',
        userId: '4',
        name: 'Alice Brown',
        email: 'alice@example.com',
        role: 'member',
        joinedAt: new Date('2024-04-05'),
        lastActive: new Date('2024-12-16'),
      },
    ];

    setTimeout(() => {
      setMembers(mockMembers);
      setIsLoading(false);
    }, 500);
  }, [currentUser, userRole]);

  const handleRoleChange = async (memberId: string, newRole: Role) => {
    try {
      // TODO: Implement updateMemberRole server action
      console.log('Updating member role:', { memberId, newRole });

      setMembers((prev) =>
        prev.map((member) =>
          member.id === memberId ? { ...member, role: newRole } : member
        )
      );

      toast.success('Member role updated successfully');
    } catch (error) {
      console.error('Error updating member role:', error);
      toast.error('Failed to update member role');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      // TODO: Implement removeMember server action
      console.log('Removing member:', memberId);

      setMembers((prev) => prev.filter((member) => member.id !== memberId));
      toast.success('Member removed successfully');
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    }
  };

  const handleBulkRemove = async () => {
    if (selectedMembers.length === 0) return;

    try {
      // TODO: Implement bulkRemoveMembers server action
      console.log('Bulk removing members:', selectedMembers);

      setMembers((prev) =>
        prev.filter((member) => !selectedMembers.includes(member.id))
      );
      setSelectedMembers([]);
      toast.success(`${selectedMembers.length} members removed successfully`);
    } catch (error) {
      console.error('Error bulk removing members:', error);
      toast.error('Failed to remove members');
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAllMembers = () => {
    const selectableMembers = members.filter((member) =>
      canRemoveMember(userRole, member.role, member.userId === currentUser.id)
    );
    setSelectedMembers(selectableMembers.map((member) => member.id));
  };

  const clearSelection = () => {
    setSelectedMembers([]);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Organization Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-4 border rounded-lg"
              >
                <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Members Header with Bulk Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Organization Members
              </CardTitle>
              <CardDescription>
                Manage team members and their roles in the organization
              </CardDescription>
            </div>
            {canManage && selectedMembers.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedMembers.length} selected
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
                  onClick={() => setShowBulkRemoveDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Selected
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {canManage && (
            <div className="flex items-center gap-2 mb-4">
              <Checkbox
                checked={
                  selectedMembers.length ===
                  members.filter((member) =>
                    canRemoveMember(
                      userRole,
                      member.role,
                      member.userId === currentUser.id
                    )
                  ).length
                }
                onCheckedChange={(checked) => {
                  if (checked) {
                    selectAllMembers();
                  } else {
                    clearSelection();
                  }
                }}
              />
              <span className="text-sm text-muted-foreground">
                Select all removable members
              </span>
            </div>
          )}

          <div className="space-y-4">
            {members.map((member) => {
              const roleDisplay = getRoleDisplay(member.role);
              const RoleIcon = roleDisplay.icon;
              const isCurrentUser = member.userId === currentUser.id;
              const canChangeThisRole = canChangeRole(
                userRole,
                member.role,
                isCurrentUser
              );
              const canRemoveThisMember = canRemoveMember(
                userRole,
                member.role,
                isCurrentUser
              );

              return (
                <div
                  key={member.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {canManage && canRemoveThisMember && (
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => toggleMemberSelection(member.id)}
                    />
                  )}

                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={member.image || ''}
                      alt={`${member.name} avatar`}
                    />
                    <AvatarFallback>
                      {getUserInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{member.name}</p>
                      {isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {member.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Joined{' '}
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }).format(member.joinedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {canChangeThisRole ? (
                      <Select
                        value={member.role}
                        onValueChange={(newRole: Role) =>
                          handleRoleChange(member.id, newRole)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
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
                    ) : (
                      <Badge className={roleDisplay.color}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {roleDisplay.label}
                      </Badge>
                    )}

                    {canRemoveThisMember && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setMemberToRemove(member)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!canManage && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg mt-4">
              You have read-only access to member information. Contact an admin
              or owner to manage members.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialogs */}
      <RemoveMemberConfirmationDialog
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={async () => {
          if (memberToRemove) {
            await handleRemoveMember(memberToRemove.id);
            setMemberToRemove(null);
          }
        }}
        memberName={memberToRemove?.name || ''}
      />

      <ConfirmationDialog
        isOpen={showBulkRemoveDialog}
        onClose={() => setShowBulkRemoveDialog(false)}
        onConfirm={async () => {
          await handleBulkRemove();
          setShowBulkRemoveDialog(false);
        }}
        title="Remove Members"
        description={`Are you sure you want to remove ${selectedMembers.length} member(s) from this organization? This action cannot be undone.`}
        confirmText="Remove Members"
        variant="destructive"
        icon="remove"
      />
    </div>
  );
}
