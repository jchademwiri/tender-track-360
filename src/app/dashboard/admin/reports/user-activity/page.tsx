export default function UserActivityReportPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Activity Report</h1>
      <p className="text-muted-foreground mb-2">
        Active users, actions by role, recent logins
      </p>
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded p-6">
        <p className="text-gray-700 dark:text-gray-200">
          User activity analytics and charts will be displayed here.
        </p>
      </div>
    </div>
  );
}
