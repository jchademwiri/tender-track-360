import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { count } from 'drizzle-orm';

export async function POST(req: Request) {
  const { email, password, fullName, department } = await req.json();

  // Only allow if no users exist
  const result = await db.select({ count: count() }).from(users);
  const userCount = Number(result[0]?.count || 0);
  if (userCount > 0) {
    return NextResponse.json(
      { error: 'Admin already exists' },
      { status: 403 }
    );
  }

  // Create user in Supabase Auth
  const { data: authUser, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError || !authUser?.user?.id) {
    return NextResponse.json(
      { error: authError?.message || 'Failed to create user' },
      { status: 400 }
    );
  }

  // Insert into your users table
  try {
    await db.insert(users).values({
      id: authUser.user.id, // Use Supabase Auth UUID as PK
      email,
      fullName,
      role: 'admin',
      department,
      isActive: true,
    });
    return NextResponse.json({ success: true });
  } catch (dbError) {
    // Optionally: Rollback Auth user if DB insert fails
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    return NextResponse.json(
      { error: 'Failed to save user profile' },
      { status: 500 }
    );
  }
}
