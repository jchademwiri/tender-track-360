import { createInsertSchema } from 'drizzle-zod';
import { clients } from './clients';
import { tenderCategories } from './categories';
import { tenders } from './tenders';

export const insertClientSchema = createInsertSchema(clients);
export const insertCategorySchema = createInsertSchema(tenderCategories);
export const insertTenderSchema = createInsertSchema(tenders);
