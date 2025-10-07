'use client';

import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export interface OrganizationSwitchOptions {
  organizationId: string;
  organizationName: string;
  router: AppRouterInstance;
  redirectUrl?: string;
  showToast?: boolean;
}

/**
 * Utility function to handle organization switching with proper session refresh
 * This ensures both client and server components get the updated organization context
 */
export async function switchOrganization({
  organizationId,
  organizationName,
  router,
  redirectUrl,
  showToast = true,
}: OrganizationSwitchOptions): Promise<{ success: boolean; error?: string }> {
  try {
    // Step 1: Switch the active organization
    const result = await authClient.organization.setActive({
      organizationId,
    });

    if (result.error) {
      const errorMessage = 'Failed to switch organization';
      if (showToast) {
        toast.error(errorMessage);
      }
      return { success: false, error: errorMessage };
    }

    // Step 2: Force session refresh to ensure server components get updated data
    // This is crucial for server components that depend on session.activeOrganizationId
    try {
      await authClient.getSession({
        fetchOptions: {
          cache: 'no-store',
        },
      });
    } catch (sessionError) {
      console.warn(
        'Session refresh failed, continuing with router refresh:',
        sessionError
      );
    }

    // Step 3: Navigate to new URL if provided
    if (redirectUrl) {
      router.push(redirectUrl);
    }

    // Step 4: Refresh the page to update all server components
    router.refresh();

    // Step 5: Show success message
    if (showToast) {
      toast.success(`Switched to ${organizationName}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Organization switch error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to switch organization';

    if (showToast) {
      toast.error(errorMessage);
    }

    return { success: false, error: errorMessage };
  }
}

/**
 * Alternative organization switching with full page reload as fallback
 * Use this if the session refresh approach doesn't work reliably
 */
export async function switchOrganizationWithReload({
  organizationId,
  organizationName,
  redirectUrl,
  showToast = true,
}: Omit<OrganizationSwitchOptions, 'router'>): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Step 1: Switch the active organization
    const result = await authClient.organization.setActive({
      organizationId,
    });

    if (result.error) {
      const errorMessage = 'Failed to switch organization';
      if (showToast) {
        toast.error(errorMessage);
      }
      return { success: false, error: errorMessage };
    }

    // Step 2: Show success message before reload
    if (showToast) {
      toast.success(`Switched to ${organizationName}`);
    }

    // Step 3: Full page reload to ensure all data is fresh
    // Removed artificial delay; navigate/reload immediately for responsiveness
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      window.location.reload();
    }

    return { success: true };
  } catch (error) {
    console.error('Organization switch error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to switch organization';

    if (showToast) {
      toast.error(errorMessage);
    }

    return { success: false, error: errorMessage };
  }
}
