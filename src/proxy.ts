import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for ANY better-auth cookie
  const hasBetterAuthCookie = request.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.startsWith('better-auth') ||
        cookie.name.includes('session') ||
        cookie.name.includes('auth')
    );

  // If no auth cookies at all, redirect to login
  if (!hasBetterAuthCookie) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding', '/organization/:path*'],
};
