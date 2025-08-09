'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setShowEmailInput(true);
      return;
    }

    setIsResending(true);

    try {
      console.log('🔄 Resending verification email for:', email);

      // Call Better Auth to resend verification email
      const response = await fetch('/api/auth/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          callbackURL: '/verify-email',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Failed to resend verification email:', result);

        let errorMessage = 'Failed to resend verification email';
        if (response.status === 404) {
          errorMessage = 'No account found with this email address';
        } else if (response.status === 400) {
          errorMessage = 'Invalid email address';
        } else if (result.message) {
          errorMessage = result.message;
        }

        toast.error(errorMessage);
        return;
      }

      console.log('✅ Verification email resent successfully');
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
