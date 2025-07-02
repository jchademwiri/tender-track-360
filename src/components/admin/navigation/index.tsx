'use client';

import { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminNavigation() {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen((open) => !open);
  };
  return (
    <div className="flex min-h-screen relative">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      <div
        className={cn(
          'flex-1 transition-all duration-300',
          !isMobile && (isSidebarOpen ? 'ml-64' : 'ml-16')
        )}
      >
        {isMobile && (
          <Button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle Menu"
          >
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </Button>
        )}
      </div>
    </div>
  );
}
