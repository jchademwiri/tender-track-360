import { createInsertSchema } from 'drizzle-zod';
import { clients } from './clients';
import { tenderCategories } from './categories';
import { tenders } from './tenders';
import { projects } from './projects';

export const insertClientSchema = createInsertSchema(clients);
export const insertCategorySchema = createInsertSchema(tenderCategories);
export const insertTenderSchema = createInsertSchema(tenders);
export const insertProjectSchema = createInsertSchema(projects);
