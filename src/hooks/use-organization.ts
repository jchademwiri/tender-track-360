'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import type { Route } from 'next';

export function useOrganization() {
  const { data: activeOrganization, isPending: isLoading } =
    authClient.useActiveOrganization();
  const router = useRouter();
  const pathname = usePathname();

  // Navigate to a path within the current organization context
  const navigateWithOrg = useCallback(
    (path: string) => {
      if (!activeOrganization?.slug) {
        // If no active organization, navigate normally
        router.push(path as Route);
        return;
      }

      // If the path is organization-specific, use the org slug
      if (path.startsWith('/organization') || path.startsWith('/dashboard')) {
        router.push(`/organization/${activeOrganization.slug}` as Route);
      } else {
        // For other paths, navigate normally but organization context is maintained
        router.push(path as Route);
      }
    },
    [activeOrganization?.slug, router]
  );

  // Get organization-aware URL for a given path
  const getOrgUrl = useCallback(
    (path: string) => {
      if (!activeOrganization?.slug) {
        return path;
      }

      if (path.startsWith('/organization') || path.startsWith('/dashboard')) {
        return `/organization/${activeOrganization.slug}`;
      }

      return path;
    },
    [activeOrganization?.slug]
  );

  // Check if current page is organization-specific
  const isOrgSpecificPage = useCallback(() => {
    return (
      pathname.includes('/organization/') || pathname.startsWith('/dashboard')
    );
  }, [pathname]);

  // Get current organization slug from URL if on org-specific page
  const getCurrentOrgSlug = useCallback(() => {
    const match = pathname.match(/\/organization\/([^\/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  return {
    activeOrganization,
    isLoading,
    navigateWithOrg,
    getOrgUrl,
    isOrgSpecificPage: isOrgSpecificPage(),
    currentOrgSlug: getCurrentOrgSlug(),
  };
}
