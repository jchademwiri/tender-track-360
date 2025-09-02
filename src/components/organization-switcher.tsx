'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Organization } from '@/db/schema';
import type { Route } from 'next';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

interface OrganizationSwitcherProps {
  organizations: Organization[];
}

export function OrganizationSwitcher({
  organizations,
}: OrganizationSwitcherProps) {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChangeOrganization = async (organizationId: string) => {
    const selectedOrg = organizations.find((org) => org.id === organizationId);
    if (!selectedOrg) {
      toast.error('Organization not found');
      return;
    }

    startTransition(async () => {
      try {
        // First, switch the active organization in the session
        console.log('Switching to organization:', organizationId);
        const result = await authClient.organization.setActive({
          organizationId,
        });
        console.log('Organization switch result:', result);
        const { error } = result;

        if (error) {
          // Handle empty error objects or errors without message
          let errorMessage = 'Failed to switch organization';
          if (error && typeof error === 'object') {
            if ('message' in error && typeof error.message === 'string') {
              errorMessage = error.message;
            } else if ('error' in error && typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (Object.keys(error).length === 0) {
              errorMessage =
                'Unknown error occurred while switching organization';
            }
          }

          // Only log meaningful errors, not empty objects
          if (Object.keys(error).length > 0) {
            console.error('Organization switch error:', error);
          } else {
            console.error(
              'Organization switch error: Empty error object received'
            );
          }

          toast.error(errorMessage);
          return;
        }

        // Handle URL navigation based on current page
        const newUrl = getUpdatedUrl(
          pathname,
          selectedOrg.slug || selectedOrg.id
        );

        // Navigate to the new URL
        router.push(newUrl as Route);

        // Refresh to ensure all server components get the new organization context
        router.refresh();

        toast.success(`Switched to ${selectedOrg.name}`);
      } catch (error) {
        console.error('Organization switch error:', error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to switch organization';
        toast.error(errorMessage);
      }
    });
  };

  // Function to determine the new URL based on current path and organization slug
  const getUpdatedUrl = (currentPath: string, orgSlug: string): string => {
    // If we're on an organization-specific page, update the slug
    if (currentPath.includes('/organization/')) {
      return `/organization/${orgSlug}`;
    }

    // For dashboard and other pages that should show organization context
    if (currentPath === '/dashboard' || currentPath.startsWith('/dashboard')) {
      return `/organization/${orgSlug}`;
    }

    // For profile and other non-org specific pages, stay on the same page
    // but the organization context will still be updated
    if (
      currentPath.startsWith('/profile') ||
      currentPath.startsWith('/settings') ||
      currentPath === '/'
    ) {
      return currentPath;
    }

    // Default: navigate to organization page
    return `/organization/${orgSlug}`;
  };

  return (
    <Select
      onValueChange={handleChangeOrganization}
      value={activeOrganization?.id}
      disabled={isPending}
    >
      <SelectTrigger className="min-w-[180px]">
        <SelectValue
          placeholder={isPending ? 'Switching...' : 'Organization'}
        />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((organization) => (
          <SelectItem key={organization.id} value={organization.id}>
            {organization.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
