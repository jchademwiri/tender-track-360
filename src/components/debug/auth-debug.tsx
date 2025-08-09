'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';

export function AuthDebug() {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: {},
    };

    try {
      // Test 1: Check environment variables
      console.log('🧪 Test 1: Environment Variables');
      results.tests.environment = {
        NEXT_PUBLIC_BETTER_AUTH_URL:
          process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'NOT SET',
        NODE_ENV: process.env.NODE_ENV || 'NOT SET',
        baseURL: 'http://localhost:3000',
      };

      // Test 2: Test email configuration
      console.log('🧪 Test 2: Email Configuration');
      try {
        const emailResponse = await fetch('/api/email-status');
        const emailData = await emailResponse.json();
        results.tests.emailConfig = {
          status: emailResponse.status,
          data: emailData,
        };
      } catch (error) {
        results.tests.emailConfig = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }

      // Test 3: Test auth configuration endpoint
      console.log('🧪 Test 3: Auth Configuration');
      try {
        const configResponse = await fetch('/api/test-auth');
        const configData = await configResponse.json();
        results.tests.authConfig = {
          status: configResponse.status,
          data: configData,
        };
      } catch (error) {
        results.tests.authConfig = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }

      // Test 4: Test auth client initialization
      console.log('🧪 Test 4: Auth Client');
      results.tests.authClient = {
        initialized: !!authClient,
        hasSignUp: !!authClient.signUp,
        hasSignIn: !!authClient.signIn,
      };

      // Test 5: Test basic auth endpoint connectivity
      console.log('🧪 Test 5: Auth Endpoint Connectivity');
      try {
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        results.tests.connectivity = {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        };
      } catch (error) {
        results.tests.connectivity = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }

      // Test 6: Test signup endpoint specifically
      console.log('🧪 Test 6: Signup Endpoint Test');
      try {
        const response = await fetch('/api/auth/sign-up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'testpassword123',
            name: 'Test User',
          }),
        });

        const responseText = await response.text();
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch {
          responseData = responseText;
        }

        results.tests.signupEndpoint = {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: responseData,
        };
      } catch (error) {
        results.tests.signupEndpoint = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }

      setTestResults(results);
    } catch (error) {
      console.error('❌ Debug test failed:', error);
      setTestResults({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Auth Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTests} disabled={isLoading}>
          {isLoading ? 'Running Tests...' : 'Run Debug Tests'}
        </Button>

        {testResults && (
          <div className="mt-4">
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
