import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/server/email';

export async function POST(request: NextRequest) {
  console.log('🧪 Testing email sending...');

  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log('📧 Attempting to send test verification email to:', email);

    // Send a test verification email
    const result = await sendVerificationEmail({
      email,
      name: name || 'Test User',
      verificationUrl: `${process.env.BETTER_AUTH_URL}/verify-email?token=test-token`,
    });

    console.log('✅ Test email sent successfully:', result);

    return NextResponse.json({
      status: 'success',
      message: 'Test email sent successfully',
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Test email failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Test email failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
