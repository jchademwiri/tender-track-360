# Email Templates - Tender Track 360

This folder contains professional email templates for the Tender Track 360 authentication system, built with React Email components for optimal email client compatibility.

## Templates

### 1. Verification Email (`verification-email.tsx`)

- **Purpose**: Email verification for new user registrations
- **Trigger**: Automatically sent when a user signs up
- **Features**:
  - Professional branding
  - Clear call-to-action button
  - Fallback link for accessibility
  - Security notice with expiration info
  - Mobile-responsive design

### 2. Invitation Email (`invitation-email.tsx`)

- **Purpose**: Organization member invitations
- **Trigger**: When an admin invites a user to join their organization
- **Features**:
  - Role-specific information and descriptions
  - Organization context
  - Feature highlights based on role
  - Inviter information
  - Security notice

### 3. Password Reset Email (`password-reset-email.tsx`)

- **Purpose**: Password reset requests
- **Trigger**: When a user requests a password reset
- **Features**:
  - Clear security warnings
  - Time-limited link information
  - Professional styling
  - Support contact guidance

## Technology Stack

- **React Email**: Professional email component library
- **Resend**: Email delivery service
- **TypeScript**: Type-safe email templates
- **Responsive Design**: Works across all email clients

## Usage

### Server-Side Integration

The email templates are integrated with Better Auth through the email service:

```typescript
// src/server/email.ts
import { renderVerificationEmail } from '../../emails/render';

export async function sendVerificationEmail({ email, verificationUrl, name }) {
  const html = renderVerificationEmail({ name, verificationUrl });

  await resend.emails.send({
    from: 'Tender Track 360 <noreply@updates.jacobc.co.za>',
    to: [email],
    subject: 'Verify your email address',
    html,
  });
}
```

### Better Auth Configuration

```typescript
// src/lib/auth.ts
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        email: user.email,
        verificationUrl: url,
        name: user.name,
      });
    },
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        email: user.email,
        resetUrl: url,
        name: user.name,
      });
    },
  },
  plugins: [
    organization({
      sendInvitationEmail: async (data) => {
        await sendInvitationEmail({
          email: data.email,
          organizationName: data.organization.name,
          role: data.role,
          invitationUrl: `${process.env.BETTER_AUTH_URL}/api/auth/organization/accept-invitation?token=${data.invitation.id}`,
          inviterName: data.inviter.user.name,
        });
      },
    }),
  ],
});
```

## Role Descriptions

The invitation email includes role-specific descriptions:

- **Admin**: Full system access with administrative privileges
- **Tender Manager**: Manage tenders, team members, and organizational settings
- **Tender Specialist**: Create, edit, and manage tender processes
- **Viewer**: Read-only access to view tenders and reports

## Email Client Compatibility

These templates are built with React Email components, ensuring compatibility with:

- Gmail
- Outlook
- Apple Mail
- Yahoo Mail
- Thunderbird
- Mobile email clients

## Development

### Preview Templates

You can preview the email templates using React Email's preview server:

```bash
pnpm email dev
```

### Testing

Test the email integration:

```bash
# Test auth configuration
pnpm tsx scripts/test-auth.ts

# Test Resend integration
pnpm tsx scripts/test-resend.ts
```

### Environment Variables

Required environment variables:

```env
RESEND_API_KEY=your_resend_api_key
BETTER_AUTH_URL=http://localhost:3000
```

## Security Features

- **Link Expiration**: All email links have appropriate expiration times
- **Security Notices**: Clear warnings about email authenticity
- **No-Reply Address**: Uses notification-only email address
- **Token-Based**: Secure token-based verification and reset flows

## Customization

To customize the templates:

1. Edit the React components in this folder
2. Update styles using the inline style objects
3. Modify the render functions if needed
4. Test changes using the preview server

## Brand Guidelines

- **Primary Color**: #007bff (Tender Track 360 blue)
- **Success Color**: #28a745 (verification buttons)
- **Warning Color**: #dc3545 (password reset buttons)
- **Typography**: Arial, sans-serif for maximum compatibility
- **Logo**: Text-based "Tender Track 360" branding

## Support

For email delivery issues:

- Check Resend dashboard for delivery status
- Verify domain configuration
- Review email logs in the application

For template issues:

- Use React Email preview for testing
- Check email client compatibility
- Validate HTML output
