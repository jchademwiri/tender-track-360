import { db } from '@/db';
import {
  organization,
  tender,
  contract,
  followUp,
  member,
  organizationDeletionLog,
} from '@/db/schema';
import { eq, and, isNull, count } from 'drizzle-orm';
import { auditLogger } from './audit-logger';

export interface DeletionConfirmation {
  organizationName: string;
  confirmationPhrase: string;
  dataExportRequested: boolean;
  exportFormat?: 'json' | 'csv';
  deletionType: 'soft' | 'permanent';
  reason?: string;
}

export interface DeletionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  relatedDataCount: {
    tenders: number;
    contracts: number;
    members: number;
    followUps: number;
  };
}

export interface OrganizationDeletionResult {
  success: boolean;
  deletionId?: string;
  deletionType: 'soft' | 'permanent';
  exportUrl?: string;
  permanentDeletionScheduledAt?: Date;
  affectedRecords: {
    tenders: number;
    contracts: number;
    members: number;
    followUps: number;
  };
  error?: string;
}

export interface SoftDeletedOrganization {
  id: string;
  name: string;
  deletedAt: Date;
  deletedBy: string;
  deletionReason?: string;
  permanentDeletionScheduledAt: Date;
  daysUntilPermanentDeletion: number;
  canRestore: boolean;
  canPermanentlyDelete: boolean;
  relatedDataCount: {
    tenders: number;
    contracts: number;
    members: number;
    followUps: number;
  };
}

class OrganizationDeletionManager {
  private readonly CONFIRMATION_PHRASE = 'DELETE ORGANIZATION';
  private readonly DEFAULT_SOFT_DELETE_GRACE_PERIOD_DAYS = 30;

  async validateDeletionRequest(
    organizationId: string,
    confirmation: DeletionConfirmation,
    userRole: string
  ): Promise<DeletionValidationResult> {
    const result: DeletionValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      relatedDataCount: {
        tenders: 0,
        contracts: 0,
        members: 0,
        followUps: 0,
      },
    };

    try {
      // Get organization details
      const org = await db.query.organization.findFirst({
        where: and(
          eq(organization.id, organizationId),
          isNull(organization.deletedAt) // Not already soft deleted
        ),
      });

      if (!org) {
        result.errors.push('Organization not found or already deleted');
        result.isValid = false;
        return result;
      }

      // Validate user permissions
      if (userRole !== 'owner') {
        result.errors.push('Only organization owners can delete organizations');
        result.isValid = false;
      }

      // Validate organization name confirmation
      if (confirmation.organizationName.trim() !== org.name.trim()) {
        result.errors.push('Organization name confirmation does not match');
        result.isValid = false;
      }

      // Validate confirmation phrase
      if (confirmation.confirmationPhrase.trim() !== this.CONFIRMATION_PHRASE) {
        result.errors.push(
          `You must type "${this.CONFIRMATION_PHRASE}" to confirm deletion`
        );
        result.isValid = false;
      }

      // Count related data
      const [tenderCount, contractCount, memberCount, followUpCount] =
        await Promise.all([
          db
            .select({ count: count() })
            .from(tender)
            .where(
              and(
                eq(tender.organizationId, organizationId),
                isNull(tender.deletedAt)
              )
            ),
          db
            .select({ count: count() })
            .from(contract)
            .where(
              and(
                eq(contract.tenderId, tender.id),
                eq(tender.organizationId, organizationId),
                isNull(contract.deletedAt),
                isNull(tender.deletedAt)
              )
            ),
          db
            .select({ count: count() })
            .from(member)
            .where(eq(member.organizationId, organizationId)),
          db
            .select({ count: count() })
            .from(followUp)
            .where(
              and(
                eq(followUp.tenderId, tender.id),
                eq(tender.organizationId, organizationId),
                isNull(followUp.deletedAt),
                isNull(tender.deletedAt)
              )
            ),
        ]);

      result.relatedDataCount = {
        tenders: tenderCount[0]?.count || 0,
        contracts: contractCount[0]?.count || 0,
        members: memberCount[0]?.count || 0,
        followUps: followUpCount[0]?.count || 0,
      };

      // Add warnings for data that will be affected
      if (result.relatedDataCount.tenders > 0) {
        result.warnings.push(
          `${result.relatedDataCount.tenders} tender(s) will be affected`
        );
      }
      if (result.relatedDataCount.contracts > 0) {
        result.warnings.push(
          `${result.relatedDataCount.contracts} contract(s) will be affected`
        );
      }
      if (result.relatedDataCount.members > 1) {
        // Exclude the owner
        result.warnings.push(
          `${result.relatedDataCount.members - 1} member(s) will lose access`
        );
      }

      // Validate permanent deletion requirements
      if (confirmation.deletionType === 'permanent') {
        result.warnings.push('Permanent deletion cannot be undone');
        result.warnings.push(
          'All organization data will be permanently removed'
        );
      } else {
        result.warnings.push(
          `Organization will be soft deleted and can be restored within ${this.DEFAULT_SOFT_DELETE_GRACE_PERIOD_DAYS} days`
        );
      }
    } catch (error) {
      console.error('Error validating deletion request:', error);
      result.errors.push('Failed to validate deletion request');
      result.isValid = false;
    }

