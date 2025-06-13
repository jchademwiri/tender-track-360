# Phase 1 Pages - Foundation & Core Authentication

## Authentication Pages

- `/login` - User login page with Supabase authentication
- `/auth/callback` - Supabase auth callback handler
- `/forgot-password` - Password reset request page
- `/reset-password` - Password reset confirmation page

## Core Layout & Navigation

- `layout.tsx` - Root layout with navigation and role-based menu
- `loading.tsx` - Global loading component
- `error.tsx` - Global error boundary
- `not-found.tsx` - 404 page

## Dashboard Landing Pages (Role-based Redirects)

- `/` - Root page that redirects to appropriate dashboard based on user role
- `/admin` - Admin dashboard (basic layout)
- `/manager` - Tender Manager dashboard (basic layout)
- `/specialist` - Tender Specialist dashboard (basic layout)
- `/viewer` - Viewer dashboard (basic layout)

## Basic User Management (Admin Only)

- `/admin/users` - Users listing page
- `/admin/users/create` - Create new user page (creates user in Supabase + sends invite)
- `/admin/users/[id]` - View/edit user profile page
- `/admin/users/invite` - Bulk user invitation page

## Profile Management

- `/profile` - User profile page (view/edit own profile)
- `/settings` - User settings and preferences

## Server Actions (No API Routes)

- `lib/actions/auth.ts` - Authentication server actions
- `lib/actions/users.ts` - User management server actions
- `lib/actions/profile.ts` - Profile management server actions

## Middleware & Protection

- `middleware.ts` - Route protection and role-based access control with Supabase
- `lib/supabase/` - Supabase client configuration and utilities
- `lib/auth/` - Authentication utilities and session management

## Components (Supporting the Pages)

- `components/ui/` - Basic UI components (Button, Input, Form, Table, etc.)
- `components/auth/` - Authentication-related components
- `components/layout/` - Layout components (Sidebar, Header, Navigation)
- `components/dashboard/` - Basic dashboard components

## Database Setup Files

- Database migrations for Phase 1 tables:
  - Users table
  - User preferences table
  - Basic seed data script

## What Each Page Should Include:

### Authentication Pages:

- **Login**: Email/password form using Supabase auth, forgot password link
- **Auth Callback**: Handle Supabase authentication redirects
- **Forgot Password**: Email input for password reset via Supabase
- **Reset Password**: New password form with Supabase token validation

### Dashboard Pages:

- **Role-specific dashboards**: Basic layout with welcome message and navigation
- **Responsive sidebar**: Role-based menu items
- **Header**: User info, logout, profile access

### User Management (Admin):

- **Users List**: Table with user info, roles, status, actions
- **Create User**: Form for creating user in Supabase + sending invitation email
- **User Profile**: View/edit user details, role management, activation/deactivation
- **Invite Users**: Bulk invitation system for multiple users

### Profile & Settings:

- **Profile**: Edit personal information, change password
- **Settings**: Notification preferences, timezone, display options

## Technical Implementation Notes:

### Next.js 15 App Router Structure:

```
src/app/
├── (auth)/
│   ├── login/page.tsx
│   ├── auth/callback/route.ts
│   ├── forgot-password/page.tsx
│   └── reset-password/page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   └── users/
│   │       ├── page.tsx
│   │       ├── create/page.tsx
│   │       ├── invite/page.tsx
│   │       └── [id]/page.tsx
│   ├── manager/page.tsx
│   ├── specialist/page.tsx
│   └── viewer/page.tsx
├── profile/page.tsx
├── settings/page.tsx
├── lib/
│   ├── actions/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   └── profile.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── auth/
│       ├── utils.ts
│       └── permissions.ts
├── layout.tsx
├── page.tsx
├── loading.tsx
├── error.tsx
├── not-found.tsx
└── globals.css
```

### Key Features to Implement:

1. **Supabase Authentication** with role-based access
2. **Protected Routes** using middleware with Supabase session
3. **Role-based Navigation** showing appropriate menu items
4. **Server Actions** for all data operations (no API routes)
5. **User Invitation System** - Admin creates users and sends invites
6. **Form Validation** using React Hook Form + Zod
7. **Error Handling** with proper user feedback
8. **Loading States** for better UX
9. **Responsive Design** for mobile/desktop

### Server Actions to Implement:

- **auth.ts**: signIn, signOut, resetPassword, updatePassword
- **users.ts**: createUser, inviteUser, updateUser, deleteUser, getUserById, getAllUsers
- **profile.ts**: updateProfile, updatePreferences, changePassword

### Supabase Configuration:

- **Row Level Security (RLS)** policies for user data
- **Email templates** for user invitations
- **Auth callbacks** for post-signup role assignment
- **Integration with your existing database schema**

### Database Tables Used in Phase 1:

- `users` - Core user information (synced with Supabase auth.users)
- `user_preferences` - User settings and preferences

### Supabase Setup Notes:

- Users table will sync with Supabase auth.users via database triggers
- Role assignment happens after user accepts invitation
- Email invitations sent through Supabase with custom templates
- RLS policies ensure users can only access appropriate data

This Phase 1 foundation will provide:

- ✅ Secure Supabase authentication and authorization
- ✅ Admin-controlled user creation and invitation system
- ✅ Role-based access control
- ✅ Server actions for all data operations
- ✅ Responsive layout structure
- ✅ Navigation framework for future phases
- ✅ Email invitation workflow
- ✅ Error handling and loading states
