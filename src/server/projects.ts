'use server';

import { db } from '@/db';
import { project, client, tender } from '@/db/schema';
import { eq, and, isNull, ilike, or, desc, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  ProjectCreateSchema,
  ProjectUpdateSchema,
  ProjectStatusUpdateSchema,
  type ProjectCreateInput,
  type ProjectUpdateInput,
  type ProjectStatusUpdateInput,
} from '@/lib/validations/project';

// Get projects with pagination, search, and client joins
export async function getProjects(
  organizationId: string,
  search?: string,
  page: number = 1,
  limit: number = 10,
  status?: string
) {
  try {
    const offset = (page - 1) * limit;

    let whereCondition = and(
      eq(project.organizationId, organizationId),
      isNull(project.deletedAt)
    );

    // Add search condition if provided
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereCondition = and(
        whereCondition,
        or(
          ilike(project.projectNumber, searchTerm),
          ilike(project.description, searchTerm)
        )
      );
    }

    // Add status filter if provided
    if (status && status !== 'all') {
      whereCondition = and(whereCondition, eq(project.status, status));
    }

    const projects = await db
      .select({
        id: project.id,
        projectNumber: project.projectNumber,
        description: project.description,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        client: {
          id: client.id,
          name: client.name,
          contactName: client.contactName,
          contactEmail: client.contactEmail,
          contactPhone: client.contactPhone,
        },
        tender: {
          id: tender.id,
          tenderNumber: tender.tenderNumber,
          description: tender.description,
        },
      })
      .from(project)
      .leftJoin(client, eq(project.clientId, client.id))
      .leftJoin(tender, eq(project.tenderId, tender.id))
      .where(whereCondition)
      .orderBy(desc(project.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: project.id })
      .from(project)
      .where(whereCondition);

    return {
      projects,
      totalCount: totalCount.length,
      currentPage: page,
      totalPages: Math.ceil(totalCount.length / limit),
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
}

// Create a new project
export async function createProject(
  organizationId: string,
  data: ProjectCreateInput
) {
  try {
    // Validate input
    const validatedData = ProjectCreateSchema.parse(data);

    // Check if project number is unique within organization
    const existingProject = await db
      .select()
      .from(project)
      .where(
        and(
          eq(project.projectNumber, validatedData.projectNumber.toUpperCase()),
          eq(project.organizationId, organizationId),
          isNull(project.deletedAt)
        )
      )
      .limit(1);

    if (existingProject.length > 0) {
      return {
        success: false,
        error: 'Project number already exists in this organization',
      };
    }

    // Verify client exists and belongs to organization if provided
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

    // Verify tender exists and belongs to organization if provided
    if (validatedData.tenderId) {
      const tenderExists = await db
        .select()
        .from(tender)
        .where(
          and(
            eq(tender.id, validatedData.tenderId),
            eq(tender.organizationId, organizationId),
            isNull(tender.deletedAt)
          )
        )
        .limit(1);

      if (tenderExists.length === 0) {
        return { success: false, error: 'Tender not found' };
      }
    }

    const newProject = await db
      .insert(project)
      .values({
        id: crypto.randomUUID(),
        organizationId,
        ...validatedData,
        projectNumber: validatedData.projectNumber.toUpperCase(),
      })
      .returning();

    revalidatePath('/dashboard/projects');
    return { success: true, project: newProject[0] };
  } catch (error) {
    console.error('Error creating project:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input data',
        details: error.errors,
      };
    }
    return { success: false, error: 'Failed to create project' };
  }
}

// Get project by ID with client and tender information
export async function getProjectById(organizationId: string, projectId: string) {
  try {
    const projectData = await db
      .select({
        id: project.id,
        projectNumber: project.projectNumber,
        description: project.description,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        client: {
          id: client.id,
          name: client.name,
          contactName: client.contactName,
          contactEmail: client.contactEmail,
          contactPhone: client.contactPhone,
        },
        tender: {
          id: tender.id,
          tenderNumber: tender.tenderNumber,
          description: tender.description,
          value: tender.value,
          submissionDate: tender.submissionDate,
        },
      })
      .from(project)
      .leftJoin(client, eq(project.clientId, client.id))
      .leftJoin(tender, eq(project.tenderId, tender.id))
      .where(
        and(
          eq(project.id, projectId),
          eq(project.organizationId, organizationId),
          isNull(project.deletedAt)
        )
      )
      .limit(1);

    if (projectData.length === 0) {
      return { success: false, error: 'Project not found' };
    }

    return { success: true, project: projectData[0] };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { success: false, error: 'Failed to fetch project' };
  }
}

