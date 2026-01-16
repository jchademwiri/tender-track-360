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

    // Send email notification to admin
    try {
      if (
        process.env.RESEND_API_KEY &&
        process.env.SENDER_FEEDBACK_EMAIL &&
        process.env.REPLY_TO_EMAIL
      ) {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const feedbackFromEmail = process.env.SENDER_FEEDBACK_EMAIL;
        const feedbackToEmail = process.env.REPLY_TO_EMAIL;

        await resend.emails.send({
          from: `Feedback <${feedbackFromEmail}>`,
          to: feedbackToEmail,
          subject: `New Feedback: ${validated.type}`,
          html: `
            <h2>New Feedback Received</h2>
            <p><strong>Type:</strong> ${validated.type}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ccc;">${validated.message}</blockquote>
            <p><strong>User:</strong> ${validated.name || 'Anonymous'} (${validated.email || 'No email'})</p>
            <p><strong>URL:</strong> ${validated.url || 'N/A'}</p>
          `,
        });
      } else {
        console.warn(
          'Email configuration missing (RESEND_API_KEY, SENDER_FEEDBACK_EMAIL, or REPLY_TO_EMAIL not set), skipping email notification'
        );
      }
    } catch (emailError) {
      console.error('Failed to send feedback email notification:', emailError);
      // Don't block the response if email fails
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    return { success: false, error: 'Failed to submit feedback' };
  }
}
