'use server';

import { db } from '@/db';
import { invitation, member, organization, user } from '@/db/schema';
import type { Role } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { getCurrentUser } from './users';
import { getUserOrganizationMembership } from './organizations';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

// Server Action Result type for consistent error handling
export interface ServerActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Invite a new member to an organization via email
 */
export async function inviteMember(
  organizationId: string,
  email: string,
  role: Role
): Promise<ServerActionResult<{ invitationId: string }>> {
  try {
    // Get current user and validate authentication
    const { currentUser } = await getCurrentUser();

    if (!currentUser?.id) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to invite members',
        },
      };
    }

    // Validate email format
    if (!email || !EMAIL_REGEX.test(email)) {
      return {
        success: false,
        error: {
          code: 'INVALID_EMAIL',
          message: 'Please provide a valid email address',
        },
      };
    }

    // Validate role
    if (!role || !['owner', 'admin', 'member'].includes(role)) {
      return {
        success: false,
        error: {
          code: 'INVALID_ROLE',
          message: 'Please select a valid role',
        },
      };
    }

    // Check if user has permission to invite members to this organization
    const userMembership = await getUserOrganizationMembership(
      currentUser.id,
      organizationId
    );

    if (!userMembership) {
      return {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this organization',
        },
      };
    }

    // Only owners and admins can invite members
    if (!['owner', 'admin'].includes(userMembership.role)) {
      return {
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'You do not have permission to invite members',
        },
      };
    }

    // Check if email is already a member
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (existingUser) {
      const existingMember = await db.query.member.findFirst({
        where: and(
          eq(member.userId, existingUser.id),
          eq(member.organizationId, organizationId)
        ),
      });

      if (existingMember) {
        return {
          success: false,
          error: {
            code: 'ALREADY_MEMBER',
            message: 'This user is already a member of the organization',
          },
        };
      }
    }

    // Check if there's already a pending invitation
    const existingInvitation = await db.query.invitation.findFirst({
      where: and(
        eq(invitation.email, email),
        eq(invitation.organizationId, organizationId),
        eq(invitation.status, 'pending')
      ),
    });

    if (existingInvitation) {
      return {
        success: false,
        error: {
          code: 'INVITATION_EXISTS',
          message: 'An invitation has already been sent to this email address',
        },
      };
    }

    // Create invitation record in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const newInvitation = await db
      .insert(invitation)
      .values({
        id: randomUUID(),
        organizationId,
        email,
        role,
        status: 'pending',
        expiresAt,
        inviterId: currentUser.id,
      })
      .returning();

    if (!newInvitation[0]) {
      return {
        success: false,
        error: {
          code: 'INVITATION_FAILED',
          message: 'Failed to create invitation',
        },
      };
    }

    // TODO: Integrate with better-auth organization plugin for email sending
    // For now, the invitation record is created and can be processed separately

    // Revalidate the organization page to show updated data
    revalidatePath(`/organizations/${userMembership.organization.slug}`);

    return {
      success: true,
      data: {
        invitationId: newInvitation[0].id,
      },
    };
  } catch (error) {
    console.error('Error inviting member:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred while sending the invitation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * Cancel a pending invitation
 */
export async function cancelInvitation(
  invitationId: string
): Promise<ServerActionResult<void>> {
  try {
    // Get current user and validate authentication
    const { currentUser } = await getCurrentUser();

    if (!currentUser?.id) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to cancel invitations',
        },
      };
    }

    // Get the invitation details
    const invitationRecord = await db.query.invitation.findFirst({
      where: eq(invitation.id, invitationId),
    });

    if (!invitationRecord) {
      return {
        success: false,
        error: {
          code: 'INVITATION_NOT_FOUND',
          message: 'Invitation not found',
        },
      };
    }

    // Check if user has permission to cancel invitations for this organization
    const userMembership = await getUserOrganizationMembership(
      currentUser.id,
      invitationRecord.organizationId
    );

    if (!userMembership) {
      return {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this organization',
        },
      };
    }

    // Only owners and admins can cancel invitations
    if (!['owner', 'admin'].includes(userMembership.role)) {
      return {
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'You do not have permission to cancel invitations',
        },
      };
    }

    // Cancel the invitation by updating its status
    await db
      .update(invitation)
      .set({ status: 'cancelled' })
      .where(eq(invitation.id, invitationId));

    // Revalidate the organization page
    revalidatePath(`/organizations/${userMembership.organization.slug}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error canceling invitation:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred while canceling the invitation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * Resend an expired or pending invitation
 */
export async function resendInvitation(
  invitationId: string
): Promise<ServerActionResult<void>> {
  try {
    // Get current user and validate authentication
    const { currentUser } = await getCurrentUser();

    if (!currentUser?.id) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to resend invitations',
        },
      };
    }

    // Get the invitation details
    const invitationRecord = await db.query.invitation.findFirst({
      where: eq(invitation.id, invitationId),
    });

    if (!invitationRecord) {
      return {
        success: false,
        error: {
          code: 'INVITATION_NOT_FOUND',
          message: 'Invitation not found',
        },
      };
    }

    // Check if user has permission to resend invitations for this organization
    const userMembership = await getUserOrganizationMembership(
      currentUser.id,
      invitationRecord.organizationId
    );

    if (!userMembership) {
      return {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this organization',
        },
      };
    }

    // Only owners and admins can resend invitations
    if (!['owner', 'admin'].includes(userMembership.role)) {
      return {
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'You do not have permission to resend invitations',
        },
      };
    }

    // Check if invitation can be resent (pending or expired)
    if (!['pending', 'expired'].includes(invitationRecord.status)) {
      return {
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: 'This invitation cannot be resent',
        },
      };
    }

    // Update invitation expiry date
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7); // 7 days from now

    await db
      .update(invitation)
      .set({
        status: 'pending',
        expiresAt: newExpiresAt,
      })
      .where(eq(invitation.id, invitationId));

    // TODO: Integrate with better-auth organization plugin for email sending
    // For now, the invitation record is updated and can be processed separately

    // Revalidate the organization page
    revalidatePath(`/organizations/${userMembership.organization.slug}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error resending invitation:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred while resending the invitation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * Cancel multiple invitations in bulk
 */
export async function bulkCancelInvitations(
  invitationIds: string[]
): Promise<ServerActionResult<{ cancelledCount: number }>> {
  try {
    // Get current user and validate authentication
    const { currentUser } = await getCurrentUser();

    if (!currentUser?.id) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to cancel invitations',
        },
      };
    }

    if (!invitationIds || invitationIds.length === 0) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'No invitations selected for cancellation',
        },
      };
    }

    // Get all invitation records
    const invitationRecords = await db.query.invitation.findMany({
      where: inArray(invitation.id, invitationIds),
    });

    if (invitationRecords.length === 0) {
      return {
        success: false,
        error: {
          code: 'INVITATIONS_NOT_FOUND',
          message: 'No valid invitations found',
        },
      };
    }

    // Check permissions for each organization
    const organizationIds = Array.from(
      new Set(invitationRecords.map((inv) => inv.organizationId))
    );

    for (const orgId of organizationIds) {
      const userMembership = await getUserOrganizationMembership(
        currentUser.id,
        orgId
      );

      if (
        !userMembership ||
        !['owner', 'admin'].includes(userMembership.role)
      ) {
        return {
          success: false,
          error: {
            code: 'INSUFFICIENT_PERMISSIONS',
            message:
              'You do not have permission to cancel invitations in one or more organizations',
          },
        };
      }
    }

    // Cancel all invitations
    const result = await db
      .update(invitation)
      .set({ status: 'cancelled' })
      .where(inArray(invitation.id, invitationIds));

    // Revalidate organization pages
    for (const orgId of organizationIds) {
      const org = await db.query.organization.findFirst({
        where: eq(organization.id, orgId),
      });
      if (org?.slug) {
        revalidatePath(`/organizations/${org.slug}`);
      }
    }

    return {
      success: true,
      data: {
        cancelledCount: invitationRecords.length,
      },
    };
  } catch (error) {
    console.error('Error bulk canceling invitations:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred while canceling invitations',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * Remove multiple members in bulk
 */
export async function bulkRemoveMembers(
  memberIds: string[]
): Promise<ServerActionResult<{ removedCount: number }>> {
  try {
    // Get current user and validate authentication
    const { currentUser } = await getCurrentUser();

    if (!currentUser?.id) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to remove members',
        },
      };
    }

    if (!memberIds || memberIds.length === 0) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'No members selected for removal',
        },
      };
    }

    // Get all member records
    const memberRecords = await db.query.member.findMany({
      where: inArray(member.id, memberIds),
      with: {
        organization: true,
      },
    });

    if (memberRecords.length === 0) {
      return {
        success: false,
        error: {
          code: 'MEMBERS_NOT_FOUND',
          message: 'No valid members found',
        },
      };
    }

    // Check permissions for each organization and prevent self-removal
    const organizationIds = Array.from(
      new Set(memberRecords.map((m) => m.organizationId))
    );

    for (const orgId of organizationIds) {
      const userMembership = await getUserOrganizationMembership(
        currentUser.id,
        orgId
      );

      if (
        !userMembership ||
        !['owner', 'admin'].includes(userMembership.role)
      ) {
        return {
          success: false,
          error: {
            code: 'INSUFFICIENT_PERMISSIONS',
            message:
              'You do not have permission to remove members from one or more organizations',
          },
        };
      }
    }

    // Prevent users from removing themselves
    const selfMember = memberRecords.find((m) => m.userId === currentUser.id);
    if (selfMember) {
      return {
        success: false,
        error: {
          code: 'CANNOT_REMOVE_SELF',
          message: 'You cannot remove yourself from the organization',
        },
      };
    }

    // Remove all members
    await db.delete(member).where(inArray(member.id, memberIds));

    // Revalidate organization pages
    for (const orgId of organizationIds) {
      const org = await db.query.organization.findFirst({
        where: eq(organization.id, orgId),
      });
      if (org?.slug) {
        revalidatePath(`/organizations/${org.slug}`);
      }
    }

    return {
      success: true,
      data: {
        removedCount: memberRecords.length,
      },
    };
  } catch (error) {
    console.error('Error bulk removing members:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred while removing members',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}
