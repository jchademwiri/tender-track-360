import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://tender-track-360.vercel.app/'
      : 'http://localhost:3000',
});

export const signInWithGoogle = async () => {
  await authClient.signIn.social({
    provider: 'google',
    callbackURL: '/dashboard',
  });
};

export const signOut = async () => {
  await authClient.signOut();
};
