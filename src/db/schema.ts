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
});

export const role = pgEnum('role', ['owner', 'admin', 'member']);
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
};
