import { db } from '@/db';
import { clients } from '@/db/schema';

export default async function ClientsPage() {
  const allClients = await db.select().from(clients);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Clients</h1>
      <table className="min-w-full border border-gray-200 bg-white dark:bg-black">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Type</th>
            <th className="px-4 py-2 border-b">Contact Person</th>
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Phone</th>
            <th className="px-4 py-2 border-b">Active</th>
          </tr>
        </thead>
        <tbody>
          {allClients.map((client) => (
            <tr
              key={client.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td className="px-4 py-2 border-b">{client.name}</td>
              <td className="px-4 py-2 border-b">{client.type}</td>
              <td className="px-4 py-2 border-b">{client.contactPerson}</td>
              <td className="px-4 py-2 border-b">{client.contactEmail}</td>
              <td className="px-4 py-2 border-b">{client.contactPhone}</td>
              <td className="px-4 py-2 border-b">
                {client.isActive ? 'Yes' : 'No'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
