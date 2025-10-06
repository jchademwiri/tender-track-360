import CreateOrg from './create-org';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  return (
    <>
      {/* Statistics Cards */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
          <span className="text-muted-foreground">Statistics Card 1</span>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
          <span className="text-muted-foreground">Statistics Card 2</span>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
          <span className="text-muted-foreground">Statistics Card 3</span>
        </div>
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min flex items-center justify-center">
        <span className="text-muted-foreground">
          <CreateOrg organizations={[]} />
        </span>
      </div>
    </>
  );
}
