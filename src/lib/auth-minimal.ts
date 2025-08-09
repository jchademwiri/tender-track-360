// Minimal Better Auth configuration to test email verification
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import * as schema from '@/db/schema';

export const authMinimal = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log(
        '📧 MINIMAL AUTH: Sending verification email to:',
        user.email
      );
      console.log('📧 MINIMAL AUTH: Verification URL:', url);

      // For now, just log the email instead of actually sending it
      console.log('✅ MINIMAL AUTH: Email would be sent (logging only)');

      // Don't actually send email for this test
      return;
    },
  },
});
