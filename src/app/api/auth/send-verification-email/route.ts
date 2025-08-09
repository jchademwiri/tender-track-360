import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schema/auth';
import { eq } from 'drizzle-orm';
import { sendVerificationEmail } from '@/server/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log('🔄 Resend verification email request:', {
      email,
      timestamp: new Date().toISOString(),
    });

    if (!email || typeof email !== 'string') {
      console.warn('❌ Invalid email provided:', email);
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Find the user in the database
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email.toLowerCase().trim()));

    if (!existingUser) {
      console.warn('❌ User not found for email:', email);
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (existingUser.emailVerified) {
      console.log('ℹ️ User already verified:', email);
      return NextResponse.json(
        { message: 'Email is already verified' },
        { status: 200 }
      );
    }

    // Generate verification URL
    const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${existingUser.id}&email=${encodeURIComponent(email)}`;

    console.log('📧 Sending verification email:', {
      userId: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
    });

    // Send verification email
    await sendVerificationEmail({
      email: existingUser.email,
      verificationUrl,
      name: existingUser.name,
    });

    console.log('✅ Verification email sent successfully:', {
      userId: existingUser.id,
      email: existingUser.email,
    });

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error sending verification email:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
