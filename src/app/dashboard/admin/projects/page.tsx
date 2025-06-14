import { db } from '@/db';
import { tenders, clients } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function ProjectsPage() {
  // Fetch all awarded tenders (projects) and join with clients for client name
  const projects = await db
    .select({
      id: tenders.id,
      referenceNumber: tenders.referenceNumber,
      title: tenders.title,
      awardDate: tenders.awardDate,
      estimatedValue: tenders.estimatedValue,
      clientName: clients.name,
    })
    .from(tenders)
    .leftJoin(clients, eq(tenders.clientId, clients.id))
    .where(eq(tenders.status, 'awarded'));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      <table className="min-w-full border border-gray-200 bg-white dark:bg-black">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Reference #</th>
            <th className="px-4 py-2 border-b">Title</th>
            <th className="px-4 py-2 border-b">Client</th>
            <th className="px-4 py-2 border-b">Award Date</th>
            <th className="px-4 py-2 border-b">Estimated Value</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
              >
                No active projects.
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="px-4 py-2 border-b">
                  {project.referenceNumber}
                </td>
                <td className="px-4 py-2 border-b">{project.title}</td>
                <td className="px-4 py-2 border-b">
                  {project.clientName ?? ''}
                </td>
                <td className="px-4 py-2 border-b">
                  {project.awardDate
                    ? new Date(project.awardDate).toLocaleDateString()
                    : ''}
                </td>
                <td className="px-4 py-2 border-b">
                  {project.estimatedValue ?? ''}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
