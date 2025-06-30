import { createInsertSchema } from 'drizzle-zod';
import { clients } from './clients';

export const insertClientSchema = createInsertSchema(clients);
