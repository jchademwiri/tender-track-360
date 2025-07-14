import { db } from '@/db';
import { users } from '@/db/schema/users';
import { NextResponse } from 'next/server';
import { count } from 'drizzle-orm';

export async function GET() {
  const result = await db.select({ count: count() }).from(users);
  const userCount = Number(result[0]?.count || 0);
  return NextResponse.json({ exists: userCount > 0 });
}
