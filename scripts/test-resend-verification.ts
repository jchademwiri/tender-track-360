/**
 * Test script to verify the resend verification email functionality
 */

import { db } from '../src/db';
import { user } from '../src/db/schema/auth';
import { eq } from 'drizzle-orm';

async function testResendVerification() {
  console.log('🧪 Testing resend verification email functionality...\n');

  try {
    // Test 1: Create a test user (unverified)
    console.log('1. Creating test unverified user...');
    const [testUser] = await db
      .insert(user)
      .values({
        id: 'test-unverified-' + Date.now(),
        name: 'Test Unverified User',
        email: 'test-unverified-' + Date.now() + '@example.com',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    console.log('✅ Unverified user created:', testUser.email);

    // Test 2: Test the resend verification API
    console.log('\n2. Testing resend verification API...');
    const response = await fetch(
      'http://localhost:3000/api/auth/send-verification-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
        }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Resend verification API working:', result.message);
    } else {
      console.log('❌ Resend verification API failed:', result.error);
    }

    // Test 3: Test with non-existent email
    console.log('\n3. Testing with non-existent email...');
    const nonExistentResponse = await fetch(
      'http://localhost:3000/api/auth/send-verification-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
        }),
      }
    );

    const nonExistentResult = await nonExistentResponse.json();

    if (nonExistentResponse.status === 404) {
      console.log(
        '✅ Non-existent email properly handled:',
        nonExistentResult.error
      );
    } else {
      console.log('❌ Non-existent email not handled correctly');
    }

    // Test 4: Test with already verified user
    console.log('\n4. Creating verified user and testing...');
    const [verifiedUser] = await db
      .insert(user)
      .values({
        id: 'test-verified-' + Date.now(),
        name: 'Test Verified User',
        email: 'test-verified-' + Date.now() + '@example.com',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    const verifiedResponse = await fetch(
      'http://localhost:3000/api/auth/send-verification-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: verifiedUser.email,
        }),
      }
    );

    const verifiedResult = await verifiedResponse.json();

    if (
      verifiedResponse.ok &&
      verifiedResult.message.includes('already verified')
    ) {
      console.log(
        '✅ Already verified user properly handled:',
        verifiedResult.message
      );
    } else {
      console.log('❌ Already verified user not handled correctly');
    }

    console.log('\n🎉 All tests completed!');

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await db.delete(user).where(eq(user.id, testUser.id));
    await db.delete(user).where(eq(user.id, verifiedUser.id));
    console.log('✅ Cleanup completed');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Only run if server is running
async function checkServerRunning() {
  try {
    const response = await fetch('http://localhost:3000/api/test-db');
    return response.ok;
  } catch {
    return false;
  }
}

// Run the test
checkServerRunning()
  .then((isRunning) => {
    if (!isRunning) {
      console.log(
        '⚠️ Server is not running. Please start the development server first:'
      );
      console.log('   npm run dev');
      process.exit(1);
    }
    return testResendVerification();
  })
  .then(() => {
    console.log('\n✨ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed with error:', error);
    process.exit(1);
  });