// Update project
export async function updateProject(
  organizationId: string,
  projectId: string,
  data: ProjectUpdateInput
) {
  try {
    // Validate input
    const validatedData = ProjectUpdateSchema.parse(data);

    // Check if project exists and belongs to organization
    const existingProject = await db
      .select()
      .from(project)
      .where(
        and(
          eq(project.id, projectId),
          eq(project.organizationId, organizationId),
          isNull(project.deletedAt)
        )
      )
      .limit(1);

    if (existingProject.length === 0) {
      return { success: false, error: 'Project not found' };
    }

    // If project number is being updated, check uniqueness
    if (validatedData.projectNumber) {
      const duplicateProject = await db
        .select()
        .from(project)
        .where(
          and(
            eq(project.projectNumber, validatedData.projectNumber.toUpperCase()),
            eq(project.organizationId, organizationId),
            isNull(project.deletedAt),
            // Exclude current project from uniqueness check
            ne(project.id, projectId)
          )
        )
        .limit(1);

      if (duplicateProject.length > 0) {
        return {
          success: false,
          error: 'Project number already exists in this organization',
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

    // If tender is being updated, verify it exists and belongs to organization
    if (validatedData.tenderId) {
      const tenderExists = await db
        .select()
        .from(tender)
        .where(
          and(
            eq(tender.id, validatedData.tenderId),
            eq(tender.organizationId, organizationId),
            isNull(tender.deletedAt)
          )
        )
        .limit(1);

      if (tenderExists.length === 0) {
        return { success: false, error: 'Tender not found' };
      }
    }

    const updatedProject = await db
      .update(project)
      .set({
        ...validatedData,
        projectNumber: validatedData.projectNumber
          ? validatedData.projectNumber.toUpperCase()
          : undefined,
        updatedAt: new Date(),
      })
      .where(eq(project.id, projectId))
      .returning();

    revalidatePath('/dashboard/projects');
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true, project: updatedProject[0] };
  } catch (error) {
    console.error('Error updating project:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input data',
        details: error.errors,
      };
    }
    return { success: false, error: 'Failed to update project' };
  }
}

// Update project status
export async function updateProjectStatus(
  organizationId: string,
  projectId: string,
  data: ProjectStatusUpdateInput
) {
  try {
    // Validate input
    const validatedData = ProjectStatusUpdateSchema.parse(data);

    // Check if project exists and belongs to organization
    const existingProject = await db
      .select()
      .from(project)
      .where(
        and(
          eq(project.id, projectId),
          eq(project.organizationId, organizationId),
          isNull(project.deletedAt)
        )
      )
      .limit(1);

    if (existingProject.length === 0) {
      return { success: false, error: 'Project not found' };
    }

    const updatedProject = await db
      .update(project)
      .set({
        status: validatedData.status,
        updatedAt: new Date(),
      })
      .where(eq(project.id, projectId))
      .returning();

    revalidatePath('/dashboard/projects');
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true, project: updatedProject[0] };
  } catch (error) {
    console.error('Error updating project status:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input data',
        details: error.errors,
      };
    }
    return { success: false, error: 'Failed to update project status' };
  }
}

// Soft delete project
export async function deleteProject(organizationId: string, projectId: string) {
  try {
    // Check if project exists and belongs to organization
    const existingProject = await db
      .select()
      .from(project)
      .where(
        and(
          eq(project.id, projectId),
          eq(project.organizationId, organizationId),
          isNull(project.deletedAt)
        )
      )
      .limit(1);

    if (existingProject.length === 0) {
      return { success: false, error: 'Project not found' };
    }

    // TODO: Check if project has active purchase orders before deletion
    // This will be implemented when purchase order functionality is added

    await db
      .update(project)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(project.id, projectId));

    revalidatePath('/dashboard/projects');
    return { success: true, message: 'Project deleted successfully' };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: 'Failed to delete project' };
  }
}

// Get project statistics for dashboard
export async function getProjectStats(organizationId: string) {
  try {
    const stats = await db
      .select({
        status: project.status,
      })
      .from(project)
      .where(
        and(eq(project.organizationId, organizationId), isNull(project.deletedAt))
      );

    const totalProjects = stats.length;
    const statusCounts = stats.reduce(
      (acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      success: true,
      stats: {
        totalProjects,
        statusCounts: {
          active: statusCounts.active || 0,
          completed: statusCounts.completed || 0,
          cancelled: statusCounts.cancelled || 0,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return {
      success: false,
      error: 'Failed to fetch project statistics',
      stats: {
        totalProjects: 0,
        statusCounts: {
          active: 0,
          completed: 0,
          cancelled: 0,
        },
      },
    };
  }
}