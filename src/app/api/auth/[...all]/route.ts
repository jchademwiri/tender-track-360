import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { NextRequest, NextResponse } from 'next/server';

// Create handlers with logging
const handlers = toNextJsHandler(auth.handler);

export async function GET(request: NextRequest) {
  console.log('🔍 AUTH API GET Request:', {
    url: request.url,
    pathname: request.nextUrl.pathname,
    searchParams: Object.fromEntries(request.nextUrl.searchParams),
    headers: {
      'content-type': request.headers.get('content-type'),
      'user-agent': request.headers.get('user-agent'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
    },
    timestamp: new Date().toISOString(),
  });

  try {
    const response = await handlers.GET(request);

    console.log('✅ AUTH API GET Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      timestamp: new Date().toISOString(),
    });

    return response;
  } catch (error) {
    console.error('❌ AUTH API GET Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('🔍 AUTH API POST Request:', {
    url: request.url,
    pathname: request.nextUrl.pathname,
    searchParams: Object.fromEntries(request.nextUrl.searchParams),
    headers: {
      'content-type': request.headers.get('content-type'),
      'user-agent': request.headers.get('user-agent'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
    },
    timestamp: new Date().toISOString(),
  });

  // Log request body (be careful with sensitive data)
  try {
    const body = await request.text();
    const parsedBody = body ? JSON.parse(body) : {};

    // Remove sensitive data from logs
    const logBody = { ...parsedBody };
    if (logBody.password) logBody.password = '[REDACTED]';
    if (logBody.confirmPassword) logBody.confirmPassword = '[REDACTED]';

    console.log('📝 AUTH API POST Body:', logBody);

    // Create new request with the body
    const newRequest = new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: body,
    });

    const response = await handlers.POST(newRequest);

    console.log('✅ AUTH API POST Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      timestamp: new Date().toISOString(),
    });

    return response;
  } catch (error) {
    console.error('❌ AUTH API POST Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
