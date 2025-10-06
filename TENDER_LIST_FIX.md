# Tender List Organization Switching Fix

## Problem

When switching organizations on the tenders page, the stats cards would update correctly, but the **TenderList component** would not refresh to show the new organization's tenders. This was because:

1. **Client Component State**: The `TenderList` is a client component that receives `organizationId` as a prop
2. **No Reactivity**: The component wasn't watching for changes to the `organizationId` prop
3. **Stale Data**: When the organization switched, the component kept showing the old organization's tenders

## Root Cause

The `TenderList` component (and similarly `ClientList`) are client components that:

- Receive `organizationId` as a prop from the server component (page)
- Maintain their own internal state for tenders/clients data
- Don't react to changes in the `organizationId` prop

When you switch organizations:

1. ✅ Server component gets new `session.activeOrganizationId`
2. ✅ Stats cards update (they're rendered server-side)
3. ❌ List components don't refetch data for the new organization

## Solution

Added `useEffect` hooks to both `TenderList` and `ClientList` components that:

1. **Watch for `organizationId` changes** using `useEffect` dependency array
2. **Reset component state** (search query, filters, pagination)
3. **Refetch data** for the new organization
4. **Use `useCallback`** for stable function references

### Changes Made

#### TenderList (`src/components/tenders/tender-list.tsx`)

```typescript
// Added imports
import { useState, useTransition, useEffect, useCallback } from 'react';

// Wrapped fetchTenders in useCallback for stable reference
const fetchTenders = useCallback(
  async (search?: string, page: number = 1) => {
    // ... existing logic
  },
  [organizationId]
);

// Added useEffect to react to organizationId changes
useEffect(() => {
  // Reset search and filters
  setSearchQuery('');
  setStatusFilter('all');
  setCurrentPage(1);

  // Fetch fresh data for the new organization
  if (organizationId) {
    fetchTenders('', 1);
  }
}, [organizationId, fetchTenders]);
```

#### ClientList (`src/components/clients/client-list.tsx`)

```typescript
// Added imports
import { useState, useTransition, useEffect, useCallback } from 'react';

// Wrapped fetchClients in useCallback for stable reference
const fetchClients = useCallback(
  async (search?: string, page: number = 1) => {
    // ... existing logic
  },
  [organizationId]
);

// Added useEffect to react to organizationId changes
useEffect(() => {
  // Reset search and filters
  setSearchQuery('');
  setCurrentPage(1);

  // Fetch fresh data for the new organization
  if (organizationId) {
    fetchClients('', 1);
  }
}, [organizationId, fetchClients]);
```

## How It Works Now

1. **User switches organization** using team switcher
2. **Session refresh** happens (from our previous fix)
3. **Server component re-renders** with new `session.activeOrganizationId`
4. **Stats cards update** (server-rendered)
5. **List components receive new `organizationId` prop**
6. **`useEffect` triggers** and detects the prop change
7. **Component state resets** (search, filters, pagination)
8. **Fresh data is fetched** for the new organization
9. **List updates** to show new organization's data

## Benefits

- ✅ **Immediate Updates**: Lists refresh automatically when switching organizations
- ✅ **Clean State**: Search queries and filters reset for each organization
- ✅ **Consistent UX**: All parts of the page update together
- ✅ **Performance**: Only refetches when organization actually changes
- ✅ **Error Handling**: Existing error handling remains intact

## Testing

To verify the fix works:

1. **Go to Tenders page** with some tenders in Organization A
2. **Switch to Organization B** using the team switcher
3. **Verify**:
   - Stats cards update immediately ✅
   - Tender list refreshes to show Organization B's tenders ✅
   - Search box clears ✅
   - Filters reset ✅
   - Pagination resets to page 1 ✅

4. **Repeat for Clients page** to verify ClientList works the same way

## Files Modified

- `src/components/tenders/tender-list.tsx`
- `src/components/clients/client-list.tsx`

This fix ensures that when you switch organizations, all list components properly refresh to display the new organization's data, providing a consistent and seamless user experience.
