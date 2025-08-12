'use server';
import { auth } from '@/lib/auth';

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

export const signUp = async () => {
  await auth.api.signUpEmail({
    body: {
      name: 'Jacob Chademwiri',
      email: 'jchademwiri@gmail.com',
      password: 'password123',
    },
  });
};
