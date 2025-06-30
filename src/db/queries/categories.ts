import { db } from '@/db';
import { tenderCategories, tenders } from '@/db/schema';
import { insertCategorySchema } from '@/db/schema/zod';
import { eq } from 'drizzle-orm';

export async function getCategories() {
  return db
    .select({
      id: tenderCategories.id,
      name: tenderCategories.name,
      isActive: tenderCategories.isActive,
      description: tenderCategories.description,
    })
    .from(tenderCategories);
}

export async function getCategoryById(id: string) {
  return db.query.tenderCategories.findFirst({
    where: eq(tenderCategories.id, id),
  });
}

export async function createCategory(
  data: typeof tenderCategories.$inferInsert
) {
  const validatedData = insertCategorySchema.parse(data);
  return db.insert(tenderCategories).values(validatedData).returning();
}

export async function updateCategory(
  id: string,
  data: Partial<typeof tenderCategories.$inferInsert>
) {
  const validatedData = insertCategorySchema.partial().parse(data);
  return db
    .update(tenderCategories)
    .set(validatedData)
    .where(eq(tenderCategories.id, id))
    .returning();
}

export async function deleteCategory(id: string) {
  const tendersUsingCategory = await db
    .select({ id: tenders.id })
    .from(tenders)
    .where(eq(tenders.categoryId, id))
    .limit(1);

  if (tendersUsingCategory.length > 0) {
    throw new Error(
      'This category cannot be deleted as it is assigned to one or more tenders.'
    );
  }

  return db
    .delete(tenderCategories)
    .where(eq(tenderCategories.id, id))
    .returning();
}
