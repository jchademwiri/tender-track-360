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
    <Button size={'lg'} onClick={handleLogout} className="cursor-pointer">
      Logout <LogOut className="size-4" />
    </Button>
  );
}
