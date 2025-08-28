'use client';
import { User } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { addMember } from '@/server';
import { useState } from 'react';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AllUsersProps {
  users: User[];
  organizationId?: string;
}

export function AllUsers({ users, organizationId }: AllUsersProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddMember = async (userId: string) => {
    if (!organizationId || !userId) return;

    try {
      setIsLoading(true);
      await addMember(organizationId, userId, 'member');
      setIsLoading(false);
      toast.success('User added to organization');
      router.refresh();
    } catch (error) {
      toast.error('Failed to add user to organization');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <div>
        {users.map((user) => (
          <div key={user.id} className="flex justify-between">
            <span>
              {user.name} - {user.email}
            </span>
            <Button
              className="cursor-pointer"
              onClick={() => handleAddMember(user.id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                'Add to organization'
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
