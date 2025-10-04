export const dynamic = 'force-dynamic';

export default async function ProjectsOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Project Management Overview
        </h1>
        <p className="text-muted-foreground">
          Manage active projects, contracts, and purchase orders.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Active Projects</h2>
          <p className="text-3xl font-bold text-green-600">8</p>
          <p className="text-sm text-muted-foreground">In progress</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Open POs</h2>
          <p className="text-3xl font-bold text-blue-600">23</p>
          <p className="text-sm text-muted-foreground">Pending fulfillment</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Contracts</h2>
          <p className="text-3xl font-bold text-purple-600">15</p>
          <p className="text-sm text-muted-foreground">Active contracts</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Completion Rate</h2>
          <p className="text-3xl font-bold text-orange-600">92%</p>
          <p className="text-sm text-muted-foreground">On-time delivery</p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="bg-background rounded-lg p-4 border">
            <p className="text-sm">
              <span className="font-medium">PO-2024-156</span> materials
              delivered for
              <span className="font-medium"> Office Building Project</span>
            </p>
            <p className="text-xs text-muted-foreground">2 hours ago</p>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <p className="text-sm">
              New contract signed for{' '}
              <span className="font-medium">Warehouse Construction</span>
            </p>
            <p className="text-xs text-muted-foreground">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
