// This file is kept for backward compatibility and user preferences
// Better Auth will auto-generate the main user table
// We use userProfiles for business-specific user data

import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  integer,
  text,
} from 'drizzle-orm/pg-core';

export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // References Better Auth user.id
  emailNotifications: boolean('email_notifications').notNull().default(true),
  reminderDays: integer('reminder_days').notNull().default(7),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
