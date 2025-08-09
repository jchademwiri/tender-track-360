import { Resend } from 'resend';
import VerificationEmail from '../../emails/verification-email';
import InvitationEmail from '../../emails/invitation-email';
import PasswordResetEmail from '../../emails/password-reset-email';

// Initialize Resend lazily to ensure environment variables are loaded
let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export interface SendInvitationEmailParams {
  email: string;
  organizationName: string;
  role: string;
  invitationUrl: string;
  inviterName: string;
}

export async function sendInvitationEmail({
  email,
  organizationName,
  role,
  invitationUrl,
  inviterName,
}: SendInvitationEmailParams) {
  const emailDetails = {
    type: 'INVITATION_EMAIL',
    from: 'Tender Track 360 <noreply@resend.dev>',
    to: email,
    subject: `You've been invited to join ${organizationName} - Tender Track 360`,
    organizationName,
    role,
    inviterName,
    invitationUrl,
    timestamp: new Date().toISOString(),
  };

  console.log('📨 STARTING EMAIL SEND:', emailDetails);

  try {
    const apiKey = process.env.RESEND_API_KEY;
    console.log('🔑 Resend API Key Status:', {
      hasApiKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
      keyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'NOT_SET',
    });

    const resendInstance = getResend();
    console.log('📡 Resend instance created successfully');

    console.log('📤 Calling Resend API with payload:', {
      from: emailDetails.from,
      to: [emailDetails.to],
      subject: emailDetails.subject,
      hasReactComponent: true,
      reactComponentName: 'InvitationEmail',
    });

    const { data, error } = await resendInstance.emails.send({
      from: emailDetails.from,
      to: [emailDetails.to],
      subject: emailDetails.subject,
      react: InvitationEmail({
        organizationName,
        role,
        invitationUrl,
        inviterName,
      }),
    });

    if (error) {
      console.error('❌ RESEND API ERROR:', {
        ...emailDetails,
        error: {
          message: error.message,
          name: error.name,
          details: error,
        },
        emailSent: false,
      });
      throw new Error(`Failed to send invitation email: ${error.message}`);
    }

    console.log('✅ EMAIL SENT SUCCESSFULLY:', {
      ...emailDetails,
      emailSent: true,
      resendResponse: {
        id: data?.id,
      },
    });

    return data;
  } catch (error) {
    console.error('❌ EMAIL SEND FAILED:', {
      ...emailDetails,
      emailSent: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error,
        details: error,
      },
    });
    throw error;
  }
}

export interface SendVerificationEmailParams {
  email: string;
  verificationUrl: string;
  name?: string;
}

export async function sendVerificationEmail({
  email,
  verificationUrl,
  name,
}: SendVerificationEmailParams) {
  const emailDetails = {
    type: 'VERIFICATION_EMAIL',
    from: 'Tender Track 360 <noreply@resend.dev>',
    to: email,
    subject: 'Verify your email address - Tender Track 360',
    recipientName: name,
    verificationUrl,
    timestamp: new Date().toISOString(),
  };

  console.log('📧 STARTING EMAIL SEND:', emailDetails);

  try {
    // Check if Resend API key is available
    const apiKey = process.env.RESEND_API_KEY;
    console.log('🔑 Resend API Key Status:', {
      hasApiKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
      keyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'NOT_SET',
    });

    const resendInstance = getResend();
    console.log('📡 Resend instance created successfully');

    console.log('📤 Calling Resend API with payload:', {
      from: emailDetails.from,
      to: [emailDetails.to],
      subject: emailDetails.subject,
      hasReactComponent: true,
      reactComponentName: 'VerificationEmail',
    });

    const { data, error } = await resendInstance.emails.send({
      from: emailDetails.from,
      to: [emailDetails.to],
      subject: emailDetails.subject,
      react: VerificationEmail({ name, verificationUrl }),
    });

    if (error) {
      console.error('❌ RESEND API ERROR:', {
        ...emailDetails,
        error: {
          message: error.message,
          name: error.name,
          details: error,
        },
        emailSent: false,
      });
      throw new Error(`Failed to send verification email: ${error.message}`);
    }

    console.log('✅ EMAIL SENT SUCCESSFULLY:', {
      ...emailDetails,
      emailSent: true,
      resendResponse: {
        id: data?.id,
      },
    });

    return data;
  } catch (error) {
    console.error('❌ EMAIL SEND FAILED:', {
      ...emailDetails,
      emailSent: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error,
        details: error,
      },
    });
    throw error;
  }
}

export interface SendPasswordResetEmailParams {
  email: string;
  resetUrl: string;
  name?: string;
}

export async function sendPasswordResetEmail({
  email,
  resetUrl,
  name,
}: SendPasswordResetEmailParams) {
  const emailDetails = {
    type: 'PASSWORD_RESET_EMAIL',
    from: 'Tender Track 360 <noreply@resend.dev>',
    to: email,
    subject: 'Reset your password - Tender Track 360',
    recipientName: name,
    resetUrl,
    timestamp: new Date().toISOString(),
  };

  console.log('🔐 STARTING EMAIL SEND:', emailDetails);

  try {
    const apiKey = process.env.RESEND_API_KEY;
    console.log('🔑 Resend API Key Status:', {
      hasApiKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
      keyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'NOT_SET',
    });

    const resendInstance = getResend();
    console.log('📡 Resend instance created successfully');

    console.log('📤 Calling Resend API with payload:', {
      from: emailDetails.from,
      to: [emailDetails.to],
      subject: emailDetails.subject,
      hasReactComponent: true,
      reactComponentName: 'PasswordResetEmail',
    });

    const { data, error } = await resendInstance.emails.send({
      from: emailDetails.from,
      to: [emailDetails.to],
      subject: emailDetails.subject,
      react: PasswordResetEmail({ name, resetUrl }),
    });

    if (error) {
      console.error('❌ RESEND API ERROR:', {
        ...emailDetails,
        error: {
          message: error.message,
          name: error.name,
          details: error,
        },
        emailSent: false,
      });
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }

    console.log('✅ EMAIL SENT SUCCESSFULLY:', {
      ...emailDetails,
      emailSent: true,
      resendResponse: {
        id: data?.id,
      },
    });

    return data;
  } catch (error) {
    console.error('❌ EMAIL SEND FAILED:', {
      ...emailDetails,
      emailSent: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error,
        details: error,
      },
    });
    throw error;
  }
}
