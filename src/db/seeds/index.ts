import { seedDefaultCategories } from './default-categories';

/**
 * Main seeding function that runs all database seeds
 */
export async function runSeeds() {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed default tender categories
    await seedDefaultCategories();

    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Export individual seed functions for selective seeding
export { seedDefaultCategories } from './default-categories';
