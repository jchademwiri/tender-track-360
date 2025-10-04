// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function TendersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tenders</h1>
        <p className="text-muted-foreground">
          Manage and track your tender applications and opportunities.
        </p>
      </div>

      {/* Tenders Content */}
      <div className="grid gap-4">
        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Active Tenders</h2>
          <div className="space-y-3">
            <div className="bg-background rounded-lg p-4 border">
              <h3 className="font-medium">Sample Tender 1</h3>
              <p className="text-sm text-muted-foreground">
                Status: In Progress
              </p>
            </div>
            <div className="bg-background rounded-lg p-4 border">
              <h3 className="font-medium">Sample Tender 2</h3>
              <p className="text-sm text-muted-foreground">Status: Submitted</p>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Opportunities</h2>
          <div className="space-y-3">
            <div className="bg-background rounded-lg p-4 border">
              <h3 className="font-medium">New Opportunity 1</h3>
              <p className="text-sm text-muted-foreground">
                Deadline: Next Week
              </p>
            </div>
            <div className="bg-background rounded-lg p-4 border">
              <h3 className="font-medium">New Opportunity 2</h3>
              <p className="text-sm text-muted-foreground">
                Deadline: Next Month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
