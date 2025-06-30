import { NextResponse } from 'next/server';
import { deleteClient } from '@/db/queries/clients';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteClient(params.id);
    return NextResponse.json({ message: 'Client deleted' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}
