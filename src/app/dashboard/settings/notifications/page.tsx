export const dynamic = 'force-dynamic';

export default async function NotificationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Notification Settings
        </h1>
        <p className="text-muted-foreground">
          Configure how and when you receive notifications about your business
          activities.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Email Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Tender Deadlines</h3>
                <p className="text-sm text-muted-foreground">
                  Alerts for upcoming submission deadlines
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Project Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Status changes and milestone completions
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Purchase Order Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  PO status changes and duplicate warnings
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Payment Reminders</h3>
                <p className="text-sm text-muted-foreground">
                  Overdue invoices and payment notifications
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Weekly Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Summary of business activities
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Push Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Urgent Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Critical deadlines and issues
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">New Opportunities</h3>
                <p className="text-sm text-muted-foreground">
                  Matching tender opportunities
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Team Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Messages from team members
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">System Maintenance</h3>
                <p className="text-sm text-muted-foreground">
                  Scheduled downtime and updates
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Notification Timing</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tender Deadline Alerts
            </label>
            <select className="w-full p-2 border rounded-md bg-background">
              <option>1 day before</option>
              <option>2 days before</option>
              <option>3 days before</option>
              <option>1 week before</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Project Milestone Reminders
            </label>
            <select className="w-full p-2 border rounded-md bg-background">
              <option>Same day</option>
              <option>1 day before</option>
              <option>2 days before</option>
              <option>1 week before</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Quiet Hours Start
            </label>
            <input
              type="time"
              className="w-full p-2 border rounded-md bg-background"
              defaultValue="22:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Quiet Hours End
            </label>
            <input
              type="time"
              className="w-full p-2 border rounded-md bg-background"
              defaultValue="08:00"
            />
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Critical Alerts</h2>
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-red-800">
                  Duplicate PO Warning
                </h3>
                <p className="text-sm text-red-600">
                  Alert when creating PO that may already exist
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-orange-800">
                  Budget Overrun Alert
                </h3>
                <p className="text-sm text-orange-600">
                  Notify when project exceeds budget by 10%
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-yellow-800">
                  Contract Expiry Warning
                </h3>
                <p className="text-sm text-yellow-600">
                  Alert 30 days before contract expiration
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="bg-primary text-primary-foreground px-6 py-2 rounded-md"
        >
          Save Notification Settings
        </button>
      </div>
    </div>
  );
}
