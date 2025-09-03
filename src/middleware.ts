import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Handle dashboard redirects to organization-specific pages
  if (request.nextUrl.pathname === '/dashboard') {
    // For now, let the client-side handle the redirect to the active organization
    // This could be enhanced to redirect server-side if we can access the active org from the session
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/onboarding', '/profile', '/organization/:path*'],
};
