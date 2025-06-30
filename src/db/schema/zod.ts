import { createInsertSchema } from 'drizzle-zod';
import { clients } from './clients';
import { tenderCategories } from './categories';

export const insertClientSchema = createInsertSchema(clients);
export const insertCategorySchema = createInsertSchema(tenderCategories);
