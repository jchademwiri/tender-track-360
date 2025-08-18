# Implementation Plan

- [ ] 1. Install required dependencies and validate database schema
  - Install @better-fetch/fetch package for proper middleware session handling
  - Create database schema validation script to check Better Auth table structure
  - Run validation script and document any missing columns or incorrect data types
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 2. Fix Better Auth configuration with explicit schema mapping
  - Update src/lib/auth.ts to include explicit schema mapping for all tables
  - Add debug logging configuration to Better Auth instance
  - Enhance emailVerification configuration with proper token logging
  - Add error handling and logging to sendVerificationEmail function
  - _Requirements: 1.1, 1.2, 1.4_

- [ ] 3. Implement enhanced middleware with Better Auth session validation
  - Replace getSessionCookie with betterFetch session validation in src/middleware.ts
  - Add email verification status checking in middleware
  - Implement proper error handling and logging for middleware operations
  - Add redirect logic for unverified users to /verify-email page
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 4. Create verification token lifecycle logging utilities
  - Create logging utilities for token creation, validation, and cleanup
  - Add structured logging with token IDs, user IDs, and timestamps
  - Implement security-conscious logging that doesn't expose sensitive data
  - Add logging to all verification-related database operations
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 5. Create database validation and debugging tools
  - Create script to validate Better Auth database schema completeness
  - Implement verification token inspection tool for debugging
  - Add database query logging for verification table operations
  - Create cleanup script for expired verification tokens
  - _Requirements: 3.1, 3.2, 3.4, 5.3_

- [ ] 6. Enhance email verification flow with comprehensive error handling
  - Update verification email sending to include database token validation
  - Add retry logic for failed database operations during token creation
  - Implement proper error responses for invalid or expired tokens
  - Add user-friendly error messages for verification failures
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 7. Create comprehensive test suite for email verification
  - Write unit tests for Better Auth configuration and token operations
  - Create integration tests for complete email verification flow
  - Add tests for middleware session validation and redirect logic
  - Implement database operation tests for verification table CRUD operations
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 8. Add monitoring and performance optimization
  - Implement database indexes for verification table performance
  - Add performance monitoring for verification token operations
  - Create alerts for high verification failure rates
  - Implement token cleanup job for expired verification tokens
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
