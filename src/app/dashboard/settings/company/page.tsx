export const dynamic = 'force-dynamic';

export default async function CompanySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization information and business settings.
        </p>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Company Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">
              Company Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md bg-background"
              placeholder="ABC Construction Ltd"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Registration Number
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md bg-background"
              placeholder="12345678"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Business Address
            </label>
            <textarea
              className="w-full p-2 border rounded-md bg-background"
              rows={3}
              placeholder="123 Business Street, City, State, ZIP Code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              className="w-full p-2 border rounded-md bg-background"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <input
              type="url"
              className="w-full p-2 border rounded-md bg-background"
              placeholder="https://www.company.com"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Certifications & Licenses
          </h2>
          <div className="space-y-3">
            <div className="bg-background rounded-lg p-3 border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">General Contractor License</h3>
                  <p className="text-sm text-muted-foreground">
                    Expires: Dec 31, 2025
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Active
                </span>
              </div>
            </div>

            <div className="bg-background rounded-lg p-3 border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Safety Certification</h3>
                  <p className="text-sm text-muted-foreground">
                    Expires: Jun 15, 2025
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Active
                </span>
              </div>
            </div>

            <button className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm">
              Add Certification
            </button>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Team Management</h2>
          <div className="space-y-3">
            <div className="bg-background rounded-lg p-3 border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">John Doe</h3>
                  <p className="text-sm text-muted-foreground">
                    Owner • john@company.com
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Admin
                </span>
              </div>
            </div>

            <div className="bg-background rounded-lg p-3 border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Jane Smith</h3>
                  <p className="text-sm text-muted-foreground">
                    Manager • jane@company.com
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  User
                </span>
              </div>
            </div>

            <button className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm">
              Invite Team Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
