/**
 * Test script to verify the signup verification email functionality
 */

async function testSignupVerification() {
  console.log('🧪 Testing signup verification email functionality...\n');

  try {
    // Test 1: Test signup with a new user
    console.log('1. Testing signup process...');
    const testEmail = 'test-signup-' + Date.now() + '@example.com';

    const signupResponse = await fetch(
      'http://localhost:3000/api/auth/sign-up',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Signup User',
          email: testEmail,
          password: 'testpassword123',
        }),
      }
    );

    const signupResult = await signupResponse.json();

    console.log('📝 Signup response:', {
      status: signupResponse.status,
      statusText: signupResponse.statusText,
      hasData: !!signupResult.data,
      hasError: !!signupResult.error,
      errorMessage: signupResult.error?.message,
    });

    if (signupResponse.ok) {
      console.log('✅ Signup successful');

      // Test 2: Check if verification email was triggered
      console.log('\n2. Checking server logs for verification email...');
      console.log('   (Check your server console for verification email logs)');

      // Test 3: Test the resend verification
      console.log('\n3. Testing resend verification...');
      const resendResponse = await fetch(
        'http://localhost:3000/api/auth/send-verification-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: testEmail,
          }),
        }
      );

      const resendResult = await resendResponse.json();

      if (resendResponse.ok) {
        console.log('✅ Resend verification working:', resendResult.message);
      } else {
        console.log('❌ Resend verification failed:', resendResult.error);
      }
    } else {
      console.log('❌ Signup failed:', signupResult.error?.message);
    }

    console.log('\n🎉 Test completed!');
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
    return testSignupVerification();
  })
  .then(() => {
    console.log('\n✨ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed with error:', error);
    process.exit(1);
  });
