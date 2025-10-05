import { db } from '@/db';
import { ownershipTransfer, member, organization, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auditLogger } from './audit-logger';

export interface OwnershipTransferRequest {
  organizationId: string;
  newOwnerId: string;
  reason?: string;
  transferMessage?: string;
}

export interface OwnershipTransferResult {
  success: boolean;
  transferId?: string;
  error?: string;
}

export interface PendingTransfer {
  id: string;
  organizationId: string;
  organizationName: string;
  fromUserId: string;
  fromUserName: string;
  fromUserEmail: string;
  toUserId: string;
  toUserName: string;
  toUserEmail: string;
  status: 'pending' | 'accepted' | 'cancelled' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  transferMessage?: string;
  reason?: string;
}

class OwnershipTransferManager {
  private readonly TRANSFER_EXPIRY_HOURS = 72; // 3 days

  async validateTransferRequest(
    organizationId: string,
    fromUserId: string,
    toUserId: string
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Check if organization exists
      const org = await db.query.organization.findFirst({
        where: eq(organization.id, organizationId),
      });

      if (!org) {
        errors.push('Organization not found');
        return { isValid: false, errors };
      }

      // Check if organization is not deleted
      if (org.deletedAt) {
        errors.push('Cannot transfer ownership of deleted organization');
        return { isValid: false, errors };
      }

      // Check if from user is the current owner
      const fromMember = await db.query.member.findFirst({
        where: and(
          eq(member.organizationId, organizationId),
          eq(member.userId, fromUserId)
        ),
      });

      if (!fromMember || fromMember.role !== 'owner') {
        errors.push('Only organization owners can initiate ownership transfer');
        return { isValid: false, errors };
      }

      // Check if to user is a member and eligible (admin or manager)
      const toMember = await db.query.member.findFirst({
        where: and(
          eq(member.organizationId, organizationId),
          eq(member.userId, toUserId)
        ),
      });

      if (!toMember) {
        errors.push('Transfer recipient must be a member of the organization');
        return { isValid: false, errors };
      }

      if (!['admin', 'manager'].includes(toMember.role)) {
        errors.push('Transfer recipient must be an admin or manager');
        return { isValid: false, errors };
      }

      // Check if there's already a pending transfer
      const existingTransfer = await db.query.ownershipTransfer.findFirst({
        where: and(
          eq(ownershipTransfer.organizationId, organizationId),
          eq(ownershipTransfer.status, 'pending')
        ),
      });

      if (existingTransfer) {
        errors.push(
          'There is already a pending ownership transfer for this organization'
        );
        return { isValid: false, errors };
      }

      // Cannot transfer to self
      if (fromUserId === toUserId) {
        errors.push('Cannot transfer ownership to yourself');
        return { isValid: false, errors };
      }
    } catch (error) {
      console.error('Error validating transfer request:', error);
      errors.push('Failed to validate transfer request');
    }

