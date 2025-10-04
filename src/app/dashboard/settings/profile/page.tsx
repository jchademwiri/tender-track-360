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
import { SkipNavigation } from '@/components/skip-navigation';

// Force dynamic rendering since we use headers() in server functions
export const dynamic = 'force-dynamic';

export default async function ProfileSettingsPage() {
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

  const skipSections = [
    { id: 'profile-header', label: 'Profile Information' },
    { id: 'profile-form-heading', label: 'Edit Profile' },
    { id: 'account-info-heading', label: 'Account Information' },
    { id: 'organization-info-heading', label: 'Organization' },
    { id: 'email-settings-heading', label: 'Email Settings' },
    { id: 'password-form-heading', label: 'Password & Security' },
    { id: 'security-settings-heading', label: 'Security & Sessions' },
  ];

  return (
    <>
      <SkipNavigation sections={skipSections} />
      <main className="container mx-auto py-4 sm:py-8 px-4">
        {/* Page Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Profile Settings
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your account settings and preferences
          </p>
        </header>

        {/* Profile Header Card */}
        <section aria-labelledby="profile-header">
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mx-auto sm:mx-0">
                  <AvatarImage
                    src={currentUser.image || ''}
                    alt={`Profile picture of ${currentUser.name}`}
                  />
                  <AvatarFallback
                    className="text-base sm:text-lg"
                    aria-label={`${currentUser.name} initials`}
                  >
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left w-full">
                  <CardTitle
                    id="profile-header"
                    className="text-xl sm:text-2xl"
                  >
                    {currentUser.name}
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <Mail
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span
                        className="text-muted-foreground text-sm sm:text-base break-all"
                        aria-label={`Email address: ${currentUser.email}`}
                      >
                        {currentUser.email}
                      </span>
                    </div>
                    {currentUser.emailVerified ? (
                      <Badge
                        variant="secondary"
                        className="text-xs w-fit mx-auto sm:mx-0"
                        aria-label="Email verification status: verified"
                      >
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="destructive"
                        className="text-xs w-fit mx-auto sm:mx-0"
                        aria-label="Email verification status: not verified"
                      >
                        Unverified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
                    <CalendarDays
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span
                      className="text-xs sm:text-sm text-muted-foreground"
                      aria-label={`Account created on ${formatDate(currentUser.createdAt)}`}
                    >
                      Member since {formatDate(currentUser.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </section>

        {/* Profile Sections */}
        <div className="grid gap-6" role="main">
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
          <section aria-labelledby="account-info-heading">
            <Card>
              <CardHeader>
                <CardTitle
                  id="account-info-heading"
                  className="flex items-center space-x-2 text-base sm:text-lg"
                >
                  <Shield
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    aria-hidden="true"
                  />
                  <span>Account Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <label
                      className="text-sm font-medium text-muted-foreground"
                      id="email-verification-label"
                    >
                      Email Verification Status
                    </label>
                    <div
                      className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-1"
                      aria-labelledby="email-verification-label"
                    >
                      <p className="text-sm sm:text-base break-all">
                        {currentUser.email}
                      </p>
                      {currentUser.emailVerified ? (
                        <Badge
                          variant="secondary"
                          className="text-xs w-fit"
                          aria-label="Email verification status: verified"
                        >
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="destructive"
                          className="text-xs w-fit"
                          aria-label="Email verification status: not verified"
                        >
                          Unverified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label
                      className="text-sm font-medium text-muted-foreground"
                      id="account-created-label"
                    >
                      Account Created
                    </label>
                    <p
                      className="mt-1 text-sm sm:text-base"
                      aria-labelledby="account-created-label"
                    >
                      {formatDate(currentUser.createdAt)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label
                      className="text-sm font-medium text-muted-foreground"
                      id="last-updated-label"
                    >
                      Last Updated
                    </label>
                    <p
                      className="mt-1 text-sm sm:text-base"
                      aria-labelledby="last-updated-label"
                    >
                      {formatDate(currentUser.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

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
      </main>
    </>
  );
}
