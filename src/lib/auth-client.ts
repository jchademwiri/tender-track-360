import { createAuthClient } from 'better-auth/react';
import { organizationClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://tender-track-360.vercel.app/'
      : 'http://localhost:3000',

  plugins: [organizationClient()],
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
