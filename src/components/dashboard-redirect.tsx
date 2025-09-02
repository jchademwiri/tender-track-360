'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Organization } from '@/db/schema';

interface DashboardRedirectProps {
  organizations: Organization[];
  fallbackContent: React.ReactNode;
}

export function DashboardRedirect({
  organizations,
  fallbackContent,
}: DashboardRedirectProps) {
  const { data: activeOrganization, isLoading } =
    authClient.useActiveOrganization();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (activeOrganization?.slug) {
      // Redirect to the active organization
      router.replace(`/organization/${activeOrganization.slug}`);
    } else if (organizations.length > 0) {
      // If no active organization but user has organizations, redirect to the first one
      router.replace(`/organization/${organizations[0].slug}`);
    }
    // If no organizations, show the fallback content (create organization form)
  }, [activeOrganization, isLoading, organizations, router]);

  // Show loading state while checking organization
  if (isLoading) {
    return (
      <section className="grid place-items-center min-h-[600px] text-center">
        <div>
          <h1 className="text-4xl font-bold">Tender Track 360</h1>
          <p className="mt-4 text-lg">Loading your organization...</p>
        </div>
      </section>
    );
  }

  // Show fallback content if no organizations or while redirecting
  return <>{fallbackContent}</>;
}
