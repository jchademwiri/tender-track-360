import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { db } from '@/db';
import { users } from '@/db/schema/users';
// You need to implement this helper based on your auth/session logic
import { getCurrentUserWithRole } from '@/auth/getCurrentUserWithRole';

export async function POST(req: Request) {
  const { email, password, fullName, role, department } = await req.json();

  // 1. Check current user's role
  const currentUser = await getCurrentUserWithRole(req);
  if (!currentUser || !['admin', 'tender_manager'].includes(currentUser.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // 2. Create user in Supabase Auth
  const { data: authUser, error: authError } =
    await supabase.auth.admin.createUser({
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

  // 3. Insert into your users table
  try {
    await db.insert(users).values({
      id: authUser.user.id, // Use Supabase Auth UUID as PK
      email,
      fullName,
      role,
      department,
      isActive: true,
    });
    return NextResponse.json({ success: true });
  } catch (dbError) {
    // Optionally: Rollback Auth user if DB insert fails
    await supabase.auth.admin.deleteUser(authUser.user.id);
    return NextResponse.json(
      { error: 'Failed to save user profile' },
      { status: 500 }
    );
  }
}
