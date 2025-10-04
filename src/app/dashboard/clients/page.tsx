export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">
          Manage your client relationships and track project history.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Total Clients</h2>
          <p className="text-3xl font-bold text-blue-600">28</p>
          <p className="text-sm text-muted-foreground">Active relationships</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Repeat Clients</h2>
          <p className="text-3xl font-bold text-green-600">18</p>
          <p className="text-sm text-muted-foreground">64% retention rate</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">New This Year</h2>
          <p className="text-3xl font-bold text-purple-600">12</p>
          <p className="text-sm text-muted-foreground">43% growth</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Avg Project Value</h2>
          <p className="text-3xl font-bold text-orange-600">$285K</p>
          <p className="text-sm text-muted-foreground">Per client</p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Client Directory</h2>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
            Add New Client
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">ABC Corporation</h3>
                <p className="text-sm text-muted-foreground">
                  Commercial Construction
                </p>
                <p className="text-sm text-muted-foreground">
                  Contact: John Smith • john@abc-corp.com
                </p>
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Active
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  3 projects • $1.2M total
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">XYZ Logistics</h3>
                <p className="text-sm text-muted-foreground">
                  Industrial & Warehouse
                </p>
                <p className="text-sm text-muted-foreground">
                  Contact: Sarah Johnson • sarah@xyz-logistics.com
                </p>
              </div>
              <div className="text-right">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  In Progress
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  2 projects • $850K total
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Fashion Plus Ltd</h3>
                <p className="text-sm text-muted-foreground">Retail Fit-outs</p>
                <p className="text-sm text-muted-foreground">
                  Contact: Mike Chen • mike@fashionplus.com
                </p>
              </div>
              <div className="text-right">
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                  Scheduled
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  1 project • $125K total
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Tech Innovations Inc</h3>
                <p className="text-sm text-muted-foreground">Office Spaces</p>
                <p className="text-sm text-muted-foreground">
                  Contact: Lisa Wong • lisa@techinnovations.com
                </p>
              </div>
              <div className="text-right">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  Completed
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  4 projects • $2.1M total
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
