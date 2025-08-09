import { db } from '../index';
import { tenderCategories } from '../schema';
import { eq, or, and, isNull, ne } from 'drizzle-orm';

/**
 * Gets all available categories for an organization
 * Includes both system defaults and organization-specific categories
 */
export async function getAvailableCategories(organizationId: string) {
  return await db
    .select()
    .from(tenderCategories)
    .where(
      and(
        or(
          eq(tenderCategories.isSystemDefault, true),
          eq(tenderCategories.organizationId, organizationId)
        ),
        eq(tenderCategories.isActive, true)
      )
    )
    .orderBy(tenderCategories.isSystemDefault, tenderCategories.name);
}

/**
 * Gets only system default categories
 */
export async function getSystemDefaultCategories() {
  return await db
    .select()
    .from(tenderCategories)
    .where(
      and(
        eq(tenderCategories.isSystemDefault, true),
        eq(tenderCategories.isActive, true)
      )
    )
    .orderBy(tenderCategories.name);
}

/**
 * Gets only organization-specific categories
 */
export async function getOrganizationCategories(organizationId: string) {
  return await db
    .select()
    .from(tenderCategories)
    .where(
      and(
        eq(tenderCategories.organizationId, organizationId),
        eq(tenderCategories.isActive, true)
      )
    )
    .orderBy(tenderCategories.name);
}

/**
 * Creates a new organization-specific category
 */
export async function createOrganizationCategory(
  organizationId: string,
  categoryData: {
    name: string;
    description?: string;
  }
) {
  return await db
    .insert(tenderCategories)
    .values({
      organizationId,
      name: categoryData.name,
      description: categoryData.description,
      isActive: true,
      isSystemDefault: false,
    })
    .returning();
}

/**
 * Checks if a category name already exists for an organization
 * (including system defaults)
 */
export async function categoryNameExists(
  organizationId: string,
  name: string,
  excludeId?: string
) {
  const query = db
    .select({ id: tenderCategories.id })
    .from(tenderCategories)
    .where(
      and(
        or(
          eq(tenderCategories.isSystemDefault, true),
          eq(tenderCategories.organizationId, organizationId)
        ),
        eq(tenderCategories.name, name),
        eq(tenderCategories.isActive, true)
      )
    );

  if (excludeId) {
    query.where(ne(tenderCategories.id, excludeId));
  }

  const existing = await query.limit(1);
  return existing.length > 0;
}

/**
 * Soft deletes a category (only organization-specific categories can be deleted)
 */
export async function deleteOrganizationCategory(
  organizationId: string,
  categoryId: string
) {
  return await db
    .update(tenderCategories)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(tenderCategories.id, categoryId),
        eq(tenderCategories.organizationId, organizationId),
        eq(tenderCategories.isSystemDefault, false)
      )
    )
    .returning();
}
