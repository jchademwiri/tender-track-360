import AdminNavigation from '@/components/admin/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-black">
      <AdminNavigation />
      <main className="px-4 flex-1 transition-all duration-200">
        {children}
      </main>
    </div>
  );
}
