'use server';

import { db } from '@/db';
import { user } from '@/db/schema/auth';
import { eq } from 'drizzle-orm';
import { sendVerificationEmail } from '@/server/email';

export async function resendVerificationEmail(email: string) {
  console.log('🔄 Server Action - Resending verification email for:', email);

  try {
    if (!email || typeof email !== 'string') {
      return {
        success: false,
        error: 'Valid email address is required',
      };
    }

    // Find the user in the database
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email.toLowerCase().trim()));

    if (!existingUser) {
      console.warn('❌ User not found for email:', email);
      return {
        success: false,
        error: 'No account found with this email address',
      };
    }

    // Check if user is already verified
    if (existingUser.emailVerified) {
      console.log('ℹ️ User already verified:', email);
      return {
        success: true,
        message: 'Email is already verified',
      };
    }

    // Generate verification URL using Better Auth's format
    const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${existingUser.id}&email=${encodeURIComponent(email)}`;

    console.log('📧 Sending verification email via server action:', {
      userId: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
    });

    // Send verification email directly
    await sendVerificationEmail({
      email: existingUser.email,
      verificationUrl,
      name: existingUser.name,
    });

    console.log('✅ Server Action - Verification email sent successfully');

    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  } catch (error) {
    console.error(
      '❌ Server Action - Error sending verification email:',
      error
    );

    return {
      success: false,
      error: 'Failed to send verification email',
    };
  }
}
