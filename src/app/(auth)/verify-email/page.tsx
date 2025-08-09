'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { resendVerificationEmail } from './actions';

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
