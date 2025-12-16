import { db } from '@/db';
import {
  ownershipTransfer,
  organization,
  user,
  member,
  type Role,
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { Resend } from 'resend';
import OwnershipTransferEmail from '@/emails/ownership-transfer';
import { env } from '@/env';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    // Basic validation: user exists, org exists, fromUser is owner
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, organizationId),
    });

    if (!org) {
      return { isValid: false, errors: ['Organization not found'] };
    }

    // Check if fromUser is the owner via Member table
    const currentOwnerMember = await db.query.member.findFirst({
      where: and(
        eq(member.organizationId, organizationId),
        eq(member.userId, fromUserId),
        eq(member.role, 'owner')
      ),
    });

    if (!currentOwnerMember) {
      return {
        isValid: false,
        errors: ['Only the current owner can initiate transfer'],
      };
    }

    // Check if there is already a pending transfer
    const existingTransfer = await db.query.ownershipTransfer.findFirst({
      where: and(
        eq(ownershipTransfer.organizationId, organizationId),
        eq(ownershipTransfer.status, 'pending')
      ),
    });

    if (existingTransfer) {
      return {
        isValid: false,
        errors: [
          'There is already a pending ownership transfer for this organization',
        ],
      };
    }

    return { isValid: true, errors: [] };
  }

  async initiateOwnershipTransfer(
    request: OwnershipTransferRequest,
    fromUserId: string
  ): Promise<OwnershipTransferResult> {
    try {
      const { organizationId, newOwnerId, reason, transferMessage } = request;

      // 1. Validation
      const validation = await this.validateTransferRequest(
        organizationId,
        fromUserId,
        newOwnerId
      );
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // 2. Prepare Data
      const transferId = crypto.randomUUID();
      const transferToken = crypto.randomUUID(); // Secure random token
      const now = new Date();
      const expiresAt = new Date(
        now.getTime() + this.TRANSFER_EXPIRY_HOURS * 60 * 60 * 1000
      );

      // 3. Database Insert
      await db.insert(ownershipTransfer).values({
        id: transferId,
        organizationId,
        fromUserId,
        toUserId: newOwnerId,
        transferToken,
        status: 'pending',
        reason,
        transferMessage,
        createdAt: now,
        expiresAt,
      });

      // 4. Send Email
      // Fetch details for email
      const org = await db.query.organization.findFirst({
        where: eq(organization.id, organizationId),
      });
      const fromUser = await db.query.user.findFirst({
        where: eq(user.id, fromUserId),
      });
      const toUser = await db.query.user.findFirst({
        where: eq(user.id, newOwnerId),
      });

      if (toUser?.email && org && fromUser) {
        const acceptLink = `${env.NEXT_PUBLIC_URL}/dashboard/organization/${org.slug}/settings/transfer-ownership?token=${transferToken}`;

        await resend.emails.send({
          from:
            process.env.SENDER_EMAIL && process.env.SENDER_NAME
              ? `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`
              : 'Tender Track 360 <hello@contact.tendertrack360.co.za>',
          // MVP: All emails to info@tendertrack360.co.za
          to: toUser.email,
          subject: `Ownership Transfer Request for ${org.name}`,
          replyTo: process.env.REPLY_TO_EMAIL || 'info@tendertrack360.co.za',
          react: OwnershipTransferEmail({
            toEmail: toUser.email,
            fromUserName: fromUser.name || 'Current Owner',
            organizationName: org.name,
            acceptLink,
            expiresInHours: this.TRANSFER_EXPIRY_HOURS,
          }),
        });
        console.log(
          `Sent ownership transfer email to ${toUser.email} (routed to info@tendertrack360.co.za)`
        );
      }

      return {
        success: true,
        transferId,
      };
    } catch (error) {
      console.error('Error initiating ownership transfer:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to initiate ownership transfer',
      };
    }
  }

  async acceptOwnershipTransfer(
    transferId: string,
    acceptingUserId: string
  ): Promise<OwnershipTransferResult> {
    try {
      return await db.transaction(async (tx) => {
        // 1. Get Transfer Record
        const transfer = await tx.query.ownershipTransfer.findFirst({
          where: eq(ownershipTransfer.id, transferId),
        });

        if (!transfer) {
          return { success: false, error: 'Transfer request not found' };
        }

        if (transfer.status !== 'pending') {
          return {
            success: false,
            error: `Transfer request is ${transfer.status}`,
          };
        }

        if (transfer.expiresAt < new Date()) {
          // Mark as expired if needed, but for now just return error
          return { success: false, error: 'Transfer request has expired' };
        }

        if (transfer.toUserId !== acceptingUserId) {
          return {
            success: false,
            error: 'You are not the intended recipient of this transfer',
          };
        }

        const orgId = transfer.organizationId;

        // 2. Key: Perform Role Swaps
        // Note: Organization table does not have ownerId, so we rely on Member roles.

        // Update Old Owner Role to 'admin'
        await tx
          .update(member)
          .set({ role: 'admin' })
          .where(
            and(
              eq(member.organizationId, orgId),
              eq(member.userId, transfer.fromUserId)
            )
          );

        // Update New Owner Role to 'owner'
        await tx
          .update(member)
          .set({ role: 'owner' })
          .where(
            and(
              eq(member.organizationId, orgId),
              eq(member.userId, acceptingUserId)
            )
          );

        // 3. Mark Transfer as Accepted
        await tx
          .update(ownershipTransfer)
          .set({ status: 'accepted', acceptedAt: new Date() })
          .where(eq(ownershipTransfer.id, transferId));

        console.log(
          `Ownership transfer ${transferId} accepted. Org ${orgId} new owner ${acceptingUserId}`
        );

        return {
          success: true,
          transferId,
        };
      });
    } catch (error) {
      console.error('Error accepting ownership transfer:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to accept ownership transfer',
      };
    }
  }

  async cancelOwnershipTransfer(
    transferId: string,
    cancellingUserId: string
  ): Promise<OwnershipTransferResult> {
    try {
      const transfer = await db.query.ownershipTransfer.findFirst({
        where: eq(ownershipTransfer.id, transferId),
      });

      if (!transfer) {
        return { success: false, error: 'Transfer request not found' };
      }

      // Only fromUser (initiator) can cancel? Or maybe new owner too? Usually initiator or current owner.
      if (transfer.fromUserId !== cancellingUserId) {
        // Check if cancellingUserId is actually the CURRENT owner (edge case if ownership changed otherwise?)
        // But relying on fromUserId is safer for "My Pending Transfers" logic.
        return {
          success: false,
          error: 'Not authorized to cancel this transfer',
        };
      }

      if (transfer.status !== 'pending') {
        return {
          success: false,
          error: 'Cannot cancel a non-pending transfer',
        };
      }

      await db
        .update(ownershipTransfer)
        .set({ status: 'cancelled', cancelledAt: new Date() })
        .where(eq(ownershipTransfer.id, transferId));

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

  async getPendingTransfers(userId: string): Promise<PendingTransfer[]> {
    // TODO: Implement getting pending transfers
    console.log(`Getting pending transfers for user ${userId}`);
    return [];
  }

  async getTransferByToken(token: string): Promise<PendingTransfer | null> {
    // TODO: Implement getting transfer by token
    console.log(`Getting transfer by token: ${token}`);
    return null;
  }

  async getTransferHistory(organizationId: string): Promise<PendingTransfer[]> {
    // TODO: Implement getting transfer history
    console.log(`Getting transfer history for organization: ${organizationId}`);
    return [];
  }

  async expireOldTransfers(): Promise<void> {
    // TODO: Implement expiring old transfers
    console.log('Expiring old transfers');
  }

  private async sendTransferNotificationEmail(
    transferId: string
  ): Promise<void> {
    // TODO: Implement email notification
    console.log(`Sending transfer notification email for: ${transferId}`);
  }

  private async sendTransferCompletionEmails(
    transferId: string
  ): Promise<void> {
    // TODO: Implement completion emails
    console.log(`Sending transfer completion emails for: ${transferId}`);
  }

  private async sendTransferCancellationEmails(
    transferId: string
  ): Promise<void> {
    // TODO: Implement cancellation emails
    console.log(`Sending transfer cancellation emails for: ${transferId}`);
  }
}

export const ownershipTransferManager = new OwnershipTransferManager();
