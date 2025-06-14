import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/admin"
          className="block p-6 rounded-lg shadow border border-gray-200 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
          <p>
            Access the admin dashboard for managing tenders, clients, users, and
            more.
          </p>
        </Link>
        {/* Add more dashboard links here as needed, e.g., User Dashboard, Client Dashboard, etc. */}
      </div>
    </div>
  );
}
