import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  date,
  numeric,
  boolean,
  index,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { tenderStatusEnum } from './enums';
import { users } from './users';
import { clients } from './clients';
import { tenderCategories } from './categories';
import { check } from 'drizzle-orm/gel-core';

export const tenders = pgTable(
  'tenders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    referenceNumber: varchar('reference_number', { length: 100 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    clientId: uuid('client_id')
      .references(() => clients.id)
      .notNull(),
    categoryId: uuid('category_id').references(() => tenderCategories.id, {
      onDelete: 'set null',
    }),
    status: tenderStatusEnum('status').notNull().default('open'),
    publicationDate: date('publication_date'),
    submissionDeadline: timestamp('submission_deadline', {
      withTimezone: true,
    }),
    evaluationDate: date('evaluation_date'),
    awardDate: date('award_date'),
    estimatedValue: numeric('estimated_value', { precision: 15, scale: 2 }),
    actualValue: numeric('actual_value', { precision: 15, scale: 2 }),
    isSuccessful: boolean('is_successful'),
    department: varchar('department', { length: 100 }),
    notes: text('notes'),
    encryptedNotes: text('encrypted_notes'),
    isDeleted: boolean('is_deleted').notNull().default(false),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    deletedById: uuid('deleted_by_id'),
    createdById: uuid('created_by_id')
      .references(() => users.id)
      .notNull(),
    updatedById: uuid('updated_by_id')
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    statusDeadlineIdx: index('idx_tenders_status_deadline').on(
      table.status,
      table.submissionDeadline
    ),
    clientIdx: index('idx_tenders_client').on(table.clientId),
    categoryIdx: index('idx_tenders_category').on(table.categoryId),
    createdByIdx: index('idx_tenders_created_by').on(table.createdById),
    deadlineAfterPublication: check(
      'chk_deadline_after_publication',
      sql`submission_deadline > publication_date::timestamp`
    ),
  })
);

export const tenderRelations = relations(tenders, ({ one }) => ({
  client: one(clients, {
    fields: [tenders.clientId],
    references: [clients.id],
    relationName: 'tender_client',
  }),
  category: one(tenderCategories, {
    fields: [tenders.categoryId],
    references: [tenderCategories.id],
    relationName: 'tender_category',
  }),
  createdByUser: one(users, {
    fields: [tenders.createdById],
    references: [users.id],
    relationName: 'tender_created_by_user',
  }),
  updatedByUser: one(users, {
    fields: [tenders.updatedById],
    references: [users.id],
    relationName: 'tender_updated_by_user',
  }),
}));
