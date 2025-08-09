import { betterFetch } from '@better-fetch/fetch';
import type { Session } from 'better-auth/types';
import { NextRequest, NextResponse } from 'next/server';

export default async function authMiddleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      baseURL: request.nextUrl.origin,
      headers: {
        //get the cookie from the request
        cookie: request.headers.get('cookie') || '',
      },
    }
  );

  console.log('🔍 Middleware - Session check:', {
    pathname: request.nextUrl.pathname,
    hasSession: !!session,
    userId: session?.user?.id,
    emailVerified: session?.user?.emailVerified,
    timestamp: new Date().toISOString(),
  });

  // Allow access to auth pages and API routes
  if (
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/sign-up') ||
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/verify-email') ||
    request.nextUrl.pathname.startsWith('/forgot-password') ||
    request.nextUrl.pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!session) {
    console.log('🚫 Middleware - No session, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect unverified users to verification page
  if (!session.user.emailVerified) {
    console.log(
      '📧 Middleware - Email not verified, redirecting to verify-email'
    );
    return NextResponse.redirect(new URL('/verify-email', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
