// src/db/schema.ts
import { relations, sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  boolean,
  date,
  integer,
  pgEnum,
  numeric,
  index,
  check,
} from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'tender_officer', 'viewer']);
export const tenderStatusEnum = pgEnum('tender_status', [
  'draft',
  'published',
  'in_progress',
  'submitted',
  'evaluation',
  'awarded',
  'rejected',
  'cancelled',
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

// Users Table (Extended from Supabase Auth)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull(), // Matches Supabase Auth user id
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }),
  role: userRoleEnum('role').notNull().default('viewer'),
  department: varchar('department', { length: 100 }),
  isActive: boolean('is_active').notNull().default(true),
  lastLogin: timestamp('last_login', { withTimezone: true }),
  profileImageUrl: varchar('profile_image_url', { length: 255 }),
  // Soft delete fields
  isDeleted: boolean('is_deleted').notNull().default(false),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  deletedById: uuid('deleted_by_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// User Preferences Table
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  emailNotifications: boolean('email_notifications').notNull().default(true),
  reminderDays: integer('reminder_days').notNull().default(7),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Tender Categories Table
export const tenderCategories = pgTable('tender_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Clients Table (Tender Issuers)
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  type: clientTypeEnum('type').notNull(),
  contactPerson: varchar('contact_person', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  address: text('address'),
  website: varchar('website', { length: 255 }),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  // Soft delete fields
  isDeleted: boolean('is_deleted').notNull().default(false),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  deletedById: uuid('deleted_by_id'),
  createdById: uuid('created_by_id').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Tenders Table
export const tenders = pgTable('tenders', {
  id: uuid('id').primaryKey().defaultRandom(),
  referenceNumber: varchar('reference_number', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  categoryId: uuid('category_id').references(() => tenderCategories.id),
  status: tenderStatusEnum('status').notNull().default('draft'),
  publicationDate: date('publication_date'),
  submissionDeadline: timestamp('submission_deadline', { withTimezone: true }),
  evaluationDate: date('evaluation_date'),
  awardDate: date('award_date'),
  estimatedValue: numeric('estimated_value', { precision: 15, scale: 2 }),
  actualValue: numeric('actual_value', { precision: 15, scale: 2 }),
  isSuccessful: boolean('is_successful'),
  department: varchar('department', { length: 100 }),
  notes: text('notes'),
  encryptedNotes: text('encrypted_notes'), // For sensitive information
  // Soft delete fields
  isDeleted: boolean('is_deleted').notNull().default(false),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  deletedById: uuid('deleted_by_id'),
  createdById: uuid('created_by_id').references(() => users.id).notNull(),
  updatedById: uuid('updated_by_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  // Indexes for performance
  statusDeadlineIdx: index('idx_tenders_status_deadline').on(table.status, table.submissionDeadline),
  clientIdx: index('idx_tenders_client').on(table.clientId),
  categoryIdx: index('idx_tenders_category').on(table.categoryId),
  createdByIdx: index('idx_tenders_created_by').on(table.createdById),
  // Business logic constraints
  deadlineAfterPublication: check('chk_deadline_after_publication', 
    sql`submission_deadline > publication_date::timestamp`),
}));

// Documents Table
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenderId: uuid('tender_id').references(() => tenders.id).notNull(),
  parentDocumentId: uuid('parent_document_id'), // For versioning chain - self-reference added later
  category: documentCategoryEnum('category').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size').notNull(), // Size in bytes
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  storageUrl: varchar('storage_url', { length: 255 }).notNull(),
  checksumHash: varchar('checksum_hash', { length: 64 }), // For integrity verification
  version: integer('version').notNull().default(1),
  isLatestVersion: boolean('is_latest_version').notNull().default(true),
  isArchived: boolean('is_archived').notNull().default(false),
  archiveReason: varchar('archive_reason', { length: 255 }),
  // Soft delete fields
  isDeleted: boolean('is_deleted').notNull().default(false),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  deletedById: uuid('deleted_by_id'),
  uploadedById: uuid('uploaded_by_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  // Indexes for performance
  tenderCategoryIdx: index('idx_documents_tender_category').on(table.tenderId, table.category),
  versionIdx: index('idx_documents_version').on(table.parentDocumentId, table.version),
  uploadedByIdx: index('idx_documents_uploaded_by').on(table.uploadedById),
}));

// Tasks Table
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenderId: uuid('tender_id').references(() => tenders.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  assignedToId: uuid('assigned_to_id').references(() => users.id),
  dueDate: timestamp('due_date', { withTimezone: true }),
  isCompleted: boolean('is_completed').notNull().default(false),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  priority: integer('priority').notNull().default(0), // 0=Low, 1=Medium, 2=High
  // Soft delete fields
  isDeleted: boolean('is_deleted').notNull().default(false),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  deletedById: uuid('deleted_by_id'),
  createdById: uuid('created_by_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  // Indexes for performance
  assignedDueIdx: index('idx_tasks_assigned_due').on(table.assignedToId, table.dueDate, table.isCompleted),
  tenderIdx: index('idx_tasks_tender').on(table.tenderId),
  statusIdx: index('idx_tasks_status').on(table.isCompleted, table.dueDate),
  // Business logic constraints
  completedTaskTimestamp: check('chk_completed_task_timestamp',
    sql`(is_completed = false) OR (is_completed = true AND completed_at IS NOT NULL)`),
}));

// Reminder Rules Table
export const reminderRules = pgTable('reminder_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  daysBefore: integer('days_before').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  messageTemplate: text('message_template').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Notifications Table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  relatedEntityId: uuid('related_entity_id'), // Could be tender_id, task_id, etc.
  isRead: boolean('is_read').notNull().default(false),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  // Indexes for performance
  userUnreadIdx: index('idx_notifications_user_unread').on(table.userId, table.isRead, table.createdAt),
  typeIdx: index('idx_notifications_type').on(table.type),
}));

