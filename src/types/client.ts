import { z } from 'zod';
import { insertClientSchema } from '../db/schema/zod';

export type ClientInsert = z.infer<typeof insertClientSchema>;
