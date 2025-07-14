import { NextResponse } from 'next/server';
import { getTenders, createTender } from '@/db/queries/tenders';
import { insertTenderSchema } from '@/db/schema/zod';
import { DEV_ADMIN_ID } from '@/lib/devUser';
// import { auth } from '@/lib/auth'; // Assuming you have an auth setup

function fixDate(val: any) {
  if (!val) return null; // Return null instead of undefined for consistency
  if (val instanceof Date) return val;
  try {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

function fixNumeric(val: any) {
  if (val === '') return null;
  if (val === null || val === undefined) return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
}

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

    // Handle numeric fields
    const data = {
      ...json,
      estimatedValue: json.estimatedValue,
      actualValue: json.actualValue,
      publicationDate: fixDate(json.publicationDate),
      submissionDeadline: fixDate(json.submissionDeadline),
      evaluationDate: fixDate(json.evaluationDate),
      awardDate: fixDate(json.awardDate),
      deletedAt: fixDate(json.deletedAt),
      // createdAt: fixDate(json.createdAt),
      // updatedAt: fixDate(json.updatedAt),
      // createdById: session.user.id,
      // updatedById: session.user.id,
      createdById: DEV_ADMIN_ID,
      updatedById: DEV_ADMIN_ID,
    };

    try {
      const validatedData = insertTenderSchema.parse(data);
      const newTender = await createTender(validatedData);
      return NextResponse.json(newTender, { status: 201 });
    } catch (validationError: any) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationError.errors || validationError.message,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Failed to create tender:', error);
    const errorMessage = error?.message || 'Failed to create tender';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
