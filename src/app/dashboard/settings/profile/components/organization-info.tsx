'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, CalendarDays, Users } from 'lucide-react';

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

interface OrganizationInfoProps {
  membership: OrganizationMembership | null;
}

export function OrganizationInfo({ membership }: OrganizationInfoProps) {
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
        <CardContent className="space-y-4">
          {membership ? (
            <div className="space-y-4">
              <div>
                <label
                  className="text-sm font-medium text-muted-foreground"
                  id="organization-name-label"
                >
                  Organization Name
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
                  <p
                    className="text-sm sm:text-base font-medium"
                    aria-labelledby="organization-name-label"
                  >
                    {membership.organization.name}
                  </p>
                  <Badge
                    variant="outline"
                    className="text-xs w-fit"
                    aria-label={`Role: ${membership.role}`}
                  >
                    <Users className="h-3 w-3 mr-1" aria-hidden="true" />
                    {membership.role}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <label
                    className="text-sm font-medium text-muted-foreground"
                    id="organization-slug-label"
                  >
                    Organization Slug
                  </label>
                  <p
                    className="mt-1 text-sm sm:text-base font-mono"
                    aria-labelledby="organization-slug-label"
                  >
                    {membership.organization.slug}
                  </p>
                </div>
                <div className="space-y-1">
                  <label
                    className="text-sm font-medium text-muted-foreground"
                    id="joined-date-label"
                  >
                    Member Since
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <CalendarDays
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <p
                      className="text-sm sm:text-base"
                      aria-labelledby="joined-date-label"
                    >
                      {formatDate(membership.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label
                  className="text-sm font-medium text-muted-foreground"
                  id="organization-created-label"
                >
                  Organization Created
                </label>
                <p
                  className="mt-1 text-sm sm:text-base"
                  aria-labelledby="organization-created-label"
                >
                  {formatDate(membership.organization.createdAt)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Building2
                className="h-8 w-8 mx-auto mb-2 opacity-50"
                aria-hidden="true"
              />
              <p className="text-sm">No organization membership</p>
              <p className="text-xs mt-1">
                You are not currently a member of any organization
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
