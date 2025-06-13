# Tender Management System - Dashboard & Page Structure

## Role-Based Dashboards (4 Main Dashboards)

### 1. **Admin Dashboard** (`/admin`)

**Users:** Admin role
**Focus:** System-wide management and oversight

#### Pages:

- `/admin` - Main dashboard with system overview
- `/admin/users` - User management (CRUD operations)
- `/admin/users/[id]` - Individual user profile
- `/admin/clients` - Client management
- `/admin/clients/[id]` - Client details
- `/admin/categories` - Tender categories management
- `/admin/system-settings` - System configurations
- `/admin/reports` - System-wide reports and analytics
- `/admin/audit-logs` - Complete activity logs
- `/admin/roles-permissions` - Role and permission management

### 2. **Tender Manager Dashboard** (`/manager`)

**Users:** Tender Manager role
**Focus:** Strategic oversight and resource allocation

#### Pages:

- `/manager` - Executive dashboard with KPIs
- `/manager/tenders` - All tenders overview
- `/manager/tenders/[id]` - Tender details
- `/manager/portfolio` - Portfolio management
- `/manager/team` - Team performance and assignments
- `/manager/reports` - Management reports
- `/manager/budget` - Budget tracking and estimated values
- `/manager/clients` - Client relationship management
- `/manager/extensions` - Extension requests oversight

### 3. **Tender Specialist Dashboard** (`/specialist`)

**Users:** Tender Specialist role
**Focus:** Day-to-day tender operations

#### Pages:

- `/specialist` - Personal dashboard with assigned tenders
- `/specialist/tenders` - My tenders list
- `/specialist/tenders/[id]` - Tender workspace
- `/specialist/tenders/[id]/documents` - Document management
- `/specialist/tenders/[id]/tasks` - Task management
- `/specialist/tenders/[id]/extensions` - Extension handling
- `/specialist/calendar` - Calendar view of deadlines
- `/specialist/tasks` - Task management across tenders
- `/specialist/notifications` - Personal notifications

### 4. **Viewer Dashboard** (`/viewer`)

**Users:** Viewer role
**Focus:** Read-only access and monitoring

#### Pages:

- `/viewer` - Overview dashboard
- `/viewer/tenders` - Browse tenders (read-only)
- `/viewer/tenders/[id]` - Tender details (read-only)
- `/viewer/reports` - Available reports
- `/viewer/notifications` - Personal notifications

## Shared/Common Pages

### Core Tender Management

- `/tenders` - Main tenders listing (filtered by role)
- `/tenders/create` - Create new tender
- `/tenders/[id]` - Tender details hub
- `/tenders/[id]/edit` - Edit tender
- `/tenders/[id]/documents` - Document management
- `/tenders/[id]/tasks` - Task management
- `/tenders/[id]/history` - Activity history
- `/tenders/[id]/extensions` - Extension management
- `/tenders/[id]/timeline` - Visual timeline

### Extensions Management

- `/extensions` - Extension requests list
- `/extensions/[id]` - Extension details
- `/extensions/create` - Create extension request
- `/extensions/[id]/process` - Process extension

### Document Management

- `/documents` - Document library
- `/documents/[id]` - Document viewer
- `/documents/upload` - Document upload

### Task Management

- `/tasks` - Task overview
- `/tasks/[id]` - Task details
- `/tasks/create` - Create task

### Reports & Analytics

- `/reports` - Reports hub
- `/reports/tender-performance` - Tender performance analytics
- `/reports/deadlines` - Deadline reports
- `/reports/client-analysis` - Client analysis
- `/reports/financial` - Financial reports

### Personal

- `/profile` - User profile
- `/settings` - Personal settings
- `/notifications` - Notifications center
- `/calendar` - Personal calendar

## Next.js 15 App Router Structure

```
src/app/
├── (auth)/
│   ├── login/
│   └── signup/
├── (dashboard)/
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── users/
│   │   ├── clients/
│   │   ├── categories/
│   │   └── reports/
│   ├── manager/
│   │   ├── page.tsx
│   │   ├── tenders/
│   │   ├── team/
│   │   └── reports/
│   ├── specialist/
│   │   ├── page.tsx
│   │   ├── tenders/
│   │   ├── tasks/
│   │   └── calendar/
│   └── viewer/
│       ├── page.tsx
│       ├── tenders/
│       └── reports/
├── tenders/
│   ├── page.tsx
│   ├── create/
│   └── [id]/
│       ├── page.tsx
│       ├── edit/
│       ├── documents/
│       ├── tasks/
│       ├── extensions/
│       └── timeline/
├── extensions/
│   ├── page.tsx
│   ├── create/
│   └── [id]/
├── documents/
├── tasks/
├── reports/
├── profile/
├── settings/
└── notifications/
```

## Key Features Per Dashboard

### Admin Dashboard Features:

- System health monitoring
- User activity analytics
- Client portfolio overview
- Security and audit logs
- System configuration

### Manager Dashboard Features:

- Portfolio performance KPIs
- Resource allocation charts
- Team productivity metrics
- Financial tracking
- Strategic reports

### Specialist Dashboard Features:

- Personal task queue
- Deadline calendar
- Extension processing workflow
- Document collaboration tools
- Progress tracking

### Viewer Dashboard Features:

- Read-only tender browser
- Status monitoring
- Basic reporting
- Notification center

## Recommended Implementation Priority:

1. **Phase 1:** Core authentication and basic tender CRUD
2. **Phase 2:** Role-based dashboards and permissions
3. **Phase 3:** Extension management system
4. **Phase 4:** Advanced reporting and analytics
5. **Phase 5:** Real-time notifications and calendar integration

## Technical Considerations:

- Use Next.js 15 App Router with nested layouts
- Implement role-based middleware for route protection
- Server Components for data fetching
- Client Components for interactive features
- Consider using React Server Actions for form handling
- Implement proper error boundaries and loading states
