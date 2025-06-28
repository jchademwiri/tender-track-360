import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'tender_manager',
  'tender_specialist',
  'viewer',
]);

export const tenderStatusEnum = pgEnum('tender_status', [
  'open',
  'closed',
  'submitted',
  'evaluation',
  'awarded',
  'cancelled',
  'rejected',
]);

export const documentCategoryEnum = pgEnum('document_category', [
  'tender_notice',
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
