'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AcceptInvitationClient({
  invitationId,
  inviteEmail,
}: {
  invitationId: string;
  inviteEmail?: string | null;
}) {
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptNow = () => {
    // Navigate to the existing accept app-route which will attempt server-side accept
    // If user is unauthenticated the route will redirect to the public invite page.
    window.location.href = `/api/accept-invitation/${invitationId}`;
  };

  const currentPath = `/invite/accept/${invitationId}`;
  const loginHref = `/login?next=${encodeURIComponent(currentPath)}`;
  const signupHref = `/sign-up?next=${encodeURIComponent(currentPath)}`;

  return (
    <div className="space-y-4 rounded-md border p-6">
      <p>
        Invitation was sent to: <strong>{inviteEmail || 'your email'}</strong>
      </p>
      <div className="flex gap-3">
        <button
          onClick={acceptNow}
          className="rounded bg-primary px-4 py-2 text-white"
        >
          Accept (if already signed in)
        </button>
        <Link href={loginHref} className="rounded border px-4 py-2">
          Sign in to accept
        </Link>
        <button
          onClick={() => setShowSignUp((s) => !s)}
          className="rounded border px-4 py-2"
        >
          Create account and accept
        </button>
      </div>
      {showSignUp && (
        <div className="mt-4 rounded-md border p-4">
          <p className="mb-2 text-sm">
            Create an account for <strong>{inviteEmail}</strong> and accept the
            invitation.
          </p>
          <div className="grid gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="border p-2"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="border p-2"
            />
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  setIsSubmitting(true);
                  setError(null);
                  try {
                    const resp = await fetch('/api/invite/complete-signup', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        invitationId,
                        name,
                        email: inviteEmail,
                        password,
                      }),
                    });
                    const data = await resp.json();
                    if (data?.success) {
                      toast.success('Account created and invitation accepted!');
                      window.location.href = data.redirectUrl || '/dashboard';
                    } else {
                      setError(data?.message || 'Failed to create account');
                      toast.error(data?.message || 'Failed to create account');
                    }
                  } catch (e) {
                    setError('Network error');
                    toast.error('Network error occurred');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="rounded bg-primary px-4 py-2 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create & Accept'}
              </button>
              <button
                onClick={() => setShowSignUp(false)}
                className="rounded border px-4 py-2"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        If you don’t have an account yet, create one and you will be returned to
        this page to complete accepting the invitation.
      </p>
    </div>
  );
}
