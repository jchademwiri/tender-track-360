'use server';

import { db } from '@/db';
import { member } from '../../docs/schema/auth';
import { auth } from '@/lib/auth';
import { Role } from '@/db/schema';

export const addMember = async (
  organizationId: string,
  userId: string,
  role: Role
) => {
  try {
    await auth.api.addMember({
      body: {
        userId,
        organizationId,
        role,
      },
    });
    return {
      success: true,
      message: 'Member added successfully',
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || 'An unknown error occurred',
    };
  }
};
