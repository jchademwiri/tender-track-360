'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

interface OrganizationProviderProps {
  children: React.ReactNode;
  organizations?: Array<{ id: string; slug: string; name: string }>;
}

export function OrganizationProvider({
  children,
  organizations = [],
}: OrganizationProviderProps) {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run this effect on organization-specific pages
    if (!pathname.includes('/organization/')) {
      return;
    }

    // Extract slug from current URL
    const urlSlugMatch = pathname.match(/\/organization\/([^\/]+)/);
    const urlSlug = urlSlugMatch ? urlSlugMatch[1] : null;

    if (!urlSlug || !activeOrganization) {
      return;
    }

    // Check if the URL slug matches the active organization
    if (activeOrganization.slug !== urlSlug) {
      // Find the organization that matches the URL slug
      const urlOrganization = organizations.find((org) => org.slug === urlSlug);

      if (urlOrganization) {
        // Switch to the organization that matches the URL
        authClient.organization
          .setActive({
            organizationId: urlOrganization.id,
          })
          .then(({ error }) => {
            if (error) {
              console.error('Failed to sync organization with URL:', error);
              toast.error('Failed to switch organization');
              // Redirect to the correct organization URL
              router.push(`/organization/${activeOrganization.slug}`);
            } else {
              // Refresh to ensure server components get updated context
              router.refresh();
            }
          });
      } else {
        // URL has invalid organization slug, redirect to active organization
        console.warn(`Invalid organization slug in URL: ${urlSlug}`);
        router.push(`/organization/${activeOrganization.slug}`);
      }
    }
  }, [pathname, activeOrganization, organizations, router]);

  return <>{children}</>;
}
