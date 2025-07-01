import { db } from '@/db';
import { tenders, clients } from '@/db/schema';
import { tenderCategories } from '@/db/schema/categories';
import { projects } from '@/db/schema/projects';
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

export async function createProject(data: {
  tenderId?: string;
  referenceNumber?: string;
  title?: string;
  description?: string;
  clientId?: string;
  categoryId?: string;
  status?: string;
  awardDate?: string;
  estimatedValue?: number;
  department?: string;
  notes?: string;
  createdById: string;
  updatedById: string;
}) {
  let projectData = { ...data };

  if (data.tenderId) {
    // Fetch the tender
    const [tender] = await db
      .select()
      .from(tenders)
      .where(eq(tenders.id, data.tenderId));
    if (!tender) throw new Error('Tender not found');

    // Update the tender status to 'awarded'
    await db
      .update(tenders)
      .set({ status: 'awarded' })
      .where(eq(tenders.id, data.tenderId));

    // Pre-fill project fields from tender if not provided
    projectData = {
      ...projectData,
      referenceNumber: data.referenceNumber || tender.referenceNumber,
      title: data.title || tender.title,
      description: data.description || tender.description,
      clientId: data.clientId || tender.clientId,
      categoryId: data.categoryId || tender.categoryId,
      status: data.status || 'active',
      awardDate: data.awardDate || tender.awardDate,
      estimatedValue: data.estimatedValue || tender.estimatedValue,
      department: data.department || tender.department,
      notes: data.notes || tender.notes,
      tenderId: data.tenderId,
    };
  }

  // Insert the new project
  const [project] = await db.insert(projects).values(projectData).returning();
  return project;
}
