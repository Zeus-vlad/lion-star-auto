'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingCart, Circle, CreditCard } from 'lucide-react';
import { AdminBreadcrumbs } from '@/components/AdminBreadcrumbs';

interface OrderItem {
  productName: string | null;
  quantity: number;
  priceAtPurchase: string;
  totalAmount: string;
  config: any;
  imgUrl: string | null;
}

interface Order {
  transactionId: number;
  totalAmount: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentPlan: any;
  dateOfTransaction: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
}

const imgSrc = (u: string | null) =>
  u && u.startsWith('http') ? u : u ? `/images/${u}` : null;

const statusStyles: Record<string, string> = {
  completed: 'bg-emerald-500/20 text-emerald-300',
  pending: 'bg-amber-500/20 text-amber-300',
  failed: 'bg-red-500/20 text-red-300',
  refunded: 'bg-zinc-500/20 text-zinc-300',
};

function ConfigChips({ config }: { config: any }) {
  if (!config) return null;
  const wheel = config.wheel;
  const color = config.color;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {wheel && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/70">
          <Circle className="w-2.5 h-2.5 text-primary" />
          {wheel.name} {wheel.price > 0 && `+$${Number(wheel.price).toLocaleString()}`}
        </span>
      )}
      {color && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/70">
          <Circle className="w-2.5 h-2.5 text-primary" />
          {color.name} {color.price > 0 && `+$${Number(color.price).toLocaleString()}`}
        </span>
      )}
    </div>
  );
}

function PlanBadge({ plan }: { plan: any }) {
  if (!plan) return null;
  return plan.type === 'installments' ? (
    <Badge className="bg-blue-500/20 text-blue-300">
      <CreditCard className="w-3 h-3 mr-1" />
      20% down · {plan.termMonths}mo · ${Number(plan.monthlyPayment || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
    </Badge>
  ) : (
    <Badge className="bg-white/10 text-white/80">
      <CreditCard className="w-3 h-3 mr-1" />
      Paid in Full
    </Badge>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders?limit=100')
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminBreadcrumbs crumbs={[{ label: 'Orders' }]} />
      <div className="flex items-center gap-2.5 mb-6">
        <ShoppingCart className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-sm text-white/50">{orders.length} total orders</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-white/50">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-white/40">No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Card key={o.transactionId} className="card-lift bg-zinc-900/80 border-white/10 shadow-lux hover:border-primary/40 transition-all">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">Order #{o.transactionId}</span>
                      <Badge className={statusStyles[o.paymentStatus] || 'bg-white/10 text-white/80'}>
                        {o.paymentStatus}
                      </Badge>
                      <PlanBadge plan={o.paymentPlan} />
                    </div>
                    <p className="text-sm text-white/50 mt-1">
                      {o.customerName} · {o.customerEmail}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-bold text-primary">${parseFloat(o.totalAmount).toLocaleString()}</p>
                    <p className="text-[11px] text-white/40">{new Date(o.dateOfTransaction).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {o.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                      <div className="w-12 h-9 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                        {imgSrc(item.imgUrl) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={imgSrc(item.imgUrl)!} alt={item.productName || ''} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-white/30">IMG</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/90 truncate">{item.productName}</p>
                        <ConfigChips config={item.config} />
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-white">${parseFloat(item.totalAmount).toLocaleString()}</p>
                        <p className="text-[11px] text-white/40">qty {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
