import { getCurrentUser } from '@/server';
import { getUserOrganizationMembership } from '@/server/organizations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ProfileForm } from './components/profile-form';
import { EmailSettings } from './components/email-settings';
import { PasswordForm } from './components/password-form';
import { OrganizationInfo } from './components/organization-info';
import { SecuritySettings } from './components/security-settings';
import {
  updateProfile,
  resendVerificationEmail,
  changePassword,
  getUserSessions,
  SessionInfo,
} from './actions';

import { CalendarDays, Mail, Shield } from 'lucide-react';

export default async function ProfilePage() {
  const { session, currentUser } = await getCurrentUser();

  // Get user's organization membership details if they have an active organization
  const organizationMembership = session.activeOrganizationId
    ? (await getUserOrganizationMembership(
        currentUser.id,
        session.activeOrganizationId
      )) || null
    : null;

  // Get user sessions for security settings
  const sessionsResult = await getUserSessions();
  const userSessions = sessionsResult.success
    ? (sessionsResult.data as SessionInfo[])
    : [];

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Header Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={currentUser.image || ''}
                alt={currentUser.name}
              />
              <AvatarFallback className="text-lg">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {currentUser.email}
                </span>
                {currentUser.emailVerified ? (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    Unverified
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Member since {formatDate(currentUser.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Sections */}
      <div className="grid gap-6">
        {/* Profile Form - Editable Profile Information */}
        <ProfileForm
          user={{
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            image: currentUser.image,
          }}
          onSubmit={updateProfile}
        />

        {/* Account Information - Read-only details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email Verification Status
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <p>{currentUser.email}</p>
                  {currentUser.emailVerified ? (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      Unverified
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Account Created
                </label>
                <p className="mt-1">{formatDate(currentUser.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <p className="mt-1">{formatDate(currentUser.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Information */}
        <OrganizationInfo membership={organizationMembership} />

        {/* Email Settings */}
        <EmailSettings
          email={currentUser.email}
          emailVerified={currentUser.emailVerified}
          onResendVerification={async () => {
            'use server';
            const result = await resendVerificationEmail();
            if (!result.success) {
              throw new Error(result.message);
            }
          }}
        />

        {/* Password Management */}
        <PasswordForm
          onSubmit={async (data) => {
            'use server';
            return await changePassword(data);
          }}
        />

        {/* Security Settings */}
        <SecuritySettings initialSessions={userSessions} />
      </div>
    </div>
  );
}
