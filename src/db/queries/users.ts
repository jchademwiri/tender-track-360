import { db } from '@/db';
import { users } from '@/db/schema';
import { userRoleEnum } from '../schema/enums';

export async function getUsers() {
  const allUsers = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      lastLogin: users.lastLogin,
      isActive: users.isActive,
    })
    .from(users);

  const stats = {
    total: allUsers.length,
    admins: allUsers.filter((u) => u.role === userRoleEnum.enumValues[0])
      .length,
    managers: allUsers.filter((u) => u.role === userRoleEnum.enumValues[1])
      .length,
    specialists: allUsers.filter((u) => u.role === userRoleEnum.enumValues[2])
      .length,
    viewers: allUsers.filter((u) => u.role === userRoleEnum.enumValues[3])
      .length,
  };

  return { allUsers, stats };
}
