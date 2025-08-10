import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'tender_manager',
  'tender_specialist',
  'viewer',
]);

export const tenderStatusEnum = pgEnum('tender_status', [
  'in_progress',
  'submitted',
  'awarded',
  'rejected',
  'cancelled',
]);

export const documentCategoryEnum = pgEnum('document_category', [
  'tender_notice',
  'tender_document',
  'technical_specifications',
  'financial_proposal',
  'legal_documents',
  'correspondence',
  'other',
]);

export const notificationTypeEnum = pgEnum('notification_type', [
  'deadline',
  'status_change',
  'task_assignment',
  'document_update',
  'custom',
]);

export const clientTypeEnum = pgEnum('client_type', [
  'government',
  'parastatal',
  'private',
  'ngo',
  'international',
  'other',
]);
