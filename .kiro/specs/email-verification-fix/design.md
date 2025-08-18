# Email Verification Database Fix - Design

## Overview

This design addresses the email verification database issues in Tender Track 360 by fixing the Better Auth configuration, enhancing middleware, validating database schema, and implementing comprehensive logging. The solution ensures verification tokens are properly stored and processed according to Better Auth best practices.

## Architecture

### Current State Analysis

- Better Auth is configured with Drizzle adapter but missing proper schema mapping
- Middleware uses basic cookie checking instead of Better Auth session validation
- Verification table exists but may not be properly integrated with Better Auth
- Email verification is enabled but tokens aren't being saved to database

### Target State

- Properly configured Better Auth with correct database adapter settings
- Enhanced middleware using Better Auth's recommended session management
- Validated database schema matching Better Auth requirements
- Comprehensive logging for debugging and monitoring

## Components and Interfaces

### 1. Better Auth Configuration (`src/lib/auth.ts`)

**Current Issues:**

- Organization plugin commented out but may be needed
- Missing explicit schema mapping for verification table
- Insufficient logging for debugging

**Design Changes:**

```typescript
// Enhanced configuration with proper schema mapping
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      account,
      verification, // Explicit mapping
    },
  }),
  // Add debug logging
  logger: {
    level: 'debug',
    disabled: false,
  },
  // Enhanced email verification config
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log(`Creating verification token for user ${user.id}: ${token}`);
      // existing email sending logic
    },
    sendOnSignUp: true,
    expiresIn: 3600,
    autoSignInAfterVerification: true,
  },
});
```

### 2. Enhanced Middleware (`src/middleware.ts`)

**Current Issues:**

- Uses `getSessionCookie` instead of proper Better Auth session validation
- Doesn't handle email verification status
- Missing comprehensive logging

**Design Changes:**

```typescript
import { betterFetch } from '@better-fetch/fetch';

export async function middleware(request: NextRequest) {
  try {
    // Use Better Auth's recommended session validation
    const session = await betterFetch('/api/auth/session', {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    if (!session.data) {
      console.log('No session found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check email verification status
    if (!session.data.user.emailVerified) {
      console.log(
        `User ${session.data.user.id} not verified, redirecting to verify-email`
      );
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

### 3. Database Schema Validation

**Verification Table Requirements:**

- `id`: Primary key (text)
- `identifier`: User identifier (text, not null)
- `value`: Token value (text, not null)
- `expiresAt`: Expiration timestamp (timestamp, not null)
- `createdAt`: Creation timestamp (timestamp)
- `updatedAt`: Update timestamp (timestamp)

**Validation Script:**

```typescript
// Database schema validation utility
export async function validateBetterAuthSchema() {
  const tables = ['user', 'session', 'account', 'verification'];

  for (const table of tables) {
    const result = await db.execute(sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = ${table}
    `);
    console.log(`Table ${table}:`, result);
  }
}
```

### 4. Enhanced Logging System

**Verification Token Lifecycle Logging:**

```typescript
// Token creation logging
const logTokenCreation = (userId: string, token: string, expiresAt: Date) => {
  console.log(`[VERIFICATION] Token created for user ${userId}`, {
    tokenId: token.substring(0, 8) + '...',
    expiresAt: expiresAt.toISOString(),
    timestamp: new Date().toISOString(),
  });
};

// Token validation logging
const logTokenValidation = (
  token: string,
  isValid: boolean,
  reason?: string
) => {
  console.log(`[VERIFICATION] Token validation`, {
    tokenId: token.substring(0, 8) + '...',
    isValid,
    reason,
    timestamp: new Date().toISOString(),
  });
};
```

## Data Models

### Verification Token Model

```typescript
interface VerificationToken {
  id: string; // Primary key
  identifier: string; // User email or ID
  value: string; // Token value
  expiresAt: Date; // Expiration time
  createdAt?: Date; // Creation time
  updatedAt?: Date; // Last update time
}
```

### Session Data Model

```typescript
interface SessionData {
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
}
```

## Error Handling

### Database Connection Errors

- Implement retry logic for transient database failures
- Log detailed error information for debugging
- Provide fallback behavior when database is unavailable

### Token Validation Errors

- Handle expired tokens gracefully
- Provide clear error messages for invalid tokens
- Log all validation attempts for security monitoring

### Email Sending Errors

- Retry failed email sends with exponential backoff
- Log email delivery status
- Provide user feedback for email sending issues

## Testing Strategy

### Unit Tests

- Test Better Auth configuration with mock database
- Test middleware session validation logic
- Test verification token creation and validation
- Test error handling scenarios

### Integration Tests

- Test complete email verification flow
- Test database operations with real database
- Test email sending integration
- Test middleware with actual Better Auth session

### End-to-End Tests

- Test user signup with email verification
- Test verification link clicking
- Test resend verification email functionality
- Test protected route access after verification

### Database Tests

- Verify all required tables exist
- Test verification token CRUD operations
- Test token expiration cleanup
- Test database constraint enforcement

## Performance Considerations

### Database Optimization

- Add indexes on verification table for faster lookups
- Implement token cleanup job for expired tokens
- Use connection pooling for database operations

### Caching Strategy

- Cache session data to reduce database queries
- Implement token validation caching with short TTL
- Cache user verification status

### Monitoring

- Track verification success/failure rates
- Monitor database query performance
- Alert on high error rates or slow responses

## Security Considerations

### Token Security

- Use cryptographically secure random token generation
- Implement proper token expiration
- Prevent token reuse after successful verification

### Database Security

- Use parameterized queries to prevent SQL injection
- Implement proper access controls on verification table
- Log all verification attempts for security monitoring

### Session Security

- Validate session integrity in middleware
- Implement proper session expiration
- Use secure cookie settings for session management
