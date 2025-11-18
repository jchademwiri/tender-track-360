import { betterAuth } from 'better-auth';
import { organization } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { db } from '@/db';
import { schema } from '@/db/schema';
import { ac, admin, manager, member, owner } from '@/lib/auth/permissions';
import { Resend } from 'resend';
import ResetPasswordEmail from '@/emails/reset-password-email';
import VerifyEmail from '@/emails/verify-email';
import { getActiveOrganization } from '@/server';
import OrganizationInvitation from '@/emails/organization-invitation';

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  trustedOrigins: [
    'http://localhost:3000',
    'https://tender-track-360.vercel.app',
    ...(process.env.NEXT_PUBLIC_URL
      ? [new URL(process.env.NEXT_PUBLIC_URL).origin]
      : []),
  ],
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          try {
            const organization = await getActiveOrganization(session.userId);
            return {
              data: {
                ...session,
                activeOrganizationId: organization?.id,
              },
            };
          } catch (error) {
            console.error('Error in session create hook:', error);
            return { data: session };
          }
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
        const base =
          process.env.NEXT_PUBLIC_APP_URL ||
          process.env.NEXT_PUBLIC_URL ||
          'http://localhost:3000';
        const inviteLink = `${base}/invite/accept/${data.id}`;
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
      allowUserToCreateOrganization: async (user) => {
        // Example: only verified users can create orgs
        return user.emailVerified;
      },
      organizationLimit: 2,

      // Hook to update session when organization is switched
      hooks: {
        organization: {
          setActive: {
            after: async ({
              user,
              organizationId,
            }: {
              user: { id: string };
              organizationId: string;
            }) => {
              // This ensures the session gets updated with the new active organization
              console.log(
                `Organization switched to ${organizationId} for user ${user.id}`
              );
            },
          },
        },
      },

      ac,
      roles: {
        owner,
        admin,
        manager,
        member,
      },
    }),
    nextCookies(),
  ],
});
