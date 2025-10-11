import { z } from 'zod';

export const PurchaseOrderCreateSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  supplierName: z.string().min(1, 'Supplier name is required'),
  description: z.string().min(1, 'Description is required'),
  totalAmount: z.string().min(1, 'Total amount is required'),
  status: z.enum(['draft', 'sent', 'delivered']),
  expectedDeliveryDate: z.date().optional(),
  deliveredAt: z.date().optional(),
  notes: z.string().optional(),
});

export const PurchaseOrderUpdateSchema = PurchaseOrderCreateSchema.partial().extend({
  projectId: z.string().min(1, 'Project is required').optional(),
});

export const PurchaseOrderStatusUpdateSchema = z.object({
  status: z.enum(['draft', 'sent', 'delivered']),
});

export type PurchaseOrderCreateInput = z.infer<typeof PurchaseOrderCreateSchema>;
export type PurchaseOrderUpdateInput = z.infer<typeof PurchaseOrderUpdateSchema>;
export type PurchaseOrderStatusUpdateInput = z.infer<typeof PurchaseOrderStatusUpdateSchema>;