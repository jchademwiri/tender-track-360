import { config } from 'dotenv';
import { sendVerificationEmail } from '../src/server/email';

// Load environment variables from both .env and .env.local
config({ path: '.env' });
config({ path: '.env.local' });

async function testEmailSending() {
  console.log('🧪 Testing actual email sending...\n');

  // Debug environment variables
  console.log('Environment variables:');
  console.log(
    'RESEND_API_KEY:',
    process.env.RESEND_API_KEY ? 'Set' : 'Not set'
  );
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  console.log(
    'BETTER_AUTH_SECRET:',
    process.env.BETTER_AUTH_SECRET ? 'Set' : 'Not set'
  );

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not set!');
    return;
  }

  try {
    console.log('\n1. Testing verification email sending...');

    const testEmail = 'hello@jacobc.co.za'; // Your actual email for testing
    const testUrl = 'http://localhost:3000/verify-email?token=test123';
    const testName = 'Test User';

    console.log(`   Sending test email to: ${testEmail}`);
    console.log(`   Verification URL: ${testUrl}`);
    console.log(`   User name: ${testName}`);

    const result = await sendVerificationEmail({
      email: testEmail,
      verificationUrl: testUrl,
      name: testName,
    });

    console.log('✅ Email sent successfully!');
    console.log('   Result:', result);

    console.log('\n🎉 Email sending test completed successfully!');
    console.log(
      '\nIf you used a real email address, check your inbox (and spam folder).'
    );
  } catch (error) {
    console.error('❌ Error sending email:', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

// Run the test
testEmailSending().catch(console.error);
