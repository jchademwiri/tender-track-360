import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  numeric,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { clients } from './clients';
import { tenderCategories } from './categories';
import { tenders } from './tenders';

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenderId: uuid('tender_id').references(() => tenders.id),
  referenceNumber: varchar('reference_number', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  clientId: uuid('client_id')
    .references(() => clients.id)
    .notNull(),
  categoryId: uuid('category_id').references(() => tenderCategories.id),
  status: varchar('status', { length: 50 }).notNull(),
  awardDate: varchar('award_date'),
  estimatedValue: numeric('estimated_value', { precision: 15, scale: 2 }),
  department: varchar('department', { length: 100 }),
  notes: text('notes'),
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
});

export const projectRelations = relations(projects, ({ one }) => ({
  tender: one(tenders, {
    fields: [projects.tenderId],
    references: [tenders.id],
    relationName: 'project_tender',
  }),
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
    relationName: 'project_client',
  }),
  category: one(tenderCategories, {
    fields: [projects.categoryId],
    references: [tenderCategories.id],
    relationName: 'project_category',
  }),
  createdByUser: one(users, {
    fields: [projects.createdById],
    references: [users.id],
    relationName: 'project_created_by_user',
  }),
  updatedByUser: one(users, {
    fields: [projects.updatedById],
    references: [users.id],
    relationName: 'project_updated_by_user',
  }),
}));
