# Design Document

## Overview

This design expands the existing Drizzle ORM schema with 12 new tables to support project management, client management, calendar functionality, user preferences, and analytics tracking. The design maintains consistency with existing patterns including multi-tenant organization isolation, soft deletion capabilities, and proper TypeScript type inference.

## Architecture

### Design Principles

- **Multi-tenant isolation**: All business data tables include `organizationId` for data segregation
- **Soft deletion**: Critical business entities support soft deletion with `deletedAt`, `deletedBy` fields
- **Audit trails**: All tables include `createdAt` and `updatedAt` timestamps
- **Type safety**: Leverage Drizzle's TypeScript inference and pgEnum for type-safe operations
- **Referential integrity**: Proper foreign key relationships with cascade rules

### Table Categories

1. **Project Management**: `project`, `purchaseOrder`, `purchaseOrderItem`
2. **Client Management**: `client`, `clientContact`, `clientAddress`
3. **Calendar & Scheduling**: `calendarEvent`, `reminder`
4. **User Preferences**: `userPreferences`, `notificationPreferences`, `userNotifications`
5. **Analytics**: `analytics`

## Components and Interfaces

### Project Management Tables

#### Project Table

```typescript
export const project = pgTable('project', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  status: projectStatus('status').default('planning').notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  budget: text('budget'), // Store as string for precision
  clientId: text('client_id').references(() => client.id),
  tenderId: text('tender_id').references(() => tender.id), // Optional link to originating tender
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  createdBy: text('created_by')
    .notNull()
    .references(() => user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
  deletedBy: text('deleted_by').references(() => user.id),
});
```

#### Purchase Order Tables

```typescript
export const purchaseOrder = pgTable('purchase_order', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  projectId: text('project_id')
    .notNull()
    .references(() => project.id, { onDelete: 'cascade' }),
  supplierId: text('supplier_id').references(() => client.id), // Reuse client table for suppliers
  status: purchaseOrderStatus('status').default('draft').notNull(),
  orderDate: timestamp('order_date').defaultNow().notNull(),
  expectedDeliveryDate: timestamp('expected_delivery_date'),
  totalAmount: text('total_amount'), // Calculated from items
  notes: text('notes'),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  createdBy: text('created_by')
    .notNull()
    .references(() => user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
  deletedBy: text('deleted_by').references(() => user.id),
});

export const purchaseOrderItem = pgTable('purchase_order_item', {
  id: text('id').primaryKey(),
  purchaseOrderId: text('purchase_order_id')
    .notNull()
    .references(() => purchaseOrder.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  quantity: text('quantity').notNull(), // Store as string for precision
  unitPrice: text('unit_price').notNull(),
  totalPrice: text('total_price').notNull(), // quantity * unitPrice
  unit: text('unit'), // e.g., 'pieces', 'kg', 'hours'
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### Client Management Tables

#### Client Table

```typescript
export const client = pgTable('client', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  companyRegistrationNumber: text('company_registration_number'),
  taxNumber: text('tax_number'),
  industry: text('industry'),
  website: text('website'),
  notes: text('notes'),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  createdBy: text('created_by')
    .notNull()
    .references(() => user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
  deletedBy: text('deleted_by').references(() => user.id),
});

