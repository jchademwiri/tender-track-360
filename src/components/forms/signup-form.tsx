'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import Link from 'next/link';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('🚀 Starting signup process:', {
      name: formData.name,
      email: formData.email,
      passwordLength: formData.password.length,
      timestamp: new Date().toISOString(),
    });

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      console.warn('❌ Password validation failed: passwords do not match');
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      console.warn('❌ Password validation failed: too short');
      toast.error('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      console.log('📡 Making signup request to Better Auth...');

      const { data, error } = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        callbackURL: '/verify-email',
      });

      console.log('📨 Better Auth response:', {
        hasData: !!data,
        hasError: !!error,
        errorMessage: error?.message,
        errorCode: error?.code,
        errorStatus: error?.status,
        timestamp: new Date().toISOString(),
      });

      if (error) {
        console.error('❌ Better Auth signup error:', {
          message: error.message,
          code: error.code,
          status: error.status,
          details: error,
        });

        // Provide more specific error messages
        let errorMessage = 'Failed to create account';

        if (error.status === 403) {
          errorMessage = 'Access forbidden. Please check your configuration.';
        } else if (error.status === 400) {
          errorMessage = 'Invalid request. Please check your input.';
        } else if (error.status === 409) {
          errorMessage = 'An account with this email already exists.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
        return;
      }

      console.log('✅ Signup successful:', data);
      toast.success(
        'Account created successfully! Please check your email to verify your account.'
      );
      router.push('/verify-email');
    } catch (error) {
      console.error('❌ Unexpected signup error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error,
        details: error,
        timestamp: new Date().toISOString(),
      });

      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error(
          'Network error. Please check your connection and try again.'
        );
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">
                  Join Tender Track 360 to manage your tenders efficiently
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  minLength={8}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Tender Track 360</h2>
                <p className="text-muted-foreground mb-6">
                  Professional tender management system for organizations
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Multi-tenant organization support</p>
                  <p>✓ Role-based access control</p>
                  <p>✓ Document management</p>
                  <p>✓ Deadline tracking</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance">
        By creating an account, you agree to our{' '}
        <Link href="/terms" className="underline underline-offset-4">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
