import AdminNavigation from '@/components/admin/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-black">
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col p-4">
        <AdminNavigation />
      </aside>
      <main className="flex-1 p-4 md:p-8 transition-all duration-200">
        {children}
      </main>
    </div>
  );
}
