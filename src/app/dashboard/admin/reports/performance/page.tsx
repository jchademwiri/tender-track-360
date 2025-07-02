export default function PerformanceReportPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Performance Report</h1>
      <p className="text-muted-foreground mb-2">
        Average days to award, completion rate, manager stats
      </p>
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded p-6">
        <p className="text-gray-700 dark:text-gray-200">
          Performance analytics and charts will be displayed here.
        </p>
      </div>
    </div>
  );
}
