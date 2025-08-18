# Implementation Plan

- [ ] 1. Fix Better Auth Drizzle adapter schema configuration
  - Update src/lib/auth.ts to import individual table schemas (user, session, account, verification) instead of using the schema object
  - Modify drizzleAdapter configuration to use explicit table mapping
  - Add comprehensive logging to sendVerificationEmail function to track token creation
  - Test the configuration change by attempting a signup and checking server logs
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Create database testing utilities for verification tokens
  - Create src/lib/verification-test.ts with functions to test verification token CRUD operations
  - Implement testVerificationTokenOperations function to insert, query, and delete test tokens
  - Add logging to confirm database operations are working correctly
  - Create a simple script to run these tests independently of Better Auth
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 3. Add comprehensive logging to email verification process
  - Enhance sendVerificationEmail function with detailed logging of token creation
  - Add logging to track when verification tokens are queried during verification attempts
  - Implement structured logging that includes user ID, token preview, and timestamps
  - Add error logging for any database operation failures during verification
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 4. Test and validate the complete email verification flow
  - Test user signup process and verify tokens are saved to database
  - Test email verification link clicking and token validation
  - Verify that successful verification marks user as verified and removes token
  - Test error scenarios like expired tokens and invalid tokens
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 5. Create debugging and monitoring tools
  - Create a simple admin utility to view verification tokens in the database
  - Implement a cleanup script for expired verification tokens
  - Add database query logging for all verification table operations
  - Create alerts or notifications for verification failures
  - _Requirements: 2.1, 2.2, 2.3, 2.4_
