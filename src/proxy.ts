import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 1. Get the current URL and Hostname
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // 2. Identify if we are on the Admin Subdomain
  // This robust check works for 'admin.localhost:3000' and 'admin.tendertrack360.co.za'
  const isAdminSubdomain = hostname.startsWith('admin.');

  // ---------------------------------------------------------
  // SCENARIO A: Request is coming from admin.domain.com
  // ---------------------------------------------------------
  if (isAdminSubdomain) {
    // PROXY LOGIC: Rewrite the URL to serve content from the /admin folder.
    // Example: https://admin.site.com/dashboard -> internally serves /admin/dashboard

    // We clone the URL to modify it safely (Best Practice for Next.js 15+)
    const rewriteUrl = url.clone();

    // Map the root path to /admin, and all other paths relative to it
    rewriteUrl.pathname = `/admin${url.pathname}`;

    return NextResponse.rewrite(rewriteUrl);
  }

  // ---------------------------------------------------------
  // SCENARIO B: Request is coming from main domain (app.com)
  // ---------------------------------------------------------

  // Security: Prevent direct access to the /admin folder from the main domain.
  // We don't want users guessing https://tendertrack360.co.za/admin
  if (url.pathname.startsWith('/admin')) {
    // Rewrite to a 404 page to effectively "hide" the admin routes
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  // Allow all other requests to proceed normally
  return NextResponse.next();
}

// ---------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api/ routes (we typically want these accessible globally or handled by logic)
     * 2. /_next/ (static files, chunks, etc.)
     * 3. /static (public folder assets)
     * 4. File extensions like .png, .jpg, .svg, .ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
