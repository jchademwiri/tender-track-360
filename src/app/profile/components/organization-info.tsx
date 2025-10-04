'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Settings, Shield, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface OrganizationInfoProps {
  membership: {
    id: string;
    organizationId: string;
    userId: string;
    role: string;
    createdAt: Date;
    organization: {
      id: string;
      name: string;
      slug: string | null;
      logo: string | null;
      createdAt: Date;
      metadata: string | null;
    };
  } | null;
}

const roleDescriptions = {
  owner: {
    label: 'Owner',
    description: 'Full access to all organization settings and data',
    permissions: [
      'Manage organization settings',
      'Add and remove members',
      'Assign roles to members',
      'Delete organization',
      'Access all projects and data',
    ],
  },
  admin: {
    label: 'Administrator',
    description: 'Manage members and organization settings',
    permissions: [
      'Manage organization settings',
      'Add and remove members',
      'Assign member roles',
      'Access all projects and data',
    ],
  },
  member: {
    label: 'Member',
    description: 'Standard access to organization resources',
    permissions: [
      'View organization information',
      'Access assigned projects',
      'Collaborate with team members',
    ],
  },
};

export function OrganizationInfo({ membership }: OrganizationInfoProps) {
  if (!membership) {
    return null;
  }

  const { organization, role, createdAt } = membership;
  const roleInfo =
    roleDescriptions[role as keyof typeof roleDescriptions] ||
    roleDescriptions.member;
  const isAdminOrOwner = role === 'owner' || role === 'admin';

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <section aria-labelledby="organization-info-heading">
      <Card>
        <CardHeader>
          <CardTitle
            id="organization-info-heading"
            className="flex items-center space-x-2 text-base sm:text-lg"
          >
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            <span>Organization</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Organization Basic Info */}
          <div className="space-y-4">
            <div>
              <label
                className="text-sm font-medium text-muted-foreground"
                id="org-name-label"
              >
                Organization Name
              </label>
              <div
                className="mt-1 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2"
                aria-labelledby="org-name-label"
              >
                <p className="font-medium text-base sm:text-lg break-words">
                  {organization.name}
                </p>
                {organization.logo && (
                  <Image
                    src={organization.logo}
                    alt={`${organization.name} logo`}
                    width={24}
                    height={24}
                    className="rounded mx-auto sm:mx-0"
                  />
                )}
              </div>
            </div>

            {organization.slug && (
              <div>
                <label
                  className="text-sm font-medium text-muted-foreground"
                  id="org-slug-label"
                >
                  Organization Slug
                </label>
                <p
                  className="mt-1 text-sm font-mono bg-muted px-2 py-1 rounded"
                  aria-labelledby="org-slug-label"
                >
                  {organization.slug}
                </p>
              </div>
            )}
          </div>

          {/* User Role and Membership Info */}
          <div className="space-y-4">
            <div>
              <label
                className="text-sm font-medium text-muted-foreground"
                id="user-role-label"
              >
                Your Role
              </label>
              <div
                className="mt-1 flex items-center space-x-2"
                aria-labelledby="user-role-label"
              >
                <Badge
                  variant={isAdminOrOwner ? 'default' : 'secondary'}
                  className="flex items-center space-x-1"
                  aria-label={`Role: ${roleInfo.label}`}
                >
                  <Shield className="h-3 w-3" aria-hidden="true" />
                  <span>{roleInfo.label}</span>
                </Badge>
              </div>
              <p
                className="text-sm text-muted-foreground mt-1"
                aria-describedby="user-role-label"
              >
                {roleInfo.description}
              </p>
            </div>

            <div>
              <label
                className="text-sm font-medium text-muted-foreground"
                id="member-since-label"
              >
                Member Since
              </label>
              <div
                className="mt-1 flex items-center space-x-2"
                aria-labelledby="member-since-label"
              >
                <Calendar
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Role Permissions */}
          <div>
            <label
              className="text-sm font-medium text-muted-foreground"
              id="permissions-label"
            >
              Your Permissions
            </label>
            <ul
              className="mt-2 space-y-1"
              aria-labelledby="permissions-label"
              role="list"
            >
              {roleInfo.permissions.map((permission, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-center space-x-2"
                  role="listitem"
                >
                  <div
                    className="h-1.5 w-1.5 bg-muted-foreground rounded-full"
                    aria-hidden="true"
                  />
                  <span>{permission}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin/Owner Actions */}
          {isAdminOrOwner && (
            <div className="pt-4 border-t">
              <label
                className="text-sm font-medium text-muted-foreground mb-3 block"
                id="org-management-label"
              >
                Organization Management
              </label>
              <div
                className="flex flex-col sm:flex-row gap-2"
                aria-labelledby="org-management-label"
                role="group"
              >
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="justify-center"
                >
                  <Link
                    href={`/organization/${organization.slug || organization.id}`}
                    aria-label={`View ${organization.name} organization details`}
                  >
                    <Building2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    View Organization
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="justify-center"
                  aria-label="Organization settings (coming soon)"
                >
                  <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                  Settings (Coming Soon)
                </Button>
              </div>
            </div>
          )}

          {/* Organization Stats */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-muted-foreground" id="org-id-label">
                  Organization ID
                </label>
                <p
                  className="font-mono text-xs mt-1 bg-muted px-2 py-1 rounded break-all"
                  aria-labelledby="org-id-label"
                >
                  {organization.id}
                </p>
              </div>
              <div>
                <label className="text-muted-foreground" id="org-created-label">
                  Created
                </label>
                <p className="mt-1" aria-labelledby="org-created-label">
                  {formatDate(organization.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
