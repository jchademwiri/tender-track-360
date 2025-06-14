'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Layers,
  Users,
  Briefcase,
  CheckSquare,
  Bell,
  BarChart3,
  LogOut,
  Menu,
  ChevronLeft,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    { title: 'Dashboard', path: '/', icon: <BarChart3 size={20} /> },
    { title: 'Tenders', path: '/tenders', icon: <Layers size={20} /> },
    { title: 'Projects', path: '/projects', icon: <FolderOpen size={20} /> },
    { title: 'Clients', path: '/clients', icon: <Briefcase size={20} /> },
    { title: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    { title: 'Users', path: '/users', icon: <Users size={20} /> },
    {
      title: 'Notifications',
      path: '/notifications',
      icon: <Bell size={20} />,
    },
  ];
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}
      <div
        className={cn(
          'h-screen fixed left-0 top-0 z-40 flex flex-col transition-all duration-300 bg-card border-r border-border',
          isMobile
            ? isOpen
              ? 'translate-x-0'
              : '-translate-x-full'
            : isOpen
            ? 'w-64'
            : 'w-16'
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
            className="ml-auto"
            onClick={toggleSidebar}
          >
            {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
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
                {isOpen && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className={cn('w-full justify-start', !isOpen && 'justify-center')}
          >
            <LogOut size={20} className={cn(!isOpen ? 'mx-auto' : 'mr-3')} />
            {isOpen && <span>Log Out</span>}
          </Button>{' '}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
