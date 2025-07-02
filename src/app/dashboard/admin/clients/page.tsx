import { Button } from '@/components/ui/button';
import { ClientTable } from '@/components/clients/client-table';
import { PlusCircle } from 'lucide-react';
import { getClients } from '@/db/queries/clients';
import Link from 'next/link';
import EmptyState from '@/components/ui/EmptyState';

export default async function ClientsPage() {
  const allClients = await getClients();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button asChild>
          <Link href="/dashboard/admin/clients/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Client
          </Link>
        </Button>
      </div>
      <div className="mt-6">
        {allClients.length === 0 ? (
          <EmptyState
            icon={<PlusCircle className="w-12 h-12 text-blue-400" />}
            title="No clients found"
            description="There are currently no clients to display. Start by adding a new client."
            action={
              <Link href="/dashboard/admin/clients/new">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold mt-4">
                  Add Client
                </Button>
              </Link>
            }
          />
        ) : (
          <ClientTable clients={allClients} />
        )}
      </div>
    </div>
  );
}
