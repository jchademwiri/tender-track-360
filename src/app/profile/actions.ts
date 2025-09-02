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
