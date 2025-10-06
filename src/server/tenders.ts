'use server';

import { db } from '@/db';
import { tender, client } from '@/db/schema';
import { eq, and, isNull, ilike, or, desc, gte, lte } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  TenderCreateSchema,
  TenderUpdateSchema,
  TenderStatusUpdateSchema,
  TenderSearchSchema,
  type TenderCreateInput,
  type TenderUpdateInput,
  type TenderStatusUpdateInput,
  type TenderSearchInput,
} from '@/lib/validations/tender';

// Get tenders with pagination, search, and client joins
export async function getTenders(
  organizationId: string,
  search?: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const offset = (page - 1) * limit;

    let whereCondition = and(
      eq(tender.organizationId, organizationId),
      isNull(tender.deletedAt)
    );

    // Add search condition if provided
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereCondition = and(
        whereCondition,
        or(
          ilike(tender.tenderNumber, searchTerm),
          ilike(tender.description, searchTerm)
        )
      );
    }

    const tenders = await db
      .select({
        id: tender.id,
        tenderNumber: tender.tenderNumber,
        description: tender.description,
        submissionDate: tender.submissionDate,
        value: tender.value,
        status: tender.status,
        createdAt: tender.createdAt,
        updatedAt: tender.updatedAt,
        client: {
          id: client.id,
          name: client.name,
          contactName: client.contactName,
          contactEmail: client.contactEmail,
          contactPhone: client.contactPhone,
        },
      })
      .from(tender)
      .leftJoin(client, eq(tender.clientId, client.id))
      .where(whereCondition)
      .orderBy(desc(tender.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: tender.id })
      .from(tender)
      .where(whereCondition);

    return {
      tenders,
      totalCount: totalCount.length,
      currentPage: page,
      totalPages: Math.ceil(totalCount.length / limit),
    };
  } catch (error) {
    console.error('Error fetching tenders:', error);
    throw new Error('Failed to fetch tenders');
  }
}

// Create a new tender with tender number validation
export async function createTender(
  organizationId: string,
  data: TenderCreateInput
) {
  try {
    // Validate input
    const validatedData = TenderCreateSchema.parse(data);

    // Check if tender number is unique within organization
    const existingTender = await db
      .select()
      .from(tender)
      .where(
        and(
          eq(tender.tenderNumber, validatedData.tenderNumber),
          eq(tender.organizationId, organizationId),
          isNull(tender.deletedAt)
        )
      )
      .limit(1);

    if (existingTender.length > 0) {
      return {
        success: false,
        error: 'Tender number already exists in this organization',
      };
    }

    // Verify client exists and belongs to organization
    const clientExists = await db
      .select()
      .from(client)
      .where(
        and(
          eq(client.id, validatedData.clientId),
          eq(client.organizationId, organizationId),
          isNull(client.deletedAt)
        )
      )
      .limit(1);

    if (clientExists.length === 0) {
      return { success: false, error: 'Client not found' };
    }

    const newTender = await db
      .insert(tender)
      .values({
        id: crypto.randomUUID(),
        organizationId,
        ...validatedData,
      })
      .returning();

    revalidatePath('/dashboard/tenders');
    return { success: true, tender: newTender[0] };
  } catch (error) {
    console.error('Error creating tender:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input data',
        details: error.errors,
      };
    }
    return { success: false, error: 'Failed to create tender' };
  }
}

// Get tender by ID with client information
export async function getTenderById(organizationId: string, tenderId: string) {
  try {
    const tenderData = await db
      .select({
        id: tender.id,
        tenderNumber: tender.tenderNumber,
        description: tender.description,
        submissionDate: tender.submissionDate,
        value: tender.value,
        status: tender.status,
        createdAt: tender.createdAt,
        updatedAt: tender.updatedAt,
        client: {
          id: client.id,
          name: client.name,
          contactName: client.contactName,
          contactEmail: client.contactEmail,
          contactPhone: client.contactPhone,
        },
      })
      .from(tender)
      .leftJoin(client, eq(tender.clientId, client.id))
      .where(
        and(
          eq(tender.id, tenderId),
          eq(tender.organizationId, organizationId),
          isNull(tender.deletedAt)
        )
      )
      .limit(1);

    if (tenderData.length === 0) {
      return { success: false, error: 'Tender not found' };
    }

    return { success: true, tender: tenderData[0] };
  } catch (error) {
    console.error('Error fetching tender:', error);
    return { success: false, error: 'Failed to fetch tender' };
  }
}

