import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarClient } from './widget';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Track important deadlines, project milestones, and tender submission
          dates.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">
              Tender submission
            </Badge>
            <Badge className="bg-warning text-warning-foreground">
              PO expected
            </Badge>
            <Badge className="bg-success text-success-foreground">
              PO delivered
            </Badge>
            <Badge
              variant="outline"
              className="border-destructive text-destructive"
            >
              Overdue
            </Badge>
          </div>
          <CalendarClient />
        </CardContent>
      </Card>
    </div>
  );
}
