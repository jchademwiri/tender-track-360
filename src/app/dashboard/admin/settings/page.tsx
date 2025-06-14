'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  UserIcon,
  BellIcon,
  ShieldIcon,
  PaletteIcon,
  DatabaseIcon,
  SaveIcon,
  KeyIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
} from 'lucide-react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    // Profile settings
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+27 11 123 4567',
    company: 'Acme Corp',
    jobTitle: 'Project Manager',
    bio: 'Experienced project manager with expertise in tender management.',

    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    tenderAlerts: true,

    // Appearance settings
    theme: 'system',
    language: 'en',
    timezone: 'Africa/Johannesburg',
    dateFormat: 'dd/mm/yyyy',

    // Security settings
    twoFactorAuth: false,
    sessionTimeout: '30',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success toast or notification
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <BellIcon className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <PaletteIcon className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldIcon className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <DatabaseIcon className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange('firstName', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange('lastName', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      handleInputChange('jobTitle', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <BuildingIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    className="pl-10"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange('company', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about updates and activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleInputChange('emailNotifications', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={formData.pushNotifications}
                  onCheckedChange={(checked) =>
                    handleInputChange('pushNotifications', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Get weekly summary of your projects and tenders
                  </p>
                </div>
                <Switch
                  checked={formData.weeklyReports}
                  onCheckedChange={(checked) =>
                    handleInputChange('weeklyReports', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tender Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new tender opportunities
                  </p>
                </div>
                <Switch
                  checked={formData.tenderAlerts}
                  onCheckedChange={(checked) =>
                    handleInputChange('tenderAlerts', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance & Localization</CardTitle>
              <CardDescription>
                Customize how the application looks and behaves
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={formData.theme}
                    onValueChange={(value) => handleInputChange('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) =>
                      handleInputChange('language', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="af">Afrikaans</SelectItem>
                      <SelectItem value="zu">Zulu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) =>
                      handleInputChange('timezone', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Johannesburg">
                        Africa/Johannesburg
                      </SelectItem>
                      <SelectItem value="Africa/Cape_Town">
                        Africa/Cape Town
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select
                    value={formData.dateFormat}
                    onValueChange={(value) =>
                      handleInputChange('dateFormat', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
              <CardDescription>
                Manage your account security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      handleInputChange('twoFactorAuth', checked)
                    }
                  />
                  {formData.twoFactorAuth && (
                    <Badge variant="secondary">Enabled</Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Session Timeout</Label>
                <Select
                  value={formData.sessionTimeout}
                  onValueChange={(value) =>
                    handleInputChange('sessionTimeout', value)
                  }
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Password Management</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm">
                    <KeyIcon className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  <Button variant="outline" size="sm">
                    Download Recovery Codes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                View system details and manage data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Application Version</Label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    v2.1.0
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Last Updated</Label>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Data Management</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm">
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm">
                    Import Data
                  </Button>
                  <Button variant="destructive" size="sm">
                    Clear Cache
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <SaveIcon className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
