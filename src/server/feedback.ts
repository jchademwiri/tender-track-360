'use server';

import { db } from '@/db';
import { feedback } from '@/db/schema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const feedbackSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(1000, 'Message is too long'),
  type: z.enum(['bug', 'feature', 'other']),
  url: z.string().optional(),
  userId: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

export async function submitFeedback(input: FeedbackInput) {
  try {
    const validated = feedbackSchema.parse(input);

    await db.insert(feedback).values({
      id: crypto.randomUUID(),
      message: validated.message,
      type: validated.type,
      url: validated.url,
      userId: validated.userId || null,
      name: validated.name || null,
      email: validated.email || null,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    return { success: false, error: 'Failed to submit feedback' };
  }
}
