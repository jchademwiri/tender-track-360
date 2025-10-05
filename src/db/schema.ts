import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

/* =========================
   AUTH & ORG TABLES
========================= */
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .notNull(),
});

export type User = typeof user.$inferSelect;

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  activeOrganizationId: text('active_organization_id'),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
});

/* =========================
   ORGANISATIONS
========================= */

export const organization = pgTable('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  logo: text('logo'),
  createdAt: timestamp('created_at').notNull(),
  metadata: text('metadata'),
  // Soft deletion fields
  deletedAt: timestamp('deleted_at'),
  deletedBy: text('deleted_by').references(() => user.id),
  deletionReason: text('deletion_reason'),
  permanentDeletionScheduledAt: timestamp('permanent_deletion_scheduled_at'),
});

export const role = pgEnum('role', ['owner', 'admin', 'manager', 'member']);
export type Role = (typeof role.enumValues)[number];

export const member = pgTable('member', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  role: role('role').default('member').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

export type Member = typeof member.$inferSelect & {
  user: typeof user.$inferSelect;
};

// Backwards-compatible type aliases for tests and older imports
export type Organization = typeof organization.$inferSelect;
export type MemberWithUser = Member;

export const invitation = pgTable('invitation', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: role('role'),
  status: text('status').default('pending').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: text('inviter_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

/* =========================
   NOTIFICATION PREFERENCES
========================= */
export const notificationPreferences = pgTable('notification_preferences', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  emailNotifications: boolean('email_notifications').default(true).notNull(),
  pushNotifications: boolean('push_notifications').default(true).notNull(),
  smsNotifications: boolean('sms_notifications').default(false).notNull(),
  tenderReminders: boolean('tender_reminders').default(true).notNull(),
  projectUpdates: boolean('project_updates').default(true).notNull(),
  calendarReminders: boolean('calendar_reminders').default(true).notNull(),
  systemAlerts: boolean('system_alerts').default(true).notNull(),
  marketingEmails: boolean('marketing_emails').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/* =========================
   OWNERSHIP TRANSFER
========================= */
export const ownershipTransfer = pgTable('ownership_transfer', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  fromUserId: text('from_user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  toUserId: text('to_user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  status: text('status').default('pending').notNull(), // pending, accepted, cancelled, expired
  transferToken: text('transfer_token').unique().notNull(),
  reason: text('reason'),
  transferMessage: text('transfer_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  acceptedAt: timestamp('accepted_at'),
  cancelledAt: timestamp('cancelled_at'),
});

/* =========================
   SECURITY AUDIT LOG
========================= */
export const securityAuditLog = pgTable('security_audit_log', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  resourceType: text('resource_type').notNull(),
  resourceId: text('resource_id'),
  details: text('details'), // JSON string
  severity: text('severity').default('info').notNull(), // info, warning, critical
  sessionId: text('session_id'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/* =========================
   SESSION TRACKING
========================= */
export const sessionTracking = pgTable('session_tracking', {
  id: text('id').primaryKey(),
  sessionId: text('session_id')
    .notNull()
    .references(() => session.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').references(() => organization.id, {
    onDelete: 'cascade',
  }),
  loginTime: timestamp('login_time').defaultNow().notNull(),
  lastActivity: timestamp('last_activity').defaultNow().notNull(),
  logoutTime: timestamp('logout_time'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  deviceInfo: text('device_info'), // JSON string
  locationInfo: text('location_info'), // JSON string
  isSuspicious: boolean('is_suspicious').default(false).notNull(),
});

/* =========================
   RELATIONS
   ⚠️ Moved here AFTER all tables are defined
========================= */
export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

export type NotificationPreferences =
  typeof notificationPreferences.$inferSelect;

export type OwnershipTransfer = typeof ownershipTransfer.$inferSelect;
export type SecurityAuditLog = typeof securityAuditLog.$inferSelect;
export type SessionTracking = typeof sessionTracking.$inferSelect;

// Notification Preferences Relations
export const notificationPreferencesRelations = relations(
  notificationPreferences,
  ({ one }) => ({
    user: one(user, {
      fields: [notificationPreferences.userId],
      references: [user.id],
    }),
  })
);

// Ownership Transfer Relations
export const ownershipTransferRelations = relations(
  ownershipTransfer,
  ({ one }) => ({
    organization: one(organization, {
      fields: [ownershipTransfer.organizationId],
      references: [organization.id],
    }),
    fromUser: one(user, {
      fields: [ownershipTransfer.fromUserId],
      references: [user.id],
    }),
    toUser: one(user, {
      fields: [ownershipTransfer.toUserId],
      references: [user.id],
    }),
  })
);

// Security Audit Log Relations
export const securityAuditLogRelations = relations(
  securityAuditLog,
  ({ one }) => ({
    organization: one(organization, {
      fields: [securityAuditLog.organizationId],
      references: [organization.id],
    }),
    user: one(user, {
      fields: [securityAuditLog.userId],
      references: [user.id],
    }),
  })
);

// Session Tracking Relations
export const sessionTrackingRelations = relations(
  sessionTracking,
  ({ one }) => ({
    session: one(session, {
      fields: [sessionTracking.sessionId],
      references: [session.id],
    }),
    organization: one(organization, {
      fields: [sessionTracking.organizationId],
      references: [organization.id],
    }),
  })
);

/* =========================
   EXPORT SCHEMA
========================= */
export const schema = {
  user,
  session,
  account,
  verification,
  organization,
  member,
  invitation,
  notificationPreferences,
  ownershipTransfer,
  securityAuditLog,
  sessionTracking,
  organizationRelations,
  memberRelations,
  notificationPreferencesRelations,
  ownershipTransferRelations,
  securityAuditLogRelations,
  sessionTrackingRelations,
};
