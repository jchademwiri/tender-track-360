/**
 * Test script to check what Better Auth endpoints are available
 */

import { auth } from '../src/lib/auth';

async function testAuthEndpoints() {
  console.log('🧪 Testing Better Auth endpoints...\n');

  const endpoints = [
    'sign-up/email',
    'sign-in/email',
    'sign-out',
    'session',
    'verify-email',
    'send-verification-email',
    'reset-password',
    'update-password',
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing endpoint: /api/auth/${endpoint}`);

      const testRequest = new Request(
        `http://localhost:3000/api/auth/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'testpassword123',
            name: 'Test User',
          }),
        }
      );

      const response = await auth.handler(testRequest);
      const result = await response.text();

      console.log(`  Status: ${response.status}`);
      console.log(
        `  Response: ${result.substring(0, 100)}${result.length > 100 ? '...' : ''}`
      );
      console.log('');
    } catch (error) {
      console.log(`  Error: ${error instanceof Error ? error.message : error}`);
      console.log('');
    }
  }
}

testAuthEndpoints();
