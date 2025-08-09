'use server';

import { db } from '@/db';
import { userProfiles } from '@/db/schema/user-profiles';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function completeOnboarding(
  organizationId: string,
  userRole:
    | 'admin'
    | 'tender_manager'
    | 'tender_specialist'
    | 'viewer' = 'admin'
) {
  try {
    console.log('🎯 Completing onboarding for organization:', organizationId);

    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: 'User not authenticated',
      };
    }

    console.log('👤 Creating user profile for:', {
      userId: session.user.id,
      organizationId,
      role: userRole,
    });

    // Create user profile
    const [userProfile] = await db
      .insert(userProfiles)
      .values({
        userId: session.user.id,
        organizationId,
        role: userRole,
        onboardingCompleted: true,
        isActive: true,
      })
      .returning();

    console.log('✅ User profile created successfully:', userProfile);

    return {
      success: true,
      userProfile,
    };
  } catch (error) {
    console.error('❌ Failed to complete onboarding:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to complete onboarding',
    };
  }
}
