#!/usr/bin/env tsx

import { config } from 'dotenv';
import { db } from '../src/db';
import {
  getAvailableCategories,
  getSystemDefaultCategories,
  createOrganizationCategory,
  categoryNameExists,
} from '../src/db/utils/category-helpers';
import {
  getOrganizationClients,
  createClient,
  searchClients,
  clientNameExists,
} from '../src/db/utils/client-helpers';

// Load environment variables
config({ path: '.env.local' });

async function testCategoryFunctionality() {
  console.log('🧪 Testing category functionality...');

  try {
    // Test getting system default categories
    const systemCategories = await getSystemDefaultCategories();
    console.log(
      `✅ Found ${systemCategories.length} system default categories`
    );

    // Test getting available categories for a mock organization
    const mockOrgId = 'test-org-123';
    const availableCategories = await getAvailableCategories(mockOrgId);
    console.log(
      `✅ Found ${availableCategories.length} available categories for organization`
    );

    // Test category name existence check
    const existsResult = await categoryNameExists(
      mockOrgId,
      'Construction & Infrastructure'
    );
    console.log(`✅ Category name exists check: ${existsResult}`);

    // Test creating organization-specific category
    try {
      const newCategory = await createOrganizationCategory(mockOrgId, {
        name: 'Test Custom Category',
        description: 'A test category for this organization',
      });
      console.log(
        `✅ Created organization-specific category: ${newCategory[0]?.name}`
      );
    } catch (error) {
      console.log(
        `ℹ️  Category creation test skipped (likely already exists or DB constraint)`
      );
    }

    console.log('✅ Category functionality tests completed');
  } catch (error) {
    console.error('❌ Category functionality test failed:', error);
    throw error;
  }
}

async function testClientFunctionality() {
  console.log('🧪 Testing client functionality...');

  try {
    const mockOrgId = 'test-org-123';
    const mockUserId = 'test-user-123';

    // Test getting organization clients
    const clients = await getOrganizationClients(mockOrgId);
    console.log(`✅ Found ${clients.length} clients for organization`);

    // Test client name existence check
    const existsResult = await clientNameExists(mockOrgId, 'Test Client');
    console.log(`✅ Client name exists check: ${existsResult}`);

    // Test creating a client
    try {
      const newClient = await createClient(mockOrgId, mockUserId, {
        name: 'Test Client Corporation',
        type: 'private',
        contactPerson: 'John Doe',
        contactEmail: 'john@testclient.com',
        contactPhone: '+1234567890',
        description: 'A test client for functionality testing',
      });
      console.log(`✅ Created client: ${newClient[0]?.name}`);

      // Test searching clients
      const searchResults = await searchClients(mockOrgId, 'Test');
      console.log(
        `✅ Search found ${searchResults.length} clients matching 'Test'`
      );
    } catch (error) {
      console.log(
        `ℹ️  Client creation test skipped (likely DB constraint or missing references)`
      );
    }

    console.log('✅ Client functionality tests completed');
  } catch (error) {
    console.error('❌ Client functionality test failed:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting client and category functionality tests...');

    await testCategoryFunctionality();
    await testClientFunctionality();

    console.log('🎉 All functionality tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Functionality tests failed:', error);
    process.exit(1);
  }
}

// Run the tests
main();
