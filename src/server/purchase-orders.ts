'use server';

import { db } from '@/db';
import { purchaseOrder, project, client } from '@/db/schema';
import { eq, and, isNull, ilike, or, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  PurchaseOrderCreateSchema,
  PurchaseOrderUpdateSchema,
  PurchaseOrderStatusUpdateSchema,
  type PurchaseOrderCreateInput,
  type PurchaseOrderUpdateInput,
  type PurchaseOrderStatusUpdateInput,
} from '@/lib/validations/purchase-order';

// Get purchase orders with pagination, search, and project joins
export async function getPurchaseOrders(
  organizationId: string,
  search?: string,
  page: number = 1,
  limit: number = 10,
  projectId?: string,
  status?: string
) {
  try {
    const offset = (page - 1) * limit;

    let whereCondition = and(
      eq(purchaseOrder.organizationId, organizationId),
      isNull(purchaseOrder.deletedAt)
    );

    // Add project filter if provided
    if (projectId) {
      whereCondition = and(whereCondition, eq(purchaseOrder.projectId, projectId));
    }

    // Add search condition if provided
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereCondition = and(
        whereCondition,
        or(
          ilike(purchaseOrder.supplierName, searchTerm),
          ilike(purchaseOrder.description, searchTerm)
        )
      );
    }

    // Add status filter if provided
    if (status && status !== 'all') {
      whereCondition = and(whereCondition, eq(purchaseOrder.status, status));
    }

    const purchaseOrders = await db
      .select({
        id: purchaseOrder.id,
        poNumber: purchaseOrder.poNumber,
        supplierName: purchaseOrder.supplierName,
        description: purchaseOrder.description,
        totalAmount: purchaseOrder.totalAmount,
        status: purchaseOrder.status,
        poDate: purchaseOrder.poDate,
        expectedDeliveryDate: purchaseOrder.expectedDeliveryDate,
        deliveredAt: purchaseOrder.deliveredAt,
        notes: purchaseOrder.notes,
        createdAt: purchaseOrder.createdAt,
        updatedAt: purchaseOrder.updatedAt,
        project: {
          id: project.id,
          projectNumber: project.projectNumber,
          description: project.description,
        },
      })
      .from(purchaseOrder)
      .leftJoin(project, eq(purchaseOrder.projectId, project.id))
      .leftJoin(client, eq(project.clientId, client.id))
      .where(whereCondition)
      .orderBy(desc(purchaseOrder.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: purchaseOrder.id })
      .from(purchaseOrder)
      .where(whereCondition);

    return {
      purchaseOrders,
      totalCount: totalCount.length,
      currentPage: page,
      totalPages: Math.ceil(totalCount.length / limit),
    };
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    throw new Error('Failed to fetch purchase orders');
  }
}

