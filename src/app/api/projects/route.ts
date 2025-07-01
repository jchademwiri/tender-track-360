import { NextRequest, NextResponse } from 'next/server';
import { createProject } from '@/db/queries/projects';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // TODO: Replace with real user id from auth/session
    const userId = '0514775a-bcea-4021-8feb-74f7d594c2b2';
    const project = await createProject({
      ...data,
      createdById: userId,
      updatedById: userId,
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to create project',
      },
      { status: 400 }
    );
  }
}

export function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
