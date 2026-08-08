import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Shared admin authorization guard for admin API routes.
 * Returns the session if the user is an authenticated admin,
 * or a 401 response if not.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    };
  }
  if (!(session.user as any).isAdmin) {
    return {
      session,
      error: NextResponse.json({ error: 'Admin privileges required' }, { status: 403 }),
    };
  }
  return { session, error: null };
}
