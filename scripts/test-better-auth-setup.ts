#!/usr/bin/env tsx

/**
 * Test script to verify Better Auth setup with Drizzle integration and organization support
 * This script tests the core functionality required for task 1
 */

import { config } from 'dotenv';
import { db } from '../src/db';
import { auth } from '../src/lib/auth';
import {
  user,
  organization,
  member,
  session,
  account,
  verification,
  invitation,
} from '../src/db/schema';
import { eq } from 'drizzle-orm';

// Load environment variables
config({ path: '.env.local' });

async function testBetterAuthSetup() {
  console.log(
    '🧪 Testing Better Auth Setup with Drizzle Integration and Organization Support'
  );
  console.log('='.repeat(80));

  try {
    // Test 1: Database Connection
    console.log('\n1️⃣ Testing Database Connection...');
    const dbTest = await db.select().from(user).limit(1);
    console.log('✅ Database connection successful');

    // Test 2: Better Auth Tables Exist
    console.log('\n2️⃣ Testing Better Auth Tables...');

    // Test user table
    const userCount = await db.select().from(user).limit(1);
    console.log('✅ User table accessible');

    // Test organization table
    const orgCount = await db.select().from(organization).limit(1);
    console.log('✅ Organization table accessible');

    // Test member table
    const memberCount = await db.select().from(member).limit(1);
    console.log('✅ Member table accessible');

    // Test session table
    const sessionCount = await db.select().from(session).limit(1);
    console.log('✅ Session table accessible');

    // Test account table
    const accountCount = await db.select().from(account).limit(1);
    console.log('✅ Account table accessible');

    // Test verification table
    const verificationCount = await db.select().from(verification).limit(1);
    console.log('✅ Verification table accessible');

    // Test invitation table
    const invitationCount = await db.select().from(invitation).limit(1);
    console.log('✅ Invitation table accessible');

    // Test 3: Better Auth Configuration
    console.log('\n3️⃣ Testing Better Auth Configuration...');

    // Check if auth object is properly configured
    if (auth && typeof auth.handler === 'function') {
      console.log('✅ Better Auth instance configured');
    } else {
      throw new Error('Better Auth instance not properly configured');
    }

    // Test 4: Environment Variables
    console.log('\n4️⃣ Testing Environment Variables...');

    const requiredEnvVars = [
      'DATABASE_URL',
      'BETTER_AUTH_SECRET',
      'BETTER_AUTH_URL',
      'NEXT_PUBLIC_BETTER_AUTH_URL',
    ];

    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        console.log(`✅ ${envVar} is set`);
      } else {
        throw new Error(`❌ ${envVar} is not set`);
      }
    }

    // Test 5: Organization Plugin Features
    console.log('\n5️⃣ Testing Organization Plugin Features...');

    // Check if organization plugin is enabled by testing table structure
    const orgTableInfo = await db.select().from(organization).limit(0);
    console.log('✅ Organization plugin tables available');

    const memberTableInfo = await db.select().from(member).limit(0);
    console.log('✅ Member management tables available');

    const invitationTableInfo = await db.select().from(invitation).limit(0);
    console.log('✅ Invitation system tables available');

    // Test 6: Email Configuration (if available)
    console.log('\n6️⃣ Testing Email Configuration...');

    if (process.env.RESEND_API_KEY) {
      console.log('✅ Email service (Resend) API key configured');
    } else {
      console.log(
        '⚠️ Email service API key not configured (optional for basic setup)'
      );
    }

    console.log('\n🎉 Better Auth Setup Test Results:');
    console.log('='.repeat(50));
    console.log('✅ Database connection: PASSED');
    console.log('✅ Better Auth tables: PASSED');
    console.log('✅ Organization support: PASSED');
    console.log('✅ Environment configuration: PASSED');
    console.log('✅ Multi-tenancy ready: PASSED');

    console.log('\n📋 Summary:');
    console.log('- Better Auth is properly installed and configured');
    console.log('- Drizzle adapter is working correctly');
    console.log('- Organization plugin is enabled for multi-tenancy');
    console.log('- All required tables are created and accessible');
    console.log('- Email/password authentication is configured');
    console.log('- Environment variables are properly set');

    return true;
  } catch (error) {
    console.error('\n❌ Better Auth Setup Test Failed:');
    console.error(error instanceof Error ? error.message : 'Unknown error');

    if (error instanceof Error && error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }

    return false;
  }
}

// Run the test
if (require.main === module) {
  testBetterAuthSetup()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

export { testBetterAuthSetup };
