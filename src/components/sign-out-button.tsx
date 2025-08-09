'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      console.log('🚪 Signing out user...');

      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            console.log('✅ Sign out successful');
            toast.success('Signed out successfully!');

            // Redirect to home page after successful sign out
            router.push('/');
          },
          onError: (error) => {
            console.error('❌ Sign out failed:', error);
            toast.error('Failed to sign out. Please try again.');
            setIsSigningOut(false);
          },
        },
      });
    } catch (error) {
      console.error('❌ Unexpected sign out error:', error);
      toast.error('An unexpected error occurred. Please try again.');
      setIsSigningOut(false);
    }
  };

  return (
    <Button onClick={handleSignOut} disabled={isSigningOut} variant="outline">
      {isSigningOut ? 'Signing out...' : 'Sign Out'}
    </Button>
  );
}
