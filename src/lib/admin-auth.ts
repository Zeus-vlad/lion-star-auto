import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Shared admin authorization guard for admin API routes.
 * Returns a 401/403 NextResponse when unauthorized, or null when allowed.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const isAdmin = (session.user as { isAdmin?: boolean })?.isAdmin;
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrator privileges required' }, { status: 403 });
  }

  return null;
}
