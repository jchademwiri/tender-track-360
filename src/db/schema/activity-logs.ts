import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  text,
  index,
} from 'drizzle-orm/pg-core';
import { tenders } from './tenders';

export const activityLogs = pgTable(
  'activity_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenderId: uuid('tender_id').references(() => tenders.id),
    userId: text('user_id').notNull(), // References Better Auth user.id
    action: varchar('action', { length: 100 }).notNull(),
    details: text('details'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    tenderIdx: index('idx_activity_logs_tender').on(
      table.tenderId,
      table.createdAt
    ),
    userIdx: index('idx_activity_logs_user').on(table.userId, table.createdAt),
    actionIdx: index('idx_activity_logs_action').on(table.action),
  })
);
