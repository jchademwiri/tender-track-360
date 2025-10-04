export const dynamic = 'force-dynamic';

export default async function TendersOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Tender Management Overview
        </h1>
        <p className="text-muted-foreground">
          Manage your tender applications and track submission progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Active Tenders</h2>
          <p className="text-3xl font-bold text-blue-600">5</p>
          <p className="text-sm text-muted-foreground">Currently applying</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Submitted</h2>
          <p className="text-3xl font-bold text-orange-600">12</p>
          <p className="text-sm text-muted-foreground">Awaiting results</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Win Rate</h2>
          <p className="text-3xl font-bold text-green-600">68%</p>
          <p className="text-sm text-muted-foreground">Last 6 months</p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-3">
          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Municipal Building Project</h3>
                <p className="text-sm text-muted-foreground">
                  Tender submitted successfully
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Submitted
              </span>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">School Renovation Tender</h3>
                <p className="text-sm text-muted-foreground">
                  Documents uploaded and reviewed
                </p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                In Progress
              </span>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Hospital Extension</h3>
                <p className="text-sm text-muted-foreground">
                  New tender opportunity identified
                </p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                New
              </span>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Office Complex Tender</h3>
                <p className="text-sm text-muted-foreground">
                  Awarded - contract signed
                </p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Won
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
