import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Heading,
} from '@react-email/components';

interface PasswordResetEmailProps {
  name?: string;
  resetUrl: string;
}

export const PasswordResetEmail = ({
  name,
  resetUrl,
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Tender Track 360</Heading>
            <Text style={headerSubtitle}>
              Professional Tender Management System
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h2}>Reset your password</Heading>

            <Text style={text}>Hello{name ? ` ${name}` : ''},</Text>

            <Text style={text}>
              We received a request to reset the password for your Tender Track
              360 account. If you made this request, click the button below to
              set a new password.
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>
                Reset Password
              </Button>
            </Section>

            <Text style={smallText}>
              If the button doesn't work, you can copy and paste this link into
              your browser:
            </Text>
            <Text style={linkText}>{resetUrl}</Text>

            {/* Security Notice */}
            <Section style={warningBox}>
              <Text style={warningTitle}>
                <strong>Security Notice:</strong>
              </Text>
              <Text style={warningItem}>
                • This password reset link will expire in 1 hour
              </Text>
              <Text style={warningItem}>
                • If you didn't request a password reset, you can safely ignore
                this email
              </Text>
              <Text style={warningItem}>
                • Your password won't be changed until you click the link above
                and create a new one
              </Text>
            </Section>

            <Text style={text}>
              If you're having trouble accessing your account or didn't request
              this password reset, please contact our support team for
              assistance.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Best regards,
              <br />
              The Tender Track 360 Team
            </Text>
            <Text style={disclaimerText}>
              This email was sent from a notification-only address that cannot
              accept incoming email. Please do not reply to this message.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
};

const header = {
  textAlign: 'center' as const,
  padding: '20px 0',
  borderBottom: '2px solid #007bff',
};

const headerTitle = {
  color: '#007bff',
  margin: 0,
  fontSize: '28px',
};

const headerSubtitle = {
  color: '#666',
  margin: '5px 0 0 0',
  fontSize: '14px',
};

const content = {
  padding: '30px 20px',
};

const h2 = {
  color: '#333',
  marginBottom: '20px',
};

const text = {
  color: '#333',
  lineHeight: '1.6',
  marginBottom: '20px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#dc3545',
  color: 'white',
  padding: '14px 28px',
  textDecoration: 'none',
  borderRadius: '6px',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: '0 2px 4px rgba(220, 53, 69, 0.2)',
};

const smallText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '1.6',
  marginBottom: '20px',
};

const linkText = {
  wordBreak: 'break-all' as const,
  color: '#007bff',
  backgroundColor: '#f8f9fa',
  padding: '10px',
  borderRadius: '4px',
  fontSize: '14px',
};

const warningBox = {
  backgroundColor: '#f8d7da',
  border: '1px solid #f5c6cb',
  borderRadius: '4px',
  padding: '15px',
  margin: '20px 0',
};

const warningTitle = {
  color: '#721c24',
  margin: '0 0 10px 0',
  fontSize: '14px',
};

const warningItem = {
  color: '#721c24',
  margin: '0 0 5px 0',
  fontSize: '14px',
};

const footer = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderTop: '1px solid #dee2e6',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#666',
  fontSize: '14px',
  margin: '0 0 10px 0',
};

const disclaimerText = {
  color: '#999',
  fontSize: '12px',
  margin: 0,
};

export default PasswordResetEmail;
