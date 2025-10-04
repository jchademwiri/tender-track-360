export const dynamic = 'force-dynamic';

export default async function SettingsOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings Overview</h1>
        <p className="text-muted-foreground">
          Manage your account, company, and system preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <p className="text-muted-foreground mb-4">
            Manage your personal profile information and preferences.
          </p>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
            Edit Profile
          </button>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Company Settings</h2>
          <p className="text-muted-foreground mb-4">
            Configure company information and organizational settings.
          </p>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
            Manage Company
          </button>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <p className="text-muted-foreground mb-4">
            Control how and when you receive notifications.
          </p>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
            Configure Alerts
          </button>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-background rounded-lg p-4 border">
            <h3 className="font-medium mb-2">System Backup</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Last backup: Dec 18, 2024 at 3:00 AM
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              Create Backup Now
            </button>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <h3 className="font-medium mb-2">Data Export</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Export all your data for backup or migration
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              Export Data
            </button>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <h3 className="font-medium mb-2">Security Settings</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Manage passwords and two-factor authentication
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              Security Options
            </button>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <h3 className="font-medium mb-2">System Status</h3>
            <p className="text-sm text-muted-foreground mb-3">
              All systems operational • Last check: 2 min ago
            </p>
            <span className="text-green-600 text-sm">✓ Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
