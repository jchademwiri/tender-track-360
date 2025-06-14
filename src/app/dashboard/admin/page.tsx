import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/admin/tenders"
          className="block p-6 rounded-lg shadow border border-gray-200 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Tenders</h2>
          <p>View and manage all tenders.</p>
        </Link>
        <Link
          href="/dashboard/admin/clients"
          className="block p-6 rounded-lg shadow border border-gray-200 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Clients</h2>
          <p>View and manage client organizations.</p>
        </Link>
        <Link
          href="/dashboard/admin/users"
          className="block p-6 rounded-lg shadow border border-gray-200 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p>View and manage users.</p>
        </Link>
        <Link
          href="/dashboard/admin/reports"
          className="block p-6 rounded-lg shadow border border-gray-200 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Reports</h2>
          <p>Access reports and analytics.</p>
        </Link>
        <Link
          href="/dashboard/admin/categories"
          className="block p-6 rounded-lg shadow border border-gray-200 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Categories</h2>
          <p>Manage tender categories.</p>
        </Link>
      </div>
    </div>
  );
}
