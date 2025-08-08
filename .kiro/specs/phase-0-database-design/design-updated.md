# Phase 0: Database Design - Better Auth Integration

## Overview

The Database Design integrates with Better Auth's existing organization support, extending it with business-specific tables for tender management. Better Auth provides user authentication, organizations, and member management out of the box, which we'll extend with our business logic.

## Architecture

### Database Architecture

- **Better Auth Layer**: Auto-generated authentication and organization tables
- **Business Extension Layer**: User profiles, tender management, and business data
- **Document Layer**: UploadThing integration with metadata storage
- **Audit Layer**: Comprehensive change tracking and activity logging
- **Performance Layer**: Optimized indexes and query patterns

### Multi-Tenancy Strategy

- **Better Auth Organizations**: Use Better Auth's built-in organization support
- **Organization-based Isolation**: All business data scoped to Better Auth organizations
- **Member Roles**: Extend Better Auth member roles with business-specific roles
- **Session Context**: Use Better Auth's activeOrganizationId for context

## Database Schema Design

### Better Auth Tables (Auto-Generated)

Better Auth provides these tables with organization support:

```typescript
// Better Auth auto-generated tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const organization = pgTable('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  logo: text('logo'),
  createdAt: timestamp('created_at').notNull(),
  metadata: text('metadata'), // Can store additional org data as JSON
});

export const member = pgTable('member', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organization.id),
  userId: text('user_id').references(() => user.id),
  role: text('role').default('member').notNull(), // We'll extend this
  createdAt: timestamp('created_at').notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => user.id),
  activeOrganizationId: text('active_organization_id'), // Current org context
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  // ... other session fields
});
```

### Business Extension Tables

#### User Profiles (Extends Better Auth Users)

```typescript
export const userProfiles = pgTable(
  'user_profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .references(() => user.id)
      .notNull()
      .unique(),
    organizationId: text('organization_id')
      .references(() => organization.id)
      .notNull(),
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
```

#### Enhanced Tenders Table

```typescript
export const tenders = pgTable(
  'tenders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: text('organization_id')
      .references(() => organization.id)
      .notNull(),
    referenceNumber: varchar('reference_number', { length: 100 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    clientId: uuid('client_id')
      .references(() => clients.id)
      .notNull(),
    categoryId: uuid('category_id').references(() => tenderCategories.id),
    status: tenderStatusEnum('status').notNull().default('in_progress'),
    closingDate: timestamp('closing_date', { withTimezone: true }),
    evaluationDate: date('evaluation_date'), // Auto-calculated: closingDate + 90 days
    awardDate: date('award_date'), // Only set when awarded
    estimatedValue: numeric('estimated_value', { precision: 15, scale: 2 }),
    actualValue: numeric('actual_value', { precision: 15, scale: 2 }),
    isSuccessful: boolean('is_successful'),
    department: varchar('department', { length: 100 }),
    notes: text('notes'),
    tags: text('tags').array(), // PostgreSQL array for tags
    isDeleted: boolean('is_deleted').notNull().default(false),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    deletedById: text('deleted_by_id'),
    createdById: text('created_by_id')
      .references(() => user.id)
      .notNull(),
    updatedById: text('updated_by_id')
      .references(() => user.id)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // Composite unique constraint for reference number within organization
    orgReferenceIdx: uniqueIndex('idx_tenders_org_reference').on(
      table.organizationId,
      table.referenceNumber
    ),
    statusClosingIdx: index('idx_tenders_status_closing').on(
      table.status,
      table.closingDate
    ),
    clientIdx: index('idx_tenders_client').on(table.clientId),
    categoryIdx: index('idx_tenders_category').on(table.categoryId),
    createdByIdx: index('idx_tenders_created_by').on(table.createdById),
    organizationIdx: index('idx_tenders_organization').on(table.organizationId),
  })
);
```

#### Clients Table

```typescript
export const clients = pgTable(
  'clients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: text('organization_id')
      .references(() => organization.id)
      .notNull(),
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
    deletedById: text('deleted_by_id'),
    createdById: text('created_by_id').references(() => user.id),
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
```

#### Tender Categories Table

```typescript
export const tenderCategories = pgTable(
  'tender_categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: text('organization_id').references(() => organization.id), // null for system defaults
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    isActive: boolean('is_active').notNull().default(true),
    isSystemDefault: boolean('is_system_default').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    organizationIdx: index('idx_categories_organization').on(
      table.organizationId
    ),
    systemDefaultIdx: index('idx_categories_system').on(table.isSystemDefault),
    nameIdx: index('idx_categories_name').on(table.name),
  })
);
```

### Audit and Tracking Tables

#### Status Transitions Table

```typescript
export const statusTransitions = pgTable(
  'status_transitions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenderId: uuid('tender_id')
      .references(() => tenders.id)
      .notNull(),
    fromStatus: tenderStatusEnum('from_status'),
    toStatus: tenderStatusEnum('to_status').notNull(),
    userId: text('user_id')
      .references(() => user.id)
      .notNull(),
    notes: text('notes'),
    isSystemGenerated: boolean('is_system_generated').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    tenderIdx: index('idx_status_transitions_tender').on(
      table.tenderId,
      table.createdAt
    ),
    userIdx: index('idx_status_transitions_user').on(table.userId),
  })
);
```

