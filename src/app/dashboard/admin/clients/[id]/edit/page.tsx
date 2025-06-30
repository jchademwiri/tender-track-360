import { ClientForm } from '@/components/clients/client-form';
import { getClientById } from '@/db/queries/clients';
import { ChevronsLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface EditClientPageProps {
  params: {
    id: string;
  };
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const client = await getClientById(params.id);

  if (!client) {
    notFound();
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        href="/dashboard/admin/clients"
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
      >
        <ChevronsLeft className="w-4 h-4" />
        Back to Clients
      </Link>
      <h1 className="text-3xl font-bold text-foreground mb-1">Edit Client</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Update the details for the &quot;{client.name}&quot; client.
      </p>
      <div className="p-8 border rounded-lg">
        <ClientForm client={client} />
      </div>
    </div>
  );
}
