import { AppSidebar } from '@/components/app-sidebar';
import { getorganizations } from '@/server/organizations';
import type { ComponentProps } from 'react';

type AppSidebarWrapperProps = Omit<
  ComponentProps<typeof AppSidebar>,
  'organizations'
>;

export async function AppSidebarWrapper(props: AppSidebarWrapperProps) {
  const organizations = await getorganizations();

  return <AppSidebar organizations={organizations} {...props} />;
}
