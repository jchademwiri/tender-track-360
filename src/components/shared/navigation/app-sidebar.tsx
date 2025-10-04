'use client';

import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import type { OrganizationWithStats } from '@/server/organizations';
import type { User } from '@/db/schema';
import { dashboadLinks } from '@/data/dashboad-links';

// This is sample data.

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  organizations: OrganizationWithStats[];
  user: User;
}

export function AppSidebar({ organizations, user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher organizations={organizations} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dashboadLinks.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
