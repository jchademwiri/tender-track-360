import {
  pgTable,
  uuid,
  text,
  varchar,
  boolean,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { userRoleEnum } from './enums';

// Import Better Auth tables (these will be auto-generated)
// We'll reference them by name since they're auto-generated
// export const user = pgTable("user", { ... }) - from Better Auth
// export const organization = pgTable("organization", { ... }) - from Better Auth

export const userProfiles = pgTable(
  'user_profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull().unique(), // References Better Auth user.id
    organizationId: text('organization_id').notNull(), // References Better Auth organization.id
    role: userRoleEnum('role').notNull().default('viewer'), // Business roles
    department: varchar('department', { length: 100 }),
    isActive: boolean('is_active').notNull().default(true),
    lastLogin: timestamp('last_login', { withTimezone: true }),
    onboardingCompleted: boolean('onboarding_completed')
      .notNull()
      .default(false),
    preferences: jsonb('preferences'), // User preferences as JSON
    isDeleted: boolean('is_deleted').notNull().default(false),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    deletedById: text('deleted_by_id'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    organizationIdx: index('idx_user_profiles_organization').on(
      table.organizationId
    ),
    userIdx: index('idx_user_profiles_user').on(table.userId),
    roleIdx: index('idx_user_profiles_role').on(table.role),
  })
);
