import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClient } from './widget';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-linear-to-b from-secondary/40 via-background to-background p-6 md:p-10">
      {/* Decorative background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-secondary/30 blur-3xl opacity-70" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20 shadow-sm">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          </div>
          <p className="text-muted-foreground ml-12">
            Track important deadlines, project milestones, and tender submission
            dates.
          </p>
        </div>

        <Card className="border-white/10 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-white/5 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground mr-2">
                Legend:
              </span>
              <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                Tender submission
              </Badge>
              <Badge className="bg-yellow-500/15 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/25">
                PO expected
              </Badge>
              <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/25">
                PO delivered
              </Badge>
              <Badge
                variant="outline"
                className="border-destructive/30 text-destructive bg-destructive/5"
              >
                Overdue
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 bg-background/40">
            <CalendarClient />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
