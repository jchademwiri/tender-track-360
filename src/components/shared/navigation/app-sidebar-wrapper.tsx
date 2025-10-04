
import { getorganizations } from '@/server/organizations';
import { getCurrentUser } from '@/server/users';
import type { ComponentProps } from 'react';
import { AppSidebar } from './app-sidebar';

type AppSidebarWrapperProps = Omit<
  ComponentProps<typeof AppSidebar>,
  'organizations' | 'user'
>;

export async function AppSidebarWrapper(props: AppSidebarWrapperProps) {
  const organizations = await getorganizations();
  const { currentUser } = await getCurrentUser();

  return (
    <AppSidebar organizations={organizations} user={currentUser} {...props} />
  );
}
