import { betterAuth } from 'better-auth';
import { organization } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { db } from '@/db';
import { schema } from '@/db/schema';
import { ac, admin, member, owner } from '@/lib/auth/permissions';
import { Resend } from 'resend';
import ResetPasswordEmail from '@/emails/reset-password-email';
import VerifyEmail from '@/emails/verify-email';
import { getActiveOrganization } from '@/server';
import OrganizationInvitation from '@/emails/organization-invitation';

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const organization = await getActiveOrganization(session.userId);
          return {
            data: {
              ...session,
              activeOrganizationId: organization?.id,
            },
          };
        },
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
        to: user.email,
        subject: 'Verify your email address',
        react: VerifyEmail({
          username: user.name,
          verificationUrl: url,
        }),
      });
    },
    sendOnSignUp: true,
    expiresIn: 3600, // 1 hour
    autoSignInAfterVerification: true,
  },

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        const { data, error } = await resend.emails.send({
          from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
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
    requireEmailVerification: true,
  },

  plugins: [
    organization({
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.NEXT_PUBLIC_URL}/api/accept-invitation/${data.id}`;
        await resend.emails.send({
          from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
          to: data.email,
          subject: `You're invited to join ${data.organization.name}`,
          react: OrganizationInvitation({
            email: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink,
          }),
        });
      },
      ac,
      roles: {
        owner,
        admin,
        member,
      },
    }),
    nextCookies(),
  ],
});
