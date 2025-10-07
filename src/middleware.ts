import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get session cookies - Better Auth uses multiple cookies
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;
  const sessionDataCookie = request.cookies.get(
    'better-auth.session_data'
  )?.value;

  // Debug: Log all cookies to see what's available
  console.log(
    'All cookies:',
    Array.from(request.cookies.getAll()).map((c) => c.name)
  );
  console.log('Session token:', !!sessionToken);
  console.log('Session data:', !!sessionDataCookie);

  // If no session token, redirect to login
  if (!sessionToken && !sessionDataCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // For now, let all authenticated users through to the dashboard
  // The dashboard page will handle the organization check server-side
  // This avoids the Edge Runtime limitation while still providing protection

  console.log('Middleware Debug:', {
    hasSessionToken: !!sessionToken,
    hasSessionData: !!sessionDataCookie,
    path: request.nextUrl.pathname,
    action: 'allowing through - will check organization in page component',
  });

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding', '/organization/:path*'],
};