#### Enhanced Activity Logs Table

```typescript
export const activityLogs = pgTable(
  'activity_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: text('organization_id')
      .references(() => organization.id)
      .notNull(),
    tenderId: uuid('tender_id').references(() => tenders.id),
    userId: text('user_id')
      .references(() => user.id)
      .notNull(),
    action: varchar('action', { length: 100 }).notNull(),
    entityType: varchar('entity_type', { length: 50 }).notNull(), // 'tender', 'document', 'task', etc.
    entityId: uuid('entity_id'),
    oldValues: jsonb('old_values'), // Store previous values for comparison
    newValues: jsonb('new_values'), // Store new values
    details: text('details'),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    organizationIdx: index('idx_activity_logs_organization').on(
      table.organizationId,
      table.createdAt
    ),
    tenderIdx: index('idx_activity_logs_tender').on(
      table.tenderId,
      table.createdAt
    ),
    userIdx: index('idx_activity_logs_user').on(table.userId, table.createdAt),
    actionIdx: index('idx_activity_logs_action').on(table.action),
    entityIdx: index('idx_activity_logs_entity').on(
      table.entityType,
      table.entityId
    ),
  })
);
```

### Document Management Tables

#### Enhanced Documents Table

```typescript
export const documents = pgTable(
  'documents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: text('organization_id')
      .references(() => organization.id)
      .notNull(),
    tenderId: uuid('tender_id')
      .references(() => tenders.id)
      .notNull(),
    parentDocumentId: uuid('parent_document_id'), // For versioning
    category: documentCategoryEnum('category').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    fileSize: integer('file_size').notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    uploadThingUrl: varchar('uploadthing_url', { length: 500 }).notNull(),
    uploadThingKey: varchar('uploadthing_key', { length: 255 }).notNull(),
    checksumHash: varchar('checksum_hash', { length: 64 }),
    version: integer('version').notNull().default(1),
    isLatestVersion: boolean('is_latest_version').notNull().default(true),
    tags: text('tags').array(),
    description: text('description'),
    isArchived: boolean('is_archived').notNull().default(false),
    archiveReason: varchar('archive_reason', { length: 255 }),
    isDeleted: boolean('is_deleted').notNull().default(false),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    deletedById: text('deleted_by_id'),
    uploadedById: text('uploaded_by_id')
      .references(() => user.id)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    organizationIdx: index('idx_documents_organization').on(
      table.organizationId
    ),
    tenderCategoryIdx: index('idx_documents_tender_category').on(
      table.tenderId,
      table.category
    ),
    versionIdx: index('idx_documents_version').on(
      table.parentDocumentId,
      table.version
    ),
    uploadedByIdx: index('idx_documents_uploaded_by').on(table.uploadedById),
    uploadThingKeyIdx: uniqueIndex('idx_documents_uploadthing_key').on(
      table.uploadThingKey
    ),
  })
);
```

## Better Auth Integration Strategy

### Organization Management

- Use Better Auth's built-in organization creation and management
- Extend organization metadata field with business-specific data
- Leverage Better Auth's member invitation system

### User Management

- Better Auth handles authentication and basic user data
- UserProfiles table extends with business-specific fields
- Sync user data between Better Auth and business tables

### Session Context

- Use Better Auth's activeOrganizationId for organization context
- All queries filtered by current organization
- Role-based access control through member roles

### Member Roles Extension

Better Auth member roles can be extended:

```typescript
// Better Auth member roles
'owner' | 'admin' | 'member' | 'viewer';

// Extended with business roles in userProfiles
'admin' | 'tender_manager' | 'tender_specialist' | 'viewer';
```

## Data Relationships

### Primary Relationships

- Better Auth organization → Business data (1:many)
- Better Auth user → UserProfile (1:1)
- Organization → Tenders (1:many)
- Organization → Clients (1:many)
- Tenders → Documents (1:many)
- Tenders → Status Transitions (1:many)

### Integration Points

- All business tables reference Better Auth organization.id
- All user references use Better Auth user.id
- Session context from Better Auth activeOrganizationId
- Member permissions from Better Auth member table

## Performance Optimizations

### Indexing Strategy

- Organization-based indexes for multi-tenancy
- Composite indexes for common query patterns
- Time-based indexes for audit queries
- Unique constraints for business rules

### Query Optimization

- Organization context filtering in all queries
- Efficient joins with Better Auth tables
- Materialized views for complex aggregations
- Connection pooling for concurrent access

## Security Considerations

### Data Isolation

- Organization-based row-level security
- Better Auth session validation
- Audit trail for all data access
- Encrypted sensitive fields

### Integration Security

- Validate organization context in all operations
- Sync user permissions between Better Auth and business tables
- Audit all cross-table operations
- Secure API endpoints with Better Auth middleware
