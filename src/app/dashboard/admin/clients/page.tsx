import { db } from '@/db';
import { clients } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { ClientTable } from '@/components/clients/client-table';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ClientForm } from '@/components/clients/client-form';

export default async function ClientsPage() {
  const allClients = await db.select().from(clients).orderBy(clients.name);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <ClientForm />
          </DialogContent>
        </Dialog>
      </div>{' '}
      <ClientTable clients={allClients} />
    </div>
  );
}
