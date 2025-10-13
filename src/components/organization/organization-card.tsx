import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Building2,
  Users,
  Calendar,
  ChevronRight,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import type { Role } from '@/db/schema';
import Link from 'next/link';

interface OrganizationCardProps {
  organization: {
    id: string;
    name: string;
    slug?: string | null;
    logo?: string | null;
    createdAt: Date;
    memberCount: number;
    userRole: Role;
    lastActivity?: Date;
    deletedAt?: Date | null;
    deletedBy?: string | null;
    deletionReason?: string | null;
    permanentDeletionScheduledAt?: Date | null;
  };
}

// Helper function to get role badge color
function getRoleBadgeColor(role: Role): string {
  switch (role) {
    case 'owner':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'admin':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'manager':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'member':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
}

// Helper function to format date
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

// Helper function to check if user can manage organization
function canManageOrganization(role: Role): boolean {
  return ['owner', 'admin', 'manager'].includes(role);
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const canManage = canManageOrganization(organization.userRole);
  const isReadOnly = organization.userRole === 'member';
  const isDeleted = !!organization.deletedAt;
  const daysUntilPermanentDeletion = organization.permanentDeletionScheduledAt
    ? Math.ceil(
        (organization.permanentDeletionScheduledAt.getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <Card
      className={`hover:shadow-md transition-shadow ${isDeleted ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' : ''}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={organization.logo || ''}
                alt={`${organization.name} logo`}
              />
              <AvatarFallback className="bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle
                className={`text-lg ${isDeleted ? 'text-red-700 dark:text-red-300' : ''}`}
              >
                {organization.name}
                {isDeleted && (
                  <AlertTriangle className="h-4 w-4 text-red-500 inline ml-2" />
                )}
              </CardTitle>
              <div className="flex gap-2 mt-1">
                <Badge
                  className={`text-xs ${getRoleBadgeColor(organization.userRole)}`}
                >
                  {organization.userRole.charAt(0).toUpperCase() +
                    organization.userRole.slice(1)}
                </Badge>
                {isDeleted && (
                  <Badge className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Deletion
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Organization Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {organization.memberCount} member
              {organization.memberCount !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Created {formatDate(organization.createdAt)}
            </span>
          </div>
        </div>

        {/* Deletion Status */}
        {isDeleted && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300 mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Scheduled for deletion</span>
            </div>
            <p className="text-xs text-red-600 dark:text-red-400">
              Will be permanently deleted in {daysUntilPermanentDeletion} day
              {daysUntilPermanentDeletion !== 1 ? 's' : ''}
              {organization.permanentDeletionScheduledAt && (
                <> ({formatDate(organization.permanentDeletionScheduledAt)})</>
              )}
            </p>
            {organization.deletionReason && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Reason: {organization.deletionReason}
              </p>
            )}
          </div>
        )}

        {/* Last Activity */}
        {!isDeleted && organization.lastActivity && (
          <div className="text-sm text-muted-foreground">
            Last activity: {formatDate(organization.lastActivity)}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {isDeleted ? (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled
              >
                Organization Deleted
              </Button>
              {canManage && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="cursor-pointer"
                >
                  Restore
                </Button>
              )}
            </div>
          ) : canManage ? (
            <Button size={'lg'} className="w-full cursor-pointer">
              <Link
                href={`/dashboard/organization/${organization.slug}`}
                className="flex justify-between items-center"
              >
                Manage Organization
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          ) : (
            // <Link
            //   // @ts-expect-error - Dynamic route typing issue
            //   href={`/dashboard/organization/${organization.slug || organization.id}/view`}
            // >
            //   <Button type="button" variant="outline" className="w-full">
            //     <Eye className="h-4 w-4 mr-2" />
            //     View Organization
            //   </Button>
            // </Link>
            // TODO: To add read only functionality to member role
            <></>
          )}
        </div>

        {/* Role-specific indicators */}
        {isReadOnly && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            You have read-only access to this organization
          </div>
        )}
      </CardContent>
    </Card>
  );
}
