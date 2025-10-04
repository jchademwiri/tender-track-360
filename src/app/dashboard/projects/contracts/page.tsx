export const dynamic = 'force-dynamic';

export default async function ContractsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
        <p className="text-muted-foreground">
          Manage all project contracts and track their status and terms.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Active</h2>
          <p className="text-3xl font-bold text-green-600">15</p>
          <p className="text-sm text-muted-foreground">In progress</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Completed</h2>
          <p className="text-3xl font-bold text-blue-600">42</p>
          <p className="text-sm text-muted-foreground">This year</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Total Value</h2>
          <p className="text-3xl font-bold text-purple-600">$2.4M</p>
          <p className="text-sm text-muted-foreground">Active contracts</p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Contracts</h2>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
            New Contract
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Office Building Renovation</h3>
                <p className="text-sm text-muted-foreground">ABC Corporation</p>
                <p className="text-sm text-muted-foreground">
                  Start: Jan 15, 2025 • End: Jun 30, 2025
                </p>
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Active
                </span>
                <p className="text-sm font-medium mt-1">$485,000</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Warehouse Construction</h3>
                <p className="text-sm text-muted-foreground">XYZ Logistics</p>
                <p className="text-sm text-muted-foreground">
                  Start: Dec 1, 2024 • End: May 15, 2025
                </p>
              </div>
              <div className="text-right">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  In Progress
                </span>
                <p className="text-sm font-medium mt-1">$720,000</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Retail Store Fit-out</h3>
                <p className="text-sm text-muted-foreground">
                  Fashion Plus Ltd
                </p>
                <p className="text-sm text-muted-foreground">
                  Start: Feb 1, 2025 • End: Apr 30, 2025
                </p>
              </div>
              <div className="text-right">
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                  Scheduled
                </span>
                <p className="text-sm font-medium mt-1">$125,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
