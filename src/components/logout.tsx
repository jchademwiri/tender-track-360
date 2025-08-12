'use client';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <Button size={'lg'} onClick={handleLogout} className="cursor-pointer">
      Logout <LogOut className="size-4" />
    </Button>
  );
}
