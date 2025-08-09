import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schema/auth';

export async function GET(request: NextRequest) {
  console.log('🧪 Testing database connection...');

  try {
    // Test basic database connection
    console.log('📊 Testing database query...');

    // Try to query the user table (should work even if empty)
    const users = await db.select().from(user).limit(1);

    console.log('✅ Database query successful:', {
      userCount: users.length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      status: 'ok',
      message: 'Database connection successful',
      userCount: users.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Database connection test failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
