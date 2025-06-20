import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  index,
  check,
} from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { tenders } from './tenders';
import { documents } from './documents';
import { sql } from 'drizzle-orm';

// Extension status enum
export const extensionStatusEnum = pgEnum('extension_status', [
  'received', // Extension received from client
  'in_progress', // Being processed by tender specialist
  'completed', // Completed and ready to send back
  'sent_to_client', // Sent back to client
  'acknowledged', // Client acknowledged receipt
  'expired', // Extension period has expired
]);

// Extension type enum
export const extensionTypeEnum = pgEnum('extension_type', [
  'evaluation', // Extension for evaluation period
  'award', // Extension for award period
  'both', // Extension for both evaluation and award
]);

export const tenderExtensions = pgTable(
  'tender_extensions',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Core relationships
    tenderId: uuid('tender_id')
      .references(() => tenders.id)
      .notNull(),
    extensionDocumentId: uuid('extension_document_id').references(
      () => documents.id
    ), // The extension form document

    // Extension details
    extensionNumber: varchar('extension_number', { length: 50 }).notNull(), // E.g., "EXT-001", "EXT-002"
    extensionType: extensionTypeEnum('extension_type').notNull(),
    status: extensionStatusEnum('status').notNull().default('received'),

    // Date tracking
    originalDeadline: timestamp('original_deadline', {
      withTimezone: true,
    }).notNull(), // Original closing/evaluation date
    currentDeadline: timestamp('current_deadline', {
      withTimezone: true,
    }).notNull(), // Current active deadline
    requestedNewDeadline: timestamp('requested_new_deadline', {
      withTimezone: true,
    }).notNull(), // New deadline requested
    actualNewDeadline: timestamp('actual_new_deadline', { withTimezone: true }), // Final agreed deadline

    // Extension period calculation
    extensionDays: integer('extension_days').notNull(), // Number of days extended
    cumulativeDays: integer('cumulative_days').notNull(), // Total days extended (including previous extensions)

    // Business details
    reason: text('reason').notNull(), // Client's reason for extension
    clientReference: varchar('client_reference', { length: 100 }), // Client's reference number
    urgencyLevel: varchar('urgency_level', { length: 20 }).default('normal'), // normal, high, critical

    // Internal processing
    internalNotes: text('internal_notes'), // Internal notes for processing
    processingNotes: text('processing_notes'), // Notes from tender specialist
    clientResponse: text('client_response'), // Any response from client

    // Workflow tracking
    receivedAt: timestamp('received_at', { withTimezone: true }).notNull(), // When extension was received
    processedAt: timestamp('processed_at', { withTimezone: true }), // When specialist completed it
    sentAt: timestamp('sent_at', { withTimezone: true }), // When sent back to client
    acknowledgedAt: timestamp('acknowledged_at', { withTimezone: true }), // When client acknowledged
    expiresAt: timestamp('expires_at', { withTimezone: true }), // When this extension expires

    // User tracking
    receivedById: uuid('received_by_id')
      .references(() => users.id)
      .notNull(), // Who logged the extension
    processedById: uuid('processed_by_id').references(() => users.id), // Tender specialist who processed
    sentById: uuid('sent_by_id').references(() => users.id), // Who sent it back

    // Soft delete
    isDeleted: boolean('is_deleted').notNull().default(false),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    deletedById: uuid('deleted_by_id').references(() => users.id),

    // Audit
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // Indexes
    tenderStatusIdx: index('idx_extensions_tender_status').on(
      table.tenderId,
      table.status
    ),
    deadlineIdx: index('idx_extensions_deadline').on(
      table.currentDeadline,
      table.status
    ),
    processedByIdx: index('idx_extensions_processed_by').on(
      table.processedById
    ),
    receivedDateIdx: index('idx_extensions_received_date').on(table.receivedAt),

    // Constraints
    validDeadlineProgression: check(
      'chk_valid_deadline_progression',
      sql`requested_new_deadline > current_deadline`
    ),
    validExtensionDays: check(
      'chk_valid_extension_days',
      sql`extension_days > 0 AND extension_days <= 365`
    ), // Max 1 year extension
    validCumulativeDays: check(
      'chk_valid_cumulative_days',
      sql`cumulative_days >= extension_days`
    ),
    processedAfterReceived: check(
      'chk_processed_after_received',
      sql`processed_at IS NULL OR processed_at >= received_at`
    ),
    sentAfterProcessed: check(
      'chk_sent_after_processed',
      sql`sent_at IS NULL OR (processed_at IS NOT NULL AND sent_at >= processed_at)`
    ),
  })
);

// Extension history for tracking all changes
export const extensionHistory = pgTable(
  'extension_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    extensionId: uuid('extension_id')
      .references(() => tenderExtensions.id)
      .notNull(),
    previousStatus: extensionStatusEnum('previous_status'),
    newStatus: extensionStatusEnum('new_status').notNull(),
    changedById: uuid('changed_by_id')
      .references(() => users.id)
      .notNull(),
    changeReason: text('change_reason'),
    changedAt: timestamp('changed_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    extensionTimeIdx: index('idx_extension_history_time').on(
      table.extensionId,
      table.changedAt
    ),
  })
);

// Extension reminders
export const extensionReminders = pgTable(
  'extension_reminders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    extensionId: uuid('extension_id')
      .references(() => tenderExtensions.id)
      .notNull(),
    reminderType: varchar('reminder_type', { length: 50 }).notNull(), // 'deadline_approaching', 'overdue', 'follow_up'
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }).notNull(),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    scheduledIdx: index('idx_extension_reminders_scheduled').on(
      table.scheduledFor,
      table.isActive
    ),
  })
);
