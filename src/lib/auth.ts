import { betterAuth } from 'better-auth';
import { env } from '@/env';
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
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [
    'http://localhost:3000',
    'https://tender-track-360.vercel.app',
    ...(env.NEXT_PUBLIC_URL ? [new URL(env.NEXT_PUBLIC_URL).origin] : []),
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
                activeOrganizationId: organization?.id ?? null,
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
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: 'Tender Track 360 <onboarding@resend.dev>',
        // MVP: Send all emails to info@tendertrack360.co.za
        to: 'info@tendertrack360.co.za',
        subject: 'Verify your email address',
        replyTo: process.env.REPLY_TO_EMAIL || 'info@tendertrack360.co.za',
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
          from: 'Tender Track 360 <onboarding@resend.dev>',
          // MVP: Send all emails to info@tendertrack360.co.za
          to: 'info@tendertrack360.co.za',
          subject: 'Reset your password',
          replyTo: process.env.REPLY_TO_EMAIL || 'info@tendertrack360.co.za',
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
        const base = env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        const inviteLink = `${base}/invite/accept/${data.id}`;
        await resend.emails.send({
          from: 'Tender Track 360 <onboarding@resend.dev>',
          // MVP: Send all emails to info@tendertrack360.co.za
          to: 'info@tendertrack360.co.za',
          subject: `You're invited to join ${data.organization.name}`,
          replyTo: process.env.REPLY_TO_EMAIL || 'info@tendertrack360.co.za',
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
