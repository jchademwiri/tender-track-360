'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignupTest() {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpassword123',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const testDirectSignup = async () => {
    setIsLoading(true);
    console.log('🧪 Testing direct signup...');

    try {
      // Test 1: Direct API call to our test endpoint
      const testResponse = await fetch('/api/test-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const testData = await testResponse.json();

      setTestResults({
        testEndpoint: {
          status: testResponse.status,
          data: testData,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Direct signup test failed:', error);
      setTestResults({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testAuthClientSignup = async () => {
    setIsLoading(true);
    console.log('🧪 Testing auth client signup...');

    try {
      // Import auth client dynamically to avoid SSR issues
      const { authClient } = await import('@/lib/auth-client');

      console.log('📡 Auth client loaded, making signup request...');

      const { data, error } = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        callbackURL: '/verify-email',
      });

      setTestResults({
        authClient: {
          hasData: !!data,
          hasError: !!error,
          data: data,
          error: error,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Auth client signup test failed:', error);
      setTestResults({
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Signup Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <Label htmlFor="test-name">Name</Label>
          <Input
            id="test-name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="test-email">Email</Label>
          <Input
            id="test-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="test-password">Password</Label>
          <Input
            id="test-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={testDirectSignup} disabled={isLoading}>
            {isLoading ? 'Testing...' : 'Test Direct API'}
          </Button>
          <Button
            onClick={testAuthClientSignup}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Testing...' : 'Test Auth Client'}
          </Button>
        </div>

        {testResults && (
          <div className="mt-4">
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm max-h-96">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
