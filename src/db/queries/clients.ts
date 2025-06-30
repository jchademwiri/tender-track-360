import { db } from '@/db';
import { clients, tenders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { insertClientSchema } from '@/db/schema/zod';

export async function getClients() {
  const allClients = await db
    .select({
      id: clients.id,
      name: clients.name,
      type: clients.type,
      contactPerson: clients.contactPerson,
      contactEmail: clients.contactEmail,
      contactPhone: clients.contactPhone,
      isActive: clients.isActive,
    })
    .from(clients)
    .orderBy(clients.name);
  return allClients;
}

export async function getClientById(id: string) {
  return db.query.clients.findFirst({
    where: eq(clients.id, id),
  });
}

export async function createClient(data: typeof clients.$inferInsert) {
  const validatedData = insertClientSchema.parse(data);
  return db.insert(clients).values(validatedData).returning();
}

export async function updateClient(
  id: string,
  data: Partial<typeof clients.$inferInsert>
) {
  const validatedData = insertClientSchema.partial().parse(data);
  return db
    .update(clients)
    .set(validatedData)
    .where(eq(clients.id, id))
    .returning();
}

export async function deleteClient(id: string) {
  const tendersWithClient = await db
    .select({ id: tenders.id })
    .from(tenders)
    .where(eq(tenders.clientId, id))
    .limit(1);

  if (tendersWithClient.length > 0) {
    throw new Error(
      'This client cannot be deleted as they are assigned to one or more tenders.'
    );
  }

  return db.delete(clients).where(eq(clients.id, id)).returning();
}
