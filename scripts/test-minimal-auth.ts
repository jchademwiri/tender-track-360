/**
 * Test script for minimal Better Auth configuration
 */

import { authMinimal } from '../src/lib/auth-minimal';

async function testMinimalAuth() {
  console.log('🧪 Testing minimal Better Auth configuration...\n');

  try {
    // Test the sendVerificationEmail endpoint
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

    console.log('Testing minimal auth handler...');
    const response = await authMinimal.handler(testRequest);
    const result = await response.text();

    console.log('Response status:', response.status);
    console.log('Response body:', result);

    if (
      response.status === 400 &&
      result.includes('VERIFICATION_EMAIL_ISNT_ENABLED')
    ) {
      console.log('❌ Still getting verification email not enabled error');
    } else {
      console.log('✅ Different response - configuration might be working');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testMinimalAuth();
