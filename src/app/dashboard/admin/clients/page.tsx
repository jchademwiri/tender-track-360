import { Button } from '@/components/ui/button';
import { ClientTable } from '@/components/clients/client-table';
import { PlusCircle } from 'lucide-react';
import { getClients } from '@/db/queries/clients';
import Link from 'next/link';

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
      <ClientTable clients={allClients} />
    </div>
  );
}
