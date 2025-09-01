'use client';
import { Button } from '@/components/ui/button';
import { removeMember } from '@/server';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function MembersTableAction({ memberId }: { memberId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    try {
      setIsLoading(true);
      const { success, error } = await removeMember(memberId);

      if (!success) {
        toast.error(error || 'Failed to remove member');
        return;
      }

      toast.success('Member removed successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to remove member from organization');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={'destructive'}
      onClick={handleRemove}
      className="text-sm cursor-pointer"
    >
      {isLoading ? <Loader className="size-4 animate-spin" /> : 'Remove'}
    </Button>
  );
}

// https://youtu.be/QN2ljJ5MjV4?list=PLb3Vtl4F8GHTUJ_RmNINhE6GxB97otFzS&t=1992
