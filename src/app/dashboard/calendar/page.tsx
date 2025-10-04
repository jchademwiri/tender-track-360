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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
          <div className="space-y-3">
            <div className="bg-background rounded-lg p-3 border border-red-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-red-700">
                    Tender Submission
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Municipal Building Project
                  </p>
                </div>
                <span className="text-sm font-medium text-red-600">Dec 22</span>
              </div>
            </div>

            <div className="bg-background rounded-lg p-3 border border-orange-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-orange-700">
                    Project Milestone
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Office Building - Foundation Complete
                  </p>
                </div>
                <span className="text-sm font-medium text-orange-600">
                  Dec 28
                </span>
              </div>
            </div>

            <div className="bg-background rounded-lg p-3 border border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-blue-700">Contract Review</h3>
                  <p className="text-sm text-muted-foreground">
                    Warehouse Construction Terms
                  </p>
                </div>
                <span className="text-sm font-medium text-blue-600">Jan 5</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">This Week</h2>
          <div className="space-y-3">
            <div className="bg-background rounded-lg p-3 border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Site Visit</h3>
                  <p className="text-sm text-muted-foreground">
                    Retail Store Project
                  </p>
                </div>
                <span className="text-sm font-medium">Today 2:00 PM</span>
              </div>
            </div>

            <div className="bg-background rounded-lg p-3 border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Client Meeting</h3>
                  <p className="text-sm text-muted-foreground">
                    ABC Corporation Progress Review
                  </p>
                </div>
                <span className="text-sm font-medium">Tomorrow 10:00 AM</span>
              </div>
            </div>

            <div className="bg-background rounded-lg p-3 border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Material Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    PO-2024-158 Steel Beams
                  </p>
                </div>
                <span className="text-sm font-medium">Friday 8:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
        <div className="bg-background rounded-lg p-8 border text-center">
          <p className="text-muted-foreground">
            Calendar component will be implemented here
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Integration with popular calendar libraries like FullCalendar or
            React Big Calendar
          </p>
        </div>
      </div>
    </div>
  );
}
