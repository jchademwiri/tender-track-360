import { AdminSidebarNav } from '@/components/admin/AdminSidebarNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-black">
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col p-4">
        <div className="flex items-center mb-8">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin
          </span>
        </div>
        <AdminSidebarNav />
      </aside>
      <main className="flex-1 p-4 md:p-8 transition-all duration-200">
        {children}
      </main>
    </div>
  );
}
