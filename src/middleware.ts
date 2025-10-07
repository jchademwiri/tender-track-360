import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Debug: Log all cookies
  const allCookies = request.cookies.getAll();
  console.log('=== MIDDLEWARE DEBUG ===');
  console.log('Path:', pathname);
  console.log(
    'All cookies:',
    allCookies.map((c) => `${c.name}=${c.value.substring(0, 20)}...`)
  );

  // Check for ANY better-auth cookie
  const hasBetterAuthCookie = allCookies.some(
    (cookie) =>
      cookie.name.startsWith('better-auth') ||
      cookie.name.includes('session') ||
      cookie.name.includes('auth')
  );

  console.log('Has any auth cookie:', hasBetterAuthCookie);

  // If no auth cookies at all, redirect to login
  if (!hasBetterAuthCookie) {
    console.log('❌ No auth cookies found - redirecting to login');
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  console.log('✅ Auth cookie found - allowing through');
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding', '/organization/:path*'],
};
