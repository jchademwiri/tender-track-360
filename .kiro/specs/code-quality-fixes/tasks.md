# Implementation Plan

- [ ] 1. Fix critical ESLint errors preventing builds
  - [ ] 1.1 Fix unescaped characters in organization page JSX
    - Replace unescaped quotes and apostrophes with HTML entities in `src/app/(dashboard)/organization/[slug]/page.tsx`
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ] 1.2 Fix variable declaration issues
    - Change `let membersError` to `const membersError` in organization page
    - _Requirements: 4.1, 4.2_

- [ ] 2. Clean up unused imports and variables in dashboard components
  - [ ] 2.1 Remove unused imports from dashboard page
    - Remove unused React imports (Suspense, components) from `src/app/(dashboard)/organization/[slug]/dashboard/page.tsx`
    - Remove unused server function imports
    - _Requirements: 2.1, 2.2_
  - [ ] 2.2 Clean up unused variables and parameters
    - Remove or properly handle unused parameters like `params` in dashboard page
    - Remove unused error boundary and loading components
    - _Requirements: 2.2, 2.3_

- [ ] 3. Fix Next.js optimization warnings
  - [ ] 3.1 Replace img tags with Next.js Image component
    - Update `src/app/profile/components/organization-info.tsx` to use Next.js Image
    - Import and configure Image component properly
    - _Requirements: 5.1, 5.2_

- [ ] 4. Clean up unused code in component files
  - [ ] 4.1 Remove unused imports from animation and example components
    - Clean up `src/components/animation-demo.tsx` unused imports
    - Fix `src/components/examples/bulk-actions-example.tsx` unused useState
    - _Requirements: 2.1, 2.2_
  - [ ] 4.2 Clean up table and grid component unused variables
    - Remove unused variables in members table components
    - Clean up organization grid unused imports
    - _Requirements: 2.2, 2.3_

- [ ] 5. Fix server-side code quality issues
  - [ ] 5.1 Clean up unused imports in server functions
    - Remove unused auth and headers imports from `src/server/invitations.ts`
    - Remove unused result variable assignments
    - _Requirements: 2.1, 2.2_

- [ ] 6. Clean up test file unused variables
  - [ ] 6.1 Remove unused imports and variables from test files
    - Clean up unused screen, fireEvent, waitFor imports across test files
    - Remove unused mock variables and parameters
    - _Requirements: 2.1, 2.2_
  - [ ]\* 6.2 Update test assertions if needed
    - Verify tests still pass after cleanup
    - Update any broken test expectations
    - _Requirements: 4.4_

- [ ] 7. Validate fixes and ensure build success
  - [ ] 7.1 Run ESLint to verify all errors are resolved
    - Execute ESLint on all modified files
    - Confirm no critical errors remain
    - _Requirements: 1.1, 1.2_
  - [ ] 7.2 Verify successful production build
    - Run `pnpm build` to ensure build completes without errors
    - Confirm all TypeScript and ESLint checks pass
    - _Requirements: 1.1, 1.2, 4.4_
  - [ ]\* 7.3 Run existing test suite
    - Execute all tests to ensure no functionality was broken
    - Fix any tests that may have been affected by cleanup
    - _Requirements: 2.4, 4.3_
