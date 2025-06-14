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
  Search,
  Bell,
  LogOut,
  Menu,
  Home,
  Briefcase,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navLinks = [
  {
    href: '/dashboard/admin',
    label: 'Dashboard',
    icon: Home,
  },
  {
    href: '/dashboard/admin/tenders',
    label: 'Tenders',
    icon: FileText,
    badge: 12,
  },
  {
    href: '/dashboard/admin/projects',
    label: 'Projects',
    icon: Briefcase,
  },
  {
    href: '/dashboard/admin/clients',
    label: 'Clients',
    icon: Users,
  },
  {
    href: '/dashboard/admin/users',
    label: 'Users',
    icon: UserCheck,
  },
  {
    href: '/dashboard/admin/reports',
    label: 'Reports',
    icon: BarChart3,
    submenu: [
      { href: '/dashboard/admin/reports/analytics', label: 'Analytics' },
      { href: '/dashboard/admin/reports/financial', label: 'Financial' },
      { href: '/dashboard/admin/reports/performance', label: 'Performance' },
    ],
  },
  {
    href: '/dashboard/admin/categories',
    label: 'Categories',
    icon: Tag,
  },
  {
    href: '/dashboard/admin/settings',
    label: 'Settings',
    icon: Settings,
  },
];

interface NavItemProps {
  item: (typeof navLinks)[0];
  pathname: string;
  onNavigate?: () => void;
  isCollapsed?: boolean;
}

function NavItem({ item, pathname, onNavigate, isCollapsed }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon;
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + '/');
  const isSubmenuActive =
    hasSubmenu &&
    item.submenu.some(
      (subItem) =>
        pathname === subItem.href || pathname.startsWith(subItem.href + '/')
    );

  // Auto-expand active submenu
  useEffect(() => {
    if (isSubmenuActive && !isCollapsed) {
      setIsOpen(true);
    }
  }, [isSubmenuActive, isCollapsed]);

  const NavButton = ({ children, className, ...props }: any) => (
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start h-10 font-normal text-sm hover:bg-accent/80 transition-all duration-200',
        (isActive || isSubmenuActive) &&
          'bg-accent text-accent-foreground shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );

  if (hasSubmenu) {
    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavButton asChild className="justify-center px-2">
                <Link href={item.href} onClick={onNavigate}>
                  <Icon className="h-4 w-4" />
                </Link>
              </NavButton>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col gap-1">
              <p className="font-medium">{item.label}</p>
              {item.submenu?.map((subItem) => (
                <p key={subItem.href} className="text-xs text-muted-foreground">
                  {subItem.label}
                </p>
              ))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <NavButton className="justify-between px-3">
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </NavButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 pl-6 mt-1">
          {item.submenu?.map((subItem) => (
            <NavButton
              key={subItem.href}
              asChild
              className={cn(
                'ml-2 h-8 border-l-2 border-transparent pl-4 hover:border-accent',
                pathname === subItem.href && 'border-primary bg-accent/50'
              )}
            >
              <Link href={subItem.href} onClick={onNavigate}>
                <span className="truncate">{subItem.label}</span>
              </Link>
            </NavButton>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  const content = (
    <div className="flex items-center gap-3 w-full">
      <Icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && (
        <>
          <span className="truncate">{item.label}</span>
          {item.badge && (
            <Badge
              variant="destructive"
              className="ml-auto text-xs px-1.5 py-0.5"
            >
              {item.badge > 99 ? '99+' : item.badge}
            </Badge>
          )}
        </>
      )}
      {isCollapsed && item.badge && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
        >
          {item.badge > 9 ? '9+' : item.badge}
        </Badge>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavButton asChild className="justify-center px-2 relative">
              <Link href={item.href} onClick={onNavigate}>
                {content}
              </Link>
            </NavButton>
          </TooltipTrigger>
          <TooltipContent side="right">
            <div className="flex items-center gap-2">
              <span>{item.label}</span>
              {item.badge && (
                <Badge variant="destructive" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <NavButton asChild className="px-3">
      <Link href={item.href} onClick={onNavigate}>
        {content}
      </Link>
    </NavButton>
  );
}

interface AdminSidebarNavProps {
  onNavigate?: () => void;
  isCollapsed?: boolean;
}

export function AdminSidebarNav({
  onNavigate,
  isCollapsed,
}: AdminSidebarNavProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <nav className="space-y-1">
        {navLinks.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            pathname={pathname}
            onNavigate={onNavigate}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
    </TooltipProvider>
  );
}

interface SidebarContentProps {
  onNavigate?: () => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

function SidebarContent({
  onNavigate,
  isCollapsed,
  onToggle,
  isMobile,
  onClose,
}: SidebarContentProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNavLinks = navLinks.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submenu?.some((subItem) =>
        subItem.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="flex h-full flex-col bg-background border-r">
      {/* Header */}
      <div
        className={cn(
          'flex items-center border-b py-4 px-4 h-16 shrink-0',
          isCollapsed && !isMobile ? 'justify-center px-2' : 'gap-2'
        )}
      >
        {!isCollapsed || isMobile ? (
          <>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shrink-0">
              <span className="text-sm font-bold text-primary-foreground">
                A
              </span>
            </div>
            <span className="text-lg font-semibold truncate">Admin Panel</span>
          </>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">A</span>
          </div>
        )}

        {/* Mobile close button */}
        {isMobile && onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-auto h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Desktop toggle button */}
        {onToggle && !isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn('h-8 w-8 shrink-0', isCollapsed ? 'ml-0' : 'ml-auto')}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Search */}
      {(!isCollapsed || isMobile) && (
        <div className="border-b p-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <AdminSidebarNav
          onNavigate={onNavigate}
          isCollapsed={isCollapsed && !isMobile}
        />

        {/* No results message */}
        {searchQuery && filteredNavLinks.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No navigation items found
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="border-t p-4 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full h-auto p-2 hover:bg-accent/80',
                isCollapsed && !isMobile
                  ? 'justify-center'
                  : 'justify-start gap-3'
              )}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              {(!isCollapsed || isMobile) && (
                <div className="flex flex-col items-start text-left min-w-0">
                  <p className="text-sm font-medium truncate">Admin User</p>
                  <p className="text-xs text-muted-foreground truncate">
                    admin@company.com
                  </p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// Enhanced Layout Component
interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar - Fixed */}
      <aside
        className={cn(
          'hidden lg:flex lg:fixed lg:inset-y-0 lg:z-40 lg:flex-col',
          'transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
        )}
      >
        <SidebarContent
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-background lg:hidden',
          'transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent
          onNavigate={() => setSidebarOpen(false)}
          isMobile={true}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          'flex flex-1 flex-col min-w-0',
          'lg:transition-all lg:duration-300 lg:ease-in-out',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="h-8 w-8"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open sidebar</span>
          </Button>

          <h1 className="text-lg font-semibold">Admin Panel</h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 text-xs flex items-center justify-center">
                  3
                </Badge>
                <span className="sr-only">View notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">New tender submitted</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Client approval pending</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here&apos;s what&apos;s happening.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 text-xs flex items-center justify-center">
                      3
                    </Badge>
                    <span className="sr-only">View notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">
                        New tender submitted
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 minutes ago
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">
                        Client approval pending
                      </p>
                      <p className="text-xs text-muted-foreground">
                        1 hour ago
                      </p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
