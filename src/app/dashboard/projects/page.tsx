export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Active Projects</h1>
        <p className="text-muted-foreground">
          Manage and track all your active construction projects.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Total Projects</h2>
          <p className="text-3xl font-bold text-blue-600">8</p>
          <p className="text-sm text-muted-foreground">Currently active</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">On Schedule</h2>
          <p className="text-3xl font-bold text-green-600">6</p>
          <p className="text-sm text-muted-foreground">75% on track</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Behind Schedule</h2>
          <p className="text-3xl font-bold text-orange-600">2</p>
          <p className="text-sm text-muted-foreground">Need attention</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Total Value</h2>
          <p className="text-3xl font-bold text-purple-600">$2.4M</p>
          <p className="text-sm text-muted-foreground">Active projects</p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Project List</h2>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
            New Project
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Office Building Renovation</h3>
                <p className="text-sm text-muted-foreground">
                  ABC Corporation • Started: Jan 15, 2025
                </p>
                <p className="text-sm text-muted-foreground">
                  Progress: Foundation complete, framing in progress
                </p>
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  On Track
                </span>
                <p className="text-sm font-medium mt-1">$485,000</p>
                <p className="text-xs text-muted-foreground">65% complete</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Warehouse Construction</h3>
                <p className="text-sm text-muted-foreground">
                  XYZ Logistics • Started: Dec 1, 2024
                </p>
                <p className="text-sm text-muted-foreground">
                  Progress: Site preparation, awaiting materials
                </p>
              </div>
              <div className="text-right">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  In Progress
                </span>
                <p className="text-sm font-medium mt-1">$720,000</p>
                <p className="text-xs text-muted-foreground">25% complete</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border border-orange-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Retail Store Fit-out</h3>
                <p className="text-sm text-muted-foreground">
                  Fashion Plus Ltd • Started: Nov 20, 2024
                </p>
                <p className="text-sm text-muted-foreground">
                  Progress: Electrical delays, 3 days behind
                </p>
              </div>
              <div className="text-right">
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                  Delayed
                </span>
                <p className="text-sm font-medium mt-1">$125,000</p>
                <p className="text-xs text-muted-foreground">80% complete</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Municipal Library Extension</h3>
                <p className="text-sm text-muted-foreground">
                  City Council • Started: Oct 15, 2024
                </p>
                <p className="text-sm text-muted-foreground">
                  Progress: Interior finishing, final inspections
                </p>
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  On Track
                </span>
                <p className="text-sm font-medium mt-1">$350,000</p>
                <p className="text-xs text-muted-foreground">90% complete</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Industrial Workshop</h3>
                <p className="text-sm text-muted-foreground">
                  Manufacturing Co • Started: Sep 1, 2024
                </p>
                <p className="text-sm text-muted-foreground">
                  Progress: Structural work complete, MEP installation
                </p>
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  On Track
                </span>
                <p className="text-sm font-medium mt-1">$680,000</p>
                <p className="text-xs text-muted-foreground">70% complete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
