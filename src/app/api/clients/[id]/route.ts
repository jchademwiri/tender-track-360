import { NextResponse } from 'next/server';
import {
  getClientById,
  updateClient,
  deleteClient,
} from '@/db/queries/clients';
import { insertClientSchema } from '@/db/schema/zod';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await getClientById(params.id);
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    return NextResponse.json(client);
  } catch (error) {
    console.error(`Failed to get client ${params.id}:`, error);
    return NextResponse.json(
      { error: `Failed to get client ${params.id}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json();
    const validatedData = insertClientSchema.partial().parse(json);
    const updatedClient = await updateClient(params.id, validatedData);
    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error(`Failed to update client ${params.id}:`, error);
    return NextResponse.json(
      { error: `Failed to update client ${params.id}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteClient(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Failed to delete client ${params.id}:`, error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 409 }); // 409 Conflict
    }
    return NextResponse.json(
      { error: `Failed to delete client ${params.id}` },
      { status: 500 }
    );
  }
}
