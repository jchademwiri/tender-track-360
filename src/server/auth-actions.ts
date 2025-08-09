'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password || !name) {
    throw new Error('Missing required fields');
  }

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: await headers(),
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    // Redirect to verification page or dashboard
    redirect('/verify-email');
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    // Redirect to dashboard
    redirect('/dashboard');
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    redirect('/');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function createOrganizationAction(formData: FormData) {
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;

  if (!name) {
    throw new Error('Organization name is required');
  }

  try {
    const result = await auth.api.createOrganization({
      body: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      },
      headers: await headers(),
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data;
  } catch (error) {
    console.error('Create organization error:', error);
    throw error;
  }
}

export async function inviteMemberAction(formData: FormData) {
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;

  if (!email || !role) {
    throw new Error('Email and role are required');
  }

  try {
    const result = await auth.api.inviteUser({
      body: {
        email,
        role,
      },
      headers: await headers(),
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data;
  } catch (error) {
    console.error('Invite member error:', error);
    throw error;
  }
}

export async function getCurrentSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}
