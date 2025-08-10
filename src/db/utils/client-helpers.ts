import { db } from '../index';
import { clients } from '../schema';
import { eq, and, ilike, or, ne } from 'drizzle-orm';

/**
 * Gets all active clients for an organization
 */
export async function getOrganizationClients(organizationId: string) {
  return await db
    .select()
    .from(clients)
    .where(
      and(
        eq(clients.organizationId, organizationId),
        eq(clients.isActive, true),
        eq(clients.isDeleted, false)
      )
    )
    .orderBy(clients.name);
}

/**
 * Gets a specific client by ID within an organization
 */
export async function getClientById(organizationId: string, clientId: string) {
  const result = await db
    .select()
    .from(clients)
    .where(
      and(
        eq(clients.id, clientId),
        eq(clients.organizationId, organizationId),
        eq(clients.isDeleted, false)
      )
    )
    .limit(1);

  return result[0] || null;
}

/**
 * Searches clients by name or contact information
 */
export async function searchClients(
  organizationId: string,
  searchTerm: string
) {
  const searchPattern = `%${searchTerm}%`;

  return await db
    .select()
    .from(clients)
    .where(
      and(
        eq(clients.organizationId, organizationId),
        eq(clients.isActive, true),
        eq(clients.isDeleted, false),
        or(
          ilike(clients.name, searchPattern),
          ilike(clients.contactPerson, searchPattern),
          ilike(clients.contactEmail, searchPattern)
        )
      )
    )
    .orderBy(clients.name);
}

/**
 * Creates a new client for an organization
 */
export async function createClient(
  organizationId: string,
  createdById: string,
  clientData: {
    name: string;
    type:
      | 'government'
      | 'parastatal'
      | 'private'
      | 'ngo'
      | 'international'
      | 'other';
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    website?: string;
    description?: string;
  }
) {
  return await db
    .insert(clients)
    .values({
      organizationId,
      createdById,
      ...clientData,
      isActive: true,
      isDeleted: false,
    })
    .returning();
}

/**
 * Updates a client
 */
export async function updateClient(
  organizationId: string,
  clientId: string,
  updates: Partial<{
    name: string;
    type:
      | 'government'
      | 'parastatal'
      | 'private'
      | 'ngo'
      | 'international'
      | 'other';
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    website: string;
    description: string;
    isActive: boolean;
  }>
) {
  return await db
    .update(clients)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(clients.id, clientId),
        eq(clients.organizationId, organizationId),
        eq(clients.isDeleted, false)
      )
    )
    .returning();
}

/**
 * Soft deletes a client
 */
export async function deleteClient(
  organizationId: string,
  clientId: string,
  deletedById: string
) {
  return await db
    .update(clients)
    .set({
      isDeleted: true,
      deletedAt: new Date(),
      deletedById,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(clients.id, clientId),
        eq(clients.organizationId, organizationId),
        eq(clients.isDeleted, false)
      )
    )
    .returning();
}

/**
 * Checks if a client name already exists in the organization
 */
export async function clientNameExists(
  organizationId: string,
  name: string,
  excludeId?: string
) {
  let query = db
    .select({ id: clients.id })
    .from(clients)
    .where(
      and(
        eq(clients.organizationId, organizationId),
        eq(clients.name, name),
        eq(clients.isDeleted, false)
      )
    );

  if (excludeId) {
    query = query.where(ne(clients.id, excludeId));
  }

  const existing = await query.limit(1);
  return existing.length > 0;
}
