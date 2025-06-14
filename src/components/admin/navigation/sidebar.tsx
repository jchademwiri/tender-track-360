'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  Users,
  UserCheck,
  BarChart3,
  Tag,
  Settings,
  ChevronDown,
  Home,
  Briefcase,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  isMobile,
}) => {
  const pathname = usePathname();
  const navItems = [
    { title: 'Dashboard', path: '/dashboard/admin', icon: <Home size={20} /> },
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
  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={toggleSidebar}>
          <SheetContent side="left" className="p-0 w-72">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 h-16">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold text-primary">
                    TenderTrack360
                  </span>
                </Link>
              </div>
              <Separator />
              <ScrollArea className="flex-1 py-4">
                <nav className="space-y-1 px-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={cn(
                        'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
                        pathname === item.path
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                      onClick={isMobile ? toggleSidebar : undefined}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <div className="flex items-center justify-between flex-1">
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </Link>
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
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </Button>
          </div>
          <Separator />
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === item.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {isOpen && (
                    <div className="flex items-center justify-between flex-1">
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                </Link>
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
