import { createAuthClient } from 'better-auth/react';
import { organizationClient } from 'better-auth/client/plugins';

const baseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000';

// Validate environment variables
const envValidation = {
  NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  NODE_ENV: process.env.NODE_ENV,
  hasBaseURL: !!baseURL,
};

console.log('🔧 Auth Client Configuration:', {
  baseURL,
  environment: envValidation,
  timestamp: new Date().toISOString(),
});

// Warn if using default URL
if (!process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
  console.warn(
    '⚠️ NEXT_PUBLIC_BETTER_AUTH_URL not set, using default:',
    baseURL
  );
}

export const authClient = createAuthClient({
  baseURL,
  plugins: [organizationClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  organization: {
    create: createOrganization,
    getFullOrganization,
    listOrganizations,
    setActiveOrganization,
    inviteMember,
    removeMember,
    updateMemberRole,
    acceptInvitation,
    rejectInvitation,
    cancelInvitation,
    getInvitations,
  },
} = authClient;
