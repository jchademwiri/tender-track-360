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

interface VerificationEmailProps {
  name?: string;
  verificationUrl: string;
}

export const VerificationEmail = ({
  name,
  verificationUrl,
}: VerificationEmailProps) => {
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
            <Heading style={h2}>Verify your email address</Heading>

            <Text style={text}>Hello{name ? ` ${name}` : ''},</Text>

            <Text style={text}>
              Thank you for signing up for Tender Track 360! To complete your
              account setup and start managing your tenders efficiently, please
              verify your email address by clicking the button below.
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={verificationUrl}>
                Verify Email Address
              </Button>
            </Section>

            <Text style={smallText}>
              If the button doesn't work, you can copy and paste this link into
              your browser:
            </Text>
            <Text style={linkText}>{verificationUrl}</Text>

            {/* Security Notice */}
            <Section style={warningBox}>
              <Text style={warningText}>
                <strong>Security Notice:</strong> This verification link will
                expire in 24 hours. If you didn't create an account with Tender
                Track 360, you can safely ignore this email.
              </Text>
            </Section>
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
  backgroundColor: '#28a745',
  color: 'white',
  padding: '14px 28px',
  textDecoration: 'none',
  borderRadius: '6px',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: '0 2px 4px rgba(40, 167, 69, 0.2)',
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
  backgroundColor: '#fff3cd',
  border: '1px solid #ffeaa7',
  borderRadius: '4px',
  padding: '15px',
  margin: '20px 0',
};

const warningText = {
  color: '#856404',
  margin: 0,
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

export default VerificationEmail;