    return result;
  }

  async generateDeletionToken(): Promise<string> {
    return crypto.randomUUID();
  }

  async exportOrganizationData(
    organizationId: string,
    format: 'json' | 'csv',
    userId: string
  ): Promise<string | null> {
    try {
      // Get all organization data
      const orgData = await db.query.organization.findFirst({
        where: eq(organization.id, organizationId),
        with: {
          members: {
            with: {
              user: true,
            },
          },
        },
      });

      if (!orgData) {
        return null;
      }

      // Get related data
      const [tenders, contracts, followUps] = await Promise.all([
        db.query.tender.findMany({
          where: and(
            eq(tender.organizationId, organizationId),
            isNull(tender.deletedAt)
          ),
        }),
        db.query.contract.findMany({
          where: and(
            eq(contract.tenderId, tender.id),
            eq(tender.organizationId, organizationId),
            isNull(contract.deletedAt)
          ),
        }),
        db.query.followUp.findMany({
          where: and(
            eq(followUp.tenderId, tender.id),
            eq(tender.organizationId, organizationId),
            isNull(followUp.deletedAt)
          ),
        }),
      ]);

      const exportData = {
        organization: orgData,
        tenders,
        contracts,
        followUps,
        exportedAt: new Date().toISOString(),
        exportedBy: userId,
      };

      // In a real implementation, you would:
      // 1. Convert to the requested format (JSON/CSV)
      // 2. Store the file in a secure location (S3, etc.)
      // 3. Return a download URL
      // For now, we'll simulate this by returning a mock URL
      const exportUrl = `https://exports.example.com/${organizationId}-${Date.now()}.${format}`;

      // Log the export
      await auditLogger.logDataExported(organizationId, userId, {
        format,
        recordCount: {
          tenders: tenders.length,
          contracts: contracts.length,
          followUps: followUps.length,
          members: orgData.members.length,
        },
      });

      return exportUrl;
    } catch (error) {
      console.error('Error exporting organization data:', error);
      return null;
    }
  }

  async softDeleteOrganization(
    organizationId: string,
    userId: string,
    confirmation: DeletionConfirmation
  ): Promise<OrganizationDeletionResult> {
    try {
      const deletionToken = await this.generateDeletionToken();
      const now = new Date();
      const permanentDeletionDate = new Date(
        now.getTime() +
          this.DEFAULT_SOFT_DELETE_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000
      );

      // Get organization data before deletion
      const org = await db.query.organization.findFirst({
        where: eq(organization.id, organizationId),
      });

      if (!org) {
        return {
          success: false,
          deletionType: 'soft',
          affectedRecords: {
            tenders: 0,
            contracts: 0,
            members: 0,
            followUps: 0,
          },
          error: 'Organization not found',
        };
      }

      // Count affected records
      const validation = await this.validateDeletionRequest(
        organizationId,
        confirmation,
        'owner'
      );

      // Export data if requested
      let exportUrl: string | undefined;
      if (confirmation.dataExportRequested && confirmation.exportFormat) {
        exportUrl =
          (await this.exportOrganizationData(
            organizationId,
            confirmation.exportFormat,
            userId
          )) || undefined;
      }

      // Soft delete the organization
      await db
        .update(organization)
        .set({
          deletedAt: now,
          deletedBy: userId,
          deletionReason: confirmation.reason,
          permanentDeletionScheduledAt: permanentDeletionDate,
        })
        .where(eq(organization.id, organizationId));

      // Soft delete related data
      await Promise.all([
        // Soft delete tenders
        db
          .update(tender)
          .set({
            deletedAt: now,
            deletedBy: userId,
          })
          .where(
            and(
              eq(tender.organizationId, organizationId),
              isNull(tender.deletedAt)
            )
          ),

        // Soft delete contracts
        db
          .update(contract)
          .set({
            deletedAt: now,
            deletedBy: userId,
          })
          .where(
            and(
              eq(contract.tenderId, tender.id),
              eq(tender.organizationId, organizationId),
              isNull(contract.deletedAt)
            )
          ),

        // Soft delete follow-ups
        db
          .update(followUp)
          .set({
            deletedAt: now,
            deletedBy: userId,
          })
          .where(
            and(
              eq(followUp.tenderId, tender.id),
              eq(tender.organizationId, organizationId),
              isNull(followUp.deletedAt)
            )
          ),
      ]);

      // Create deletion log entry
      const deletionLogId = crypto.randomUUID();
      await db.insert(organizationDeletionLog).values({
        id: deletionLogId,
        organizationId,
        organizationName: org.name,
        deletedBy: userId,
        deletionReason: confirmation.reason,
        deletionType: 'soft',
        dataExported: confirmation.dataExportRequested,
        exportFormat: confirmation.exportFormat,
        confirmationToken: deletionToken,
        relatedDataCount: JSON.stringify(validation.relatedDataCount),
        softDeletedAt: now,
        permanentDeletionScheduledAt: permanentDeletionDate,
      });

      // Log the soft deletion
      await auditLogger.logOrganizationSoftDeleted(organizationId, userId, {
        organizationName: org.name,
        reason: confirmation.reason,
        dataExported: confirmation.dataExportRequested,
        permanentDeletionScheduledAt: permanentDeletionDate.toISOString(),
        affectedRecords: validation.relatedDataCount,
      });

      return {
        success: true,
        deletionId: deletionLogId,
        deletionType: 'soft',
        exportUrl,
        permanentDeletionScheduledAt: permanentDeletionDate,
        affectedRecords: validation.relatedDataCount,
      };
    } catch (error) {
      console.error('Error soft deleting organization:', error);
      return {
        success: false,
        deletionType: 'soft',
        affectedRecords: { tenders: 0, contracts: 0, members: 0, followUps: 0 },
        error: 'Failed to delete organization',
      };
    }
  }

  async getSoftDeletedOrganizations(
    userId: string
  ): Promise<SoftDeletedOrganization[]> {
    try {
      // Get organizations where user was a member and are soft deleted
      const softDeleted = await db
        .select({
          org: organization,
          member: member,
        })
        .from(organization)
        .innerJoin(member, eq(member.organizationId, organization.id))
        .where(
          and(
            eq(member.userId, userId),
            eq(member.role, 'owner'), // Only owners can see/restore
            isNull(organization.deletedAt) === false // Is soft deleted
          )
        );

      const results: SoftDeletedOrganization[] = [];

      for (const { org } of softDeleted) {
        if (!org.deletedAt || !org.permanentDeletionScheduledAt) continue;

        const now = new Date();
        const daysUntilPermanentDeletion = Math.ceil(
          (org.permanentDeletionScheduledAt.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        // Count related data
        const validation = await this.validateDeletionRequest(
          org.id,
          {
            organizationName: org.name,
            confirmationPhrase: this.CONFIRMATION_PHRASE,
            dataExportRequested: false,
            deletionType: 'soft',
          },
          'owner'
        );

        results.push({
          id: org.id,
          name: org.name,
          deletedAt: org.deletedAt,
          deletedBy: org.deletedBy || 'unknown',
          deletionReason: org.deletionReason || undefined,
          permanentDeletionScheduledAt: org.permanentDeletionScheduledAt,
          daysUntilPermanentDeletion: Math.max(0, daysUntilPermanentDeletion),
          canRestore: daysUntilPermanentDeletion > 0,
          canPermanentlyDelete: true, // Owners can always force permanent deletion
          relatedDataCount: validation.relatedDataCount,
        });
      }

      return results;
    } catch (error) {
      console.error('Error getting soft deleted organizations:', error);
      return [];
    }
  }
}

export const organizationDeletionManager = new OrganizationDeletionManager();

  async restoreOrganization(
    organizationId: string,
    userId: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify organization is soft deleted and can be restored
      const org = await db.query.organization.findFirst({
        where: and(
          eq(organization.id, organizationId),
          isNull(organization.deletedAt) === false // Is soft deleted
        ),
      });

      if (!org) {
        return { success: false, error: 'Organization not found or not deleted' };
      }

      if (!org.permanentDeletionScheduledAt) {
        return { success: false, error: 'Organization cannot be restored' };
      }

      // Check if still within grace period
      const now = new Date();
      if (now > org.permanentDeletionScheduledAt) {
        return { success: false, error: 'Restoration period has expired' };
      }

      // Restore the organization
      await db
        .update(organization)
        .set({
          deletedAt: null,
          deletedBy: null,
          deletionReason: null,
          permanentDeletionScheduledAt: null,
        })
        .where(eq(organization.id, organizationId));

      // Restore related data
      await Promise.all([
        // Restore tenders
        db
          .update(tender)
          .set({
            deletedAt: null,
            deletedBy: null,
          })
          .where(and(
            eq(tender.organizationId, organizationId),
            isNull(tender.deletedAt) === false
          )),
        
        // Restore contracts
        db
          .update(contract)
          .set({
            deletedAt: null,
            deletedBy: null,
          })
          .where(and(
            eq(contract.tenderId, tender.id),
            eq(tender.organizationId, organizationId),
            isNull(contract.deletedAt) === false
          )),
        
        // Restore follow-ups
        db
          .update(followUp)
          .set({
            deletedAt: null,
            deletedBy: null,
          })
          .where(and(
            eq(followUp.tenderId, tender.id),
            eq(tender.organizationId, organizationId),
            isNull(followUp.deletedAt) === false
          )),
      ]);

      // Update deletion log
      await db
        .update(organizationDeletionLog)
        .set({
          restoredAt: now,
          restoredBy: userId,
          metadata: JSON.stringify({ restorationReason: reason }),
        })
        .where(eq(organizationDeletionLog.organizationId, organizationId));

      // Log the restoration
      await auditLogger.logOrganizationRestored(organizationId, userId, {
        organizationName: org.name,
        reason,
        restoredAt: now.toISOString(),
      });

      return { success: true };

    } catch (error) {
      console.error('Error restoring organization:', error);
      return { success: false, error: 'Failed to restore organization' };
    }
  }

  async scheduleAutomaticPermanentDeletion(): Promise<void> {
    try {
      // Find organizations that are past their permanent deletion date
      const now = new Date();
      const expiredOrganizations = await db.query.organization.findMany({
        where: and(
          isNull(organization.deletedAt) === false, // Is soft deleted
          isNull(organization.permanentDeletionScheduledAt) === false, // Has scheduled deletion
          // permanentDeletionScheduledAt is in the past
        ),
      });

      for (const org of expiredOrganizations) {
        if (org.permanentDeletionScheduledAt && now > org.permanentDeletionScheduledAt) {
          await this.permanentlyDeleteOrganization(org.id, 'system', 'Automatic deletion after grace period');
        }
      }
    } catch (error) {
      console.error('Error in automatic permanent deletion:', error);
    }
  }

  async getOrganizationDeletionStatus(organizationId: string): Promise<{
    isDeleted: boolean;
    deletionType?: 'soft' | 'permanent';
    deletedAt?: Date;
    permanentDeletionScheduledAt?: Date;
    canRestore: boolean;
    daysUntilPermanentDeletion?: number;
  }> {
    try {
      const org = await db.query.organization.findFirst({
        where: eq(organization.id, organizationId),
      });

      if (!org) {
        return { isDeleted: false, canRestore: false };
      }

      if (!org.deletedAt) {
        return { isDeleted: false, canRestore: false };
      }

      const now = new Date();
      let canRestore = false;
      let daysUntilPermanentDeletion: number | undefined;

      if (org.permanentDeletionScheduledAt) {
        daysUntilPermanentDeletion = Math.ceil(
          (org.permanentDeletionScheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        canRestore = daysUntilPermanentDeletion > 0;
      }

      return {
        isDeleted: true,
        deletionType: org.permanentDeletionScheduledAt ? 'soft' : 'permanent',
        deletedAt: org.deletedAt,
        permanentDeletionScheduledAt: org.permanentDeletionScheduledAt || undefined,
        canRestore,
        daysUntilPermanentDeletion: daysUntilPermanentDeletion && daysUntilPermanentDeletion > 0 
          ? daysUntilPermanentDeletion 
          : undefined,
      };
    } catch (error) {
      console.error('Error getting organization deletion status:', error);
      return { isDeleted: false, canRestore: false };
    }
  }
}  asy
nc permanentlyDeleteOrganization(
    organizationId: string,
    userId: string,
    reason?: string
  ): Promise<OrganizationDeletionResult> {
    try {
      // Get organization data before permanent deletion
      const org = await db.query.organization.findFirst({
        where: eq(organization.id, organizationId),
      });

      if (!org) {
        return {
          success: false,
          deletionType: 'permanent',
          affectedRecords: { tenders: 0, contracts: 0, members: 0, followUps: 0 },
          error: 'Organization not found',
        };
      }

      // Count affected records before deletion
      const [tenderCount, contractCount, memberCount, followUpCount] = await Promise.all([
        db.select({ count: count() }).from(tender).where(eq(tender.organizationId, organizationId)),
        db.select({ count: count() }).from(contract).where(
          and(
            eq(contract.tenderId, tender.id),
            eq(tender.organizationId, organizationId)
          )
        ),
        db.select({ count: count() }).from(member).where(eq(member.organizationId, organizationId)),
        db.select({ count: count() }).from(followUp).where(
          and(
            eq(followUp.tenderId, tender.id),
            eq(tender.organizationId, organizationId)
          )
        ),
      ]);

      const affectedRecords = {
        tenders: tenderCount[0]?.count || 0,
        contracts: contractCount[0]?.count || 0,
        members: memberCount[0]?.count || 0,
        followUps: followUpCount[0]?.count || 0,
      };

      // Permanently delete all related data (cascade delete will handle most of this)
      // But we'll be explicit for audit purposes
      await Promise.all([
        // Delete follow-ups first (they reference tenders)
        db.delete(followUp).where(
          and(
            eq(followUp.tenderId, tender.id),
            eq(tender.organizationId, organizationId)
          )
        ),
        
        // Delete contracts (they reference tenders)
        db.delete(contract).where(
          and(
            eq(contract.tenderId, tender.id),
            eq(tender.organizationId, organizationId)
          )
        ),
        
        // Delete tenders
        db.delete(tender).where(eq(tender.organizationId, organizationId)),
        
        // Delete members
        db.delete(member).where(eq(member.organizationId, organizationId)),
      ]);

      // Update deletion log to mark as permanently deleted
      const now = new Date();
      await db
        .update(organizationDeletionLog)
        .set({
          deletionType: 'permanent',
          permanentDeletedAt: now,
          metadata: JSON.stringify({ 
            permanentDeletionReason: reason,
            deletedBy: userId,
            affectedRecords,
          }),
        })
        .where(eq(organizationDeletionLog.organizationId, organizationId));

      // Finally, delete the organization itself
      await db.delete(organization).where(eq(organization.id, organizationId));

      // Log the permanent deletion
      await auditLogger.logOrganizationPermanentlyDeleted(organizationId, userId, {
        organizationName: org.name,
        reason,
        affectedRecords,
        permanentlyDeletedAt: now.toISOString(),
      });

      return {
        success: true,
        deletionType: 'permanent',
        affectedRecords,
      };

    } catch (error) {
      console.error('Error permanently deleting organization:', error);
      return {
        success: false,
        deletionType: 'permanent',
        affectedRecords: { tenders: 0, contracts: 0, members: 0, followUps: 0 },
        error: 'Failed to permanently delete organization',
      };
    }
  }

  async sanitizeDeletedData(organizationId: string): Promise<void> {
    try {
      // This method would implement secure data sanitization
      // In a production environment, this might involve:
      // 1. Overwriting sensitive data multiple times
      // 2. Clearing database logs and backups
      // 3. Notifying external services to purge data
      // 4. Generating compliance reports
      
      console.log(`Sanitizing data for organization ${organizationId}`);
      
      // For now, we'll just log the sanitization
      // In production, implement proper data sanitization according to security requirements
      
    } catch (error) {
      console.error('Error sanitizing deleted data:', error);
    }
  }

  async cleanupExpiredSoftDeletions(): Promise<{
    processed: number;
    errors: string[];
  }> {
    const result = {
      processed: 0,
      errors: [] as string[],
    };

    try {
      const now = new Date();
      
      // Find organizations that are past their permanent deletion date
      const expiredOrganizations = await db.query.organization.findMany({
        where: and(
          isNull(organization.deletedAt) === false, // Is soft deleted
          isNull(organization.permanentDeletionScheduledAt) === false // Has scheduled deletion
        ),
      });

      for (const org of expiredOrganizations) {
        if (org.permanentDeletionScheduledAt && now > org.permanentDeletionScheduledAt) {
          try {
            const deletionResult = await this.permanentlyDeleteOrganization(
              org.id, 
              'system', 
              'Automatic deletion after grace period expired'
            );
            
            if (deletionResult.success) {
              result.processed++;
              await this.sanitizeDeletedData(org.id);
            } else {
              result.errors.push(`Failed to delete ${org.name}: ${deletionResult.error}`);
            }
          } catch (error) {
            result.errors.push(`Error deleting ${org.name}: ${error}`);
          }
        }
      }

    } catch (error) {
      console.error('Error in cleanup expired soft deletions:', error);
      result.errors.push(`Cleanup process error: ${error}`);
    }

    return result;
  }

  async forcePermanentDeletion(
    organizationId: string,
    userId: string,
    userRole: string,
    reason: string
  ): Promise<OrganizationDeletionResult> {
    // Only owners can force permanent deletion
    if (userRole !== 'owner') {
      return {
        success: false,
        deletionType: 'permanent',
        affectedRecords: { tenders: 0, contracts: 0, members: 0, followUps: 0 },
        error: 'Only organization owners can force permanent deletion',
      };
    }

    // Log the forced deletion attempt
    await auditLogger.log({
      organizationId,
      userId,
      action: 'organization_permanently_deleted',
      resourceType: 'organization',
      resourceId: organizationId,
      details: {
        forced: true,
        reason,
        timestamp: new Date().toISOString(),
      },
      severity: 'critical',
    });

    return await this.permanentlyDeleteOrganization(organizationId, userId, reason);
  }
}