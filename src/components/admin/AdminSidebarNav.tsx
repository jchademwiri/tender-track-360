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
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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

  if (hasSubmenu) {
    // Don't show collapsible submenus when collapsed
    if (isCollapsed) {
      return (
        <Button
          variant="ghost"
          asChild
          className={cn(
            'w-full justify-center h-auto p-3 font-normal',
            (isActive || isSubmenuActive) && 'bg-accent text-accent-foreground'
          )}
        >
          <Link href={item.href} onClick={onNavigate}>
            <Icon className="h-4 w-4" />
          </Link>
        </Button>
      );
    }

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-between h-auto p-3 font-normal',
              (isActive || isSubmenuActive) &&
                'bg-accent text-accent-foreground'
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4 min-w-4" />
              <span className="text-sm">{item.label}</span>
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 pl-7 mt-1">
          {item.submenu?.map((subItem) => (
            <Button
              key={subItem.href}
              variant="ghost"
              asChild
              className={cn(
                'w-full justify-start h-auto p-2 font-normal text-sm',
                pathname === subItem.href && 'bg-accent text-accent-foreground'
              )}
            >
              <Link href={subItem.href} onClick={onNavigate}>
                {subItem.label}
              </Link>
            </Button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      variant="ghost"
      asChild
      className={cn(
        'w-full justify-start h-auto p-3 font-normal',
        isActive && 'bg-accent text-accent-foreground'
      )}
    >
      <Link href={item.href} onClick={onNavigate} className="flex items-center">
        <Icon className="h-4 w-4 min-w-4" />
        {!isCollapsed && (
          <>
            <span className="ml-3 text-sm">{item.label}</span>
            {item.badge && (
              <Badge variant="destructive" className="ml-auto text-xs">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Link>
    </Button>
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
  );
}

function SidebarContent({
  onNavigate,
  isCollapsed,
  onToggle,
}: {
  onNavigate?: () => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div
        className={cn(
          'flex items-center border-b py-4 px-6',
          isCollapsed ? 'justify-center px-3' : 'gap-2'
        )}
      >
        {!isCollapsed && (
          <>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                A
              </span>
            </div>
            <span className="text-lg font-semibold">Admin Panel</span>
          </>
        )}
        {isCollapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">A</span>
          </div>
        )}
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              'h-8 w-8 hidden lg:flex',
              isCollapsed ? 'ml-0' : 'ml-auto'
            )}
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
      {!isCollapsed && (
        <div className="border-b p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <AdminSidebarNav onNavigate={onNavigate} isCollapsed={isCollapsed} />
      </div>

      {/* User Section */}
      {!isCollapsed && (
        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 p-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">
                    admin@company.com
                  </p>
                </div>
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
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Collapsed User Section */}
      {isCollapsed && (
        <div className="border-t p-3 flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
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
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

// Enhanced Layout Component
interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r bg-background lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 lg:hidden">
          <SidebarContent onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>

          <h1 className="text-lg font-semibold">Admin Panel</h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -right-1 -top-1 h-2 w-2 p-0">
                  <span className="sr-only">New notifications</span>
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>New tender submitted</DropdownMenuItem>
              <DropdownMenuItem>Client approval pending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Desktop Header - Optional */}
        <header className="hidden border-b bg-background p-4 lg:block">
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
                    <Badge className="absolute -right-1 -top-1 h-2 w-2 p-0">
                      <span className="sr-only">New notifications</span>
                    </Badge>
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
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
