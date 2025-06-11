# Phase 1 Detailed Development Plan - Tender Management MVP
*Timeline: 4-6 weeks | Core MVP Development*

## Week 1: Development Setup & Foundation

### Day 1-2: Environment Setup
**Local Development Environment:**
```bash
# Database setup
- Install PostgreSQL locally
- Create development database
- Set up connection strings

# Project initialization
- Create Next.js 15 project with TypeScript
- Install and configure Drizzle ORM
- Set up Tailwind CSS + Shadcn/ui
- Configure environment variables
```

**Key Files to Create:**
- `src/lib/db.ts` - Database connection
- `src/lib/env.ts` - Environment variable validation
- `drizzle.config.ts` - Drizzle configuration
- `.env.local` - Local environment variables

**Environment Variables:**
```env
# Local Development
DATABASE_URL="postgresql://user:password@localhost:5432/tender_management_dev"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Day 3-4: Database Schema Migration
**Tasks:**
- Run Drizzle migrations for your existing schema
- Create seed script for development data
- Set up Drizzle Studio for database management
- Test all table relationships and constraints

**Deliverables:**
- All tables created in local PostgreSQL
- Seed data script with sample users, clients, categories
- Database connection working in Next.js

### Day 5-7: Supabase Integration
**Tasks:**
- Set up Supabase project
- Configure Supabase Auth
- Set up Supabase Storage buckets
- Install Supabase CLI for local development
- Configure RLS policies (basic setup)

**Deliverables:**
- Supabase project configured
- Local Supabase development environment
- Basic auth configuration
- Storage buckets for documents

---

## Week 2: User & Client Management

### Day 8-10: Authentication System
**Components to Build:**
```typescript
// src/components/auth/
├── login-form.tsx          // Login form with Server Action
├── auth-guard.tsx          // Route protection component  
└── user-avatar.tsx         // User profile display

// src/actions/auth.ts
- signIn() - Server Action for login
- signOut() - Server Action for logout
- getCurrentUser() - Get authenticated user
```

**Pages to Create:**
- `src/app/(auth)/login/page.tsx` - Login page
- `src/app/(auth)/layout.tsx` - Auth layout
- `src/middleware.ts` - Route protection

**Key Features:**
- Email/password authentication via Supabase
- Automatic redirect after login
- Session management
- Role-based route protection

### Day 11-12: User Management (Admin Only)
**Components to Build:**
```typescript
// src/components/users/
├── user-list.tsx           // Display all users
├── user-form.tsx           // Create/edit user form
├── user-card.tsx           // User display component
└── user-role-badge.tsx     // Role display

// src/actions/users.ts
- createUser() - Admin creates new user
- updateUser() - Update user details
- toggleUserStatus() - Activate/deactivate user
- deleteUser() - Soft delete user
```

**Pages to Create:**
- `src/app/(dashboard)/users/page.tsx` - Users list
- `src/app/(dashboard)/users/new/page.tsx` - Create user
- `src/app/(dashboard)/users/[id]/edit/page.tsx` - Edit user

**Key Features:**
- Admin-only user creation
- Role assignment (Admin, Tender Manager, Viewer)
- User activation/deactivation
- User preferences management

### Day 13-14: Client Management
**Components to Build:**
```typescript
// src/components/clients/
├── client-list.tsx         // All clients with search/filter
├── client-form.tsx         // Create/edit client form
├── client-card.tsx         // Client display component
└── client-type-badge.tsx   // Client type indicator

// src/actions/clients.ts
- getClients() - List clients with pagination
- createClient() - Create new client
- updateClient() - Update client details
- deleteClient() - Soft delete client
```

**Pages to Create:**
- `src/app/(dashboard)/clients/page.tsx` - Clients list
- `src/app/(dashboard)/clients/new/page.tsx` - Create client
- `src/app/(dashboard)/clients/[id]/page.tsx` - Client details
- `src/app/(dashboard)/clients/[id]/edit/page.tsx` - Edit client

**Key Features:**
- Client type management (Government, Private, etc.)
- Contact information management
- Search and filtering
- Client-tender relationship display

---

## Week 3-4: Core Tender Management

### Day 15-18: Tender Creation & Management
**Components to Build:**
```typescript
// src/components/tenders/
├── tender-list.tsx         // Tenders list with filters
├── tender-form.tsx         // Multi-step tender creation
├── tender-card.tsx         // Tender summary display
├── tender-status-badge.tsx // Status indicator
├── tender-details.tsx      // Complete tender view
└── status-transition.tsx   // Status change interface

// src/actions/tenders.ts
- getTenders() - List tenders with filters
- createTender() - Create new tender
- updateTender() - Update tender details
- updateTenderStatus() - Change tender status
- deleteTender() - Soft delete tender
- generateReferenceNumber() - Auto-generate reference
```

**Pages to Create:**
- `src/app/(dashboard)/tenders/page.tsx` - Tenders dashboard
- `src/app/(dashboard)/tenders/new/page.tsx` - Create tender
- `src/app/(dashboard)/tenders/[id]/page.tsx` - Tender details
- `src/app/(dashboard)/tenders/[id]/edit/page.tsx` - Edit tender

### Day 19-21: Tender Status Workflow
**Key Features to Implement:**
- Status progression: Draft → Published → In Progress → Submitted → Evaluation → Awarded/Rejected/Cancelled
- Role-based status transitions
- Status transition validation
- Automatic status updates based on dates

**Components:**
```typescript
// src/components/workflow/
├── status-timeline.tsx     // Visual status progression
├── transition-modal.tsx    // Status change confirmation
└── workflow-rules.tsx      // Display allowed transitions

