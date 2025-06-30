import { db } from '@/db';
import { clients } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ClientInsert } from '@/types/client';

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

export async function createClient(data: ClientInsert) {
  return db.insert(clients).values(data);
}

export async function updateClient(id: string, data: Partial<ClientInsert>) {
  return db.update(clients).set(data).where(eq(clients.id, id));
}

export async function deleteClient(id: string) {
  return db.delete(clients).where(eq(clients.id, id));
}