// Update tender
export async function updateTender(
  organizationId: string,
  tenderId: string,
  data: TenderUpdateInput
) {
  try {
    // Validate input
    const validatedData = TenderUpdateSchema.parse(data);

    // Check if tender exists and belongs to organization
    const existingTender = await db
      .select()
      .from(tender)
      .where(
        and(
          eq(tender.id, tenderId),
          eq(tender.organizationId, organizationId),
          isNull(tender.deletedAt)
        )
      )
      .limit(1);

    if (existingTender.length === 0) {
      return { success: false, error: 'Tender not found' };
    }

    // If tender number is being updated, check uniqueness
    if (validatedData.tenderNumber) {
      const duplicateTender = await db
        .select()
        .from(tender)
        .where(
          and(
            eq(tender.tenderNumber, validatedData.tenderNumber),
            eq(tender.organizationId, organizationId),
            isNull(tender.deletedAt),
            // Exclude current tender from uniqueness check
            eq(tender.id, tenderId)
          )
        )
        .limit(1);

      if (duplicateTender.length > 0) {
        return {
          success: false,
          error: 'Tender number already exists in this organization',
        };
      }
    }

    // If client is being updated, verify it exists and belongs to organization
    if (validatedData.clientId) {
      const clientExists = await db
        .select()
        .from(client)
        .where(
          and(
            eq(client.id, validatedData.clientId),
            eq(client.organizationId, organizationId),
            isNull(client.deletedAt)
          )
        )
        .limit(1);

      if (clientExists.length === 0) {
        return { success: false, error: 'Client not found' };
      }
    }

    const updatedTender = await db
      .update(tender)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(tender.id, tenderId))
      .returning();

    revalidatePath('/dashboard/tenders');
    revalidatePath(`/dashboard/tenders/${tenderId}`);
    return { success: true, tender: updatedTender[0] };
  } catch (error) {
    console.error('Error updating tender:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input data',
        details: error.errors,
      };
    }
    return { success: false, error: 'Failed to update tender' };
  }
}

// Update tender status
export async function updateTenderStatus(
  organizationId: string,
  tenderId: string,
  data: TenderStatusUpdateInput
) {
  try {
    // Validate input
    const validatedData = TenderStatusUpdateSchema.parse(data);

    // Check if tender exists and belongs to organization
    const existingTender = await db
      .select()
      .from(tender)
      .where(
        and(
          eq(tender.id, tenderId),
          eq(tender.organizationId, organizationId),
          isNull(tender.deletedAt)
        )
      )
      .limit(1);

    if (existingTender.length === 0) {
      return { success: false, error: 'Tender not found' };
    }

    const updatedTender = await db
      .update(tender)
      .set({
        status: validatedData.status,
        updatedAt: new Date(),
      })
      .where(eq(tender.id, tenderId))
      .returning();

    revalidatePath('/dashboard/tenders');
    revalidatePath(`/dashboard/tenders/${tenderId}`);
    return { success: true, tender: updatedTender[0] };
  } catch (error) {
    console.error('Error updating tender status:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input data',
        details: error.errors,
      };
    }
    return { success: false, error: 'Failed to update tender status' };
  }
}

// Soft delete tender
export async function deleteTender(organizationId: string, tenderId: string) {
  try {
    // Check if tender exists and belongs to organization
    const existingTender = await db
      .select()
      .from(tender)
      .where(
        and(
          eq(tender.id, tenderId),
          eq(tender.organizationId, organizationId),
          isNull(tender.deletedAt)
        )
      )
      .limit(1);

    if (existingTender.length === 0) {
      return { success: false, error: 'Tender not found' };
    }

    // TODO: Check if tender has active projects or follow-ups before deletion
    // This will be implemented when project and follow-up functionality is added

    await db
      .update(tender)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(tender.id, tenderId));

    revalidatePath('/dashboard/tenders');
    return { success: true, message: 'Tender deleted successfully' };
  } catch (error) {
    console.error('Error deleting tender:', error);
    return { success: false, error: 'Failed to delete tender' };
  }
}

