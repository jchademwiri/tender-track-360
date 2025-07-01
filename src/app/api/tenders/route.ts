import { NextResponse } from 'next/server';
import { getTenders, createTender } from '@/db/queries/tenders';
import { insertTenderSchema } from '@/db/schema/zod';
// import { auth } from '@/lib/auth'; // Assuming you have an auth setup

export async function GET() {
  try {
    const tenders = await getTenders();
    return NextResponse.json(tenders);
  } catch (error) {
    console.error('Failed to get tenders:', error);
    return NextResponse.json(
      { error: 'Failed to get tenders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // const session = await auth();
  // if (!session?.user?.id) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const json = await request.json();
    const validatedData = insertTenderSchema.parse({
      ...json,
      // createdById: session.user.id,
      // updatedById: session.user.id,
      createdById: '0514775a-bcea-4021-8feb-74f7d594c2b2', // Placeholder
      updatedById: '0514775a-bcea-4021-8feb-74f7d594c2b2', // Placeholder
    });

    const newTender = await createTender(validatedData);
    return NextResponse.json(newTender, { status: 201 });
  } catch (error) {
    console.error('Failed to create tender:', error);
    return NextResponse.json(
      { error: 'Failed to create tender' },
      { status: 500 }
    );
  }
}
