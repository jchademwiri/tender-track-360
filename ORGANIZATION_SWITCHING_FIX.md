# Organization Switching Fix - Session Refresh Implementation

## Problem

When switching organizations using the team switcher or organization switcher, the page wasn't properly reloading to display information for the updated organization. This was because:

1. **Session State Mismatch**: Client components using `authClient.useActiveOrganization()` would get the updated organization, but server components using `session.activeOrganizationId` would still have the old organization data.

2. **Insufficient Page Refresh**: While `router.refresh()` was being called, the session data wasn't being properly refreshed, causing server components to render with stale organization context.

## Solution: Force Session Refresh

We implemented **Option 1: Force Session Refresh** which ensures both client and server components get the updated organization context.

### Changes Made

#### 1. Created Organization Switching Utility (`src/lib/organization-utils.ts`)

- **`switchOrganization()`**: Centralized function that handles organization switching with proper session refresh
- **`switchOrganizationWithReload()`**: Fallback function that uses full page reload if session refresh doesn't work

#### 2. Updated Organization Switching Components

- **Team Switcher** (`src/components/shared/navigation/team-switcher.tsx`): Now uses the utility function
- **Organization Switcher** (`src/components/shared/navigation/organization-switcher.tsx`): Simplified to use the utility
- **Organization Provider** (`src/components/shared/providers/organization-provider.tsx`): Uses utility for URL sync

#### 3. Enhanced Better Auth Configuration (`src/lib/auth.ts`)

- Added organization switching hooks for better session management
- Maintained the session creation hook that sets `activeOrganizationId`

### How It Works

1. **Switch Organization**: Call `authClient.organization.setActive()` to update the active organization
2. **Force Session Refresh**: Call `authClient.getSession({ fetchOptions: { cache: 'no-store' } })` to ensure fresh session data
3. **Navigate**: Update URL if needed using `router.push()`
4. **Refresh Page**: Call `router.refresh()` to update all server components
5. **Show Feedback**: Display success toast to user

### Key Benefits

- **Consistent State**: Both client and server components now use the same organization context
- **Reliable Updates**: Server components that depend on `session.activeOrganizationId` get fresh data
- **Better UX**: Users see immediate feedback and updated content
- **Centralized Logic**: All organization switching goes through the same utility function
- **Error Handling**: Graceful fallbacks if session refresh fails

### Usage Example

```typescript
import { switchOrganization } from '@/lib/organization-utils';

// In your component
const handleSwitchOrg = async (org: Organization) => {
  await switchOrganization({
    organizationId: org.id,
    organizationName: org.name,
    router,
    redirectUrl: `/organization/${org.slug}/dashboard`, // optional
    showToast: true, // optional, defaults to true
  });
};
```

### Fallback Option

If the session refresh approach doesn't work reliably, you can use the full page reload fallback:

```typescript
import { switchOrganizationWithReload } from '@/lib/organization-utils';

await switchOrganizationWithReload({
  organizationId: org.id,
  organizationName: org.name,
  redirectUrl: `/organization/${org.slug}/dashboard`,
});
```

## Testing

To test the fix:

1. **Switch Organizations**: Use the team switcher dropdown to switch between organizations
2. **Verify Data Updates**: Check that server-rendered content (like member lists, stats, etc.) updates to show the new organization's data
3. **Check URL Sync**: Ensure URLs update correctly when switching organizations
4. **Test Error Handling**: Try switching to invalid organizations to ensure graceful error handling

## Files Modified

- `src/lib/organization-utils.ts` (new)
- `src/components/shared/navigation/team-switcher.tsx`
- `src/components/shared/navigation/organization-switcher.tsx`
- `src/components/shared/providers/organization-provider.tsx`
- `src/lib/auth.ts`

The implementation ensures that when you switch to a new organization, the current page reloads properly to display information for the updated organization.
