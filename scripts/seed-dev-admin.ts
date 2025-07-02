import { db } from '@/db';
import { users } from '@/db/schema/users';
import { userRoleEnum } from '@/db/schema/enums';

const SEED_USERS = [
  {
    email: 'hello@jacobc.co.za',
    fullName: 'Dev Admin',
    role: userRoleEnum.enumValues[0],
    isActive: true,
  },
  {
    email: 'manager@tendertrack.com',
    fullName: 'Dev Manager',
    role: userRoleEnum.enumValues[1],
    isActive: true,
  },
  {
    email: 'specialist@tendertrack.com',
    fullName: 'Dev Specialist',
    role: userRoleEnum.enumValues[2],
    isActive: true,
  },
  {
    email: 'viewer@tendertrack.com',
    fullName: 'Dev Viewer',
    role: userRoleEnum.enumValues[3],
    isActive: true,
  },
];

async function seedDevUsers() {
  for (const user of SEED_USERS) {
    await db
      .insert(users)
      .values(user)
      .onConflictDoUpdate({
        target: users.email,
        set: { role: user.role, isActive: true },
      });
    console.log(`Seeded user: ${user.email} (${user.role})`);
  }
  console.log('All dev users seeded!');
}

seedDevUsers().catch(console.error);
