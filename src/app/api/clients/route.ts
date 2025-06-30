import { NextResponse } from 'next/server';
import { createClient, updateClient } from '@/db/queries/clients';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await createClient(data);
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

    await updateClient(id, updateData);

    return NextResponse.json({ message: 'Client updated' });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}
