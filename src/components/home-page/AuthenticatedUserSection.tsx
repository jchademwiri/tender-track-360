import { AuthenticatedUserSectionProps } from '@/types/home-page';

export function AuthenticatedUserSection({
  user,
  recentActivity,
}: AuthenticatedUserSectionProps) {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-card-foreground mb-2">
              Welcome back, {user.name}!
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s what&apos;s happening with {user.organizationName}
              &apos;s tenders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <div className="text-3xl font-bold text-primary mb-2">
                {recentActivity.activeTenders}
              </div>
              <div className="text-sm font-medium text-card-foreground">
                Active Tenders
              </div>
              <div className="text-xs text-muted-foreground">
                Currently in progress
              </div>
            </div>

            <div className="bg-chart-4/10 p-6 rounded-lg border border-chart-4/20">
              <div className="text-3xl font-bold text-chart-4 mb-2">
                {recentActivity.upcomingDeadlines}
              </div>
              <div className="text-sm font-medium text-card-foreground">
                Upcoming Deadlines
              </div>
              <div className="text-xs text-muted-foreground">Next 7 days</div>
            </div>

            <div className="bg-chart-2/10 p-6 rounded-lg border border-chart-2/20">
              <div className="text-3xl font-bold text-chart-2 mb-2">
                {recentActivity.recentDocuments.length}
              </div>
              <div className="text-sm font-medium text-card-foreground">
                Recent Documents
              </div>
              <div className="text-xs text-muted-foreground">Last 24 hours</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              View Dashboard
            </button>
            <button className="border border-border text-foreground px-6 py-3 rounded-lg hover:bg-secondary/50 transition-colors">
              Create New Tender
            </button>
            <button className="border border-border text-foreground px-6 py-3 rounded-lg hover:bg-secondary/50 transition-colors">
              View Reports
            </button>
          </div>

          {recentActivity.upcomingDeadlines > 0 && (
            <div className="mt-6 p-4 bg-chart-4/10 border border-chart-4/20 rounded-lg">
              <div className="flex items-center">
                <span className="text-chart-4 text-xl mr-2">⚠️</span>
                <div>
                  <div className="font-semibold text-chart-4">
                    Urgent: Upcoming Deadlines
                  </div>
                  <div className="text-sm text-muted-foreground">
                    You have {recentActivity.upcomingDeadlines} tender
                    {recentActivity.upcomingDeadlines > 1 ? 's' : ''} with
                    deadlines in the next 7 days
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
