'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { authClient, useSession } from '@/lib/auth-client';
import { toast } from 'sonner';
import { resendVerificationEmail } from './actions';

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Handle email verification from URL params
  useEffect(() => {
    const token = searchParams.get('token');
    const callbackUrl = searchParams.get('callbackUrl');

    if (token) {
      handleEmailVerification(token, callbackUrl);
    }
  }, [searchParams]);

  // Check if user is already verified and redirect
  useEffect(() => {
    if (session?.user?.emailVerified && !isVerifying) {
      console.log('✅ User already verified, redirecting to onboarding');
      toast.success(
        'Email verified successfully! Setting up your organization...'
      );
      router.push('/onboarding');
    }
  }, [session, router, isVerifying]);

  const handleEmailVerification = async (
    token: string,
    callbackUrl: string | null
  ) => {
    setIsVerifying(true);

    try {
      console.log(
        '🔐 Verifying email with token:',
        token.substring(0, 8) + '...'
      );

      const { data, error } = await authClient.verifyEmail({
        query: { token },
      });

      if (error) {
        console.error('❌ Email verification failed:', error);
        toast.error(
          'Invalid or expired verification link. Please request a new one.'
        );
        return;
      }

      console.log('✅ Email verification successful:', data);
      toast.success(
        'Email verified successfully! Setting up your organization...'
      );

      // Small delay to show success message before redirect
      setTimeout(() => {
        router.push(callbackUrl || '/onboarding');
      }, 1500);
    } catch (error) {
      console.error('❌ Unexpected verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setShowEmailInput(true);
      return;
    }

    setIsResending(true);

    try {
      console.log('🔄 Resending verification email for:', email);

      // Use server action for resending verification email
      const result = await resendVerificationEmail(email.trim());

      if (!result.success) {
        console.error('❌ Failed to resend verification email:', result.error);
        toast.error(result.error || 'Failed to send verification email');
        return;
      }

      console.log('✅ Verification email sent successfully');
      toast.success('Verification email sent! Please check your inbox.');
      setShowEmailInput(false);
      setEmail('');
    } catch (error) {
      console.error('❌ Unexpected error resending verification email:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Show loading state while checking session
  if (isPending) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Loading...</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Checking verification status...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show verification in progress
  if (isVerifying) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Verifying email...</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Please wait while we verify your email address.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Check your email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                We&apos;ve sent a verification link to your email address.
              </p>
              <p className="text-sm text-muted-foreground">
                Please check your email and click the verification link to
                activate your account.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or:
              </p>

              {showEmailInput && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isResending}
                  />
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendVerification}
                disabled={isResending}
              >
                {isResending ? 'Sending...' : 'Resend verification email'}
              </Button>

              {showEmailInput && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setShowEmailInput(false);
                    setEmail('');
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm underline underline-offset-4"
              >
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
