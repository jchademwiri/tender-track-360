import { NextResponse } from 'next/server';
import { db } from '@/db';
import { clients } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete(clients).where(eq(clients.id, params.id));
    return NextResponse.json({ message: 'Client deleted' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}
