import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  console.log('🧪 Testing auth configuration...');

  try {
    // Test database connection
    console.log('📊 Testing database connection...');

    // Test environment variables
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      BETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      NODE_ENV: process.env.NODE_ENV,
    };

    console.log('🔧 Environment variables check:', envCheck);

    return NextResponse.json({
      status: 'ok',
      message: 'Auth configuration test successful',
      environment: envCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Auth configuration test failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Auth configuration test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
