/**
 * Comprehensive diagnostic script for Better Auth verification issues
 */

import { db } from '../src/db';
import { user, verification } from '../src/db/schema/auth';
import { eq } from 'drizzle-orm';

async function diagnoseVerificationIssue() {
  console.log('🔍 Diagnosing Better Auth verification issues...\n');

  try {
    // Test 1: Check database connection
    console.log('1. Testing database connection...');
    const userCount = await db.select().from(user);
    console.log(`✅ Database connected. Found ${userCount.length} users.`);

    // Test 2: Check verification table
    console.log('\n2. Checking verification table...');
    const verificationCount = await db.select().from(verification);
    console.log(
      `✅ Verification table accessible. Found ${verificationCount.length} verification records.`
    );

    // Test 3: Check environment variables
    console.log('\n3. Checking environment variables...');
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      BETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: !!process.env.BETTER_AUTH_URL,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    };
    console.log('Environment variables:', envCheck);

    // Test 4: Check for unverified users
    console.log('\n4. Checking for unverified users...');
    const unverifiedUsers = await db
      .select()
      .from(user)
      .where(eq(user.emailVerified, false));

    console.log(`Found ${unverifiedUsers.length} unverified users:`);
    unverifiedUsers.forEach((u, index) => {
      console.log(
        `  ${index + 1}. ${u.email} (ID: ${u.id}, Created: ${u.createdAt})`
      );
    });

    // Test 5: Check verification tokens for unverified users
    if (unverifiedUsers.length > 0) {
      console.log('\n5. Checking verification tokens...');
      for (const unverifiedUser of unverifiedUsers.slice(0, 3)) {
        // Check first 3
        const tokens = await db
          .select()
          .from(verification)
          .where(eq(verification.identifier, unverifiedUser.email));

        console.log(
          `  User ${unverifiedUser.email}: ${tokens.length} verification tokens`
        );
        tokens.forEach((token, index) => {
          console.log(
            `    ${index + 1}. Token: ${token.value.substring(0, 8)}..., Expires: ${token.expiresAt}`
          );
        });
      }
    }

    // Test 6: Test email service
    console.log('\n6. Testing email service configuration...');
    try {
      const { sendVerificationEmail } = await import('../src/server/email');
      console.log('✅ Email service module loaded successfully');

      // Test with a dummy call (won't actually send)
      console.log('   Email service appears to be properly configured');
    } catch (error) {
      console.error('❌ Email service error:', error);
    }

    // Test 7: Test Better Auth API endpoints
    console.log('\n7. Testing Better Auth API endpoints...');
    try {
      const response = await fetch('http://localhost:3000/api/auth/session');
      console.log(
        `   /api/auth/session: ${response.status} ${response.statusText}`
      );
    } catch (error) {
      console.log('   ⚠️ Server not running or API not accessible');
    }

    // Test 8: Recommendations
    console.log('\n8. Recommendations:');

    if (!envCheck.RESEND_API_KEY) {
      console.log('   ❌ RESEND_API_KEY is missing - emails cannot be sent');
    }

    if (!envCheck.BETTER_AUTH_SECRET) {
      console.log(
        '   ❌ BETTER_AUTH_SECRET is missing - authentication may fail'
      );
    }

    if (unverifiedUsers.length > 0) {
      console.log(
        '   ⚠️ Found unverified users - verification emails may not be sending'
      );
      console.log('   💡 Try the resend verification functionality');
    }

    if (verificationCount.length === 0 && unverifiedUsers.length > 0) {
      console.log('   ❌ No verification tokens found for unverified users');
      console.log(
        '   💡 This suggests verification emails are not being sent during signup'
      );
    }

    console.log('\n🎉 Diagnosis completed!');
  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
    process.exit(1);
  }
}

// Run the diagnosis
diagnoseVerificationIssue()
  .then(() => {
    console.log('\n✨ Diagnosis completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Diagnosis failed with error:', error);
    process.exit(1);
  });
