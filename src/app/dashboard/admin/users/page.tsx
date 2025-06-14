import { db } from '@/db';
import { users } from '@/db/schema';

const roleDisplayMap: Record<string, string> = {
  admin: 'Admin',
  tender_manager: 'Manager',
  tender_specialist: 'Specialist',
  viewer: 'Viewer',
};

export default async function UsersPage() {
  const allUsers = await db.select().from(users);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <table className="min-w-full border border-gray-200 bg-white dark:bg-black">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Role</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td className="px-4 py-2 border-b">{user.fullName}</td>
              <td className="px-4 py-2 border-b">{user.email}</td>
              <td className="px-4 py-2 border-b">
                {roleDisplayMap[user.role] || user.role}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
