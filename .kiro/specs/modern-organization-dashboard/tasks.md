# Implementation Plan

- [ ] 1. Set up enhanced data models and database schema
  - Create or update Invitation model in database schema
  - Add organization settings fields to existing schema
  - Create database migration for new invitation table
  - Update existing Member model to include status and joinedAt fields
  - _Requirements: 2.2, 4.2, 4.4_

- [ ] 2. Create server actions for invitation management
  - Implement inviteMember server action with email validation and ServerActionResult return type
  - Create cancelInvitation server action for removing pending invites
  - Implement resendInvitation server action for expired invitations
  - Add bulk invitation management server actions (bulkCancelInvitations, bulkRemoveMembers)
  - Ensure all server actions follow Next.js server action patterns with proper error handling
  - Write unit tests for all server actions
  - _Requirements: 2.1, 2.2, 2.3, 4.3, 5.3_

- [ ] 3. Build InviteMemberModal component using shadcn/ui
  - Create Dialog component with DialogContent, DialogHeader, and DialogTitle
  - Build form using Input, Label, Select components with proper dark/light mode support
  - Implement client-side email validation and form state management
  - Add Button loading states and error handling for server action submission
  - Integrate toast notifications using shadcn/ui toast system
  - Ensure full Tailwind CSS styling with dark: prefixes for theme support
  - Write unit tests for modal component and form validation
  - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 7.2, 7.3_

- [ ] 4. Implement enhanced MembersTable component using shadcn/ui
  - Create Table with TableHeader, TableBody, TableRow, TableCell components
  - Add Avatar components with AvatarImage and AvatarFallback for member photos
  - Implement Badge components for status indicators with theme-aware colors
  - Add Checkbox components for member selection in bulk actions
  - Create DropdownMenu components for individual member action menus
  - Implement Skeleton components for loading states
  - Add empty state using Card component with call-to-action Button
  - Ensure full dark/light mode support with Tailwind CSS
  - Write unit tests for table component and interactions
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.1_

- [ ] 5. Build PendingInvitationsSection component
  - Create separate table/list for pending invitations
  - Implement invitation status indicators and expiry date display
  - Add resend and cancel actions for individual invitations
  - Create empty state for when no pending invitations exist
  - Write unit tests for invitation management functionality
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 6. Implement search and filtering functionality
  - Create SearchAndFilters component with input and filter dropdowns
  - Add real-time search functionality for members and invitations
  - Implement role-based and status-based filtering
  - Add clear filters functionality and active filter indicators
  - Create "no results" state for filtered views
  - Write unit tests for search and filter logic
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 7. Build BulkActionsToolbar component
  - Create floating toolbar that appears when items are selected
  - Implement bulk member removal and invitation cancellation
  - Add progress indicators for bulk operations
  - Create confirmation dialogs for destructive bulk actions
  - Add summary results display after bulk operations complete
  - Write unit tests for bulk actions functionality
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.3_

- [ ] 8. Create OrganizationHeader component using shadcn/ui
  - Build Card component with CardHeader and CardContent for organization details
  - Use Avatar component with AvatarImage and AvatarFallback for organization logo
  - Add Button components for edit capabilities (if admin)
  - Implement responsive layout using Tailwind CSS responsive prefixes
  - Ensure proper dark/light mode styling throughout
  - Write unit tests for header component
  - _Requirements: 1.1, 1.4_

- [ ] 9. Implement OrganizationStats component using shadcn/ui
  - Create grid of Card components with CardHeader and CardContent for metrics
  - Use Badge components for highlighting key numbers and status
  - Add Skeleton components for loading states matching card layout
  - Implement responsive grid using Tailwind CSS grid utilities
  - Ensure theme-aware styling for dark/light mode
  - Write unit tests for stats calculations and display
  - _Requirements: 1.2_

- [ ] 10. Build main OrganizationDashboard page component
  - Update the main page component to use new modern layout
  - Integrate all sub-components with proper data flow
  - Implement responsive layout with mobile-first approach
  - Add loading states and error boundaries
  - Create comprehensive integration tests for full page functionality
  - _Requirements: 1.3, 7.1, 7.4_

- [ ] 11. Add comprehensive error handling and user feedback
  - Implement toast notification system integration
  - Add loading skeletons for all data loading states
  - Create user-friendly error messages for all failure scenarios
  - Add confirmation dialogs for all destructive actions
  - Write tests for error handling and user feedback flows
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 12. Implement responsive design and dark/light mode optimization
  - Ensure all shadcn/ui components work properly on mobile devices using Tailwind responsive prefixes
  - Create mobile-specific layouts where needed (Card view replacing Table on small screens)
  - Test and optimize touch interactions for mobile using proper Button sizing
  - Verify dark/light mode works correctly across all components
  - Ensure accessibility compliance across all shadcn/ui components
  - Test theme switching functionality and system preference detection
  - Write responsive design and theme tests
  - _Requirements: 1.3_
