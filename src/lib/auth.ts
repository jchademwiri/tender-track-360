// Core Better Auth imports
import { betterAuth } from 'better-auth';
import { organization } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

// Your Drizzle database connection and schema
import { db } from '@/db';
import * as schema from '@/db/schema';

// Your custom email utilities
import {
  sendInvitationEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '@/server/email';

// Type definitions for Better Auth
interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface InvitationData {
  email: string;
  role: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  invitation: {
    id: string;
    organizationId: string;
    email: string;
    role: string;
    status: string;
    expiresAt: Date;
    inviterId: string;
  };
  inviter: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export const auth = betterAuth({
  // Connect Better Auth to PostgreSQL via Drizzle ORM
  database: drizzleAdapter(db, {
    provider: 'pg', // Database type: PostgreSQL
    schema, // Your Drizzle schema with all table definitions
  }),

  // Enable email & password authentication
  emailAndPassword: {
    enabled: true, // Allow sign-in/sign-up via email and password
    requireEmailVerification: true, // Users must verify email before logging in

    // Custom email verification handler
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      user: User;
      url: string;
    }) => {
      console.log('🔔 BETTER AUTH TRIGGERED: Verification email request:', {
        userId: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        verificationUrl: url,
        timestamp: new Date().toISOString(),
      });

      try {
        console.log('📧 Calling sendVerificationEmail function...');
        const result = await sendVerificationEmail({
          email: user.email, // Recipient email
          verificationUrl: url, // Verification link
          name: user.name, // Recipient name
        });
        console.log('✅ BETTER AUTH: Verification email sent successfully:', {
          userId: user.id,
          email: user.email,
          result,
        });
        return result;
      } catch (error) {
        console.error('❌ BETTER AUTH: Failed to send verification email:', {
          userId: user.id,
          email: user.email,
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        });
        throw error;
      }
    },

    // Custom password reset handler
    sendResetPassword: async ({ user, url }: { user: User; url: string }) => {
      console.log('🔔 BETTER AUTH TRIGGERED: Password reset email request:', {
        userId: user.id,
        email: user.email,
        name: user.name,
        resetUrl: url,
        timestamp: new Date().toISOString(),
      });

      try {
        console.log('🔐 Calling sendPasswordResetEmail function...');
        const result = await sendPasswordResetEmail({
          email: user.email, // Recipient email
          resetUrl: url, // Password reset link
          name: user.name, // Recipient name
        });
        console.log('✅ BETTER AUTH: Password reset email sent successfully:', {
          userId: user.id,
          email: user.email,
          result,
        });
        return result;
      } catch (error) {
        console.error('❌ BETTER AUTH: Failed to send password reset email:', {
          userId: user.id,
          email: user.email,
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        });
        throw error;
      }
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // Sessions last 7 days
    updateAge: 60 * 60 * 24, // Refresh token every 1 day if user is active
  },

  // Plugins: Add organization (multi-tenant) support
  plugins: [
    organization({
      allowUserToCreateOrganization: true, // Users can create organizations
      organizationLimit: 1, // Each user can only own 1 organization

      // Define roles using Better Auth role objects (fix the type issues)
      roles: {
        admin: {
          description: 'Full system access with administrative privileges',
        },
        tender_manager: {
          description:
            'Manage tenders, team members, and organizational settings',
        },
        tender_specialist: {
          description: 'Create, edit, and manage tender processes',
        },
        viewer: {
          description: 'Read-only access to view tenders and reports',
        },
      },

      defaultRole: 'viewer', // New members join as viewer

      // Custom email invitation handler
      sendInvitationEmail: async (data: InvitationData) => {
        console.log(
          '🔔 BETTER AUTH TRIGGERED: Organization invitation email request:',
          {
            invitationId: data.invitation.id,
            email: data.email,
            organizationId: data.organization.id,
            organizationName: data.organization.name,
            role: data.role,
            inviterId: data.inviter.user.id,
            inviterName: data.inviter.user.name,
            expiresAt: data.invitation.expiresAt,
            timestamp: new Date().toISOString(),
          }
        );

        try {
          console.log('📨 Calling sendInvitationEmail function...');
          const result = await sendInvitationEmail({
            email: data.email, // Invitee email
            organizationName: data.organization.name, // Org name in email
            role: data.role, // Role assigned upon joining
            invitationUrl: `${process.env.BETTER_AUTH_URL}/api/auth/organization/accept-invitation?token=${data.invitation.id}`, // Invitation link
            inviterName: data.inviter.user.name, // Name of inviter
          });
          console.log('✅ BETTER AUTH: Invitation email sent successfully:', {
            invitationId: data.invitation.id,
            email: data.email,
            organizationName: data.organization.name,
            result,
          });
          return result;
        } catch (error) {
          console.error('❌ BETTER AUTH: Failed to send invitation email:', {
            invitationId: data.invitation.id,
            email: data.email,
            organizationName: data.organization.name,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
          });
          throw error;
        }
      },
    }),
  ],

  // Security: Define trusted frontend origins that can use this auth API
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'https://localhost:3000',
  ],

  // Add CORS configuration
  cors: {
    origin: [
      process.env.BETTER_AUTH_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'https://localhost:3000',
    ],
    credentials: true,
  },

  // Add advanced configuration for debugging
  advanced: {
    generateId: () => crypto.randomUUID(),
    crossSubDomainCookies: {
      enabled: false,
    },
  },

  // Add logger for debugging
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    disabled: false,
  },
});