// Generate unique PO number for organization
async function generatePoNumber(organizationId: string): Promise<string> {
  try {
    // Get the latest PO number for this organization
    const lastPO = await db
      .select({ poNumber: purchaseOrder.poNumber })
      .from(purchaseOrder)
      .where(eq(purchaseOrder.organizationId, organizationId))
      .orderBy(desc(purchaseOrder.createdAt))
      .limit(1);

    let nextNumber = 1;
    if (lastPO.length > 0 && lastPO[0].poNumber) {
      // Extract number from PO-XXX format
      const match = lastPO[0].poNumber.match(/PO-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    return `PO-${nextNumber.toString().padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating PO number:', error);
    // Fallback to timestamp-based number
    return `PO-${Date.now().toString().slice(-6)}`;
  }
}

// Create a new purchase order
export async function createPurchaseOrder(
  organizationId: string,
  data: PurchaseOrderCreateInput
) {
  try {
    // Validate input
    const validatedData = PurchaseOrderCreateSchema.parse(data);

    // Verify project exists and belongs to organization
    const projectExists = await db
      .select()
      .from(project)
      .where(
        and(
          eq(project.id, validatedData.projectId),
          eq(project.organizationId, organizationId),
          isNull(project.deletedAt)
        )
      )
      .limit(1);

    if (projectExists.length === 0) {
      return { success: false, error: 'Project not found' };
    }

    // Generate unique PO number
    let poNumber = await generatePoNumber(organizationId);

    // Check if PO number is unique (extra safety check)
    const existingPO = await db
      .select()
      .from(purchaseOrder)
      .where(
        and(
          eq(purchaseOrder.poNumber, poNumber),
          eq(purchaseOrder.organizationId, organizationId)
        )
      )
      .limit(1);

    // Regenerate if collision (very unlikely)
    if (existingPO.length > 0) {
      poNumber = await generatePoNumber(organizationId);
    }

    const newPurchaseOrder = await db
      .insert(purchaseOrder)
      .values({
        id: crypto.randomUUID(),
        organizationId,
        poNumber,
        ...validatedData,
      })
      .returning();

    revalidatePath('/dashboard/projects/purchase-orders');
    revalidatePath(`/dashboard/projects/${validatedData.projectId}`);
    return { success: true, purchaseOrder: newPurchaseOrder[0] };
  } catch (error) {
    console.error('Error creating purchase order:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input data',
        details: error.errors,
      };
    }
    return { success: false, error: 'Failed to create purchase order' };
  }
}

// Get purchase order by ID with project information
export async function getPurchaseOrderById(organizationId: string, poId: string) {
  try {
    const poData = await db
      .select({
        id: purchaseOrder.id,
        poNumber: purchaseOrder.poNumber,
        supplierName: purchaseOrder.supplierName,
        description: purchaseOrder.description,
        totalAmount: purchaseOrder.totalAmount,
        status: purchaseOrder.status,
        poDate: purchaseOrder.poDate,
        expectedDeliveryDate: purchaseOrder.expectedDeliveryDate,
        deliveredAt: purchaseOrder.deliveredAt,
        notes: purchaseOrder.notes,
        createdAt: purchaseOrder.createdAt,
        updatedAt: purchaseOrder.updatedAt,
        project: {
          id: project.id,
          projectNumber: project.projectNumber,
          description: project.description,
        },
      })
      .from(purchaseOrder)
      .leftJoin(project, eq(purchaseOrder.projectId, project.id))
      .leftJoin(client, eq(project.clientId, client.id))
      .where(
        and(
          eq(purchaseOrder.id, poId),
          eq(purchaseOrder.organizationId, organizationId),
          isNull(purchaseOrder.deletedAt)
        )
      )
      .limit(1);

    if (poData.length === 0) {
      return { success: false, error: 'Purchase order not found' };
    }

    return { success: true, purchaseOrder: poData[0] };
  } catch (error) {
    console.error('Error fetching purchase order:', error);
    return { success: false, error: 'Failed to fetch purchase order' };
  }
}

// Update purchase order
export async function updatePurchaseOrder(
  organizationId: string,
  poId: string,
  data: PurchaseOrderUpdateInput
) {
  try {
    // Validate input
    const validatedData = PurchaseOrderUpdateSchema.parse(data);

    // Check if purchase order exists and belongs to organization
    const existingPO = await db
      .select()
      .from(purchaseOrder)
      .where(
        and(
          eq(purchaseOrder.id, poId),
          eq(purchaseOrder.organizationId, organizationId),
          isNull(purchaseOrder.deletedAt)
        )
      )
      .limit(1);

    if (existingPO.length === 0) {
      return { success: false, error: 'Purchase order not found' };
    }

    // If project is being updated, verify it exists and belongs to organization
    if (validatedData.projectId) {
      const projectExists = await db
        .select()
        .from(project)
        .where(
          and(
            eq(project.id, validatedData.projectId),
            eq(project.organizationId, organizationId),
            isNull(project.deletedAt)
          )
        )
        .limit(1);

      if (projectExists.length === 0) {
        return { success: false, error: 'Project not found' };
      }
    }

    const updatedPO = await db
      .update(purchaseOrder)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(purchaseOrder.id, poId))
      .returning();

    revalidatePath('/dashboard/projects/purchase-orders');
    revalidatePath(`/dashboard/projects/purchase-orders/${poId}`);
    if (existingPO[0].projectId) {
      revalidatePath(`/dashboard/projects/${existingPO[0].projectId}`);
    }
    return { success: true, purchaseOrder: updatedPO[0] };
  } catch (error) {
    console.error('Error updating purchase order:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input data',
        details: error.errors,
      };
    }
    return { success: false, error: 'Failed to update purchase order' };
  }
}

// Update purchase order status
export async function updatePurchaseOrderStatus(
  organizationId: string,
  poId: string,
  data: PurchaseOrderStatusUpdateInput
) {
  try {
    // Validate input
    const validatedData = PurchaseOrderStatusUpdateSchema.parse(data);

    // Check if purchase order exists and belongs to organization
    const existingPO = await db
      .select()
      .from(purchaseOrder)
      .where(
        and(
          eq(purchaseOrder.id, poId),
          eq(purchaseOrder.organizationId, organizationId),
          isNull(purchaseOrder.deletedAt)
        )
      )
      .limit(1);

    if (existingPO.length === 0) {
      return { success: false, error: 'Purchase order not found' };
    }

    const updatedPO = await db
      .update(purchaseOrder)
      .set({
        status: validatedData.status,
        // Auto-set deliveredAt when status is delivered
        deliveredAt: validatedData.status === 'delivered' ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(eq(purchaseOrder.id, poId))
      .returning();

    revalidatePath('/dashboard/projects/purchase-orders');
    revalidatePath(`/dashboard/projects/purchase-orders/${poId}`);
    if (existingPO[0].projectId) {
      revalidatePath(`/dashboard/projects/${existingPO[0].projectId}`);
    }
    return { success: true, purchaseOrder: updatedPO[0] };
  } catch (error) {
    console.error('Error updating purchase order status:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input data',
        details: error.errors,
      };
    }
    return { success: false, error: 'Failed to update purchase order status' };
  }
}

// Soft delete purchase order
export async function deletePurchaseOrder(organizationId: string, poId: string) {
  try {
    // Check if purchase order exists and belongs to organization
    const existingPO = await db
      .select()
      .from(purchaseOrder)
      .where(
        and(
          eq(purchaseOrder.id, poId),
          eq(purchaseOrder.organizationId, organizationId),
          isNull(purchaseOrder.deletedAt)
        )
      )
      .limit(1);

    if (existingPO.length === 0) {
      return { success: false, error: 'Purchase order not found' };
    }

    await db
      .update(purchaseOrder)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(purchaseOrder.id, poId));

    revalidatePath('/dashboard/projects/purchase-orders');
    if (existingPO[0].projectId) {
      revalidatePath(`/dashboard/projects/${existingPO[0].projectId}`);
    }
    return { success: true, message: 'Purchase order deleted successfully' };
  } catch (error) {
    console.error('Error deleting purchase order:', error);
    return { success: false, error: 'Failed to delete purchase order' };
  }
}