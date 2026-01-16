'use server';

import { db } from '@/db';
import { supportTickets } from '@/db/schema';
import { z } from 'zod';

const supportTicketSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(2000, 'Message is too long'),
  userId: z.string().optional(),
});

export type SupportTicketInput = z.infer<typeof supportTicketSchema>;

export async function createSupportTicket(input: SupportTicketInput) {
  try {
    const validated = supportTicketSchema.parse(input);

    await db.insert(supportTickets).values({
      id: crypto.randomUUID(),
      name: validated.name,
      email: validated.email,
      message: validated.message,
      userId: validated.userId || null,
      status: 'open',
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to create support ticket:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input data' };
    }
    return { success: false, error: 'Failed to submit support request' };
  }
}
