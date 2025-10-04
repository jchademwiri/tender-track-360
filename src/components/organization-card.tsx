'use client';

import { organization, Role } from '@/db/schema';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Settings, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface OrganizationCardProps {
  organization: typeof organization.$inferSelect;
  memberCount?: number;
  isActive?: boolean;
  userRole?: Role;
  className?: string;
}

export function OrganizationCard({
  organization,
  memberCount = 0,
  isActive = false,
  userRole = 'member',
  className,
}: OrganizationCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300 ease-out hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.03] hover:-translate-y-1 cursor-pointer',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
        isActive && 'ring-2 ring-primary ring-offset-2 shadow-lg',
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 transition-transform duration-300 group-hover:scale-110">
              <AvatarImage src={organization.logo || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold transition-colors duration-300 group-hover:bg-primary/20">
                <Link href={`/organization/${organization.slug}`}>
                  {getInitials(organization.name)}
                </Link>
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight truncate">
                {organization.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={isActive ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {userRole}
                </Badge>
                {isActive && (
                  <Badge variant="outline" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="size-4" />
              <span>
                {memberCount} member{memberCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="size-4" />
              <span>Created {formatDate(organization.createdAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              asChild
              className="flex-1 transition-all duration-200 hover:scale-105"
              size="sm"
            >
              <Link href={`/organization/${organization.slug}/dashboard`}>
                <ExternalLink className="size-4 mr-2 transition-transform duration-200 group-hover:translate-x-0.5" />
                Go to Dashboard
              </Link>
            </Button>
            {(userRole === 'owner' || userRole === 'admin') && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="transition-all duration-200 hover:scale-105 hover:rotate-12"
              >
                {/* TODO: Implement settings page route */}
                <button
                  onClick={() => {
                    console.log('Settings clicked for:', organization.slug);
                    // TODO: Navigate to settings page when route is created
                  }}
                  aria-label="Settings"
                  className="p-1 hover:bg-muted rounded"
                >
                  <Settings className="size-4 transition-transform duration-200" />
                </button>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
