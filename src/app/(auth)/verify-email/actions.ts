'use server';

import { auth } from '@/lib/auth';

export async function resendVerificationEmail(email: string) {
  console.log('🔄 Server Action - Resending verification email for:', email);

  try {
    if (!email || typeof email !== 'string') {
      return {
        success: false,
        error: 'Valid email address is required',
      };
    }

    console.log('📧 Using Better Auth API to send verification email:', email);

    // Use Better Auth's built-in sendVerificationEmail method
    // This will properly generate verification tokens and handle the email sending
    const result = await auth.api.sendVerificationEmail({
      body: {
        email: email.toLowerCase().trim(),
      },
    });

    if (!result) {
      console.error(
        '❌ Better Auth sendVerificationEmail returned null/undefined'
      );
      return {
        success: false,
        error:
          'Failed to send verification email - no response from auth service',
      };
    }

    console.log(
      '✅ Server Action - Verification email sent successfully via Better Auth'
    );

    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  } catch (error) {
    console.error(
      '❌ Server Action - Error sending verification email:',
      error
    );

    // Provide more specific error messages
    let errorMessage = 'Failed to send verification email';

    if (error instanceof Error) {
      if (error.message.includes('User not found')) {
        errorMessage = 'No account found with this email address';
      } else if (error.message.includes('already verified')) {
        errorMessage = 'Email is already verified';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Too many attempts. Please try again later';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
