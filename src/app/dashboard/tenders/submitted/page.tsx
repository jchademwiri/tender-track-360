export const dynamic = 'force-dynamic';

export default async function SubmittedTendersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submitted Tenders</h1>
        <p className="text-muted-foreground">
          Track tenders awaiting results and follow up on submissions.
        </p>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
        <div className="space-y-3">
          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Office Building Renovation</h3>
                <p className="text-sm text-muted-foreground">
                  Submitted: Dec 15, 2024
                </p>
                <p className="text-sm text-muted-foreground">
                  Client: ABC Corporation
                </p>
              </div>
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                Pending
              </span>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Warehouse Construction</h3>
                <p className="text-sm text-muted-foreground">
                  Submitted: Dec 10, 2024
                </p>
                <p className="text-sm text-muted-foreground">
                  Client: XYZ Logistics
                </p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Under Review
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
