'use client';
import { User } from '@/db/schema';
import { Button } from '@/components/ui/button';

interface AllUsersProps {
  users: User[];
}

export function AllUsers({ users }: AllUsersProps) {
  console.log(users);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <div>
        {users.map((user) => (
          <div key={user.id} className="flex justify-between">
            <span>
              {user.name} - {user.email}
            </span>
            <Button className="cursor-pointer">Add to organization</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
