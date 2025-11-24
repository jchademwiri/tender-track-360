/**
 * @jest-environment node
 */
import { db } from '@/db';
import { organization, client } from '@/db/schema';
import { createClient, getClients, getClientById, updateClient, deleteClient } from '@/server/clients';
import { eq } from 'drizzle-orm';

// Mock revalidatePath to avoid Next.js errors in test environment
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Mock console.error to avoid noise and potential Jest issues with ZodError logging
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe('Client CRUD Integration Tests', () => {
  let testOrgId: string;
  const TEST_PREFIX = 'TEST_RUN_' + Date.now();

  beforeAll(async () => {
    // Create a test organization
    testOrgId = `org_${Date.now()}`;
    await db.insert(organization).values({
      id: testOrgId,
      name: `${TEST_PREFIX}_Org`,
      createdAt: new Date(),
    });
  });

  afterAll(async () => {
    // Cleanup: Delete the test organization (cascades to clients)
    if (testOrgId) {
      await db.delete(organization).where(eq(organization.id, testOrgId));
    }
    // Close DB connection
    const { client } = await import('@/db');
    await client.end();
  });

  describe('Create Client', () => {
    it('should create a new client successfully', async () => {
      const clientData = {
        name: `${TEST_PREFIX}_Client`,
        contactName: 'John Doe',
        contactEmail: 'john@example.com',
        contactPhone: '1234567890',
      };

      const result = await createClient(testOrgId, clientData);

      expect(result.success).toBe(true);
      expect(result.client).toBeDefined();
      expect(result.client?.name).toBe(clientData.name);
      expect(result.client?.organizationId).toBe(testOrgId);

      // Verify in DB
      const dbClient = await db.query.client.findFirst({
        where: eq(client.id, result.client!.id),
      });
      expect(dbClient).toBeDefined();
      expect(dbClient?.name).toBe(clientData.name);
    });

    it('should fail validation with invalid email', async () => {
      const clientData = {
        name: `${TEST_PREFIX}_Invalid`,
        contactEmail: 'invalid-email',
      };

      const result = await createClient(testOrgId, clientData as any);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid input data');
    });
  });

  describe('Read Client', () => {
    let clientId: string;

    beforeAll(async () => {
      // Create a client for reading
      const res = await createClient(testOrgId, {
        name: `${TEST_PREFIX}_Read_Client`,
      });
      if (res.client) clientId = res.client.id;
    });

    it('should get client by ID', async () => {
      const result = await getClientById(testOrgId, clientId);
      expect(result.success).toBe(true);
      expect(result.client?.id).toBe(clientId);
    });

    it('should list clients with pagination', async () => {
      const result = await getClients(testOrgId);
      expect(result.clients.length).toBeGreaterThan(0);
      const found = result.clients.find(c => c.id === clientId);
      expect(found).toBeDefined();
    });
  });

  describe('Update Client', () => {
    let clientId: string;

    beforeAll(async () => {
      const res = await createClient(testOrgId, {
        name: `${TEST_PREFIX}_Update_Client`,
      });
      if (res.client) clientId = res.client.id;
    });

    it('should update client details', async () => {
      const updateData = {
        name: `${TEST_PREFIX}_Updated_Name`,
        notes: 'Updated notes',
      };

      const result = await updateClient(testOrgId, clientId, updateData);

      expect(result.success).toBe(true);
      expect(result.client?.name).toBe(updateData.name);
      expect(result.client?.notes).toBe(updateData.notes);

      // Verify in DB
      const dbClient = await db.query.client.findFirst({
        where: eq(client.id, clientId),
      });
      expect(dbClient?.name).toBe(updateData.name);
    });
  });

  describe('Delete Client', () => {
    let clientId: string;

    beforeAll(async () => {
      const res = await createClient(testOrgId, {
        name: `${TEST_PREFIX}_Delete_Client`,
      });
      if (res.client) clientId = res.client.id;
    });

    it('should soft delete client', async () => {
      const result = await deleteClient(testOrgId, clientId);

      expect(result.success).toBe(true);

      // Verify soft delete in DB
      const dbClient = await db.query.client.findFirst({
        where: eq(client.id, clientId),
      });
      expect(dbClient?.deletedAt).not.toBeNull();

      // Verify it doesn't show up in getClients
      const listResult = await getClients(testOrgId);
      const found = listResult.clients.find(c => c.id === clientId);
      expect(found).toBeUndefined();
    });
  });
});
