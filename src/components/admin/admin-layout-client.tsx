'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logout from '@/components/ui/logout';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: any; // User type is not strictly exported yet for frontend, so using any or a partial shape
}

export default function AdminLayoutClient({
  children,
  user,
}: AdminLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="admin-theme flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* 
         SIDEBAR
         - Hidden on mobile by default (unless toggled open)
         - Visible on desktop (md:flex)
       */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground border-r transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:flex flex-col p-4
          ${isMobileMenuOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="font-bold text-lg">Admin Portal</div>
          {/* Mobile Close Button inside Sidebar */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-2 flex-1">
          <div className="text-sm font-medium text-muted-foreground p-2">
            Menu
          </div>
          <Link
            href="/admin"
            className="block p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="block p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Users
          </Link>

          <Link
            href="/admin/organizations"
            className="block p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Organizations
          </Link>
        </nav>
        <div className="mt-auto pt-4 border-t">
          <Logout />
        </div>
      </aside>

      {/* OVERLAY for mobile when menu is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-14 border-b bg-card text-card-foreground flex items-center px-4 md:px-6 shrink-0 gap-4">
          {/* Mobile Hamburger Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>

          <h1 className="font-semibold text-lg md:text-xl">Super Admin</h1>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
