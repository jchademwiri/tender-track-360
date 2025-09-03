'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Settings, Shield, Calendar } from 'lucide-react';
import Link from 'next/link';

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>Organization</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Organization Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Organization Name
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <p className="font-medium text-lg">{organization.name}</p>
              {organization.logo && (
                <img
                  src={organization.logo}
                  alt={`${organization.name} logo`}
                  className="h-6 w-6 rounded"
                />
              )}
            </div>
          </div>

          {organization.slug && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Organization Slug
              </label>
              <p className="mt-1 text-sm font-mono bg-muted px-2 py-1 rounded">
                {organization.slug}
              </p>
            </div>
          )}
        </div>

        {/* User Role and Membership Info */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Your Role
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <Badge
                variant={isAdminOrOwner ? 'default' : 'secondary'}
                className="flex items-center space-x-1"
              >
                <Shield className="h-3 w-3" />
                <span>{roleInfo.label}</span>
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {roleInfo.description}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Member Since
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Role Permissions */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Your Permissions
          </label>
          <ul className="mt-2 space-y-1">
            {roleInfo.permissions.map((permission, index) => (
              <li
                key={index}
                className="text-sm text-muted-foreground flex items-center space-x-2"
              >
                <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full" />
                <span>{permission}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Admin/Owner Actions */}
        {isAdminOrOwner && (
          <div className="pt-4 border-t">
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
              Organization Management
            </label>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/organization/${organization.slug || organization.id}`}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  View Organization
                </Link>
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Settings (Coming Soon)
              </Button>
            </div>
          </div>
        )}

        {/* Organization Stats */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-muted-foreground">Organization ID</label>
              <p className="font-mono text-xs mt-1 bg-muted px-2 py-1 rounded">
                {organization.id}
              </p>
            </div>
            <div>
              <label className="text-muted-foreground">Created</label>
              <p className="mt-1">{formatDate(organization.createdAt)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
