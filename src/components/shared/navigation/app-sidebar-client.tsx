'use client';

import { useEffect, useState } from 'react';
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
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [user, setUser] = useState(initialUser);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    // Update state with initial props after hydration
    setOrganizations(initialOrganizations);
    setUser(initialUser);
  }, [initialOrganizations, initialUser]);

  // During SSR and before hydration, use initial data
  if (!isHydrated) {
    return (
      <AppSidebar
        organizations={initialOrganizations}
        user={initialUser}
        {...props}
      />
    );
  }

  return <AppSidebar organizations={organizations} user={user} {...props} />;
}
