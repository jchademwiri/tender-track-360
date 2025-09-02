'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { useState, useTransition, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface EmailSettingsProps {
  email: string;
  emailVerified: boolean;
  onResendVerification?: () => Promise<void>;
}

export function EmailSettings({
  email,
  emailVerified: initialEmailVerified,
  onResendVerification,
}: EmailSettingsProps) {
  const [isPending, startTransition] = useTransition();
  const [isResending, setIsResending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [emailVerified, setEmailVerified] = useState(initialEmailVerified);
  const [lastResendTime, setLastResendTime] = useState<number | null>(null);
  const router = useRouter();

  // Polling for verification status changes
  const checkVerificationStatus = useCallback(async () => {
    if (emailVerified) return; // Don't poll if already verified

    try {
      setIsRefreshing(true);
      // Refresh the page data to get updated verification status
      router.refresh();

      // Small delay to allow for server-side data refresh
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // The verification status will be updated through the parent component re-render
    } catch (error) {
      console.error('Error checking verification status:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [emailVerified, router]);

  // Auto-refresh verification status every 30 seconds if unverified and recently sent email
  useEffect(() => {
    if (emailVerified || !lastResendTime) return;

    const interval = setInterval(() => {
      const timeSinceResend = Date.now() - lastResendTime;
      // Stop polling after 10 minutes
      if (timeSinceResend > 10 * 60 * 1000) {
        return;
      }
      checkVerificationStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [emailVerified, lastResendTime, checkVerificationStatus]);

  // Update local state when prop changes
  useEffect(() => {
    if (initialEmailVerified !== emailVerified) {
      setEmailVerified(initialEmailVerified);
      if (initialEmailVerified) {
        toast.success('Email verified successfully!');
      }
    }
  }, [initialEmailVerified, emailVerified]);

  const handleResendVerification = () => {
    if (!onResendVerification) return;

    setIsResending(true);
    startTransition(async () => {
      try {
        await onResendVerification();
        setLastResendTime(Date.now());
        toast.success(
          'Verification email sent successfully! Check your inbox.'
        );
      } catch (error) {
        toast.error('Failed to send verification email. Please try again.');
      } finally {
        setIsResending(false);
      }
    });
  };

  const handleRefreshStatus = () => {
    checkVerificationStatus();
  };

  const getVerificationIcon = () => {
    if (emailVerified) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  const getVerificationBadge = () => {
    if (emailVerified) {
      return (
        <Badge
          variant="secondary"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge
        variant="destructive"
        className="bg-red-50 text-red-700 border-red-200"
      >
        <AlertCircle className="h-3 w-3 mr-1" />
        Unverified
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5" />
          <span>Email Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Email Address
            </label>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-3">
                {getVerificationIcon()}
                <span className="font-medium">{email}</span>
                {getVerificationBadge()}
              </div>
            </div>
          </div>

          {!emailVerified && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-amber-800">
                    Email Verification Required
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Please verify your email address to ensure you receive
                    important notifications and can recover your account if
                    needed.
                  </p>
                  <div className="mt-3 flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResendVerification}
                      disabled={
                        isPending || isResending || !onResendVerification
                      }
                      className="border-amber-300 text-amber-700 hover:bg-amber-100"
                    >
                      {isResending ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Resend Verification Email
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefreshStatus}
                      disabled={isRefreshing}
                      className="text-amber-700 hover:bg-amber-100"
                    >
                      {isRefreshing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Check Status
                        </>
                      )}
                    </Button>
                  </div>
                  {lastResendTime && (
                    <p className="text-xs text-amber-600 mt-2">
                      Verification email sent. If you don&apos;t see it, check
                      your spam folder. Status will refresh automatically.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {emailVerified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">
                    Email Verified
                  </h4>
                  <p className="text-sm text-green-700">
                    Your email address has been verified and is ready to receive
                    notifications.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
