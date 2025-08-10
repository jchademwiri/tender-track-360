# Role-Based Access Control System

## Overview

The Tender Track 360 application uses a hierarchical role-based access control (RBAC) system with four distinct roles, each with specific permissions and capabilities.

## Role Definitions

### 1. Admin (Level 4)

- **Full system access** with administrative privileges
- **Permissions**:
  - Manage organization settings
  - Manage all users and roles
  - Full tender management
  - System configuration
  - View all data and reports

### 2. Tender Manager (Level 3)

- **Management role** for tenders and team oversight
- **Permissions**:
  - Manage all tenders
  - Assign tasks to team members
  - Invite new members
  - Manage clients and categories
  - View comprehensive reports

### 3. Tender Specialist (Level 2)

- **Operational role** for tender creation and management
- **Permissions**:
  - Create and edit tenders
  - Manage documents
  - Update tender status
  - Manage assigned tasks
  - View basic reports

### 4. Viewer (Level 1)

- **Read-only access** to organizational data
- **Permissions**:
  - View tenders and documents
  - View basic reports
  - View assigned tasks
  - No editing capabilities

## Implementation

### Better Auth Configuration

```typescript
// In src/lib/auth.ts
roles: ['admin', 'tender_manager', 'tender_specialist', 'viewer'],
defaultRole: 'viewer',
```

### Role Utilities

```typescript
// In src/lib/roles.ts
import { hasMinimumRole, hasPermission, getRoleDefinition } from '@/lib/roles';

// Check if user has minimum required role
if (hasMinimumRole(userRole, 'tender_manager')) {
  // User can perform manager-level actions
}

// Check specific permission
if (hasPermission(userRole, 'manage_tenders')) {
  // User can manage tenders
}
```

### Server-Side Protection

```typescript
// In server components/actions
import { requireRole, requireAuth } from '@/server/auth-utils';

// Require specific role
await requireRole('admin');

// Check role in logic
const session = await requireAuth();
if (hasRole(session.user.role, 'tender_manager')) {
  // Manager-level logic
}
```

## Role Hierarchy

```
Admin (4) ──────────── Full Access
    │
Tender Manager (3) ─── Management Access
    │
Tender Specialist (2) ─ Operational Access
    │
Viewer (1) ──────────── Read-Only Access
```

## Permission Matrix

| Permission          | Admin | Tender Manager | Tender Specialist | Viewer |
| ------------------- | ----- | -------------- | ----------------- | ------ |
| Manage Organization | ✅    | ❌             | ❌                | ❌     |
| Manage Users        | ✅    | ✅             | ❌                | ❌     |
| Manage All Tenders  | ✅    | ✅             | ❌                | ❌     |
| Create Tenders      | ✅    | ✅             | ✅                | ❌     |
| Edit Own Tenders    | ✅    | ✅             | ✅                | ❌     |
| View Tenders        | ✅    | ✅             | ✅                | ✅     |
| Manage Documents    | ✅    | ✅             | ✅                | ❌     |
| View Documents      | ✅    | ✅             | ✅                | ✅     |
| Assign Tasks        | ✅    | ✅             | ❌                | ❌     |
| Manage Own Tasks    | ✅    | ✅             | ✅                | ❌     |
| View Reports        | ✅    | ✅             | ✅                | ✅     |
| System Settings     | ✅    | ❌             | ❌                | ❌     |

## Usage Examples

### Component-Level Protection

```typescript
import { hasMinimumRole } from '@/lib/roles';

function TenderManagementPanel({ userRole }: { userRole: UserRole }) {
  if (!hasMinimumRole(userRole, 'tender_specialist')) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      {hasMinimumRole(userRole, 'tender_manager') && (
        <AdminControls />
      )}
      <TenderList />
    </div>
  );
}
```

### Role-Based UI

```typescript
import { getRoleColor, getRoleName } from '@/lib/roles';

function UserRoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(role)}`}>
      {getRoleName(role)}
    </span>
  );
}
```

### Permission Checks

```typescript
import { hasPermission } from '@/lib/roles';

function TenderActions({ userRole }: { userRole: UserRole }) {
  return (
    <div>
      {hasPermission(userRole, 'create_tenders') && (
        <CreateTenderButton />
      )}
      {hasPermission(userRole, 'manage_tenders') && (
        <ManageTendersButton />
      )}
    </div>
  );
}
```

## Security Considerations

1. **Server-Side Validation**: Always validate permissions on the server
2. **Database Isolation**: Organization-level data isolation
3. **Role Inheritance**: Higher roles inherit lower role permissions
4. **Principle of Least Privilege**: Users get minimum required access
5. **Audit Trail**: All role changes and permission usage logged

## Migration and Updates

When updating roles or permissions:

1. Update the `ROLES` object in `src/lib/roles.ts`
2. Update database migrations if needed
3. Update UI components to reflect new permissions
4. Test all role combinations thoroughly
5. Update documentation

The role system is designed to be flexible and extensible while maintaining security and clarity.