// Activity Logs Table
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenderId: uuid('tender_id').references(() => tenders.id),
  userId: uuid('user_id').references(() => users.id).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  details: text('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  // Indexes for performance
  tenderIdx: index('idx_activity_logs_tender').on(table.tenderId, table.createdAt),
  userIdx: index('idx_activity_logs_user').on(table.userId, table.createdAt),
  actionIdx: index('idx_activity_logs_action').on(table.action),
}));

// Allowed Status Transitions Table (for state machine validation)
export const allowedStatusTransitions = pgTable('allowed_status_transitions', {
  id: uuid('id').primaryKey().defaultRandom(),
  fromStatus: tenderStatusEnum('from_status').notNull(),
  toStatus: tenderStatusEnum('to_status').notNull(),
  requiredRole: userRoleEnum('required_role'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  transitionIdx: index('idx_status_transitions').on(table.fromStatus, table.toStatus),
}));

// Custom Fields Table
export const customFields = pgTable('custom_fields', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  fieldType: varchar('field_type', { length: 50 }).notNull(), // text, number, date, boolean, etc.
  isRequired: boolean('is_required').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  // Soft delete fields
  isDeleted: boolean('is_deleted').notNull().default(false),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  deletedById: uuid('deleted_by_id').references(() => users.id),
  createdById: uuid('created_by_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Custom Field Values Table
export const customFieldValues = pgTable('custom_field_values', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenderId: uuid('tender_id').references(() => tenders.id).notNull(),
  customFieldId: uuid('custom_field_id').references(() => customFields.id).notNull(),
  value: text('value'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  tenderFieldIdx: index('idx_custom_field_values_tender_field').on(table.tenderId, table.customFieldId),
}));

// Team Members Table (Many-to-Many relationship between Users and Tenders)
export const tenderTeamMembers = pgTable('tender_team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenderId: uuid('tender_id').references(() => tenders.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: varchar('role', { length: 100 }).notNull(), // e.g., "Lead", "Technical Reviewer", "Financial Analyst"
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  tenderUserIdx: index('idx_tender_team_members_tender_user').on(table.tenderId, table.userId),
  userIdx: index('idx_tender_team_members_user').on(table.userId),
}));

