'use client';

import React, { JSX, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  Users,
  UserCheck,
  BarChart3,
  Tag,
  Settings,
  Home,
  Briefcase,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

interface NavItem {
  title: string;
  path: string;
  icon: JSX.Element;
  badge?: number;
  submenu?: { title: string; path: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  isMobile,
}) => {
  const pathname = usePathname();
  const [reportsOpen, setReportsOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      path: '/dashboard/admin',
      icon: <Home size={20} />,
    },
    {
      title: 'Tenders',
      path: '/dashboard/admin/tenders',
      icon: <FileText size={20} />,
      badge: 12,
    },
    {
      title: 'Projects',
      path: '/dashboard/admin/projects',
      icon: <Briefcase size={20} />,
    },
    {
      title: 'Clients',
      path: '/dashboard/admin/clients',
      icon: <Users size={20} />,
    },
    {
      title: 'Users',
      path: '/dashboard/admin/users',
      icon: <UserCheck size={20} />,
    },
    {
      title: 'Reports',
      path: '/dashboard/admin/reports',
      icon: <BarChart3 size={20} />,
      submenu: [
        { title: 'Analytics', path: '/dashboard/admin/reports/analytics' },
        { title: 'Financial', path: '/dashboard/admin/reports/financial' },
        { title: 'Performance', path: '/dashboard/admin/reports/performance' },
      ],
    },
    {
      title: 'Categories',
      path: '/dashboard/admin/categories',
      icon: <Tag size={20} />,
    },
    {
      title: 'Settings',
      path: '/dashboard/admin/settings',
      icon: <Settings size={20} />,
    },
  ];

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.path;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isSubmenuOpen = hasSubmenu && reportsOpen;
    const isSubmenuActive =
      hasSubmenu && item.submenu?.some((subItem) => pathname === subItem.path);

    const handleItemClick = () => {
      if (hasSubmenu) {
        setReportsOpen(!reportsOpen);
      } else if (isMobile) {
        toggleSidebar();
      }
    };

    const itemContent = (
      <div
        className={cn(
          'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
          isActive || isSubmenuActive
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
        )}
        onClick={handleItemClick}
      >
        <span className="mr-3">{item.icon}</span>
        {(isOpen || isMobile) && (
          <div className="flex items-center justify-between flex-1">
            <span>{item.title}</span>
            <div className="flex items-center">
              {item.badge && (
                <Badge
                  variant="destructive"
                  className="ml-2 text-xs bg-red-500"
                >
                  {item.badge}
                </Badge>
              )}
              {hasSubmenu && (
                <ChevronDown
                  size={16}
                  className={cn(
                    'ml-2 transition-transform',
                    isSubmenuOpen && 'transform rotate-180'
                  )}
                />
              )}
            </div>
          </div>
        )}
      </div>
    );

    return (
      <>
        {hasSubmenu ? (
          itemContent
        ) : (
          <Link href={item.path} passHref>
            {itemContent}
          </Link>
        )}
        {hasSubmenu && isSubmenuOpen && (isOpen || isMobile) && (
          <div className="ml-8 space-y-1">
            {item.submenu?.map((subItem) => (
              <Link
                key={subItem.path}
                href={subItem.path}
                className={cn(
                  'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname === subItem.path
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                {subItem.title}
              </Link>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={toggleSidebar}>
          <SheetContent side="left" className="p-0 w-72">
            <div className="flex flex-col h-full">
              <SheetHeader className="p-4 h-16">
                <SheetTitle asChild>
                  <Link href="/" className="flex items-center">
                    <span className="text-xl font-bold text-primary">
                      TenderTrack360
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <Separator />
              <ScrollArea className="flex-1 py-4">
                <nav className="space-y-1 px-2">
                  {navItems.map((item) => (
                    <NavLink key={item.path} item={item} />
                  ))}
                </nav>
              </ScrollArea>
              <Separator />
              <div className="p-4">
                <Button variant="ghost" className="w-full justify-start">
                  <LogOut size={20} className="mr-3" />
                  <span>Log Out</span>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div
          className={cn(
            'h-screen fixed left-0 top-0 z-40 flex flex-col transition-all duration-300 bg-card border-r border-border',
            isOpen ? 'w-64' : 'w-16'
          )}
        >
          <div className="flex items-center justify-between p-4 h-16">
            {isOpen && (
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-primary">
                  TenderTrack360
                </span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={cn('', isOpen && 'ml-auto')}
              onClick={toggleSidebar}
              aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </Button>
          </div>
          <Separator />
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </nav>
          </ScrollArea>
          <Separator />
          <div className="p-4">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start',
                !isOpen && 'justify-center'
              )}
            >
              <LogOut size={20} className={cn(!isOpen ? 'mx-auto' : 'mr-3')} />
              {isOpen && <span>Log Out</span>}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
