'use client';
import { signOut } from '@/lib/auth-client';
import { Button } from './button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <Button
      variant={'link'}
      onClick={handleLogout}
      className="cursor-pointer hover:no-underline"
    >
      <LogOut className="size-4" />
      Log out
    </Button>
  );
}
