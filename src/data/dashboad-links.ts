import {
  Calendar,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Settings2,
  Users,
  Building2,
} from 'lucide-react';
export const dashboadLinks = {
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
      icon: ClipboardList,
      items: [
        {
          title: 'Overview',
          url: '/dashboard/tenders/overview',
        },
        {
          title: 'Active Tenders',
          url: '/dashboard/tenders',
        },
        {
          title: 'Submitted',
          url: '/dashboard/tenders/submitted',
        },
        // {
        //   title: 'Proposals',
        //   url: '/dashboard/tenders/proposals',
        // },
        // {
        //   title: 'Documents',
        //   url: '/dashboard/tenders/documents',
        // },
      ],
    },

    {
      title: 'Project Management',
      url: '#',
      icon: FolderKanban,
      items: [
        {
          title: 'Overview',
          url: '/dashboard/projects/overview',
        },
        {
          title: 'Active Projects',
          url: '/dashboard/projects',
        },
        {
          title: 'Purchase Orders', // Can not be visible to the role of member
          url: '/dashboard/projects/purchase-orders',
        },
        // {
        //   title: 'Contracts', // Can not be visible to the role of member
        //   url: '/dashboard/projects/contracts',
        // },
        // {
        //   title: 'PO Status Tracker',
        //   url: '/dashboard/projects/po-tracker',
        // },
        // {
        //   title: 'Project Timeline',
        //   url: '/dashboard/projects/timeline',
        // },
      ],
    },
    {
      title: 'Calendar',
      url: '/dashboard/calendar',
      icon: Calendar,
    },
    // {
    //   title: 'Reports',
    //   url: '/dashboard/reports/overview',
    //   icon: BarChart3,
    //   items: [
    //     {
    //       title: 'Analytics',
    //       url: '/dashboard/reports/analytics',
    //     },
    //     {
    //       title: 'Performance',
    //       url: '/dashboard/reports/performance',
    //     },
    //     {
    //       title: 'Export Data',
    //       url: '/dashboard/reports/export',
    //     },
    //   ],
    // },
    {
      title: 'Clients',
      url: '/dashboard/clients',
      icon: Users,
    },
    {
      title: 'Organisations', // Must be for Current Active Organisation: must be seen only of you are owner or admin
      // Can not be visible to the role of member
      url: '/dashboard/organisation',
      icon: Building2,
    },
    {
      title: 'Settings',
      url: '/dashboard/settings/overview',
      icon: Settings2,
      items: [
        {
          title: 'Overview',
          url: '/dashboard/settings/overview',
        },
        {
          title: 'Notifications', // your prefereance on notifications
          url: '/dashboard/settings/notifications',
        },
      ],
    },
  ],
};
