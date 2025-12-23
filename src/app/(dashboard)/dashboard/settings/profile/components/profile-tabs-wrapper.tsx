'use client';

import { ProfileTabs, createProfileTabs } from './profile-tabs';
import { EmailSettings } from './email-settings';
import { PasswordForm } from './password-form';
import { OrganizationInfo } from './organization-info';
import { SecurityDashboard } from './security-dashboard';
import { SecuritySettings } from './security-settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import type { ChangePasswordData, ActionResult, SessionInfo } from '../actions';

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
  resendVerificationEmail: () => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<ActionResult>;
}

export function ProfileTabsWrapper({
  currentUser,
  organizationMembership,
  userSessions,
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
            <div className="space-y-6">
              {/* Account Details & Organization */}
              <div className="grid gap-6 md:grid-cols-2">
                <OrganizationInfo membership={organizationMembership} />

                {/* Account Metadata Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <Shield className="h-4 w-4" aria-hidden="true" />
                      <span>Account Access</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        User ID
                      </label>
                      <p className="font-mono text-sm bg-muted p-2 rounded-md break-all">
                        {currentUser.id}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Last Updated
                      </label>
                      <p className="text-sm">
                        {formatDate(currentUser.updatedAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Email & Security (Lower Section) */}
              <div className="grid gap-6 md:grid-cols-2">
                <EmailSettings
                  email={currentUser.email}
                  emailVerified={currentUser.emailVerified}
                  onResendVerification={resendVerificationEmail}
                />

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
            </div>
          ),
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
