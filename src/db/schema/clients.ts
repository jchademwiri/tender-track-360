import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { clientTypeEnum } from './enums';

export const clients = pgTable(
  'clients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: text('organization_id').notNull(), // References Better Auth organization.id
    name: varchar('name', { length: 255 }).notNull(),
    type: clientTypeEnum('type').notNull(),
    contactPerson: varchar('contact_person', { length: 255 }),
    contactEmail: varchar('contact_email', { length: 255 }),
    contactPhone: varchar('contact_phone', { length: 50 }),
    address: text('address'),
    website: varchar('website', { length: 255 }),
    description: text('description'),
    isActive: boolean('is_active').notNull().default(true),
    isDeleted: boolean('is_deleted').notNull().default(false),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    deletedById: text('deleted_by_id'), // References Better Auth user.id
    createdById: text('created_by_id'), // References Better Auth user.id
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    organizationIdx: index('idx_clients_organization').on(table.organizationId),
    nameIdx: index('idx_clients_name').on(table.name),
    typeIdx: index('idx_clients_type').on(table.type),
  })
);
