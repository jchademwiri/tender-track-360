'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import Logout from '../ui/logout';

export default function AuthAwareNav() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex items-center gap-3">
        <Button variant="ghost" asChild size="sm" >
          <Link href="/login">Sign In</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/sign-up">Get Started</Link>
        </Button>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            Dashboard
          </Button>
        </Link>
        <Logout />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" asChild size="sm">
        <Link href="/login">Sign In</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/sign-up">Get Started</Link>
      </Button>
    </div>
  );
}
