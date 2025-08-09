/**
 * Test script to check Better Auth configuration
 */

import { auth } from '../src/lib/auth';

async function testBetterAuthConfig() {
  console.log('🧪 Testing Better Auth configuration...\n');

  try {
    // Test 1: Check if auth object is properly initialized
    console.log('1. Checking Better Auth initialization...');
    console.log('   Auth object exists:', !!auth);
    console.log('   Auth handler exists:', !!auth.handler);
    console.log('   Auth API exists:', !!auth.api);

    // Test 2: Check configuration
    console.log('\n2. Checking Better Auth configuration...');

    // Try to access the configuration (this might not be directly accessible)
    try {
      console.log('   Attempting to check internal configuration...');

      // Create a test request to see what endpoints are available
      const testRequest = new Request(
        'http://localhost:3000/api/auth/send-verification-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
          }),
        }
      );

      console.log('   Test request created successfully');

      // Try to call the handler directly
      const response = await auth.handler(testRequest);
      const result = await response.text();

      console.log('   Handler response status:', response.status);
      console.log('   Handler response:', result);
    } catch (error) {
      console.log(
        '   Handler test error:',
        error instanceof Error ? error.message : error
      );
    }

    // Test 3: Check environment variables
    console.log('\n3. Checking environment variables...');
    const envCheck = {
      BETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: !!process.env.BETTER_AUTH_URL,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      DATABASE_URL: !!process.env.DATABASE_URL,
    };
    console.log('   Environment variables:', envCheck);

    console.log('\n🎉 Configuration test completed!');
  } catch (error) {
    console.error('❌ Configuration test failed:', error);
    process.exit(1);
  }
}

// Run the test
testBetterAuthConfig()
  .then(() => {
    console.log('\n✨ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed with error:', error);
    process.exit(1);
  });
