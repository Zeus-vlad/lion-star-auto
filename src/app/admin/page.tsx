import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { AdminBreadcrumbs } from '@/components/AdminBreadcrumbs';

interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalTransactions: number;
  totalRevenue: string;
  recentOrders: Array<{
    id: number;
    customerName: string;
    amount: number;
    date: string;
    status: string;
  }>;
}

async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/stats`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json() as Promise<DashboardStats>;
}

const statusStyle: Record<string, string> = {
  completed: 'bg-emerald-500/20 text-emerald-300',
  pending: 'bg-amber-500/20 text-amber-300',
  failed: 'bg-red-500/20 text-red-300',
};

export default async function AdminDashboard() {
  let stats: DashboardStats;
  try {
    stats = await fetchStats();
  } catch (e) {
    stats = {
      totalCustomers: 0,
      totalProducts: 68,
      totalTransactions: 0,
      totalRevenue: '0',
      recentOrders: [],
    };
  }

  const cards = [
    {
      label: 'Total Customers',
      value: stats.totalCustomers,
      sub: 'Registered customers',
      icon: Users,
      gradient: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-400',
      glow: 'group-hover:shadow-blue-500/20',
    },
    {
      label: 'Total Products',
      value: stats.totalProducts,
      sub: 'Luxury vehicles',
      icon: Package,
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-400',
      glow: 'group-hover:shadow-emerald-500/20',
    },
    {
      label: 'Total Orders',
      value: stats.totalTransactions,
      sub: 'Completed transactions',
      icon: ShoppingCart,
      gradient: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-400',
      glow: 'group-hover:shadow-amber-500/20',
    },
    {
      label: 'Total Revenue',
      value: `$${parseFloat(stats.totalRevenue).toLocaleString()}`,
      sub: 'All time',
      icon: DollarSign,
      gradient: 'from-primary/25 to-primary/5',
      iconColor: 'text-primary',
      glow: 'group-hover:shadow-primary/30',
    },
  ];

  return (
    <div>
      <AdminBreadcrumbs crumbs={[]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm text-white/50 mt-1">Welcome back — here&apos;s your dealership at a glance</p>
        </div>
      </div>

      {/* Stats Grid — premium cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((c) => (
          <Card
            key={c.label}
            className={`group card-lift relative overflow-hidden bg-zinc-900/80 border-white/10 shadow-lux hover:shadow-2xl transition-all duration-300 ${c.glow}`}
          >
            {/* texture gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/[0.03] blur-2xl group-hover:bg-white/[0.06] transition-colors" />
            <CardContent className="relative p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">{c.label}</p>
                  <p className="text-3xl font-bold text-white mt-2">{c.value}</p>
                  <p className="text-xs text-white/40 mt-1">{c.sub}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.gradient} border border-white/10 flex items-center justify-center ${c.iconColor} group-hover:scale-110 transition-transform`}>
                  <c.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[11px] text-emerald-400/80 opacity-0 group-hover:opacity-100 transition-opacity">
                <TrendingUp className="w-3 h-3" /> Live data
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent orders */}
      <Card className="bg-zinc-900/80 border-white/10 shadow-lux">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Recent Orders</h2>
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-orange-400 hover:bg-white/5">
              <Link href="/admin/orders" className="gap-1">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-10 text-white/40 text-sm">
              No orders yet — your sales will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center text-primary font-bold flex-shrink-0">
                      #{o.id}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{o.customerName}</p>
                      <p className="text-[11px] text-white/40">{new Date(o.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-semibold text-white">${o.amount.toLocaleString()}</span>
                    <Badge className={statusStyle[o.status] || 'bg-white/10 text-white/80'}>{o.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
