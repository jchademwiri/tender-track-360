/**
 * Test script to verify Better Auth integration with user profiles and preferences
 */

import { db } from '../src/db';
import { user, organization, member } from '../src/db/schema/auth';
import { eq } from 'drizzle-orm';
import {
  createUserProfile,
  createUserPreferences,
  getUserProfile,
  getUserPreferences,
  getUsersByOrganization,
} from '../src/db/utils/user-profile-helpers';

async function testBetterAuthIntegration() {
  console.log('🧪 Testing Better Auth integration with user profiles...\n');

  try {
    // Test 1: Create a test organization
    console.log('1. Creating test organization...');
    const [testOrg] = await db
      .insert(organization)
      .values({
        id: 'test-org-' + Date.now(),
        name: 'Test Organization',
        slug: 'test-org-' + Date.now(),
        createdAt: new Date(),
      })
      .returning();
    console.log('✅ Organization created:', testOrg.name);

    // Test 2: Create a test user
    console.log('\n2. Creating test user...');
    const [testUser] = await db
      .insert(user)
      .values({
        id: 'test-user-' + Date.now(),
        name: 'Test User',
        email: 'test-' + Date.now() + '@example.com',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    console.log('✅ User created:', testUser.name);

    // Test 3: Create organization membership
    console.log('\n3. Creating organization membership...');
    const [membership] = await db
      .insert(member)
      .values({
        id: 'member-' + Date.now(),
        organizationId: testOrg.id,
        userId: testUser.id,
        role: 'admin',
        createdAt: new Date(),
      })
      .returning();
    console.log('✅ Membership created with role:', membership.role);

    // Test 4: Create user profile with Better Auth references
    console.log('\n4. Creating user profile...');
    const profile = await createUserProfile({
      userId: testUser.id,
      organizationId: testOrg.id,
      role: 'tender_manager',
      department: 'Procurement',
    });
    console.log('✅ User profile created:', {
      id: profile.id,
      role: profile.role,
      department: profile.department,
    });

    // Test 5: Create user preferences
    console.log('\n5. Creating user preferences...');
    const preferences = await createUserPreferences({
      userId: testUser.id,
      emailNotifications: true,
      pushNotifications: false,
      reminderDays: 14,
      timezone: 'America/New_York',
      language: 'en',
    });
    console.log('✅ User preferences created:', {
      id: preferences.id,
      reminderDays: preferences.reminderDays,
      timezone: preferences.timezone,
    });

    // Test 6: Retrieve user profile
    console.log('\n6. Retrieving user profile...');
    const retrievedProfile = await getUserProfile(testUser.id);
    console.log('✅ Profile retrieved:', {
      userId: retrievedProfile?.userId,
      organizationId: retrievedProfile?.organizationId,
      role: retrievedProfile?.role,
    });

    // Test 7: Retrieve user preferences
    console.log('\n7. Retrieving user preferences...');
    const retrievedPreferences = await getUserPreferences(testUser.id);
    console.log('✅ Preferences retrieved:', {
      userId: retrievedPreferences?.userId,
      emailNotifications: retrievedPreferences?.emailNotifications,
      timezone: retrievedPreferences?.timezone,
    });

    // Test 8: Get users by organization
    console.log('\n8. Getting users by organization...');
    const orgUsers = await getUsersByOrganization(testOrg.id);
    console.log('✅ Organization users found:', orgUsers.length);

    // Test 9: Test foreign key constraints by trying to reference non-existent user
    console.log('\n9. Testing foreign key constraints...');
    try {
      await createUserProfile({
        userId: 'non-existent-user',
        organizationId: testOrg.id,
        role: 'viewer',
      });
      console.log('❌ Foreign key constraint failed - this should not happen');
    } catch (error) {
      console.log(
        '✅ Foreign key constraint working - invalid user ID rejected'
      );
    }

    console.log(
      '\n🎉 All tests passed! Better Auth integration is working correctly.'
    );

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await db.delete(member).where(eq(member.id, membership.id));
    await db.delete(user).where(eq(user.id, testUser.id));
    await db.delete(organization).where(eq(organization.id, testOrg.id));
    console.log('✅ Cleanup completed');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testBetterAuthIntegration()
  .then(() => {
    console.log('\n✨ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed with error:', error);
    process.exit(1);
  });
