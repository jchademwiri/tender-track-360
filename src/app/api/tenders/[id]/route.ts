import { NextResponse } from 'next/server';
import {
  getTenderById,
  updateTender,
  deleteTender,
} from '@/db/queries/tenders';
import { insertTenderSchema } from '@/db/schema/zod';
// import { auth } from '@/lib/auth'; // Assuming you have an auth setup

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tender = await getTenderById(params.id);
    if (!tender) {
      return NextResponse.json({ error: 'Tender not found' }, { status: 404 });
    }
    return NextResponse.json(tender);
  } catch (error) {
    console.error(`Failed to get tender ${params.id}:`, error);
    return NextResponse.json(
      { error: `Failed to get tender ${params.id}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  // const session = await auth();
  // if (!session?.user?.id) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const json = await request.json();
    const validatedData = insertTenderSchema.partial().parse({
      ...json,
      updatedById: '0514775a-bcea-4021-8feb-74f7d594c2b2', // Placeholder
      // updatedById: session.user.id,
    });

    const updatedTender = await updateTender(id, validatedData);
    return NextResponse.json(updatedTender);
  } catch (error) {
    console.error(`Failed to update tender ${id}:`, error);
    return NextResponse.json(
      { error: `Failed to update tender ${id}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  // const session = await auth();
  // if (!session?.user?.id) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    // await deleteTender(id, session.user.id);
    await deleteTender(id, '0514775a-bcea-4021-8feb-74f7d594c2b2'); // Placeholder
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Failed to delete tender ${id}:`, error);
    return NextResponse.json(
      { error: `Failed to delete tender ${id}` },
      { status: 500 }
    );
  }
}
