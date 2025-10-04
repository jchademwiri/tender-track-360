'use client';

import { HomePage } from '@/components/home-page';
import { UserContext } from '@/types/home-page';
import { authClient } from '@/lib/auth-client';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  // Show loading state while checking authentication
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Build user context based on actual authentication state
  const userContext: UserContext = {
    isAuthenticated: !!session?.user,
    user: session?.user
      ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          organizationId: activeOrganization?.id || '',
          organizationName: activeOrganization?.name || '',
          role: 'member', // Default role - will be determined by server-side logic when needed
        }
      : undefined,
  };

  return <HomePage userContext={userContext} />;
}
