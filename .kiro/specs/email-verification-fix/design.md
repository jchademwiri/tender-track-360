# Email Verification Database Fix - Design

## Overview

This design addresses the email verification database issues in Tender Track 360 by fixing the Better Auth configuration, enhancing middleware, validating database schema, and implementing comprehensive logging. The solution ensures verification tokens are properly stored and processed according to Better Auth best practices.

## Architecture

### Current State Analysis

- Better Auth is configured with Drizzle adapter using `schema` object from `src/db/schema/auth.ts`
- The verification table exists in the database and schema definition
- Email verification is enabled and emails are being sent successfully
- However, verification tokens are not being saved to the database during the signup process

### Root Cause Analysis

The issue is likely in how the schema is being passed to the Drizzle adapter. The current configuration uses:

```typescript
database: drizzleAdapter(db, {
  provider: 'pg',
  schema, // This might not be mapping correctly to Better Auth's expectations
});
```

### Target State

- Better Auth Drizzle adapter properly configured with explicit table mapping
- Verification tokens successfully saved to and retrieved from the database
- Comprehensive logging to confirm database operations are working
- Simple test utilities to validate the fix

## Components and Interfaces

### 1. Better Auth Configuration (`src/lib/auth.ts`)

**Current Issues:**

- The schema object being passed to drizzleAdapter might not be properly recognized by Better Auth
- Missing explicit import and mapping of individual table schemas
- Insufficient logging for debugging verification token operations

**Design Changes:**

```typescript
import { user, session, account, verification } from '@/db/schema/auth';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      account,
      verification, // Explicit individual table mapping
    },
  }),
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log(`[VERIFICATION] Creating token for user ${user.id}:`, {
        tokenPreview: token?.substring(0, 8) + '...',
        userEmail: user.email,
        timestamp: new Date().toISOString(),
      });

      await resend.emails.send({
        from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
        to: user.email,
        subject: 'Verify your email address',
        react: VerifyEmail({
          username: user.name,
          verificationUrl: url,
        }),
      });

      console.log(`[VERIFICATION] Email sent successfully to ${user.email}`);
    },
    sendOnSignUp: true,
    expiresIn: 3600,
    autoSignInAfterVerification: true,
  },
  // ... rest of configuration
});
```

### 2. Database Testing and Validation Utilities

**Purpose:** Create simple utilities to test and validate that verification tokens are being saved correctly.

**Design Changes:**

```typescript
// Create a test utility file: src/lib/verification-test.ts
import { db } from '@/db';
import { verification } from '@/db/schema/auth';
import { eq } from 'drizzle-orm';

export async function testVerificationTokenOperations() {
  console.log('[TEST] Starting verification token database tests...');

  // Test 1: Insert a test token
  const testToken = {
    id: 'test-' + Date.now(),
    identifier: 'test@example.com',
    value: 'test-token-' + Math.random().toString(36).substring(7),
    expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
  };

  try {
    await db.insert(verification).values(testToken);
    console.log('[TEST] ✅ Token insertion successful:', testToken.id);
  } catch (error) {
    console.error('[TEST] ❌ Token insertion failed:', error);
    return false;
  }

  // Test 2: Query the token back
  try {
    const retrieved = await db
      .select()
      .from(verification)
      .where(eq(verification.id, testToken.id));
    console.log('[TEST] ✅ Token retrieval successful:', retrieved[0]);
  } catch (error) {
    console.error('[TEST] ❌ Token retrieval failed:', error);
    return false;
  }

  // Test 3: Clean up test token
  try {
    await db.delete(verification).where(eq(verification.id, testToken.id));
    console.log('[TEST] ✅ Token cleanup successful');
  } catch (error) {
    console.error('[TEST] ❌ Token cleanup failed:', error);
  }

  return true;
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
