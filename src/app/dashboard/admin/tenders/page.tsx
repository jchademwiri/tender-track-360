import { db } from '@/db';
import { tenders } from '@/db/schema';

export default async function TendersPage() {
  const allTenders = await db.select().from(tenders);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tenders</h1>
      <table className="min-w-full border border-gray-200 bg-white dark:bg-black">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Reference #</th>
            <th className="px-4 py-2 border-b">Title</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Submission Deadline</th>
            <th className="px-4 py-2 border-b">Estimated Value</th>
            <th className="px-4 py-2 border-b">Department</th>
          </tr>
        </thead>
        <tbody>
          {allTenders.map((tender) => (
            <tr
              key={tender.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td className="px-4 py-2 border-b">{tender.referenceNumber}</td>
              <td className="px-4 py-2 border-b">{tender.title}</td>
              <td className="px-4 py-2 border-b">{tender.status}</td>
              <td className="px-4 py-2 border-b">
                {tender.submissionDeadline
                  ? new Date(tender.submissionDeadline).toLocaleString()
                  : ''}
              </td>
              <td className="px-4 py-2 border-b">
                {tender.estimatedValue ?? ''}
              </td>
              <td className="px-4 py-2 border-b">{tender.department ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
