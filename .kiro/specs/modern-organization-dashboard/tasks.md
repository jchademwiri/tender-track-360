# Implementation Plan

- [x] 1. Create server actions for invitation management
  - Implement inviteMember server action with email validation and ServerActionResult return type
  - Create cancelInvitation server action for removing pending invites
  - Implement resendInvitation server action for expired invitations
  - Add bulk invitation management server actions (bulkCancelInvitations, bulkRemoveMembers)
  - Ensure all server actions follow Next.js server action patterns with proper error handling
  - _Requirements: 2.1, 2.2, 2.3, 4.3, 5.3_

- [x] 2. Build InviteMemberModal component using shadcn/ui
  - Create Dialog component with DialogContent, DialogHeader, and DialogTitle
  - Build form using Input, Label, Select components with proper dark/light mode support
  - Implement client-side email validation and form state management
  - Add Button loading states and error handling for server action submission
  - Integrate toast notifications using existing sonner toast system
  - Ensure full Tailwind CSS styling with dark: prefixes for theme support
  - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 7.2, 7.3_

- [x] 3. Enhance existing MembersTable component using shadcn/ui
  - Add Avatar components with AvatarImage and AvatarFallback for member photos
  - Implement Badge components for status indicators with theme-aware colors
  - Add Checkbox components for member selection in bulk actions
  - Enhance existing DropdownMenu in MembersTableAction for more actions (edit role, etc.)
  - Implement Skeleton components for loading states
  - Add empty state using Card component with call-to-action Button
  - Add join date display and status indicators
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.1_

- [x] 4. Build PendingInvitationsSection component
  - Create separate table/list for pending invitations using existing Table components
  - Implement invitation status indicators and expiry date display using Badge components
  - Add resend and cancel actions for individual invitations
  - Create empty state for when no pending invitations exist
  - Integrate with invitation server actions from task 1
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 5. Implement search and filtering functionality
  - Create SearchAndFilters component with Input and Select components
  - Add real-time search functionality for members and invitations
  - Implement role-based and status-based filtering using existing role types
  - Add clear filters functionality and active filter indicators using Badge components
  - Create "no results" state for filtered views
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 6. Build BulkActionsToolbar component
  - Create floating toolbar using Card component that appears when items are selected
  - Implement bulk member removal and invitation cancellation using server actions
  - Add progress indicators for bulk operations using existing loading patterns
  - Create confirmation dialogs for destructive bulk actions using Dialog component
  - Add summary results display after bulk operations complete using toast notifications
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.3_

- [x] 7. Create OrganizationHeader component using shadcn/ui
  - Build Card component with CardHeader and CardContent for organization details
  - Use Avatar component with AvatarImage and AvatarFallback for organization logo
  - Add Button components for edit capabilities (if admin)
  - Implement responsive layout using Tailwind CSS responsive prefixes
  - Ensure proper dark/light mode styling throughout
  - _Requirements: 1.1, 1.4_

- [x] 8. Implement OrganizationStats component using shadcn/ui
  - Create grid of Card components with CardHeader and CardContent for metrics
  - Use Badge components for highlighting key numbers and status
  - Add Skeleton components for loading states matching card layout
  - Implement responsive grid using Tailwind CSS grid utilities
  - Integrate with existing getOrganizationStats server function
  - Ensure theme-aware styling for dark/light mode
  - _Requirements: 1.2_

- [x] 9. Update main OrganizationDashboard page component
  - Replace existing minimal dashboard page with new modern layout
  - Integrate all sub-components (OrganizationHeader, OrganizationStats, enhanced MembersTable, PendingInvitationsSection)
  - Fetch organization data, members, and pending invitations using existing server functions
  - Implement responsive layout with mobile-first approach
  - Add loading states and error boundaries
  - _Requirements: 1.3, 7.1, 7.4_

- [ ] 10. Add comprehensive error handling and user feedback
  - Enhance existing toast notification system integration
  - Add loading skeletons for all data loading states using Skeleton components
  - Create user-friendly error messages for all failure scenarios
  - Add confirmation dialogs for all destructive actions using Dialog component
  - Ensure consistent error handling patterns across all components
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 11. Implement responsive design and accessibility optimization
  - Ensure all shadcn/ui components work properly on mobile devices using Tailwind responsive prefixes
  - Create mobile-specific layouts where needed (Card view replacing Table on small screens)
  - Test and optimize touch interactions for mobile using proper Button sizing
  - Verify dark/light mode works correctly across all components
  - Ensure accessibility compliance across all shadcn/ui components
  - Test keyboard navigation and screen reader compatibility
  - _Requirements: 1.3_
