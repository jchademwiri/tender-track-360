import { db } from '@/db';
import {
  clients,
  tenderCategories,
  tenders as tendersSchema,
} from '@/db/schema';
import { desc, eq, and, isNull, sql } from 'drizzle-orm';
import { insertTenderSchema } from '@/db/schema/zod';

export async function getTenders() {
  const allTenders = await db
    .select({
      id: tendersSchema.id,
      referenceNumber: tendersSchema.referenceNumber,
      title: tendersSchema.title,
      client: clients.name,
      category: tenderCategories.name,
      status: tendersSchema.status,
      submissionDeadline: tendersSchema.submissionDeadline,
      estimatedValue: tendersSchema.estimatedValue,
    })
    .from(tendersSchema)
    .leftJoin(clients, eq(tendersSchema.clientId, clients.id))
    .leftJoin(
      tenderCategories,
      eq(tendersSchema.categoryId, tenderCategories.id)
    )
    .where(eq(tendersSchema.isDeleted, false))
    .orderBy(desc(tendersSchema.createdAt));

  const stats = await db
    .select({
      total: sql<number>`count(*)`.mapWith(Number),
      open: sql<number>`count(*) filter (where status = 'open')`.mapWith(
        Number
      ),
      closed: sql<number>`count(*) filter (where status = 'closed')`.mapWith(
        Number
      ),
      totalValue: sql<number>`sum(estimated_value)`.mapWith(Number),
    })
    .from(tendersSchema)
    .where(eq(tendersSchema.isDeleted, false));

  return { allTenders, stats: stats[0] };
}

export async function getTenderById(id: string) {
  return db.query.tenders.findFirst({
    where: and(eq(tendersSchema.id, id), eq(tendersSchema.isDeleted, false)),
    with: {
      client: true,
      category: true,
      createdByUser: true,
      updatedByUser: true,
    },
  });
}

export async function createTender(data: typeof tendersSchema.$inferInsert) {
  const validatedData = insertTenderSchema.parse(data);
  return db.insert(tendersSchema).values(validatedData).returning();
}

export async function updateTender(
  id: string,
  data: Partial<typeof tendersSchema.$inferInsert>
) {
  const validatedData = insertTenderSchema.partial().parse(data);
  return db
    .update(tendersSchema)
    .set(validatedData)
    .where(eq(tendersSchema.id, id))
    .returning();
}

export async function deleteTender(id: string, userId: string) {
  return db
    .update(tendersSchema)
    .set({
      isDeleted: true,
      deletedAt: new Date(),
      deletedById: userId,
    })
    .where(eq(tendersSchema.id, id))
    .returning();
}
