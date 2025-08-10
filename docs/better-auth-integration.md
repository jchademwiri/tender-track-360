# Better Auth Integration - User Profiles and Preferences

## Overview

This document describes the implementation of business extension tables that integrate with Better Auth for user management in Tender Track 360.

## Architecture

### Better Auth Tables (Auto-generated)

Better Auth automatically creates and manages these core authentication tables:

- `user` - Core user authentication data
- `organization` - Organization/tenant data
- `member` - User-organization relationships
- `session` - User sessions
- `account` - OAuth accounts
- `invitation` - Organization invitations
- `verification` - Email verification

### Business Extension Tables

#### User Profiles (`user_profiles`)

Extends Better Auth user data with business-specific information:

```typescript
{
  id: uuid (primary key)
  userId: text (references user.id) - Better Auth user reference
  organizationId: text (references organization.id) - Better Auth org reference
  role: enum - Business roles (admin, tender_manager, tender_specialist, viewer)
  department: varchar - User's department
  isActive: boolean - Account status
  lastLogin: timestamp - Last login tracking
  onboardingCompleted: boolean - Onboarding status
  preferences: jsonb - Additional user preferences
  isDeleted: boolean - Soft delete flag
  deletedAt: timestamp - Deletion timestamp
  deletedById: text (references user.id) - Who deleted the user
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Key Features:**

- ✅ Foreign key constraints to Better Auth tables
- ✅ Organization-based data isolation
- ✅ Soft delete functionality
- ✅ Audit trail support
- ✅ Optimized indexes for queries

#### User Preferences (`user_preferences`)

Stores user notification and display preferences:

```typescript
{
  id: uuid (primary key)
  userId: text (references user.id) - Better Auth user reference
  emailNotifications: boolean - Email notification preference
  pushNotifications: boolean - Push notification preference
  reminderDays: integer - Default reminder days
  timezone: varchar - User's timezone
  language: varchar - Preferred language
  dateFormat: varchar - Date display format
  timeFormat: varchar - Time display format (12h/24h)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Key Features:**

- ✅ One-to-one relationship with Better Auth users
- ✅ Comprehensive notification settings
- ✅ Localization support
- ✅ Foreign key constraints with cascade delete

## Database Constraints and Relationships

### Foreign Key Constraints

All business extension tables properly reference Better Auth tables:

```sql
-- User Profiles
ALTER TABLE "user_profiles"
ADD CONSTRAINT "user_profiles_user_id_user_id_fk"
FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade;

ALTER TABLE "user_profiles"
ADD CONSTRAINT "user_profiles_organization_id_organization_id_fk"
FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE cascade;

-- User Preferences
ALTER TABLE "user_preferences"
ADD CONSTRAINT "user_preferences_user_id_user_id_fk"
FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade;
```

### Indexes for Performance

Organization-based queries are optimized with composite indexes:

```sql
-- User Profiles Indexes
CREATE INDEX "idx_user_profiles_organization" ON "user_profiles" ("organization_id");
CREATE INDEX "idx_user_profiles_user" ON "user_profiles" ("user_id");
CREATE INDEX "idx_user_profiles_role" ON "user_profiles" ("role");
CREATE INDEX "idx_user_profiles_active" ON "user_profiles" ("is_active", "organization_id");
CREATE INDEX "idx_user_profiles_department" ON "user_profiles" ("department", "organization_id");

-- User Preferences Indexes
CREATE INDEX "idx_user_preferences_user" ON "user_preferences" ("user_id");
```

## Usage Examples

### Creating User Profile and Preferences

```typescript
import {
  createUserProfile,
  createUserPreferences,
} from '../src/db/utils/user-profile-helpers';

// Create user profile after Better Auth user creation
const profile = await createUserProfile({
  userId: betterAuthUser.id,
  organizationId: betterAuthOrg.id,
  role: 'tender_manager',
  department: 'Procurement',
});

// Create user preferences
const preferences = await createUserPreferences({
  userId: betterAuthUser.id,
  emailNotifications: true,
  reminderDays: 7,
  timezone: 'America/New_York',
});
```

### Querying Organization Users

```typescript
import { getUsersByOrganization } from '../src/db/utils/user-profile-helpers';

// Get all active users in an organization
const orgUsers = await getUsersByOrganization(organizationId);
```

## Data Isolation and Security

### Organization-Based Isolation

- All business data is scoped to organizations via `organizationId`
- Foreign key constraints ensure data integrity
- Indexes optimize organization-based queries

### Soft Delete Support

- User profiles support soft deletion for audit trails
- Deleted users are marked with `isDeleted: true` and `deletedAt` timestamp
- `deletedById` tracks who performed the deletion

### Cascade Behavior

- When Better Auth users are deleted, related profiles and preferences are automatically removed
- When organizations are deleted, all related user profiles are removed
- This maintains referential integrity

## Testing

The integration includes comprehensive tests that verify:

- ✅ Foreign key constraints work correctly
- ✅ User profiles can be created with Better Auth references
- ✅ User preferences are properly linked
- ✅ Organization-based queries function correctly
- ✅ Invalid references are rejected by the database

Run tests with:

```bash
npx tsx scripts/test-user-profile-integration.ts
```

## Migration Applied

The following migration was applied to add foreign key constraints:

- Added foreign key constraints between business tables and Better Auth tables
- Added additional indexes for performance optimization
- Enhanced user preferences with additional fields (push notifications, language, date/time formats)
- Added unique constraint on user_preferences.user_id for one-to-one relationship

## Requirements Satisfied

This implementation satisfies the following requirements:

- **1.2**: ✅ Users are associated with organizations and assigned appropriate roles
- **1.3**: ✅ Organization-level data isolation is enforced through foreign keys and indexes
- **1.4**: ✅ System enforces organization-level data isolation with proper constraints

The business extension tables successfully integrate with Better Auth while maintaining data integrity, performance, and security.
