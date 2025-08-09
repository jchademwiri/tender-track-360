#!/usr/bin/env tsx

import { config } from 'dotenv';
import { runSeeds } from '../src/db/seeds';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  try {
    console.log('🚀 Starting database seeding process...');
    await runSeeds();
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Database seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding process
main();
