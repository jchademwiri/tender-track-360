import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth'; // Adjust import based on your actual auth setup
import { headers } from 'next/headers';

// Placeholder for Admin Sidebar and Header components
// You should create these components in src/components/admin/
// import { AdminSidebar } from '@/components/admin/admin-sidebar';
// import { AdminHeader } from '@/components/admin/admin-header';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  // ----------------------------------------------------------------------
  // AUTH CHECK: Ensure user is logged in and has 'admin' role (or 'superadmin')
  // ----------------------------------------------------------------------
  // NOTE: The role check depends on how you implemented the 'role' field.
  // If 'role' is directly on user, check user.role.
  // If we need to fetch it from DB, do it here.

  // For now, if no user, redirect to login
  if (!user) {
    // We are on admin.domain.com. We might want to redirect to the main domain's login
    // or show a specialized admin login.
    // For now, redirect to main login
    // return redirect('https://tendertrack360.co.za/login'); // Hardcoded or env var
    return redirect('/login');
  }

  // Ensure user has 'admin' role
  if ((user as any).role !== 'admin') {
    console.log('Unauthorized access attempt to Admin Portal by:', user.email);
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    return redirect(`${baseUrl}/dashboard`);
  }

  return (
    <div className="admin-theme flex h-screen w-full bg-background text-foreground">
      {/* 
         TODO: Add AdminSidebar here
         <AdminSidebar />
       */}
      <aside className="w-64 border-r bg-sidebar text-sidebar-foreground p-4 hidden md:block">
        <div className="font-bold text-lg mb-6">Admin Portal</div>
        <nav className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground p-2">
            Menu
          </div>
          <a
            href="/"
            className="block p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded"
          >
            Dashboard
          </a>
          <a
            href="/users"
            className="block p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded"
          >
            Users
          </a>
          <a
            href="/organizations"
            className="block p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded"
          >
            Organizations
          </a>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* 
          TODO: Add AdminHeader here
          <AdminHeader user={user} />
        */}
        <header className="h-14 border-b bg-card text-card-foreground flex items-center px-6">
          <h1 className="font-semibold">Super Admin</h1>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
