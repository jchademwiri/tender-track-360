'use client';

import * as React from 'react';
import {
  BookOpen,
  Bot,
  Frame,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

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

// This is sample data.
const dashboadLinks = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Tender Management',
      url: '#',
      icon: SquareTerminal,
      items: [
        {
          title: 'Tenders',
          url: '/dashboard/tenders',
        },
        {
          title: 'Submited',
          url: '#',
        },
        {
          title: 'Briefings',
          url: '#',
        },
        {
          title: 'Documents',
          url: '#',
        },
      ],
    },
    {
      title: 'Project Management',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Current Projects',
          url: '#',
        },
        {
          title: 'Purchase Orders',
          url: '#',
        },
        {
          title: 'Invoices',
          url: '#',
        },
      ],
    },
    {
      title: 'Customers',
      url: '#',
      icon: Bot,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

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
