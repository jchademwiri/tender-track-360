import { db } from '@/db';
import { tenderCategories } from '@/db/schema';

export async function getCategories() {
  return db
    .select({ id: tenderCategories.id, name: tenderCategories.name })
    .from(tenderCategories);
}
