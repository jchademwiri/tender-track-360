import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

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
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Calendar Coming Soon
          </h3>
          <p className="text-gray-500 text-center">
            Calendar functionality will be available once implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
