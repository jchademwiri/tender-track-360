import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🧪 Testing signup endpoint directly...');

  try {
    const body = await request.json();
    console.log('📝 Received signup request:', {
      name: body.name,
      email: body.email,
      hasPassword: !!body.password,
      timestamp: new Date().toISOString(),
    });

    // Test making a direct request to the auth endpoint
    const authResponse = await fetch(
      `${process.env.BETTER_AUTH_URL}/api/auth/sign-up`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: body.name,
          email: body.email,
          password: body.password,
          callbackURL: '/verify-email',
        }),
      }
    );

    const authResponseText = await authResponse.text();
    let authResponseData;
    try {
      authResponseData = JSON.parse(authResponseText);
    } catch {
      authResponseData = authResponseText;
    }

    console.log('📨 Auth endpoint response:', {
      status: authResponse.status,
      statusText: authResponse.statusText,
      headers: Object.fromEntries(authResponse.headers.entries()),
      body: authResponseData,
    });

    return NextResponse.json({
      status: 'test-complete',
      authResponse: {
        status: authResponse.status,
        statusText: authResponse.statusText,
        body: authResponseData,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Test signup error:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Test signup failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
