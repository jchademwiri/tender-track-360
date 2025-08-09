import { db } from '../index';
import { userProfiles, userPreferences } from '../schema';
import { eq, and } from 'drizzle-orm';

/**
 * Utility functions for managing user profiles and preferences with Better Auth integration
 */

export interface CreateUserProfileData {
  userId: string; // Better Auth user.id
  organizationId: string; // Better Auth organization.id
  role?: 'admin' | 'tender_manager' | 'tender_specialist' | 'viewer';
  department?: string;
}

export interface CreateUserPreferencesData {
  userId: string; // Better Auth user.id
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  reminderDays?: number;
  timezone?: string;
  language?: string;
  dateFormat?: string;
  timeFormat?: string;
}

/**
 * Create a user profile for a Better Auth user
 */
export async function createUserProfile(data: CreateUserProfileData) {
  try {
    const [profile] = await db
      .insert(userProfiles)
      .values({
        userId: data.userId,
        organizationId: data.organizationId,
        role: data.role || 'viewer',
        department: data.department,
      })
      .returning();

    return profile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

/**
 * Create user preferences for a Better Auth user
 */
export async function createUserPreferences(data: CreateUserPreferencesData) {
  try {
    const [preferences] = await db
      .insert(userPreferences)
      .values({
        userId: data.userId,
        emailNotifications: data.emailNotifications ?? true,
        pushNotifications: data.pushNotifications ?? true,
        reminderDays: data.reminderDays ?? 7,
        timezone: data.timezone ?? 'UTC',
        language: data.language ?? 'en',
        dateFormat: data.dateFormat ?? 'MM/dd/yyyy',
        timeFormat: data.timeFormat ?? '12h',
      })
      .returning();

    return preferences;
  } catch (error) {
    console.error('Error creating user preferences:', error);
    throw error;
  }
}

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: string) {
  try {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));

    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Get user preferences by user ID
 */
export async function getUserPreferences(userId: string) {
  try {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    return preferences;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<CreateUserProfileData>
) {
  try {
    const [profile] = await db
      .update(userProfiles)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId))
      .returning();

    return profile;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: string,
  updates: Partial<CreateUserPreferencesData>
) {
  try {
    const [preferences] = await db
      .update(userPreferences)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.userId, userId))
      .returning();

    return preferences;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
}

/**
 * Get users by organization with their profiles
 */
export async function getUsersByOrganization(organizationId: string) {
  try {
    const profiles = await db
      .select()
      .from(userProfiles)
      .where(
        and(
          eq(userProfiles.organizationId, organizationId),
          eq(userProfiles.isActive, true),
          eq(userProfiles.isDeleted, false)
        )
      );

    return profiles;
  } catch (error) {
    console.error('Error fetching users by organization:', error);
    throw error;
  }
}

/**
 * Soft delete user profile
 */
export async function softDeleteUserProfile(
  userId: string,
  deletedById: string
) {
  try {
    const [profile] = await db
      .update(userProfiles)
      .set({
        isDeleted: true,
        deletedAt: new Date(),
        deletedById,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId))
      .returning();

    return profile;
  } catch (error) {
    console.error('Error soft deleting user profile:', error);
    throw error;
  }
}
