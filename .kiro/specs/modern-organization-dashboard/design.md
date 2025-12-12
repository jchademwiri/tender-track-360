# Design Document

## Overview

The modern organization dashboard will be built as a comprehensive React component that replaces the existing simple organization page. The design follows a card-based layout with clear sections for organization overview, member management, and invitation handling. The interface will be responsive and use modern UI patterns with proper loading states, error handling, and user feedback.

**Technology Stack:**

- **UI Components**: shadcn/ui component library for consistent, accessible components
- **Styling**: Tailwind CSS for utility-first styling with full dark/light mode support
- **Server Logic**: Next.js server actions exclusively (no API routes)
- **Theme Support**: Built-in dark/light mode toggle with system preference detection

## Architecture

### Component Structure

```
OrganizationDashboard (Server Component)
├── OrganizationHeader (Client Component)
├── OrganizationStats (Server Component)
├── InviteMemberModal (Client Component)
├── MembersSection (Client Component)
│   ├── MembersTable (Client Component)
│   └── MemberActions (Client Component)
├── PendingInvitationsSection (Client Component)
│   ├── InvitationsTable (Client Component)
│   └── InvitationActions (Client Component)
└── BulkActionsToolbar (Client Component)
```

### Data Flow

- Server component fetches organization data, members, and pending invitations
- Client components handle user interactions and state management
- All form submissions and data mutations use Next.js server actions exclusively
- Real-time updates use router.refresh() after successful server action operations
- No API routes - all server-side logic implemented as server actions

## Components and Interfaces

### OrganizationDashboard (Main Page Component)

```typescript
interface OrganizationDashboardProps {
  params: { slug: string };
}

interface OrganizationData {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  createdAt: Date;
  members: Member[];
  pendingInvitations: Invitation[];
}
```

### InviteMemberModal

```typescript
interface InviteMemberModalProps {
  organizationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface InviteMemberForm {
  email: string;
  role: 'admin' | 'member' | 'viewer';
}
```

### MembersTable

```typescript
interface MembersTableProps {
  members: Member[];
  onMemberAction: (memberId: string, action: string) => void;
  selectedMembers: string[];
  onSelectionChange: (memberIds: string[]) => void;
}

interface Member {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: string;
  joinedAt: Date;
  status: 'active' | 'inactive';
}
```

### PendingInvitationsSection

```typescript
interface PendingInvitationsSectionProps {
  invitations: Invitation[];
  onInvitationAction: (invitationId: string, action: string) => void;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  invitedAt: Date;
  expiresAt: Date;
  status: 'pending' | 'expired';
}
```

## Data Models

### Enhanced Organization Model

```typescript
interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  members: Member[];
  pendingInvitations: Invitation[];
  settings: OrganizationSettings;
}

interface OrganizationSettings {
  allowMemberInvites: boolean;
  defaultMemberRole: string;
  invitationExpiryDays: number;
}
```

### Invitation Model

```typescript
interface Invitation {
  id: string;
  organizationId: string;
  email: string;
  role: string;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  token: string;
}
```

## User Interface Design

### shadcn/ui Component Usage

**Core Components:**

- `Card`, `CardHeader`, `CardContent`, `CardFooter` for layout sections
- `Button` with variants (default, destructive, outline, ghost)
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` for data display
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` for modals
- `Input`, `Label`, `Select`, `SelectContent`, `SelectItem` for forms
- `Badge` for status indicators with variant colors
- `Avatar`, `AvatarImage`, `AvatarFallback` for user photos
- `Skeleton` for loading states
- `Checkbox` for bulk selection
- `DropdownMenu` for action menus
- `Separator` for visual divisions

**Theme Integration:**

- All components automatically support dark/light mode via CSS variables
- Use `className` with Tailwind utilities for custom styling
- Leverage `dark:` prefixes for theme-specific overrides

### Layout Structure

1. **Header Section**: Card with organization name, description, avatar using Avatar component
2. **Stats Cards**: Grid of Card components showing metrics with Badge indicators
3. **Action Bar**: Flex container with Input (search), Select (filters), and Button (invite)
4. **Members Section**: Card containing Table with Avatar, Badge, and DropdownMenu components
5. **Pending Invitations**: Separate Card with Table for invitation management
6. **Bulk Actions**: Fixed positioned Card with Button group for selected items

### Visual Design Patterns

- **shadcn/ui Components**: Use Card, Button, Table, Dialog, Input, Select, Badge, Avatar components
- **Tailwind CSS Styling**: Utility-first approach with consistent spacing scale
- **Dark/Light Mode**: Full theme support using CSS variables and `dark:` prefixes
- **Color System**: Theme-aware colors (green for active, yellow for pending, red for expired)
- **Typography**: Consistent text sizing using Tailwind typography scale
- **Loading States**: Skeleton components from shadcn/ui matching final layout structure
- **Responsive Design**: Mobile-first approach with Tailwind responsive prefixes

### Responsive Behavior

- Desktop: Full table layout with all columns visible
- Tablet: Condensed table with some columns hidden, expandable rows
- Mobile: Card-based layout replacing tables, stacked information

## Error Handling

### Client-Side Validation

- Email format validation using regex pattern
- Required field validation before form submission
- Role selection validation ensuring valid options
- Duplicate email checking against existing members and pending invitations

### Server Actions Error Handling

```typescript
// Server Action Response Pattern
interface ServerActionResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Example Server Action
async function inviteMemberAction(
  organizationId: string,
  formData: FormData
): Promise<ServerActionResult<Invitation>> {
  // Server action implementation with validation and error handling
}

// Error scenarios to handle:
// - Invalid email format
// - Email already exists as member
// - Email already has pending invitation
// - Organization not found
// - Insufficient permissions
// - Rate limiting exceeded
```

### User Feedback

- Toast notifications for success/error states
- Inline form validation errors
- Loading states with progress indicators
- Confirmation dialogs for destructive actions
- Empty states with helpful call-to-action messages

## Testing Strategy

### Unit Tests

- Component rendering with various props
- Form validation logic
- State management functions
- Utility functions for data formatting

### Integration Tests

- Complete invitation flow from form submission to success
- Member management actions (edit role, remove member)
- Search and filtering functionality
- Bulk actions workflow

### E2E Tests

- Full organization dashboard page load
- Invite member end-to-end flow
- Member management operations
- Responsive behavior across device sizes

### Test Data Requirements

- Organizations with various member counts (0, 1, many)
- Different member roles and statuses
- Pending invitations in various states
- Edge cases like expired invitations and duplicate emails

## Performance Considerations

### Optimization Strategies

- Server-side rendering for initial page load
- Client-side state management for interactive elements
- Debounced search input to reduce API calls
- Pagination for large member lists
- Lazy loading for member avatars

### Caching Strategy

- Organization data cached at server level
- Member list cached with invalidation on mutations
- Avatar images cached with appropriate headers
- Search results cached temporarily on client

## Security Considerations

### Access Control

- Verify user has admin permissions for organization
- Validate organization ownership before displaying data
- Rate limiting on invitation endpoints
- CSRF protection on form submissions

### Data Validation

- Server-side validation of all form inputs
- Email sanitization before database storage
- Role validation against allowed values
- Organization ID validation in all operations
