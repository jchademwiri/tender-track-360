import { NextResponse } from 'next/server';
import { db } from '@/db';
import { clients } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await db.insert(clients).values(data);
    return NextResponse.json({ message: 'Client created' });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;

    await db.update(clients).set(updateData).where(eq(clients.id, id));

    return NextResponse.json({ message: 'Client updated' });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}
