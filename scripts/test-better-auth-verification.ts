/**
 * Test script to verify Better Auth verification system with middleware
 */

async function testBetterAuthVerification() {
  console.log('🧪 Testing Better Auth verification system...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Checking if development server is running...');
    try {
      const healthResponse = await fetch(
        'http://localhost:3000/api/auth/session'
      );
      console.log(
        `   Server response: ${healthResponse.status} ${healthResponse.statusText}`
      );

      if (healthResponse.status === 404) {
        console.log(
          '   ⚠️ This might be normal - session endpoint might not exist without session'
        );
      }
    } catch (error) {
      console.log(
        '   ❌ Server not accessible. Please start with: npm run dev'
      );
      return;
    }

    // Test 2: Test Better Auth API endpoints
    console.log('\n2. Testing Better Auth API endpoints...');

    // Test signup endpoint
    const signupTestResponse = await fetch(
      'http://localhost:3000/api/auth/sign-up',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test-' + Date.now() + '@example.com',
          password: 'testpassword123',
        }),
      }
    );

    console.log(
      `   Signup endpoint: ${signupTestResponse.status} ${signupTestResponse.statusText}`
    );

    if (signupTestResponse.ok) {
      const signupResult = await signupTestResponse.json();
      console.log('   ✅ Signup endpoint working');
      console.log('   📧 Check server logs for verification email sending');
    } else {
      const errorResult = await signupTestResponse.json();
      console.log('   ❌ Signup failed:', errorResult);
    }

    // Test 3: Test sendVerificationEmail endpoint
    console.log('\n3. Testing sendVerificationEmail endpoint...');
    const verificationResponse = await fetch(
      'http://localhost:3000/api/auth/send-verification-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'jchademwiri@gmail.com', // Use the existing unverified user
        }),
      }
    );

    console.log(
      `   SendVerificationEmail: ${verificationResponse.status} ${verificationResponse.statusText}`
    );

    if (verificationResponse.ok) {
      console.log('   ✅ SendVerificationEmail endpoint working');
    } else {
      const errorResult = await verificationResponse.json();
      console.log('   Response:', errorResult);
    }

    // Test 4: Check middleware configuration
    console.log('\n4. Testing middleware...');
    const protectedResponse = await fetch('http://localhost:3000/dashboard');
    console.log(
      `   Protected route: ${protectedResponse.status} ${protectedResponse.statusText}`
    );

    if (protectedResponse.status === 302 || protectedResponse.status === 307) {
      console.log('   ✅ Middleware is redirecting unauthenticated users');
    } else {
      console.log('   ⚠️ Middleware might not be working as expected');
    }

    console.log('\n🎉 Test completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Try signing up with a new email address');
    console.log('   2. Check server logs for verification email sending');
    console.log('   3. Use the resend functionality if needed');
    console.log('   4. Check email inbox for verification link');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testBetterAuthVerification()
  .then(() => {
    console.log('\n✨ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed with error:', error);
    process.exit(1);
  });
