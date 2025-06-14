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
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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

// Desktop Navigation Component
interface DesktopNavProps {
  isCollapsed?: boolean;
  className?: string;
  onToggleCollapse?: () => void;
  showToggle?: boolean;
  title?: string;
}

function DesktopNav({
  isCollapsed,
  className,
  onToggleCollapse,
  showToggle = true,
  title = 'Admin',
}: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Header with Title and Toggle */}
      <div
        className={cn(
          'flex items-center border-b py-4',
          isCollapsed ? 'justify-center px-3' : 'justify-between px-6'
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">
              {isCollapsed ? title.charAt(0) : title.charAt(0)}
            </span>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-semibold">{title}</span>
          )}
        </div>

        {showToggle && onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className={cn('space-y-1', className)}>
          {navLinks.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              pathname={pathname}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

// Mobile Navigation Component
interface MobileNavProps {
  className?: string;
}

function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('lg:hidden', className)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="text-left">Navigation</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <nav className="space-y-1">
            {navLinks.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Main Responsive Navigation Component
interface AdminSidebarNavProps {
  // Desktop props
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  showMobileToggle?: boolean;
  showDesktopToggle?: boolean;
  title?: string;
  className?: string;
  mobileToggleClassName?: string;
}

export function AdminSidebarNav({
  isCollapsed = false,
  onToggleCollapse,
  showMobileToggle = true,
  showDesktopToggle = true,
  title = 'Admin',
  className,
  mobileToggleClassName,
}: AdminSidebarNavProps) {
  return (
    <>
      {/* Mobile Navigation Toggle */}
      {showMobileToggle && <MobileNav className={mobileToggleClassName} />}

      {/* Desktop Navigation */}
      <div className="hidden lg:block h-full">
        <DesktopNav
          isCollapsed={isCollapsed}
          className={className}
          onToggleCollapse={onToggleCollapse}
          showToggle={showDesktopToggle}
          title={title}
        />
      </div>
    </>
  );
}

// Export individual components for more flexibility
export { DesktopNav, MobileNav };
