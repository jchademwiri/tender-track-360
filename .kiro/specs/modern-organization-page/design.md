# Design Document

## Overview

The modern organization page will transform the current basic organization selector into a comprehensive, visually appealing dashboard that serves as the central hub for organization management. The design emphasizes modern UI patterns, improved user experience, and enhanced functionality while maintaining the existing authentication and organization switching capabilities.

## Architecture

### Component Structure

```
OrganizationPage (Server Component)
├── OrganizationPageHeader
├── OrganizationSearch (when >3 orgs)
├── OrganizationGrid
│   ├── OrganizationCard (for each org)
│   │   ├── OrganizationAvatar
│   │   ├── OrganizationInfo
│   │   ├── OrganizationStats
│   │   └── OrganizationActions
│   └── CreateOrganizationCard
├── RecentActivitySection
└── CreateOrganizationDialog (enhanced)
```

### Layout Strategy

- **Grid-based layout**: Responsive CSS Grid for organization cards
- **Card-first design**: Each organization represented as a modern card
- **Progressive disclosure**: Show more details on hover/interaction
- **Mobile-first responsive**: Adapts from single column to multi-column grid

## Components and Interfaces

### 1. OrganizationPageHeader

```typescript
interface OrganizationPageHeaderProps {
  organizationCount: number;
  activeOrganization?: Organization;
}
```

- Clean, modern header with title and subtitle
- Shows current active organization if available
- Includes organization count for context

### 2. OrganizationCard

```typescript
interface OrganizationCardProps {
  organization: Organization;
  memberCount: number;
  isActive: boolean;
  recentActivity?: ActivitySummary;
  userRole: Role;
}

interface ActivitySummary {
  lastActivity: Date;
  activeProjects?: number;
  recentUpdates?: number;
}
```

**Visual Design:**

- Card with subtle shadow and hover effects
- Organization avatar (logo or generated initials)
- Organization name and creation date
- Member count badge
- Role indicator
- Quick action buttons (Enter, Settings, Leave)
- Recent activity indicator

### 3. OrganizationSearch

```typescript
interface OrganizationSearchProps {
  organizations: Organization[];
  onFilter: (filtered: Organization[]) => void;
}
```

- Appears when user has more than 3 organizations
- Real-time search with debouncing
- Search by organization name
- Clear search functionality

### 4. CreateOrganizationCard

```typescript
interface CreateOrganizationCardProps {
  className?: string;
}
```

- Dashed border card design
- Plus icon and "Create Organization" text
- Opens enhanced creation dialog
- Matches organization card dimensions

### 5. RecentActivitySection

```typescript
interface RecentActivityProps {
  activities: RecentActivity[];
  organizations: Organization[];
}

interface RecentActivity {
  id: string;
  organizationId: string;
  type: 'member_joined' | 'project_created' | 'document_updated';
  description: string;
  timestamp: Date;
  user?: User;
}
```

### 6. Enhanced CreateOrganizationDialog

- Modern form design with better validation
- Real-time feedback
- Loading states
- Success animations
- Organization slug generation preview

## Data Models

### Extended Organization Data

```typescript
interface OrganizationWithStats extends Organization {
  memberCount: number;
  userRole: Role;
  lastActivity?: Date;
  activeProjects?: number;
}
```

### Activity Tracking

```typescript
interface ActivitySummary {
  organizationId: string;
  lastActivity: Date;
  activityCount: number;
  recentMembers: number;
}
```

## Error Handling

### Loading States

- Skeleton cards while organizations load
- Progressive loading for organization stats
- Graceful degradation if stats fail to load

### Error States

- Network error handling with retry options
- Empty state when no organizations exist
- Search no-results state
- Organization creation failure handling

### Validation

- Real-time form validation for organization creation
- Duplicate name checking
- Slug availability validation

## Testing Strategy

### Unit Tests

- Component rendering with different props
- Search functionality
- Form validation logic
- Error state handling

### Integration Tests

- Organization creation flow
- Organization switching
- Search and filter functionality
- Responsive behavior

### Visual Tests

- Card hover states
- Loading animations
- Empty states
- Mobile responsiveness

## Implementation Details

### Styling Approach

- Tailwind CSS with existing design system
- CSS Grid for responsive layout
- Framer Motion for subtle animations
- Custom CSS variables for consistent spacing

### Performance Considerations

- Server-side rendering for initial load
- Client-side hydration for interactive features
- Lazy loading for organization stats
- Debounced search to reduce API calls

### Responsive Breakpoints

```css
/* Mobile: 1 column */
@media (max-width: 640px) {
  grid-template-columns: 1fr;
}

/* Tablet: 2 columns */
@media (min-width: 641px) and (max-width: 1024px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Desktop: 3+ columns */
@media (min-width: 1025px) {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}
```

### Animation Strategy

- Subtle hover effects on cards (scale, shadow)
- Smooth transitions for state changes
- Loading skeleton animations
- Success feedback animations

### Accessibility

- Proper ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly descriptions
- High contrast mode support
- Focus management for modals

## API Requirements

### New Endpoints Needed

```typescript
// Get organization stats
GET /api/organizations/[id]/stats
Response: {
  memberCount: number;
  lastActivity: Date;
  activeProjects: number;
}

// Get recent activity across organizations
GET /api/organizations/activity
Response: RecentActivity[]
```

### Enhanced Existing Endpoints

- Include member count in organization list response
- Add user role information to organization data

## Migration Strategy

### Phase 1: Core Layout

- Replace current OrganizationSelector with new card-based layout
- Maintain existing functionality
- Add basic styling improvements

### Phase 2: Enhanced Features

- Add search functionality
- Implement organization stats
- Add recent activity section

### Phase 3: Polish

- Add animations and micro-interactions
- Implement advanced error handling
- Performance optimizations
