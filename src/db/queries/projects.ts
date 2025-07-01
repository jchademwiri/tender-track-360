import { db } from '@/db';
import { tenders, clients } from '@/db/schema';
import { tenderCategories } from '@/db/schema/categories';
import { eq } from 'drizzle-orm';

export async function getProjects() {
  const projectsData = await db
    .select({
      id: tenders.id,
      referenceNumber: tenders.referenceNumber,
      title: tenders.title,
      awardDate: tenders.awardDate,
      estimatedValue: tenders.estimatedValue,
      clientName: clients.name,
      description: tenders.description,
      status: tenders.status,
      category: tenderCategories.name,
      department: tenders.department,
      notes: tenders.notes,
    })
    .from(tenders)
    .leftJoin(clients, eq(tenders.clientId, clients.id))
    .leftJoin(tenderCategories, eq(tenders.categoryId, tenderCategories.id))
    .where(eq(tenders.status, 'awarded'));

  const projects = projectsData.map((project) => ({
    ...project,
    awardDate: project.awardDate ? new Date(project.awardDate) : null,
    estimatedValue: project.estimatedValue
      ? Number(project.estimatedValue)
      : null,
  }));

  const totalValue = projects.reduce(
    (sum, project) => sum + (project.estimatedValue || 0),
    0
  );

  const uniqueClients = new Set(
    projects.map((p) => p.clientName).filter(Boolean)
  ).size;

  const stats = {
    totalProjects: projects.length,
    totalValue,
    uniqueClients,
  };

  return { projects, stats };
}
