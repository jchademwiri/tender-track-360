import { getCurrentUser } from '@/server';
import { getUserOrganizationMembership } from '@/server/organizations';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ProfileTabsWrapper } from './components/profile-tabs-wrapper';
import {
  updateProfile,
  resendVerificationEmail,
  changePassword,
  getUserSessions,
  SessionInfo,
} from './actions';

import { CalendarDays, Mail } from 'lucide-react';
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

  // Server action wrapper that handles the ActionResult
  async function handleResendVerification(): Promise<void> {
    'use server';
    const result = await resendVerificationEmail();
    if (!result.success) {
      throw new Error(result.message);
    }
  }

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

        {/* Profile Header Card - Mobile Optimized */}
        <section aria-labelledby="profile-header">
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="pb-4 sm:pb-6">
              <div className="flex flex-col space-y-4">
                {/* Avatar and Basic Info - Centered on Mobile */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                    <AvatarImage
                      src={currentUser.image || ''}
                      alt={`Profile picture of ${currentUser.name}`}
                    />
                    <AvatarFallback
                      className="text-lg sm:text-xl"
                      aria-label={`${currentUser.name} initials`}
                    >
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <CardTitle
                      id="profile-header"
                      className="text-xl sm:text-2xl"
                    >
                      {currentUser.name}
                    </CardTitle>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center space-x-2">
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
                          className="text-xs w-fit"
                          aria-label="Email verification status: verified"
                        >
                          Email Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="destructive"
                          className="text-xs w-fit"
                          aria-label="Email verification status: not verified"
                        >
                          Email Unverified
                        </Badge>
                      )}
                      <div className="flex items-center space-x-2">
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
                </div>
              </div>
            </CardHeader>
          </Card>
        </section>

        {/* Tabbed Interface */}
        <ProfileTabsWrapper
          currentUser={currentUser}
          organizationMembership={organizationMembership}
          userSessions={userSessions}
          updateProfile={updateProfile}
          resendVerificationEmail={handleResendVerification}
          changePassword={changePassword}
        />
      </main>
    </>
  );
}
