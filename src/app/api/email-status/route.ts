import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: NextRequest) {
  console.log('🔍 Checking email configuration status...');

  try {
    // Check environment variables
    const envStatus = {
      RESEND_API_KEY: {
        exists: !!process.env.RESEND_API_KEY,
        length: process.env.RESEND_API_KEY?.length || 0,
        prefix:
          process.env.RESEND_API_KEY?.substring(0, 8) + '...' || 'NOT_SET',
      },
      BETTER_AUTH_URL: {
        exists: !!process.env.BETTER_AUTH_URL,
        value: process.env.BETTER_AUTH_URL || 'NOT_SET',
      },
      NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
    };

    console.log('🔧 Environment Status:', envStatus);

    // Test Resend connection
    let resendStatus = {
      connected: false,
      error: null as any,
    };

    try {
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Try to get domains (this will test the API key)
        const domains = await resend.domains.list();
        resendStatus.connected = true;
        console.log('✅ Resend API connection successful');
      } else {
        resendStatus.error = 'RESEND_API_KEY not set';
      }
    } catch (error) {
      resendStatus.error =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Resend API connection failed:', error);
    }

    const status = {
      timestamp: new Date().toISOString(),
      environment: envStatus,
      resend: resendStatus,
      emailConfiguration: {
        fromAddress: 'Tender Track 360 <noreply@updates.jacobc.co.za>',
        emailTypes: [
          'VERIFICATION_EMAIL',
          'INVITATION_EMAIL',
          'PASSWORD_RESET_EMAIL',
        ],
      },
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error('❌ Email status check failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Email status check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