export const clientContact = pgTable('client_contact', {
  id: text('id').primaryKey(),
  clientId: text('client_id')
    .notNull()
    .references(() => client.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  position: text('position'),
  isPrimary: boolean('is_primary').default(false).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const clientAddress = pgTable('client_address', {
  id: text('id').primaryKey(),
  clientId: text('client_id')
    .notNull()
    .references(() => client.id, { onDelete: 'cascade' }),
  type: addressType('type').default('business').notNull(),
  street: text('street').notNull(),
  city: text('city').notNull(),
  state: text('state'),
  postalCode: text('postal_code'),
  country: text('country').notNull(),
  isPrimary: boolean('is_primary').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### Calendar & Scheduling Tables

#### Calendar Event Table

```typescript
export const calendarEvent = pgTable('calendar_event', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  isAllDay: boolean('is_all_day').default(false).notNull(),
  location: text('location'),
  eventType: eventType('event_type').default('meeting').notNull(),
  // Polymorphic relationships
  relatedEntityType: text('related_entity_type'), // 'tender', 'project', 'client'
  relatedEntityId: text('related_entity_id'),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  createdBy: text('created_by')
    .notNull()
    .references(() => user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
  deletedBy: text('deleted_by').references(() => user.id),
});

export const reminder = pgTable('reminder', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  message: text('message'),
  reminderDate: timestamp('reminder_date').notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  reminderType: reminderType('reminder_type').default('general').notNull(),
  // Polymorphic relationships
  relatedEntityType: text('related_entity_type'), // 'tender', 'project', 'calendar_event'
  relatedEntityId: text('related_entity_id'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### User Preferences Tables

#### User Preferences

```typescript
export const userPreferences = pgTable('user_preferences', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  theme: text('theme').default('system').notNull(), // 'light', 'dark', 'system'
  language: text('language').default('en').notNull(),
  timezone: text('timezone').default('UTC').notNull(),
  dateFormat: text('date_format').default('MM/dd/yyyy').notNull(),
  timeFormat: text('time_format').default('12h').notNull(), // '12h', '24h'
  dashboardLayout: text('dashboard_layout'), // JSON string
  preferences: text('preferences'), // JSON for additional settings
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

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

export const userNotifications = pgTable('user_notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: notificationType('type').default('info').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  actionUrl: text('action_url'),
  // Polymorphic relationships
  relatedEntityType: text('related_entity_type'),
  relatedEntityId: text('related_entity_id'),
  organizationId: text('organization_id').references(() => organization.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  readAt: timestamp('read_at'),
});
```

### Analytics Table

#### Analytics

```typescript
export const analytics = pgTable('analytics', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  metricType: text('metric_type').notNull(), // 'tender_count', 'project_value', 'client_count'
  metricValue: text('metric_value').notNull(),
  metricDate: timestamp('metric_date').defaultNow().notNull(),
  dimensions: text('dimensions'), // JSON for additional metric dimensions
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

## Data Models

### Required Enums

```typescript
export const projectStatus = pgEnum('project_status', [
  'planning',
  'active',
  'on_hold',
  'completed',
  'cancelled',
]);

export const purchaseOrderStatus = pgEnum('purchase_order_status', [
  'draft',
  'sent',
  'approved',
  'delivered',
  'cancelled',
]);

export const addressType = pgEnum('address_type', [
  'business',
  'billing',
  'shipping',
  'other',
]);

export const eventType = pgEnum('event_type', [
  'meeting',
  'deadline',
  'reminder',
  'milestone',
  'other',
]);

export const reminderType = pgEnum('reminder_type', [
  'general',
  'tender_deadline',
  'project_milestone',
  'follow_up',
  'meeting',
]);

export const notificationType = pgEnum('notification_type', [
  'info',
  'success',
  'warning',
  'error',
  'reminder',
]);
```

### TypeScript Types

```typescript
export type Project = typeof project.$inferSelect;
export type PurchaseOrder = typeof purchaseOrder.$inferSelect;
export type PurchaseOrderItem = typeof purchaseOrderItem.$inferSelect;
export type Client = typeof client.$inferSelect;
export type ClientContact = typeof clientContact.$inferSelect;
export type ClientAddress = typeof clientAddress.$inferSelect;
export type CalendarEvent = typeof calendarEvent.$inferSelect;
export type Reminder = typeof reminder.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type NotificationPreferences =
  typeof notificationPreferences.$inferSelect;
export type UserNotifications = typeof userNotifications.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;
```

## Error Handling

### Referential Integrity

- Foreign key constraints with appropriate cascade rules
- Soft deletion preserves historical relationships
- Polymorphic relationships validated at application level

### Data Validation

- Required fields enforced at database level
- Enum constraints for status fields
- Unique constraints where appropriate (order numbers, etc.)

### Constraint Violations

- Handle duplicate key violations gracefully
- Validate organization isolation in application layer
- Check user permissions before data access

## Testing Strategy

### Unit Tests

- Test table creation and schema validation
- Verify foreign key relationships
- Test enum value constraints
- Validate TypeScript type inference

### Integration Tests

- Test cross-table relationships
- Verify cascade deletion behavior
- Test soft deletion functionality
- Validate organization data isolation

### Performance Tests

- Query performance with proper indexing
- Join performance across related tables
- Bulk insert/update operations
- Analytics query optimization

### Migration Tests

- Test schema migration scripts
- Verify data integrity during migration
- Test rollback scenarios
- Validate existing data compatibility
