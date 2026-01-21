import { createAuthClient } from 'better-auth/react';
import { organizationClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  plugins: [organizationClient()],
});

export function getRedirectPath(): string {
  if (typeof window === 'undefined') return '/dashboard';

  const hostname = window.location.hostname;
  const mainDomainUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  let mainHostname = 'localhost';
  try {
    mainHostname = new URL(mainDomainUrl).hostname;
  } catch (e) {
    // Fallback if URL parsing fails
  }

  // Remove 'www.' for comparison
  const currentHost = hostname.replace(/^www\./, '');
  const rootHost = mainHostname.replace(/^www\./, '');

  // Check if it's a subdomain
  if (currentHost !== rootHost && currentHost.endsWith(rootHost)) {
    return '/';
  }

  return '/dashboard';
}

export const signInWithGoogle = async (callbackURL?: string) => {
  const finalCallbackURL = callbackURL || getRedirectPath();
  try {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: finalCallbackURL,
    });
  } catch (error) {
    console.error('Google sign in error:', error);
    // Fallback to direct redirect
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    window.location.href = `${baseUrl}/api/auth/sign-in/google?callbackURL=${encodeURIComponent(finalCallbackURL)}`;
  }
};

export const signOut = async () => {
  try {
    // Try the auth client method first
    await authClient.signOut();
  } catch (error) {
    console.error('Auth client sign out error:', error);
    // Fallback to direct API call
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    try {
      const response = await fetch(`${baseUrl}/api/auth/sign-out`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Sign out API call failed: ${response.status}`);
      }
    } catch (apiError) {
      console.error('Direct API sign out also failed:', apiError);
    }

    // Clear local storage/session storage as fallback
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
  }
};
