import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Parse session cookie if possible
  let sessionData: any = {};
  try {
    sessionData = JSON.parse(sessionCookie);
  } catch {
    // If parsing fails, treat as no organization
    sessionData = {};
  }
  const hasOrganization = sessionData.activeOrganizationId;
  const onboardingUrl = new URL('/onboarding', request.url);

  // Redirect to onboarding if user does not have an organization and is not already on onboarding page
  if (!hasOrganization && !request.nextUrl.pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(onboardingUrl);
  }

  // Handle dashboard redirects to organization-specific pages
  if (request.nextUrl.pathname === '/dashboard') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding', '/organization/:path*'],
};
