import { getCurrentUser } from '@/server';
import { searchTenders } from '@/server/tenders';
import { TenderList } from '@/components/tenders/tender-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, Send } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SubmittedTendersPage() {
  const { session } = await getCurrentUser();

  if (!session.activeOrganizationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            No Organization Selected
          </h2>
          <p className="text-gray-600">
            Please select an organization to view submitted tenders.
          </p>
        </div>
      </div>
    );
  }

  // Fetch submitted and pending tenders
  const [submittedResult, pendingResult] = await Promise.all([
    searchTenders(session.activeOrganizationId, { status: 'submitted' }, 1, 50),
    searchTenders(session.activeOrganizationId, { status: 'pending' }, 1, 50),
  ]);

  const submittedTenders = submittedResult.success
    ? submittedResult.tenders
    : [];
  const pendingTenders = pendingResult.success ? pendingResult.tenders : [];
  const allSubmittedTenders = [...submittedTenders, ...pendingTenders];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submitted Tenders</h1>
        <p className="text-muted-foreground">
          Track tenders awaiting results and follow up on submissions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <Send className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {submittedTenders.length}
            </div>
            <p className="text-xs text-muted-foreground">Recently submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingTenders.length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting results</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allSubmittedTenders.length}
            </div>
            <p className="text-xs text-muted-foreground">
              All active submissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tender List */}
      {allSubmittedTenders.length > 0 ? (
        <TenderList
          organizationId={session.activeOrganizationId}
          initialTenders={allSubmittedTenders}
          initialTotalCount={allSubmittedTenders.length}
        />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Submitted Tenders
            </h3>
            <p className="text-muted-foreground text-center">
              You haven&apos;t submitted any tenders yet. Create and submit your
              first tender to track it here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
