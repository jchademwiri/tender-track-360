'use client';

import { ProfileTabs, createProfileTabs } from './profile-tabs';
import { ProfileForm } from './profile-form';
import { EmailSettings } from './email-settings';
import { PasswordForm } from './password-form';
import { OrganizationInfo } from './organization-info';
import { SecurityDashboard } from './security-dashboard';
import { SecuritySettings } from './security-settings';
import { ActivityTimeline } from './activity-timeline';
import { NotificationPreferences } from './notification-preferences';
import { PrivacyControls } from './privacy-controls';
import { Preferences } from './preferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import type {
  UpdateProfileData,
  ChangePasswordData,
  ActionResult,
  SessionInfo,
} from '../actions';

interface OrganizationMembership {
  id: string;
  role: string;
  createdAt: Date;
  organization: {
    id: string;
    name: string;
    slug: string | null;
    createdAt: Date;
  };
}

interface ProfileTabsWrapperProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  organizationMembership: OrganizationMembership | null;
  userSessions: SessionInfo[];
  updateProfile: (data: UpdateProfileData) => Promise<ActionResult>;
  resendVerificationEmail: () => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<ActionResult>;
}

export function ProfileTabsWrapper({
  currentUser,
  organizationMembership,
  userSessions,
  updateProfile,
  resendVerificationEmail,
  changePassword,
}: ProfileTabsWrapperProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <ProfileTabs
      tabs={createProfileTabs(
        {
          personal: (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column - Profile & Account Info */}
              <div className="space-y-6">
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
                      <div className="grid grid-cols-1 gap-4 sm:gap-6">
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
              </div>

              {/* Right Column - Email Settings */}
              <div className="space-y-6">
                {/* Email Settings */}
                <EmailSettings
                  email={currentUser.email}
                  emailVerified={currentUser.emailVerified}
                  onResendVerification={resendVerificationEmail}
                />

                {/* Password Management */}
                <PasswordForm onSubmit={changePassword} />
              </div>
            </div>
          ),
          security: (
            <div className="space-y-6">
              {/* Security Dashboard */}
              <SecurityDashboard
                emailVerified={currentUser.emailVerified}
                sessions={userSessions}
                lastPasswordChange={currentUser.updatedAt}
                twoFactorEnabled={false}
              />

              {/* Security Settings */}
              <SecuritySettings initialSessions={userSessions} />

              {/* Activity Timeline */}
              <ActivityTimeline
                activities={[
                  {
                    id: '1',
                    type: 'login',
                    timestamp: new Date(),
                    description: 'Successful login from Chrome on Windows',
                    device: 'Chrome on Windows',
                    location: 'New York, NY',
                    ipAddress: '192.168.1.1',
                    severity: 'low',
                  },
                  {
                    id: '2',
                    type: 'password_change',
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    description: 'Password changed successfully',
                    severity: 'medium',
                  },
                ]}
                sessions={userSessions}
              />
            </div>
          ),
          notifications: <NotificationPreferences />,
          privacy: <PrivacyControls />,
          preferences: <Preferences />,
        },
        {
          securityScore: 75,
          unreadNotifications: 3,
          pendingVerifications: currentUser.emailVerified ? 0 : 1,
        }
      )}
    />
  );
}
