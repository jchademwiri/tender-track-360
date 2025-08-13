import { betterAuth, email } from 'better-auth';
// import { organization } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { db } from '@/db';
import { Resend } from 'resend';
import ResetPasswordEmail from '@/emails/reset-password-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        const { data, error } = await resend.emails.send({
          from: 'Tender Track <reset-password@updates.jacobc.co.za>',
          to: user.email,
          subject: 'Reset your password',
          react: ResetPasswordEmail({
            username: user.name,
            resetUrl: url,
            userEmail: user.email,
          }),
        });

        if (error) {
          console.error('Error sending reset password email:', error);
          throw error;
        }

        console.log(
          `Reset password email sent successfully to ${user.email} with token ${url}`
        );
        console.log('Email data:', data);
      } catch (error) {
        console.error('Failed to send reset password email:', error);
        throw error;
      }
    },
    // onPasswordReset: async ({ email }) => {
    //   console.log(`Password for user ${email} has been reset.`);
    // },
  },

  plugins: [nextCookies()],
});
