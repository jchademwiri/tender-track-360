import { z } from 'zod';

// Base schema without refinements
const baseTenderExtensionSchema = z.object({
  extensionNumber: z.string().min(1).max(50),
  extensionType: z.enum(['evaluation', 'award', 'both']),
  status: z
    .enum([
      'received',
      'in_progress',
      'completed',
      'sent_to_client',
      'acknowledged',
      'expired',
    ])
    .default('received'),

  // Date validations
  originalDeadline: z.date(),
  currentDeadline: z.date(),
  requestedNewDeadline: z.date(),
  actualNewDeadline: z.date().optional(),

  // Extension period validations
  extensionDays: z.number().int().min(1).max(365), // Max 1 year extension
  cumulativeDays: z.number().int().min(1),

  // Business details
  reason: z.string().min(1),
  clientReference: z.string().max(100).optional(),
  urgencyLevel: z.enum(['normal', 'high', 'critical']).default('normal'),

  // Internal processing
  internalNotes: z.string().optional(),
  processingNotes: z.string().optional(),
  clientResponse: z.string().optional(),

  // Workflow tracking
  receivedAt: z.date(),
  processedAt: z.date().optional(),
  sentAt: z.date().optional(),
  acknowledgedAt: z.date().optional(),
  expiresAt: z.date().optional(),

  // User tracking
  receivedById: z.string().min(1),
  processedById: z.string().optional(),
  sentById: z.string().optional(),
});

// Full validation schema with refinements for creation
export const tenderExtensionSchema = baseTenderExtensionSchema
  .refine(
    (data) => {
      // Validate deadline progression
      return data.requestedNewDeadline > data.currentDeadline;
    },
    {
      message: 'Requested new deadline must be after current deadline',
      path: ['requestedNewDeadline'],
    }
  )
  .refine(
    (data) => {
      // Validate cumulative days
      return data.cumulativeDays >= data.extensionDays;
    },
    {
      message:
        'Cumulative days must be greater than or equal to extension days',
      path: ['cumulativeDays'],
    }
  )
  .refine(
    (data) => {
      // Validate processed after received
      return !data.processedAt || data.processedAt >= data.receivedAt;
    },
    {
      message: 'Processed date must be after received date',
      path: ['processedAt'],
    }
  )
  .refine(
    (data) => {
      // Validate sent after processed
      return (
        !data.sentAt || (data.processedAt && data.sentAt >= data.processedAt)
      );
    },
    {
      message: 'Sent date must be after processed date',
      path: ['sentAt'],
    }
  );

export type TenderExtensionInput = z.infer<typeof tenderExtensionSchema>;

// Partial schema for updates - using base schema then applying partial
export const updateTenderExtensionSchema = baseTenderExtensionSchema
  .partial()
  .omit({
    receivedAt: true,
    receivedById: true,
  })
  .refine(
    (data) => {
      // Only validate deadline progression if both dates are provided
      if (data.requestedNewDeadline && data.currentDeadline) {
        return data.requestedNewDeadline > data.currentDeadline;
      }
      return true;
    },
    {
      message: 'Requested new deadline must be after current deadline',
      path: ['requestedNewDeadline'],
    }
  )
  .refine(
    (data) => {
      // Only validate cumulative days if both values are provided
      if (data.cumulativeDays && data.extensionDays) {
        return data.cumulativeDays >= data.extensionDays;
      }
      return true;
    },
    {
      message:
        'Cumulative days must be greater than or equal to extension days',
      path: ['cumulativeDays'],
    }
  )
  .refine(
    (data) => {
      // Only validate sent after processed if both dates are provided
      if (data.sentAt && data.processedAt) {
        return data.sentAt >= data.processedAt;
      }
      return true;
    },
    {
      message: 'Sent date must be after processed date',
      path: ['sentAt'],
    }
  );

export type UpdateTenderExtensionInput = z.infer<
  typeof updateTenderExtensionSchema
>;
