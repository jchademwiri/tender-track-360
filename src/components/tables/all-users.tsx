'use client';
import { user, User } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { addMember } from '@/server';
import { useState } from 'react';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

interface AllUsersProps {
  users: User[];
  organizationId?: string;
}

export function AllUsers({ users, organizationId }: AllUsersProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInviteMember = async (user: User) => {
    if (!organizationId || !user.id) return;

    try {
      setIsLoading(true);
      const { error } = await authClient.organization.inviteMember({
        email: user.email,
        role: 'member',
        organizationId,
        resend: true,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('User invited to organization');
      router.refresh();
    } catch (error) {
      toast.error('Failed to invite user to organization');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <div>
        {users.map((user) => (
          <div key={user.id} className="flex justify-between py-2">
            <span>
              {user.name} - {user.email}
            </span>
            <Button
              className="cursor-pointer"
              onClick={() => handleInviteMember(user)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                `Invite ${user.name} to organization`
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
