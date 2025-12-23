'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Mail,
  CalendarDays,
  Building2,
  CheckCircle2,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';

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

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
}

interface ProfileSidebarProps {
  currentUser: User;
  organizationMembership: OrganizationMembership | null;
}

export function ProfileSidebar({
  currentUser,
  organizationMembership,
}: ProfileSidebarProps) {
  // Helpers
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(currentUser.email);
    toast.success('Email copied to clipboard');
  };

  return (
    <Card className="h-fit sticky top-6 border-muted/60 shadow-md overflow-hidden">
      {/* Cover / Header Background Pattern */}
      <div className="h-24 bg-linear-to-r from-primary/10 to-primary/5 border-b border-border/50" />

      <CardHeader className="relative pb-0 pt-0">
        <div className="flex flex-col items-center -mt-12 mb-4">
          <Avatar className="h-24 w-24 border-4 border-background shadow-sm bg-background">
            <AvatarImage
              src={currentUser.image || ''}
              alt={`Profile picture of ${currentUser.name}`}
            />
            <AvatarFallback className="text-xl font-medium bg-secondary text-secondary-foreground">
              {getInitials(currentUser.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 text-center pt-2">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight">
            {currentUser.name}
          </h2>
          <div className="flex items-center justify-center space-x-2 text-muted-foreground group">
            <Mail className="h-3.5 w-3.5" />
            <span className="text-sm">{currentUser.email}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={copyEmail}
              aria-label="Copy email address"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Verification Status Badge */}
        <div className="flex justify-center">
          {currentUser.emailVerified ? (
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              Verified Account
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-200"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
              Unverified
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-border">
          {/* Member Since */}
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div className="text-left space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground">
                Member Since
              </p>
              <p className="text-sm font-semibold">
                {formatDate(currentUser.createdAt)}
              </p>
            </div>
          </div>

          {/* Organization Info */}
          {organizationMembership ? (
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="text-left space-y-0.5 w-full overflow-hidden">
                <p className="text-xs font-medium text-muted-foreground">
                  Organization
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold truncate pr-2">
                    {organizationMembership.organization.name}
                  </p>
                  <Badge
                    variant="secondary"
                    className="text-[10px] uppercase font-bold px-1.5 h-5"
                  >
                    {organizationMembership.role}
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-3 rounded-lg border border-dashed text-muted-foreground text-sm">
              No Active Organization
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
