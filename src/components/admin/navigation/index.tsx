'use client';

import { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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
      ></div>
    </div>
  );
}