// Add self-references after table definitions to avoid circular dependencies
// Note: These would be added as foreign key constraints in your migration files
// users.deletedById -> users.id
// documents.parentDocumentId -> documents.id  
// clients.deletedById -> users.id
// tenders.deletedById -> users.id
// tasks.deletedById -> users.id
// customFields.deletedById -> users.id

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  preferences: many(userPreferences),
  createdTenders: many(tenders, { relationName: 'created_tenders' }),
  updatedTenders: many(tenders, { relationName: 'updated_tenders' }),
  assignedTasks: many(tasks, { relationName: 'assigned_tasks' }),
  createdTasks: many(tasks, { relationName: 'created_tasks' }),
  uploadedDocuments: many(documents, { relationName: 'uploaded_documents' }),
  notifications: many(notifications),
  activityLogs: many(activityLogs),
  createdCustomFields: many(customFields),
  teamMemberships: many(tenderTeamMembers),
  createdClients: many(clients),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const tenderCategoriesRelations = relations(tenderCategories, ({ many }) => ({
  tenders: many(tenders),
}));

export const clientsRelations = relations(clients, ({ many, one }) => ({
  tenders: many(tenders),
  createdBy: one(users, {
    fields: [clients.createdById],
    references: [users.id],
  }),
}));

export const tendersRelations = relations(tenders, ({ many, one }) => ({
  client: one(clients, {
    fields: [tenders.clientId],
    references: [clients.id],
  }),
  category: one(tenderCategories, {
    fields: [tenders.categoryId],
    references: [tenderCategories.id],
  }),
  createdBy: one(users, {
    fields: [tenders.createdById],
    references: [users.id],
    relationName: 'created_tenders',
  }),
  updatedBy: one(users, {
    fields: [tenders.updatedById],
    references: [users.id],
    relationName: 'updated_tenders',
  }),
  documents: many(documents),
  tasks: many(tasks),
  activityLogs: many(activityLogs),
  customFieldValues: many(customFieldValues),
  teamMembers: many(tenderTeamMembers),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  tender: one(tenders, {
    fields: [documents.tenderId],
    references: [tenders.id],
  }),
  parentDocument: one(documents, {
    fields: [documents.parentDocumentId],
    references: [documents.id],
    relationName: 'document_versions',
  }),
  childDocuments: many(documents, { relationName: 'document_versions' }),
  uploadedBy: one(users, {
    fields: [documents.uploadedById],
    references: [users.id],
    relationName: 'uploaded_documents',
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  tender: one(tenders, {
    fields: [tasks.tenderId],
    references: [tenders.id],
  }),
  assignedTo: one(users, {
    fields: [tasks.assignedToId],
    references: [users.id],
    relationName: 'assigned_tasks',
  }),
  createdBy: one(users, {
    fields: [tasks.createdById],
    references: [users.id],
    relationName: 'created_tasks',
  }),
}));

export const reminderRulesRelations = relations(reminderRules, ({ }) => ({
  // Can be extended to link with specific tenders or users
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  tender: one(tenders, {
    fields: [activityLogs.tenderId],
    references: [tenders.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const allowedStatusTransitionsRelations = relations(allowedStatusTransitions, ({ }) => ({
  // Can be extended to link with audit logs
}));

export const customFieldsRelations = relations(customFields, ({ many, one }) => ({
  values: many(customFieldValues),
  createdBy: one(users, {
    fields: [customFields.createdById],
    references: [users.id],
  }),
}));

export const customFieldValuesRelations = relations(customFieldValues, ({ one }) => ({
  tender: one(tenders, {
    fields: [customFieldValues.tenderId],
    references: [tenders.id],
  }),
  customField: one(customFields, {
    fields: [customFieldValues.customFieldId],
    references: [customFields.id],
  }),
}));

export const tenderTeamMembersRelations = relations(tenderTeamMembers, ({ one }) => ({
  tender: one(tenders, {
    fields: [tenderTeamMembers.tenderId],
    references: [tenders.id],
  }),
  user: one(users, {
    fields: [tenderTeamMembers.userId],
    references: [users.id],
  }),
}));