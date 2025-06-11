import { pgTable, uuid, varchar, text, timestamp, boolean, integer, index, check, } from 'drizzle-orm/pg-core';
import { users } from './users';
import { tenders } from './tenders';
import { sql } from 'drizzle-orm';

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenderId: uuid('tender_id').references(() => tenders.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  assignedToId: uuid('assigned_to_id').references(() => users.id),
  dueDate: timestamp('due_date', { withTimezone: true }),
  isCompleted: boolean('is_completed').notNull().default(false),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  priority: integer('priority').notNull().default(0),
  isDeleted: boolean('is_deleted').notNull().default(false),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  deletedById: uuid('deleted_by_id'),
  createdById: uuid('created_by_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  assignedDueIdx: index('idx_tasks_assigned_due').on(table.assignedToId, table.dueDate, table.isCompleted),
  tenderIdx: index('idx_tasks_tender').on(table.tenderId),
  statusIdx: index('idx_tasks_status').on(table.isCompleted, table.dueDate),
  completedTaskTimestamp: check('chk_completed_task_timestamp',
    sql`(is_completed = false) OR (is_completed = true AND completed_at IS NOT NULL)`),
}));
