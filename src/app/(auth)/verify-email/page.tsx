import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyEmailPage() {
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
              <Button variant="outline" className="w-full">
                Resend verification email
              </Button>
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
