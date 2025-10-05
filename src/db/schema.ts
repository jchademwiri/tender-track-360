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
   ENUMS
========================= */
export const tenderStatus = pgEnum('tender_status', [
  'draft',
  'submitted',
  'appointed',
  'rejected',
  'under_evaluation',
]);

export const followUpStatus = pgEnum('follow_up_status', [
  'under_evaluation',
  'appointed',
  'rejected',
]);

/* =========================
   TENDERS
========================= */
export const tender = pgTable('tender', {
  id: text('id').primaryKey(),
  tenderNumber: text('tender_number').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  client: text('client').notNull(),
  submissionDate: timestamp('submission_date'),
  value: text('value'), // optional
  status: tenderStatus('status').default('draft').notNull(),
  createdBy: text('created_by')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  // Soft deletion fields
  deletedAt: timestamp('deleted_at'),
  deletedBy: text('deleted_by').references(() => user.id),
});

/* =========================
   FOLLOW UPS
========================= */
export const followUp = pgTable('follow_up', {
  id: text('id').primaryKey(),
  tenderId: text('tender_id')
    .notNull()
    .references(() => tender.id, { onDelete: 'cascade' }),
  contactPerson: text('contact_person'),
  phoneNumber: text('phone_number').notNull(),
  email: text('email'), // optional
  communicationLog: text('communication_log'),
  extensionLetter: text('extension_letter'),
  feedback: text('feedback'),
  statusUpdate: followUpStatus('status_update')
    .default('under_evaluation')
    .notNull(),
  nextFollowUpDate: timestamp('next_follow_up_date'),
  notified: boolean('notified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  // Soft deletion fields
  deletedAt: timestamp('deleted_at'),
  deletedBy: text('deleted_by').references(() => user.id),
});

/* =========================
   CONTRACTS
========================= */
export const contract = pgTable('contract', {
  id: text('id').primaryKey(),
  tenderId: text('tender_id')
    .notNull()
    .references(() => tender.id, { onDelete: 'cascade' }),
  followUpId: text('follow_up_id').references(() => followUp.id),
  contractNumber: text('contract_number').unique(),
  appointedDate: timestamp('appointed_date').notNull(), // start date = appointed date
  endDate: timestamp('end_date'), // optional
  status: text('status').default('active').notNull(), // active, completed, terminated
  documents: text('documents'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  // Soft deletion fields
  deletedAt: timestamp('deleted_at'),
  deletedBy: text('deleted_by').references(() => user.id),
});

/* =========================
   CONTROL CENTER
========================= */
export const controlCenter = pgTable('control_center', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  defaultEmail: text('default_email'),
  notificationSettings: text('notification_settings'), // JSON
  preferences: text('preferences'), // JSON
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
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

export const tenderRelations = relations(tender, ({ one, many }) => ({
  organization: one(organization, {
    fields: [tender.organizationId],
    references: [organization.id],
  }),
  createdByUser: one(user, {
    fields: [tender.createdBy],
    references: [user.id],
  }),
  followUps: many(followUp), // ✅ fixed: now defined before usage
  contracts: many(contract), // ✅ fixed: now defined before usage
}));

export const followUpRelations = relations(followUp, ({ one }) => ({
  tender: one(tender, {
    fields: [followUp.tenderId],
    references: [tender.id],
  }),
}));

export const contractRelations = relations(contract, ({ one }) => ({
  tender: one(tender, {
    fields: [contract.tenderId],
    references: [tender.id],
  }),
  followUp: one(followUp, {
    fields: [contract.followUpId],
    references: [followUp.id],
  }),
}));

export const controlCenterRelations = relations(controlCenter, ({ one }) => ({
  organization: one(organization, {
    fields: [controlCenter.organizationId],
    references: [organization.id],
  }),
}));

/* =========================
   ADVANCED ORGANIZATION FEATURES
========================= */

// Ownership transfers
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
  status: text('status').default('pending').notNull(),
  transferToken: text('transfer_token').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  acceptedAt: timestamp('accepted_at'),
  cancelledAt: timestamp('cancelled_at'),
  metadata: text('metadata'), // JSON
});

// Security audit log
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
  details: text('details'), // JSON
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  sessionId: text('session_id'),
  severity: text('severity').default('info').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Organization deletion log
export const organizationDeletionLog = pgTable('organization_deletion_log', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  organizationName: text('organization_name').notNull(),
  deletedBy: text('deleted_by')
    .notNull()
    .references(() => user.id),
  deletionReason: text('deletion_reason'),
  deletionType: text('deletion_type').default('soft').notNull(),
  dataExported: boolean('data_exported').default(false).notNull(),
  exportFormat: text('export_format'),
  confirmationToken: text('confirmation_token').notNull(),
  relatedDataCount: text('related_data_count'), // JSON
  softDeletedAt: timestamp('soft_deleted_at').defaultNow().notNull(),
  permanentDeletionScheduledAt: timestamp('permanent_deletion_scheduled_at'),
  permanentDeletedAt: timestamp('permanent_deleted_at'),
  restoredAt: timestamp('restored_at'),
  restoredBy: text('restored_by').references(() => user.id),
  metadata: text('metadata'), // JSON
});

// Session tracking
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
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  deviceInfo: text('device_info'), // JSON
  locationInfo: text('location_info'), // JSON
  isSuspicious: boolean('is_suspicious').default(false).notNull(),
  logoutTime: timestamp('logout_time'),
});

// Organization security settings
export const organizationSecuritySettings = pgTable(
  'organization_security_settings',
  {
    id: text('id').primaryKey(),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    require2FA: boolean('require_2fa').default(false).notNull(),
    ipWhitelist: text('ip_whitelist'), // JSON array
    sessionTimeout: text('session_timeout').default('86400').notNull(), // seconds as string
    maxConcurrentSessions: text('max_concurrent_sessions')
      .default('5')
      .notNull(),
    loginAttemptLimit: text('login_attempt_limit').default('5').notNull(),
    lockoutDuration: text('lockout_duration').default('900').notNull(), // seconds as string
    passwordPolicy: text('password_policy'), // JSON
    auditRetentionDays: text('audit_retention_days').default('365').notNull(),
    autoPermanentDeleteDays: text('auto_permanent_delete_days')
      .default('30')
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  }
);

/* =========================
   RELATIONS FOR NEW TABLES
========================= */
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

export const organizationSecuritySettingsRelations = relations(
  organizationSecuritySettings,
  ({ one }) => ({
    organization: one(organization, {
      fields: [organizationSecuritySettings.organizationId],
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
  organizationRelations,
  memberRelations,
  tender,
  tenderRelations,
  followUp,
  followUpRelations,
  contract,
  contractRelations,
  controlCenter,
  controlCenterRelations,
  // New advanced features
  ownershipTransfer,
  ownershipTransferRelations,
  securityAuditLog,
  securityAuditLogRelations,
  organizationDeletionLog,
  sessionTracking,
  sessionTrackingRelations,
  organizationSecuritySettings,
  organizationSecuritySettingsRelations,
};
