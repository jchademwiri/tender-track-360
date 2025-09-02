'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Server-side validation schema
const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
}

export async function updateProfile(
  data: UpdateProfileData
): Promise<ActionResult> {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: 'You must be logged in to update your profile',
      };
    }

    // Validate input data
    const validationResult = updateProfileSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Invalid input data',
        data: validationResult.error.flatten().fieldErrors,
      };
    }

    const validatedData = validationResult.data;

    // Update user profile using Better Auth
    const updateResult = await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: validatedData.name,
      },
    });

    if (!updateResult) {
      return {
        success: false,
        message: 'Failed to update profile. Please try again.',
      };
    }

    // Revalidate the profile page to show updated data
    revalidatePath('/profile');

    return {
      success: true,
      message: 'Profile updated successfully',
      data: {
        name: validatedData.name,
      },
    };
  } catch (error) {
    console.error('Profile update error:', error);

    // Handle specific Better Auth errors
    if (error instanceof Error) {
      if (error.message.includes('unauthorized')) {
        return {
          success: false,
          message: 'You are not authorized to perform this action',
        };
      }

      if (error.message.includes('validation')) {
        return {
          success: false,
          message: 'Invalid data provided',
        };
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

// Rate limiting store for email verification resends
const resendAttempts = new Map<
  string,
  { count: number; lastAttempt: number }
>();
const RESEND_RATE_LIMIT = 3; // Max 3 attempts
const RESEND_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds

export async function resendVerificationEmail(): Promise<ActionResult> {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: 'You must be logged in to resend verification email',
      };
    }

    const userId = session.user.id;
    const now = Date.now();

    // Check rate limiting
    const userAttempts = resendAttempts.get(userId);
    if (userAttempts) {
      // Reset counter if window has passed
      if (now - userAttempts.lastAttempt > RESEND_WINDOW) {
        resendAttempts.set(userId, { count: 1, lastAttempt: now });
      } else if (userAttempts.count >= RESEND_RATE_LIMIT) {
        const remainingTime = Math.ceil(
          (RESEND_WINDOW - (now - userAttempts.lastAttempt)) / 60000
        );
        return {
          success: false,
          message: `Too many attempts. Please wait ${remainingTime} minutes before trying again.`,
        };
      } else {
        // Increment attempt count
        resendAttempts.set(userId, {
          count: userAttempts.count + 1,
          lastAttempt: now,
        });
      }
    } else {
      // First attempt for this user
      resendAttempts.set(userId, { count: 1, lastAttempt: now });
    }

    // Check if email is already verified
    if (session.user.emailVerified) {
      return {
        success: false,
        message: 'Your email is already verified',
      };
    }

    // Send verification email using Better Auth
    const result = await auth.api.sendVerificationEmail({
      headers: await headers(),
      body: {
        email: session.user.email,
        callbackURL: `${process.env.BETTER_AUTH_URL}/api/auth/verify-email`,
      },
    });

    if (!result) {
      return {
        success: false,
        message: 'Failed to send verification email. Please try again.',
      };
    }

    return {
      success: true,
      message: 'Verification email sent successfully. Please check your inbox.',
    };
  } catch (error) {
    console.error('Email verification resend error:', error);

    // Handle specific Better Auth errors
    if (error instanceof Error) {
      if (error.message.includes('unauthorized')) {
        return {
          success: false,
          message: 'You are not authorized to perform this action',
        };
      }

      if (error.message.includes('already verified')) {
        return {
          success: false,
          message: 'Your email is already verified',
        };
      }

      if (error.message.includes('rate limit')) {
        return {
          success: false,
          message: 'Too many requests. Please wait before trying again.',
        };
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}
