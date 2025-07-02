import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { cookies, nextUrl } = request;
  // Supabase sets a cookie named 'sb-access-token' (or similar)
  const accessToken =
    cookies.get('sb-access-token')?.value ||
    cookies.get('supabase-auth-token')?.value;

  // Protect /dashboard/*
  if (nextUrl.pathname.startsWith('/dashboard')) {
    if (!accessToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
