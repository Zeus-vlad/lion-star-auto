import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Role gate: only authenticated users with isAdmin=true can access /admin
  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=/admin`);
  }
  if (!(session.user as any).isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Access Denied</h1>
          <p className="text-white/60 mb-6">
            This section is restricted to administrators only. If you believe this
            is a mistake, contact your account administrator.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link href="/">Back to Storefront</Link>
            </Button>
            <Button asChild className="shadow-glow">
              <Link href="/auth/login?callbackUrl=/admin">Sign In as Admin</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="lg:pl-64 pt-14 lg:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
