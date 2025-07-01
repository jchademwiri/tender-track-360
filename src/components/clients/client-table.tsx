'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { ClientForm } from './client-form';
import { toast } from 'sonner';
import { ClientActions } from './ClientActions';
import { Switch } from '@/components/ui/switch';

interface Client {
  id: string;
  name: string;
  type:
    | 'government'
    | 'parastatal'
    | 'private'
    | 'ngo'
    | 'international'
    | 'other';
  contactPerson: string | null;
  contactEmail: string | null;
  contactPhone?: string | null;
  isActive: boolean;
  address?: string | null;
  website?: string | null;
  description?: string | null;
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedById?: string | null;
  createdById?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface ClientTableProps {
  clients: Client[];
}

function toDateOrNull(val: string | Date | null | undefined): Date | null {
  if (!val) return null;
  if (val instanceof Date) return val;
  return new Date(val);
}

export function ClientTable({ clients }: ClientTableProps) {
  const router = useRouter();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  async function handleDelete(client: Client) {
    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete client');

      toast.success('Client deleted');
      router.refresh();
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Contact Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{client.type}</Badge>
                </TableCell>
                <TableCell>{client.contactPerson}</TableCell>
                <TableCell>{client.contactEmail}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={client.isActive ? 'default' : 'destructive'}
                    >
                      {client.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Switch
                      checked={client.isActive}
                      onCheckedChange={async (checked) => {
                        try {
                          await fetch(`/api/clients/${client.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ isActive: checked }),
                          });
                          router.refresh();
                          toast.success(
                            `Client marked as ${
                              checked ? 'Active' : 'Inactive'
                            }`
                          );
                        } catch (error) {
                          toast.error('Failed to update status');
                        }
                      }}
                      aria-label={
                        client.isActive ? 'Set Inactive' : 'Set Active'
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <ClientActions
                    clientId={client.id}
                    clientName={client.name}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>{' '}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingClient}
        onOpenChange={(open) => !open && setEditingClient(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          {editingClient && (
            <ClientForm
              client={{
                ...editingClient,
                contactPhone: editingClient.contactPhone ?? null,
                address: editingClient.address ?? null,
                website: editingClient.website ?? null,
                description: editingClient.description ?? null,
                isDeleted: editingClient.isDeleted ?? false,
                deletedAt: editingClient.deletedAt
                  ? (toDateOrNull(editingClient.deletedAt) as Date)
                  : null,
                deletedById: editingClient.deletedById ?? null,
                createdById: editingClient.createdById ?? null,
                createdAt: editingClient.createdAt
                  ? (toDateOrNull(editingClient.createdAt) as Date)
                  : null,
                updatedAt: editingClient.updatedAt
                  ? (toDateOrNull(editingClient.updatedAt) as Date)
                  : null,
              }}
              onSuccess={() => setEditingClient(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingClient?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingClient && handleDelete(deletingClient)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