// Search tenders with advanced filtering
export async function searchTenders(
  organizationId: string,
  searchParams: TenderSearchInput,
  page: number = 1,
  limit: number = 10
) {
  try {
    const offset = (page - 1) * limit;
    const validatedParams = TenderSearchSchema.parse(searchParams);

    let whereCondition = and(
      eq(tender.organizationId, organizationId),
      isNull(tender.deletedAt)
    );

    // Add search query condition
    if (validatedParams.query && validatedParams.query.trim()) {
      const searchTerm = `%${validatedParams.query.trim()}%`;
      whereCondition = and(
        whereCondition,
        or(
          ilike(tender.tenderNumber, searchTerm),
          ilike(tender.description, searchTerm)
        )
      );
    }

    // Add status filter
    if (validatedParams.status) {
      whereCondition = and(
        whereCondition,
        eq(tender.status, validatedParams.status)
      );
    }

    // Add client filter
    if (validatedParams.clientId) {
      whereCondition = and(
        whereCondition,
        eq(tender.clientId, validatedParams.clientId)
      );
    }

    // Add date range filters
    if (validatedParams.dateFrom) {
      whereCondition = and(
        whereCondition,
        gte(tender.submissionDate, validatedParams.dateFrom)
      );
    }

    if (validatedParams.dateTo) {
      whereCondition = and(
        whereCondition,
        lte(tender.submissionDate, validatedParams.dateTo)
      );
    }

    const tenders = await db
      .select({
        id: tender.id,
        tenderNumber: tender.tenderNumber,
        description: tender.description,
        submissionDate: tender.submissionDate,
        value: tender.value,
        status: tender.status,
        createdAt: tender.createdAt,
        updatedAt: tender.updatedAt,
        client: {
          id: client.id,
          name: client.name,
          contactName: client.contactName,
          contactEmail: client.contactEmail,
          contactPhone: client.contactPhone,
        },
      })
      .from(tender)
      .leftJoin(client, eq(tender.clientId, client.id))
      .where(whereCondition)
      .orderBy(desc(tender.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCount = await db
      .select({ count: tender.id })
      .from(tender)
      .where(whereCondition);

    return {
      success: true,
      tenders,
      totalCount: totalCount.length,
      currentPage: page,
      totalPages: Math.ceil(totalCount.length / limit),
    };
  } catch (error) {
    console.error('Error searching tenders:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid search parameters',
        details: error.errors,
        tenders: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
      };
    }
    return {
      success: false,
      error: 'Failed to search tenders',
      tenders: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
    };
  }
}

// Get tenders with sorting options
export async function getTendersWithSorting(
  organizationId: string,
  sortBy:
    | 'tenderNumber'
    | 'createdAt'
    | 'submissionDate'
    | 'status' = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
  page: number = 1,
  limit: number = 10
) {
  try {
    const offset = (page - 1) * limit;

    const whereCondition = and(
      eq(tender.organizationId, organizationId),
      isNull(tender.deletedAt)
    );

    // Determine sort column
    let sortColumn;
    switch (sortBy) {
      case 'tenderNumber':
        sortColumn = tender.tenderNumber;
        break;
      case 'submissionDate':
        sortColumn = tender.submissionDate;
        break;
      case 'status':
        sortColumn = tender.status;
        break;
      default:
        sortColumn = tender.createdAt;
    }

    const tenders = await db
      .select({
        id: tender.id,
        tenderNumber: tender.tenderNumber,
        description: tender.description,
        submissionDate: tender.submissionDate,
        value: tender.value,
        status: tender.status,
        createdAt: tender.createdAt,
        updatedAt: tender.updatedAt,
        client: {
          id: client.id,
          name: client.name,
          contactName: client.contactName,
          contactEmail: client.contactEmail,
          contactPhone: client.contactPhone,
        },
      })
      .from(tender)
      .leftJoin(client, eq(tender.clientId, client.id))
      .where(whereCondition)
      .orderBy(sortOrder === 'desc' ? desc(sortColumn) : sortColumn)
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCount = await db
      .select({ count: tender.id })
      .from(tender)
      .where(whereCondition);

    return {
      success: true,
      tenders,
      totalCount: totalCount.length,
      currentPage: page,
      totalPages: Math.ceil(totalCount.length / limit),
    };
  } catch (error) {
    console.error('Error fetching tenders with sorting:', error);
    return {
      success: false,
      error: 'Failed to fetch tenders',
      tenders: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
    };
  }
}

// Get tender statistics for dashboard
export async function getTenderStats(organizationId: string) {
  try {
    const stats = await db
      .select({
        status: tender.status,
        value: tender.value,
      })
      .from(tender)
      .where(
        and(eq(tender.organizationId, organizationId), isNull(tender.deletedAt))
      );

    const totalTenders = stats.length;
    const statusCounts = stats.reduce(
      (acc, tender) => {
        acc[tender.status] = (acc[tender.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Calculate total value (only for tenders with numeric values)
    const totalValue = stats.reduce((sum, tender) => {
      const value = parseFloat(tender.value || '0');
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    return {
      success: true,
      stats: {
        totalTenders,
        statusCounts: {
          draft: statusCounts.draft || 0,
          submitted: statusCounts.submitted || 0,
          won: statusCounts.won || 0,
          lost: statusCounts.lost || 0,
          pending: statusCounts.pending || 0,
        },
        totalValue,
      },
    };
  } catch (error) {
    console.error('Error fetching tender stats:', error);
    return {
      success: false,
      error: 'Failed to fetch tender statistics',
      stats: {
        totalTenders: 0,
        statusCounts: {
          draft: 0,
          submitted: 0,
          won: 0,
          lost: 0,
          pending: 0,
        },
        totalValue: 0,
      },
    };
  }
}
