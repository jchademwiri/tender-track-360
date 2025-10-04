import { AuthenticatedUserSectionProps } from '@/types/home-page';

export function AuthenticatedUserSection({
  user,
  recentActivity,
}: AuthenticatedUserSectionProps) {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}!
            </h2>
            <p className="text-gray-600">
              Here&apos;s what&apos;s happening with {user.organizationName}
              &apos;s tenders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {recentActivity.activeTenders}
              </div>
              <div className="text-sm font-medium text-gray-900">
                Active Tenders
              </div>
              <div className="text-xs text-gray-600">Currently in progress</div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {recentActivity.upcomingDeadlines}
              </div>
              <div className="text-sm font-medium text-gray-900">
                Upcoming Deadlines
              </div>
              <div className="text-xs text-gray-600">Next 7 days</div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {recentActivity.recentDocuments.length}
              </div>
              <div className="text-sm font-medium text-gray-900">
                Recent Documents
              </div>
              <div className="text-xs text-gray-600">Last 24 hours</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              View Dashboard
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Create New Tender
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              View Reports
            </button>
          </div>

          {recentActivity.upcomingDeadlines > 0 && (
            <div className="mt-6 p-4 bg-orange-100 border border-orange-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-orange-600 text-xl mr-2">⚠️</span>
                <div>
                  <div className="font-semibold text-orange-800">
                    Urgent: Upcoming Deadlines
                  </div>
                  <div className="text-sm text-orange-700">
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
