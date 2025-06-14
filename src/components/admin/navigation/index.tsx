'use client';

import { useState } from 'react';
import Sidebar from './sidebar';
// import Header from './header';
import { cn } from '@/lib/utils';

export default function AdminNavigation() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((open) => !open);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          isSidebarOpen
            ? 'ml-64' // Expanded desktop sidebar
            : 'ml-16' // Collapsed desktop sidebar
        )}
      >
        {/* <Header toggleSidebar={toggleSidebar} /> */}
      </div>
    </div>
  );
}
