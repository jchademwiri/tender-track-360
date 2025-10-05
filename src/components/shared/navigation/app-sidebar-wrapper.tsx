import { getorganizations } from '@/server/organizations';
import { getCurrentUser } from '@/server/users';
import type { ComponentProps } from 'react';
import { AppSidebarClient } from './app-sidebar-client';

type AppSidebarWrapperProps = Omit<
  ComponentProps<typeof AppSidebarClient>,
  'initialOrganizations' | 'initialUser'
>;

export async function AppSidebarWrapper(props: AppSidebarWrapperProps) {
  const organizations = await getorganizations();
  const { currentUser } = await getCurrentUser();

  return (
    <AppSidebarClient
      initialOrganizations={organizations}
      initialUser={currentUser}
      {...props}
    />
  );
}
