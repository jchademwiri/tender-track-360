import {
  BarChart3,
  Calendar,
  ClipboardList,
  FolderKanban,
  HandCoins,
  LayoutDashboard,
  Settings2,
  Users,
} from 'lucide-react';
export const dashboadLinks = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },
    // {
    //   title: 'Opportunities',
    //   url: '/dashboard/opportunities',
    //   icon: Search,
    // },
    {
      title: 'Tender Management',
      url: '/dashboard/tenders/overview',
      icon: ClipboardList,
      items: [
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
      url: '/dashboard/projects/overview',
      icon: FolderKanban,
      items: [
        {
          title: 'Active Projects',
          url: '/dashboard/projects',
        },
        {
          title: 'Purchase Orders', // Can not be visible to the role of member
          url: '/dashboard/projects/purchase-orders',
        },
        {
          title: 'Contracts', // Can not be visible to the role of member
          url: '/dashboard/projects/contracts',
        },
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
    {
      title: 'Reports',
      url: '/dashboard/reports/overview',
      icon: BarChart3,
      items: [
        {
          title: 'Analytics',
          url: '/dashboard/reports/analytics',
        },
        {
          title: 'Performance',
          url: '/dashboard/reports/performance',
        },
        {
          title: 'Export Data',
          url: '/dashboard/reports/export',
        },
      ],
    },
    {
      title: 'Clients',
      url: '/dashboard/clients',
      icon: Users,
    },
    {
      title: 'Settings',
      url: '/dashboard/settings/overview',
      icon: Settings2,
      items: [
        {
          title: 'Profile', // must be your personal profile
          url: '/dashboard/settings/profile',
          //   /profile this is the personal profile page i created
        },
        {
          title: 'Company', // Must be for Current Active Organisation: must be seen only of you are owner or admin
          // Can not be visible to the role of member
          url: '/dashboard/settings/company',
        },
        {
          title: 'Notifications', // your prefereance on notifications
          url: '/dashboard/settings/notifications',
        },
      ],
    },
  ],
};
