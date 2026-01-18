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

    // Send email notification to admin
    try {
      if (
        process.env.RESEND_API_KEY &&
        process.env.SENDER_SUPPORT_EMAIL &&
        process.env.REPLY_TO_EMAIL
      ) {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const supportFromEmail = process.env.SENDER_SUPPORT_EMAIL;
        const supportToEmail = process.env.REPLY_TO_EMAIL;

        await resend.emails.send({
          from: `Tender Track 360 Support <${supportFromEmail}>`,
          to: supportToEmail,
          subject: `New Support Ticket from ${validated.name}`,
          html: `
            <h2>New Support Ticket Created</h2>
            <p><strong>Name:</strong> ${validated.name}</p>
            <p><strong>Email:</strong> ${validated.email}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ccc;">${validated.message}</blockquote>
            <p><strong>User ID:</strong> ${validated.userId || 'N/A'}</p>
          `,
        });
      } else {
        console.warn(
          'Email configuration missing (RESEND_API_KEY, SENDER_SUPPORT_EMAIL, or REPLY_TO_EMAIL not set), skipping email notification'
        );
      }

      // Send confirmation email to user
      try {
        if (process.env.RESEND_API_KEY && process.env.SENDER_SUPPORT_EMAIL) {
          const { Resend } = await import('resend');
          const resend = new Resend(process.env.RESEND_API_KEY);
          const supportFromEmail = process.env.SENDER_SUPPORT_EMAIL;

          await resend.emails.send({
            from: `Tender Track 360 Support <${supportFromEmail}>`,
            to: validated.email,
            subject: `We received your request: ${validated.name}`,
            html: `
              <h2>Hello ${validated.name},</h2>
              <p>Thank you for contacting Tender Track 360. We have received your message and will get back to you shortly.</p>
              <p><strong>Your Message:</strong></p>
              <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ccc;">${validated.message}</blockquote>
              <p>Best Regards,<br/>Tender Track 360 Team</p>
            `,
          });
        }
      } catch (userEmailError) {
        console.error(
          'Failed to send user confirmation email:',
          userEmailError
        );
        // Don't block response
      }
    } catch (emailError) {
      console.error('Failed to send support ticket email:', emailError);
      // Don't block the response if email fails
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to create support ticket:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input data' };
    }
    return { success: false, error: 'Failed to submit support request' };
  }
}
