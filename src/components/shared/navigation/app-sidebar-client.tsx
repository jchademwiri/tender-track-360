'use client';

import React from 'react';
import { AppSidebar } from './app-sidebar';
import type { OrganizationWithStats } from '@/server/organizations';
import type { User } from '@/db/schema';
import type { ComponentProps } from 'react';

interface AppSidebarClientProps
  extends Omit<ComponentProps<typeof AppSidebar>, 'organizations' | 'user'> {
  initialOrganizations: OrganizationWithStats[];
  initialUser: User;
}

export function AppSidebarClient({
  initialOrganizations,
  initialUser,
  ...props
}: AppSidebarClientProps) {
  // Always use the initial data to prevent hydration mismatches
  // The data will be updated through page navigation/refresh after deletions
  return (
    <div suppressHydrationWarning>
      <AppSidebar
        organizations={initialOrganizations}
        user={initialUser}
        {...props}
      />
    </div>
  );
}
