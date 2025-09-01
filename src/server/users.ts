'use server';
import { db } from '@/db';
import { member, user } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq, inArray, not } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect('/login');
  }
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });
  if (!currentUser) {
    redirect('/login');
  }
  return {
    ...session,
    currentUser,
  };
};

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return {
      success: true,
      message: 'User signed in successfully',
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || 'An unknown error occurred',
    };
  }
};

// https://youtu.be/gzYTDGToYcw?list=PLb3Vtl4F8GHTUJ_RmNINhE6GxB97otFzS&t=1916

export const signUp = async (name: string, email: string, password: string) => {
  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });
    return {
      success: true,
      message: 'User signed up successfully',
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || 'An unknown error occurred',
    };
  }
};

export const getAllUsers = async (organizationId: string) => {
  try {
    const members = await db.query.member.findMany({
      where: eq(member.organizationId, organizationId),
    });
    const users = await db.query.user.findMany({
      where: not(
        inArray(
          user.id,
          members.map((m) => m.userId)
        )
      ),
    });
    return users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
};
