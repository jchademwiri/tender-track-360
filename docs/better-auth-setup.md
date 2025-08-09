# Better Auth Setup Documentation

## Overview

This document describes the Better Auth integration with Drizzle ORM for Tender Track 360, providing organization-based multi-tenancy with role-based access control.

## Configuration

### Environment Variables

Required environment variables in `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tender-track-360
BETTER_AUTH_SECRET=D5cX2E593M73kymzuopOCuBizR1C40L5
BETTER_AUTH_URL=http://localhost:3000
RESEND_API_KEY=re_epVCAisa_N5bzypz4XpBYQw7pstXt7UTP
```

### Better Auth Configuration

Located in `src/lib/auth.ts`:

- **Database Adapter**: Drizzle PostgreSQL adapter
- **Email/Password Authentication**: Enabled with email verification
- **Session Management**: 7-day expiry with 1-day update age
- **Organization Plugin**: Multi-tenant support with role-based access
- **Roles**: admin, tender_manager, tender_specialist, viewer
- **Default Role**: viewer
- **Email Service**: Resend integration for verification and invitations
- **Domain**: updates.jacobc.co.za

### Database Schema

Better Auth automatically creates these tables:

- `user` - User accounts
- `session` - User sessions
- `account` - OAuth accounts (for future social login)
- `verification` - Email verification tokens
- `organization` - Organizations for multi-tenancy
- `member` - Organization membership with roles
- `invitation` - Organization invitations

## API Endpoints

Better Auth provides these endpoints via `/api/auth/[...all]`:

### Authentication

- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User sign-in
- `POST /api/auth/sign-out` - User sign-out
- `GET /api/auth/session` - Get current session

### Organization Management

- `POST /api/auth/organization/create` - Create organization
- `GET /api/auth/organization/list` - List user organizations
- `GET /api/auth/organization/get-full` - Get organization details
- `POST /api/auth/organization/invite-member` - Invite member
- `POST /api/auth/organization/remove-member` - Remove member
- `POST /api/auth/organization/update-member-role` - Update member role

## Server-Side Usage

### Server Actions

Import from `src/server/auth-actions.ts`:

```typescript
import {
  signUpAction,
  signInAction,
  signOutAction,
  createOrganizationAction,
  inviteMemberAction,
} from '@/server/auth-actions';

// Use in forms
<form action={signUpAction}>
  <input name="email" type="email" required />
  <input name="password" type="password" required />
  <input name="name" type="text" required />
  <button type="submit">Sign Up</button>
</form>;
```

### Auth Utilities

Import from `src/server/auth-utils.ts`:

```typescript
import {
  requireAuth,
  requireRole,
  hasRole,
  getActiveOrganization,
} from '@/server/auth-utils';

// Protect server actions/pages
const session = await requireAuth();
const adminSession = await requireRole('admin');

// Check permissions
if (hasRole(userRole, 'tender_manager')) {
  // User can manage tenders
}
```

### Email Service

Located in `src/server/email.ts`:

- **Verification Emails**: Sent automatically on user registration
- **Invitation Emails**: Sent when inviting organization members
- **Domain**: updates.jacobc.co.za
- **Templates**: Professional HTML email templates
- **Error Handling**: Comprehensive error logging

## Client-Side Usage

Import from `src/lib/auth-client.ts`:

```typescript
import {
  signIn,
  signUp,
  signOut,
  useSession,
  createOrganization,
  inviteMember,
} from '@/lib/auth-client';

// Sign up
await signUp.email({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe',
});

// Sign in
await signIn.email({
  email: 'user@example.com',
  password: 'password123',
});

// Use session in React components
const { data: session } = useSession();

// Create organization
await createOrganization({
  name: 'My Company',
  slug: 'my-company',
});

// Invite member
await inviteMember({
  email: 'member@example.com',
  role: 'tender_specialist',
});
```

## Role-Based Access Control

### Available Roles

1. **admin** - Full system access
2. **tender_manager** - Manage tenders and team members
3. **tender_specialist** - Create and edit tenders
4. **viewer** - Read-only access

### Role Assignment

- Users are assigned roles when invited to organizations
- Default role is 'viewer'
- Organization creators automatically get 'admin' role
- Roles can be updated by organization admins

## Multi-Tenant Architecture

### Organization Isolation

- All business data is scoped to organizations via `organization_id`
- Users can belong to multiple organizations
- Active organization is tracked in session
- Database queries automatically filter by organization

### Data Access Patterns

```typescript
// All queries should include organization filter
const tenders = await db
  .select()
  .from(tendersTable)
  .where(eq(tendersTable.organizationId, session.user.activeOrganizationId));
```

## Testing

Run the setup tests:

```bash
# Test Better Auth configuration
npx tsx scripts/test-auth.ts

# Test user creation flow
npx tsx scripts/test-user-creation.ts

# Test Resend email integration
npx tsx scripts/test-resend.ts
```

## Development Workflow

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Test user registration:

   ```bash
   curl -X POST http://localhost:3000/api/auth/sign-up \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
   ```

3. Test user sign-in:
   ```bash
   curl -X POST http://localhost:3000/api/auth/sign-in \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

## Security Features

- **Password Hashing**: Automatic secure password hashing
- **Session Security**: Secure session tokens with expiration
- **Email Verification**: Required for account activation
- **CSRF Protection**: Built-in CSRF protection
- **Rate Limiting**: Built-in rate limiting for auth endpoints
- **Organization Isolation**: Database-level multi-tenancy

## Next Steps

1. Implement UI components for authentication
2. Add password reset functionality
3. Implement social login providers
4. Add audit logging for authentication events
5. Set up email service for verification and invitations

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: Ensure PostgreSQL is running and DATABASE_URL is correct
2. **Environment Variables**: Ensure all required env vars are set
3. **Session Issues**: Check BETTER_AUTH_SECRET is set and consistent
4. **CORS Issues**: Ensure BETTER_AUTH_URL matches your domain

### Debug Mode

Enable debug logging by setting:

```env
DEBUG=better-auth:*
```
