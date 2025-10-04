export const dynamic = 'force-dynamic';

export default async function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal profile information and account preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-background"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full p-2 border rounded-md bg-background"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full p-2 border rounded-md bg-background"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Job Title
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-background"
                placeholder="Project Manager"
              />
            </div>

            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Account Security</h2>
          <div className="space-y-4">
            <div className="bg-background rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Password</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Last changed 3 months ago
              </p>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Change Password
              </button>
            </div>

            <div className="bg-background rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Add an extra layer of security to your account
              </p>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Enable 2FA
              </button>
            </div>

            <div className="bg-background rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Active Sessions</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Manage devices that are signed into your account
              </p>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                View Sessions
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Time Zone</label>
            <select className="w-full p-2 border rounded-md bg-background">
              <option>UTC-5 (Eastern Time)</option>
              <option>UTC-6 (Central Time)</option>
              <option>UTC-7 (Mountain Time)</option>
              <option>UTC-8 (Pacific Time)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Date Format
            </label>
            <select className="w-full p-2 border rounded-md bg-background">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select className="w-full p-2 border rounded-md bg-background">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select className="w-full p-2 border rounded-md bg-background">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