// src/lib/workflow.ts
- getAllowedTransitions() - Check valid status changes
- validateTransition() - Verify user can make transition
- processStatusChange() - Handle status update logic
```

**Database Integration:**
- Implement `allowedStatusTransitions` table logic
- Role-based transition validation
- Status change logging in activity logs

---

## Week 5: Document Management

### Day 22-24: File Upload System
**Components to Build:**
```typescript
// src/components/documents/
├── document-upload.tsx     // Drag & drop file upload
├── document-list.tsx       // List documents by tender
├── document-card.tsx       // Document display with actions
├── document-viewer.tsx     // Basic document preview
└── upload-progress.tsx     // Upload progress indicator

// src/actions/documents.ts
- uploadDocument() - Handle file upload to Supabase Storage
- getDocuments() - List documents by tender/category
- deleteDocument() - Soft delete document
- updateDocumentDetails() - Update document metadata
```

**Key Features:**
- Drag & drop file upload
- File type validation (PDF, DOC, XLS, images)
- File size limits
- Upload progress tracking
- Document categorization

### Day 25-26: Document Organization
**Features to Implement:**
- Document categories (Tender Notice, Technical Specs, etc.)
- Document association with tenders
- Basic document metadata management
- Document access control based on user roles

**Supabase Storage Integration:**
```typescript
// src/lib/storage.ts
- uploadFile() - Upload to Supabase Storage
- getFileUrl() - Generate signed URLs
- deleteFile() - Remove from storage
- validateFile() - File type/size validation
```

**Storage Bucket Structure:**
```
tender-documents/
├── {tender-id}/
│   ├── tender-notices/
│   ├── technical-specs/
│   ├── financial-proposals/
│   └── legal-documents/
```

---

## Week 6: Essential Features & Integration

### Day 27-28: Task Management
**Components to Build:**
```typescript
// src/components/tasks/
├── task-list.tsx           // Tasks by tender/user
├── task-form.tsx           // Create/edit task
├── task-card.tsx           // Task display
├── task-status.tsx         // Completion status
└── task-assignment.tsx     // Assign tasks to users

// src/actions/tasks.ts
- getTasks() - List tasks with filters
- createTask() - Create new task
- updateTask() - Update task details
- completeTask() - Mark task as complete
- assignTask() - Assign task to user
```

**Key Features:**
- Task creation and assignment
- Due date tracking
- Priority levels (0-5)
- Task completion tracking
- Tender-specific task organization

### Day 29-30: Basic Notifications
**Components to Build:**
```typescript
// src/components/notifications/
├── notification-bell.tsx   // Header notification icon
├── notification-list.tsx   // Notification dropdown
├── notification-item.tsx   // Individual notification
└── notification-settings.tsx // User preferences

// src/actions/notifications.ts
- getNotifications() - User notifications
- markAsRead() - Mark notification as read
- createNotification() - System notifications
- getUserPreferences() - Notification settings
```

**Key Features:**
- In-app notifications
- Notification types: Deadline, Status Change, Task Assignment
- Read/unread status
- Basic notification preferences

### Day 31-35: Activity Logging & Testing
**Activity Logging:**
- Automatic logging through Server Actions
- User action tracking
- Tender-specific activity logs
- System event logging

**Testing & Polish:**
- Test all Server Actions
- Verify role-based access control
- Test file upload and storage
- End-to-end testing of core workflows
- Bug fixes and UI polish

---

## Technical Implementation Details

### Server Actions Structure:
```typescript
// src/actions/tenders.ts
'use server'

export async function createTender(formData: FormData) {
  // 1. Validate user permissions
  // 2. Validate form data with Zod
  // 3. Database transaction
  // 4. Create activity log
  // 5. Return success/error
}

export async function updateTenderStatus(
  tenderId: string, 
  newStatus: TenderStatus
) {
  // 1. Check allowed transitions
  // 2. Verify user role permissions
  // 3. Update database
  // 4. Create notification
  // 5. Log activity
}
```

### Database Queries with Drizzle:
```typescript
// src/db/queries/tenders.ts
export async function getTendersByStatus(status: TenderStatus) {
  return await db
    .select()
    .from(tenders)
    .where(
      and(
        eq(tenders.status, status),
        eq(tenders.isDeleted, false)
      )
    )
    .leftJoin(clients, eq(tenders.clientId, clients.id))
    .orderBy(desc(tenders.createdAt));
}
```

### RLS Policies (Supabase):
```sql
-- Users can only see active, non-deleted records
CREATE POLICY "Users can view active tenders" ON tenders
  FOR SELECT USING (is_deleted = false);

-- Only admins and tender managers can create tenders
CREATE POLICY "Authorized users can create tenders" ON tenders
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' IN ('admin', 'tender_manager')
  );
```

## Deliverables for Phase 1:

### Core Features:
- ✅ User authentication and management
- ✅ Client CRUD operations
- ✅ Tender creation, editing, and status management
- ✅ Document upload and basic management
- ✅ Task creation and assignment
- ✅ Basic notification system
- ✅ Activity logging

### Technical Deliverables:
- ✅ Next.js 15 app with Server Actions
- ✅ Drizzle ORM integration with PostgreSQL
- ✅ Supabase Auth integration
- ✅ Supabase Storage for file management
- ✅ Role-based access control
- ✅ Basic UI with Tailwind CSS + Shadcn/ui

### Ready for Phase 2:
- Advanced document management
- Enhanced notification system
- Workflow automation
- Reporting and analytics

## Success Metrics:
- Users can log in and manage their profiles
- Admins can create and manage users
- Complete tender lifecycle from creation to status updates
- Documents can be uploaded and associated with tenders
- Tasks can be created and assigned
- Basic notifications are working
- All core workflows are functional and secure