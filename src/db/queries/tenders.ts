import { db } from '@/db';
import { tenders } from '@/db/schema/tenders';
import { tenderStatusEnum } from '../schema/enums';

export async function getTenders() {
  const allTendersRaw = await db
    .select({
      id: tenders.id,
      referenceNumber: tenders.referenceNumber,
      title: tenders.title,
      status: tenders.status,
      submissionDeadline: tenders.submissionDeadline,
      estimatedValue: tenders.estimatedValue,
      department: tenders.department,
    })
    .from(tenders);

  const allTenders = allTendersRaw.map((t) => ({
    ...t,
    estimatedValue:
      typeof t.estimatedValue === 'string'
        ? parseFloat(t.estimatedValue)
        : t.estimatedValue,
  }));

  const stats = {
    total: allTenders.length,
    open: allTenders.filter((t) => t.status === tenderStatusEnum.enumValues[0])
      .length,
    closed: allTenders.filter(
      (t) => t.status === tenderStatusEnum.enumValues[1]
    ).length,
    totalValue: allTenders.reduce(
      (sum, t) =>
        sum + (typeof t.estimatedValue === 'number' ? t.estimatedValue : 0),
      0
    ),
  };

  return { allTenders, stats };
}
