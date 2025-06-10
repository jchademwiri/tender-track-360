// src/db/schema.ts
import { relations } from 'drizzle-orm';
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
  createdById: uuid('created_by_id').references(() => users.id).notNull(),
  updatedById: uuid('updated_by_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Documents Table
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenderId: uuid('tender_id').references(() => tenders.id).notNull(),
  category: documentCategoryEnum('category').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size').notNull(), // Size in bytes
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  storageUrl: varchar('storage_url', { length: 255 }).notNull(),
  version: integer('version').notNull().default(1),
  isLatestVersion: boolean('is_latest_version').notNull().default(true),
  uploadedById: uuid('uploaded_by_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

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
  createdById: uuid('created_by_id').references(() => users.id).notNull(),
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
});

// Activity Logs Table
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenderId: uuid('tender_id').references(() => tenders.id),
  userId: uuid('user_id').references(() => users.id).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  details: text('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Custom Fields Table
export const customFields = pgTable('custom_fields', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  fieldType: varchar('field_type', { length: 50 }).notNull(), // text, number, date, boolean, etc.
  isRequired: boolean('is_required').notNull().default(false),
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
});

// Team Members Table (Many-to-Many relationship between Users and Tenders)
export const tenderTeamMembers = pgTable('tender_team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenderId: uuid('tender_id').references(() => tenders.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: varchar('role', { length: 100 }).notNull(), // e.g., "Lead", "Technical Reviewer", "Financial Analyst"
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
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

export const documentsRelations = relations(documents, ({ one }) => ({
  tender: one(tenders, {
    fields: [documents.tenderId],
    references: [tenders.id],
  }),
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