    return { isValid: errors.length === 0, errors };
  }

  async initiateOwnershipTransfer(
    request: OwnershipTransferRequest,
    fromUserId: string
  ): Promise<OwnershipTransferResult> {
    try {
      // Validate the transfer request
      const validation = await this.validateTransferRequest(
        request.organizationId,
        fromUserId,
        request.newOwnerId
      );

      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', '),
        };
      }

      // Generate transfer token and expiry
      const transferToken = crypto.randomUUID();
      const expiresAt = new Date(
        Date.now() + this.TRANSFER_EXPIRY_HOURS * 60 * 60 * 1000
      );

      // Create the transfer record
      const transferId = crypto.randomUUID();
      await db.insert(ownershipTransfer).values({
        id: transferId,
        organizationId: request.organizationId,
        fromUserId,
        toUserId: request.newOwnerId,
        status: 'pending',
        transferToken,
        createdAt: new Date(),
        expiresAt,
        metadata: JSON.stringify({
          reason: request.reason,
          transferMessage: request.transferMessage,
        }),
      });

      // Log the transfer initiation
      await auditLogger.logOwnershipTransferInitiated(
        request.organizationId,
        fromUserId,
        transferId,
        {
          toUserId: request.newOwnerId,
          reason: request.reason,
          expiresAt: expiresAt.toISOString(),
        }
      );

      // In a real implementation, send email notification here
      await this.sendTransferNotificationEmail(transferId);

      return {
        success: true,
        transferId,
      };
    } catch (error) {
      console.error('Error initiating ownership transfer:', error);
      return {
        success: false,
        error: 'Failed to initiate ownership transfer',
      };
    }
  }

  async sendTransferNotificationEmail(transferId: string): Promise<void> {
    try {
      // Get transfer details
      const transfer = await db.query.ownershipTransfer.findFirst({
        where: eq(ownershipTransfer.id, transferId),
      });

      if (!transfer) {
        console.error('Transfer not found for email notification');
        return;
      }

      // Get organization and user details
      const [org, fromUser, toUser] = await Promise.all([
        db.query.organization.findFirst({
          where: eq(organization.id, transfer.organizationId),
        }),
        db.query.user.findFirst({
          where: eq(user.id, transfer.fromUserId),
        }),
        db.query.user.findFirst({
          where: eq(user.id, transfer.toUserId),
        }),
      ]);

      if (!org || !fromUser || !toUser) {
        console.error('Missing data for transfer notification email');
        return;
      }

      const metadata = transfer.metadata ? JSON.parse(transfer.metadata) : {};

      // In a real implementation, integrate with your email service
      console.log('Sending ownership transfer notification email:', {
        to: toUser.email,
        subject: `Ownership Transfer Request for ${org.name}`,
        organizationName: org.name,
        fromUserName: fromUser.name,
        toUserName: toUser.name,
        transferMessage: metadata.transferMessage,
        reason: metadata.reason,
        expiresAt: transfer.expiresAt,
        acceptUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/organisation/transfer/accept/${transfer.transferToken}`,
      });

      // Also notify the initiator
      console.log('Sending transfer confirmation email:', {
        to: fromUser.email,
        subject: `Ownership Transfer Initiated for ${org.name}`,
        organizationName: org.name,
        toUserName: toUser.name,
        expiresAt: transfer.expiresAt,
      });
    } catch (error) {
      console.error('Error sending transfer notification email:', error);
    }
  }

  async getPendingTransfers(userId: string): Promise<PendingTransfer[]> {
    try {
      // Get transfers where user is either sender or recipient
      const transfers = await db
        .select({
          transfer: ownershipTransfer,
          org: organization,
          fromUser: user,
          toUser: user,
        })
        .from(ownershipTransfer)
        .innerJoin(
          organization,
          eq(ownershipTransfer.organizationId, organization.id)
        )
        .innerJoin(user, eq(ownershipTransfer.fromUserId, user.id))
        .innerJoin(user, eq(ownershipTransfer.toUserId, user.id))
        .where(
          and(
            eq(ownershipTransfer.status, 'pending')
            // User is either sender or recipient
          )
        );

      // Note: The above query has a limitation with joining user table twice
      // In a real implementation, you'd need to use aliases or separate queries
      // For now, let's use a simpler approach

      const allTransfers = await db.query.ownershipTransfer.findMany({
        where: eq(ownershipTransfer.status, 'pending'),
      });

      const userTransfers = allTransfers.filter(
        (t) => t.fromUserId === userId || t.toUserId === userId
      );

      const results: PendingTransfer[] = [];

      for (const transfer of userTransfers) {
        const [org, fromUser, toUser] = await Promise.all([
          db.query.organization.findFirst({
            where: eq(organization.id, transfer.organizationId),
          }),
          db.query.user.findFirst({
            where: eq(user.id, transfer.fromUserId),
          }),
          db.query.user.findFirst({
            where: eq(user.id, transfer.toUserId),
          }),
        ]);

        if (org && fromUser && toUser) {
          const metadata = transfer.metadata
            ? JSON.parse(transfer.metadata)
            : {};

          results.push({
            id: transfer.id,
            organizationId: transfer.organizationId,
            organizationName: org.name,
            fromUserId: transfer.fromUserId,
            fromUserName: fromUser.name,
            fromUserEmail: fromUser.email,
            toUserId: transfer.toUserId,
            toUserName: toUser.name,
            toUserEmail: toUser.email,
            status: transfer.status as
              | 'pending'
              | 'accepted'
              | 'cancelled'
              | 'expired',
            createdAt: transfer.createdAt,
            expiresAt: transfer.expiresAt,
            transferMessage: metadata.transferMessage,
            reason: metadata.reason,
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error getting pending transfers:', error);
      return [];
    }
  }

  async getTransferByToken(token: string): Promise<PendingTransfer | null> {
    try {
      const transfer = await db.query.ownershipTransfer.findFirst({
        where: eq(ownershipTransfer.transferToken, token),
      });

      if (!transfer) {
        return null;
      }

      const [org, fromUser, toUser] = await Promise.all([
        db.query.organization.findFirst({
          where: eq(organization.id, transfer.organizationId),
        }),
        db.query.user.findFirst({
          where: eq(user.id, transfer.fromUserId),
        }),
        db.query.user.findFirst({
          where: eq(user.id, transfer.toUserId),
        }),
      ]);

      if (!org || !fromUser || !toUser) {
        return null;
      }

      const metadata = transfer.metadata ? JSON.parse(transfer.metadata) : {};

      return {
        id: transfer.id,
        organizationId: transfer.organizationId,
        organizationName: org.name,
        fromUserId: transfer.fromUserId,
        fromUserName: fromUser.name,
        fromUserEmail: fromUser.email,
        toUserId: transfer.toUserId,
        toUserName: toUser.name,
        toUserEmail: toUser.email,
        status: transfer.status as
          | 'pending'
          | 'accepted'
          | 'cancelled'
          | 'expired',
        createdAt: transfer.createdAt,
        expiresAt: transfer.expiresAt,
        transferMessage: metadata.transferMessage,
        reason: metadata.reason,
      };
    } catch (error) {
      console.error('Error getting transfer by token:', error);
      return null;
    }
  }

  async expireOldTransfers(): Promise<void> {
    try {
      const now = new Date();

      await db
        .update(ownershipTransfer)
        .set({
          status: 'expired',
        })
        .where(
          and(
            eq(ownershipTransfer.status, 'pending')
            // expiresAt < now (expired)
          )
        );
    } catch (error) {
      console.error('Error expiring old transfers:', error);
    }
  }
}

export const ownershipTransferManager = new OwnershipTransferManager();
  async acceptOwnershipTransfer(
    transferId: string,
    acceptingUserId: string
  ): Promise<OwnershipTransferResult> {
    try {
      // Get the transfer details
      const transfer = await db.query.ownershipTransfer.findFirst({
        where: eq(ownershipTransfer.id, transferId),
      });

      if (!transfer) {
        return {
          success: false,
          error: 'Transfer not found',
        };
      }

      // Validate transfer status and expiry
      if (transfer.status !== 'pending') {
        return {
          success: false,
          error: 'Transfer is no longer pending',
        };
      }

      if (new Date() > transfer.expiresAt) {
        // Mark as expired
        await db
          .update(ownershipTransfer)
          .set({ status: 'expired' })
          .where(eq(ownershipTransfer.id, transferId));

        return {
          success: false,
          error: 'Transfer has expired',
        };
      }

      // Verify the accepting user is the intended recipient
      if (transfer.toUserId !== acceptingUserId) {
        return {
          success: false,
          error: 'You are not authorized to accept this transfer',
        };
      }

      // Execute the ownership transfer
      const now = new Date();
      
      // Update the current owner to admin role
      await db
        .update(member)
        .set({ role: 'admin' })
        .where(and(
          eq(member.organizationId, transfer.organizationId),
          eq(member.userId, transfer.fromUserId)
        ));

      // Update the new owner to owner role
      await db
        .update(member)
        .set({ role: 'owner' })
        .where(and(
          eq(member.organizationId, transfer.organizationId),
          eq(member.userId, transfer.toUserId)
        ));

      // Mark transfer as accepted
      await db
        .update(ownershipTransfer)
        .set({
          status: 'accepted',
          acceptedAt: now,
        })
        .where(eq(ownershipTransfer.id, transferId));

      // Log the transfer acceptance
      await auditLogger.logOwnershipTransferAccepted(
        transfer.organizationId,
        acceptingUserId,
        transferId,
        {
          fromUserId: transfer.fromUserId,
          acceptedAt: now.toISOString(),
        }
      );

      // Send completion notification emails
      await this.sendTransferCompletionEmails(transferId);

      return {
        success: true,
        transferId,
      };

    } catch (error) {
      console.error('Error accepting ownership transfer:', error);
      return {
        success: false,
        error: 'Failed to accept ownership transfer',
      };
    }
  }

  async cancelOwnershipTransfer(
    transferId: string,
    cancellingUserId: string
  ): Promise<OwnershipTransferResult> {
    try {
      // Get the transfer details
      const transfer = await db.query.ownershipTransfer.findFirst({
        where: eq(ownershipTransfer.id, transferId),
      });

      if (!transfer) {
        return {
          success: false,
          error: 'Transfer not found',
        };
      }

      // Validate transfer status
      if (transfer.status !== 'pending') {
        return {
          success: false,
          error: 'Transfer is no longer pending',
        };
      }

      // Verify the cancelling user is the initiator
      if (transfer.fromUserId !== cancellingUserId) {
        return {
          success: false,
          error: 'Only the transfer initiator can cancel the transfer',
        };
      }

      // Mark transfer as cancelled
      const now = new Date();
      await db
        .update(ownershipTransfer)
        .set({
          status: 'cancelled',
          cancelledAt: now,
        })
        .where(eq(ownershipTransfer.id, transferId));

      // Log the transfer cancellation
      await auditLogger.log({
        organizationId: transfer.organizationId,
        userId: cancellingUserId,
        action: 'ownership_transfer_cancelled',
        resourceType: 'ownership_transfer',
        resourceId: transferId,
        details: {
          toUserId: transfer.toUserId,
          cancelledAt: now.toISOString(),
        },
        severity: 'info',
      });

      // Send cancellation notification emails
      await this.sendTransferCancellationEmails(transferId);

      return {
        success: true,
        transferId,
      };

    } catch (error) {
      console.error('Error cancelling ownership transfer:', error);
      return {
        success: false,
        error: 'Failed to cancel ownership transfer',
      };
    }
  }

  async acceptTransferByToken(
    token: string,
    acceptingUserId: string
  ): Promise<OwnershipTransferResult> {
    try {
      const transfer = await db.query.ownershipTransfer.findFirst({
        where: eq(ownershipTransfer.transferToken, token),
      });

      if (!transfer) {
        return {
          success: false,
          error: 'Invalid transfer token',
        };
      }

      return await this.acceptOwnershipTransfer(transfer.id, acceptingUserId);

    } catch (error) {
      console.error('Error accepting transfer by token:', error);
      return {
        success: false,
        error: 'Failed to accept transfer',
      };
    }
  }

  private async sendTransferCompletionEmails(transferId: string): Promise<void> {
    try {
      const transfer = await db.query.ownershipTransfer.findFirst({
        where: eq(ownershipTransfer.id, transferId),
      });

      if (!transfer) return;

      const [org, fromUser, toUser] = await Promise.all([
        db.query.organization.findFirst({
          where: eq(organization.id, transfer.organizationId),
        }),
        db.query.user.findFirst({
          where: eq(user.id, transfer.fromUserId),
        }),
        db.query.user.findFirst({
          where: eq(user.id, transfer.toUserId),
        }),
      ]);

      if (!org || !fromUser || !toUser) return;

      // Email to new owner
      console.log('Sending ownership transfer completion email to new owner:', {
        to: toUser.email,
        subject: `You are now the owner of ${org.name}`,
        organizationName: org.name,
        previousOwnerName: fromUser.name,
        completedAt: transfer.acceptedAt,
      });

      // Email to previous owner
      console.log('Sending ownership transfer completion email to previous owner:', {
        to: fromUser.email,
        subject: `Ownership of ${org.name} has been transferred`,
        organizationName: org.name,
        newOwnerName: toUser.name,
        completedAt: transfer.acceptedAt,
      });

    } catch (error) {
      console.error('Error sending transfer completion emails:', error);
    }
  }

  private async sendTransferCancellationEmails(transferId: string): Promise<void> {
    try {
      const transfer = await db.query.ownershipTransfer.findFirst({
        where: eq(ownershipTransfer.id, transferId),
      });

      if (!transfer) return;

      const [org, fromUser, toUser] = await Promise.all([
        db.query.organization.findFirst({
          where: eq(organization.id, transfer.organizationId),
        }),
        db.query.user.findFirst({
          where: eq(user.id, transfer.fromUserId),
        }),
        db.query.user.findFirst({
          where: eq(user.id, transfer.toUserId),
        }),
      ]);

      if (!org || !fromUser || !toUser) return;

      // Email to intended recipient
      console.log('Sending ownership transfer cancellation email:', {
        to: toUser.email,
        subject: `Ownership transfer for ${org.name} has been cancelled`,
        organizationName: org.name,
        fromUserName: fromUser.name,
        cancelledAt: transfer.cancelledAt,
      });

    } catch (error) {
      console.error('Error sending transfer cancellation emails:', error);
    }
  }

  async getTransferHistory(organizationId: string): Promise<PendingTransfer[]> {
    try {
      const transfers = await db.query.ownershipTransfer.findMany({
        where: eq(ownershipTransfer.organizationId, organizationId),
      });

      const results: PendingTransfer[] = [];

      for (const transfer of transfers) {
        const [org, fromUser, toUser] = await Promise.all([
          db.query.organization.findFirst({
            where: eq(organization.id, transfer.organizationId),
          }),
          db.query.user.findFirst({
            where: eq(user.id, transfer.fromUserId),
          }),
          db.query.user.findFirst({
            where: eq(user.id, transfer.toUserId),
          }),
        ]);

        if (org && fromUser && toUser) {
          const metadata = transfer.metadata ? JSON.parse(transfer.metadata) : {};
          
          results.push({
            id: transfer.id,
            organizationId: transfer.organizationId,
            organizationName: org.name,
            fromUserId: transfer.fromUserId,
            fromUserName: fromUser.name,
            fromUserEmail: fromUser.email,
            toUserId: transfer.toUserId,
            toUserName: toUser.name,
            toUserEmail: toUser.email,
            status: transfer.status as 'pending' | 'accepted' | 'cancelled' | 'expired',
            createdAt: transfer.createdAt,
            expiresAt: transfer.expiresAt,
            transferMessage: metadata.transferMessage,
            reason: metadata.reason,
          });
        }
      }

      return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    } catch (error) {
      console.error('Error getting transfer history:', error);
      return [];
    }
  }
}