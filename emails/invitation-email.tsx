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

interface InvitationEmailProps {
  organizationName: string;
  role: string;
  invitationUrl: string;
  inviterName: string;
}

const roleDescriptions: Record<string, string> = {
  admin: 'Full system access with administrative privileges',
  tender_manager: 'Manage tenders, team members, and organizational settings',
  tender_specialist: 'Create, edit, and manage tender processes',
  viewer: 'Read-only access to view tenders and reports',
};

export const InvitationEmail = ({
  organizationName,
  role,
  invitationUrl,
  inviterName,
}: InvitationEmailProps) => {
  const roleDescription =
    roleDescriptions[role] || 'Access to the tender management system';
  const roleDisplayName = role
    .replace('_', ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

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
            <Heading style={h2}>
              You've been invited to join {organizationName}
            </Heading>

            <Text style={text}>Hello,</Text>

            <Text style={text}>
              <strong>{inviterName}</strong> has invited you to join{' '}
              <strong>{organizationName}</strong>
              on Tender Track 360 as a <strong>{roleDisplayName}</strong>.
            </Text>

            {/* Role Information */}
            <Section style={roleBox}>
              <Heading style={roleTitle}>Your Role: {roleDisplayName}</Heading>
              <Text style={roleDescription}>{roleDescription}</Text>
            </Section>

            <Text style={text}>
              Tender Track 360 is a comprehensive tender management system that
              helps organizations track, manage, and optimize their tender
              processes. With your new role, you'll be able to:
            </Text>

            {/* Features List */}
            <Section style={featuresList}>
              <Text style={featureItem}>
                • Track tender deadlines and milestones
              </Text>
              <Text style={featureItem}>
                • Manage documents and submissions
              </Text>
              <Text style={featureItem}>• Collaborate with team members</Text>
              <Text style={featureItem}>• Generate reports and analytics</Text>
              {role === 'admin' && (
                <Text style={featureItem}>
                  • Configure system settings and user permissions
                </Text>
              )}
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={invitationUrl}>
                Accept Invitation
              </Button>
            </Section>

            <Text style={smallText}>
              If the button doesn't work, you can copy and paste this link into
              your browser:
            </Text>
            <Text style={linkText}>{invitationUrl}</Text>

            {/* Security Notice */}
            <Section style={warningBox}>
              <Text style={warningText}>
                <strong>Security Notice:</strong> This invitation link will
                expire in 7 days. If you weren't expecting this invitation, you
                can safely ignore this email.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This invitation was sent by <strong>{inviterName}</strong> from{' '}
              <strong>{organizationName}</strong>.
            </Text>
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

const roleBox = {
  backgroundColor: '#e3f2fd',
  border: '1px solid #bbdefb',
  borderRadius: '6px',
  padding: '15px',
  margin: '20px 0',
};

const roleTitle = {
  color: '#1976d2',
  margin: '0 0 10px 0',
  fontSize: '16px',
};

const roleDescription = {
  color: '#333',
  margin: 0,
  fontSize: '14px',
  lineHeight: '1.5',
};

const featuresList = {
  marginBottom: '30px',
};

const featureItem = {
  color: '#333',
  lineHeight: '1.6',
  marginBottom: '8px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '14px 28px',
  textDecoration: 'none',
  borderRadius: '6px',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: '0 2px 4px rgba(0, 123, 255, 0.2)',
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
  margin: '0 0 15px 0',
};

const disclaimerText = {
  color: '#999',
  fontSize: '12px',
  margin: 0,
};

export default InvitationEmail;
