import { db } from '../index';
import { tenderCategories } from '../schema';
import { or, eq } from 'drizzle-orm';

export const defaultTenderCategories = [
  {
    name: 'Construction & Infrastructure',
    description:
      'Building construction, road works, infrastructure development projects',
    isSystemDefault: true,
  },
  {
    name: 'Information Technology',
    description:
      'Software development, IT services, hardware procurement, digital solutions',
    isSystemDefault: true,
  },
  {
    name: 'Professional Services',
    description: 'Consulting, legal services, accounting, advisory services',
    isSystemDefault: true,
  },
  {
    name: 'Healthcare & Medical',
    description:
      'Medical equipment, pharmaceutical supplies, healthcare services',
    isSystemDefault: true,
  },
  {
    name: 'Education & Training',
    description: 'Educational services, training programs, academic supplies',
    isSystemDefault: true,
  },
  {
    name: 'Transportation & Logistics',
    description:
      'Vehicle procurement, logistics services, transportation infrastructure',
    isSystemDefault: true,
  },
  {
    name: 'Energy & Utilities',
    description:
      'Power generation, renewable energy, utility services, fuel supply',
    isSystemDefault: true,
  },
  {
    name: 'Security & Defense',
    description: 'Security services, defense equipment, surveillance systems',
    isSystemDefault: true,
  },
  {
    name: 'Agriculture & Food',
    description:
      'Agricultural equipment, food supply, farming services, livestock',
    isSystemDefault: true,
  },
  {
    name: 'Environmental Services',
    description:
      'Waste management, environmental consulting, green technologies',
    isSystemDefault: true,
  },
  {
    name: 'Manufacturing & Industrial',
    description:
      'Industrial equipment, manufacturing services, machinery procurement',
    isSystemDefault: true,
  },
  {
    name: 'Research & Development',
    description: 'Research services, laboratory equipment, innovation projects',
    isSystemDefault: true,
  },
] as const;

/**
 * Seeds the database with default tender categories
 * These categories are available to all organizations
 */
export async function seedDefaultCategories() {
  try {
    console.log('🌱 Seeding default tender categories...');

    // Check if default categories already exist
    const existingCategories = await db
      .select()
      .from(tenderCategories)
      .where(eq(tenderCategories.isSystemDefault, true));

    if (existingCategories.length > 0) {
      console.log(
        `ℹ️  Found ${existingCategories.length} existing default categories, skipping seed`
      );
      return existingCategories;
    }

    // Insert default categories
    const insertedCategories = await db
      .insert(tenderCategories)
      .values(
        defaultTenderCategories.map((category) => ({
          organizationId: null, // System defaults have no organization
          name: category.name,
          description: category.description,
          isActive: true,
          isSystemDefault: category.isSystemDefault,
        }))
      )
      .returning();

    console.log(
      `✅ Successfully seeded ${insertedCategories.length} default tender categories`
    );
    return insertedCategories;
  } catch (error) {
    console.error('❌ Error seeding default categories:', error);
    throw error;
  }
}

/**
 * Gets all available categories for an organization
 * Includes both system defaults and organization-specific categories
 */
export async function getAvailableCategories(organizationId: string) {
  return await db
    .select()
    .from(tenderCategories)
    .where(
      or(
        eq(tenderCategories.isSystemDefault, true),
        eq(tenderCategories.organizationId, organizationId)
      )
    )
    .where(eq(tenderCategories.isActive, true))
    .orderBy(tenderCategories.isSystemDefault, tenderCategories.name);
}
