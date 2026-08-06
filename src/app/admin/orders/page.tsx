'use client';

import { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface OrderItem {
  productName: string | null;
  quantity: number;
  priceAtPurchase: string;
  totalAmount: string;
}

interface Order {
  transactionId: number;
  purchaseId: number | null;
  totalAmount: string;
  taxAmount: string | null;
  paymentMethod: string | null;
  paymentStatus: string;
  shippingCity: string | null;
  stateCode: string | null;
  dateOfTransaction: string;
  customerName: string | null;
  customerEmail: string | null;
  items: OrderItem[];
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-600',
  completed: 'bg-emerald-500/15 text-emerald-600',
  cancelled: 'bg-destructive/15 text-destructive',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=${statusFilter}`);
      if (res.ok) setOrders(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(transactionId: number, paymentStatus: string) {
    setMessage(null);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, paymentStatus }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: `Order #${transactionId} updated.` });
        await load();
      } else {
        setMessage({ type: 'error', text: 'Failed to update order.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to update order.' });
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <div className="w-48">
            <Select value={statusFilter} onChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm ${
              message.type === 'error'
                ? 'bg-destructive/10 text-destructive'
                : 'bg-emerald-500/10 text-emerald-600'
            }`}
          >
            {message.text}
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Order</th>
                    <th className="text-left p-4 font-medium">Customer</th>
                    <th className="text-left p-4 font-medium">Items</th>
                    <th className="text-right p-4 font-medium">Total</th>
                    <th className="text-center p-4 font-medium">Status</th>
                    <th className="text-center p-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.transactionId} className="border-b align-top">
                      <td className="p-4 font-medium">#{order.transactionId}</td>
                      <td className="p-4">
                        <div className="font-medium">{order.customerName || 'Guest'}</div>
                        <div className="text-sm text-muted-foreground">{order.customerEmail || '—'}</div>
                      </td>
                      <td className="p-4">
                        {order.items.length === 0 ? (
                          <span className="text-muted-foreground text-sm">—</span>
                        ) : (
                          <ul className="text-sm">
                            {order.items.map((item, i) => (
                              <li key={i}>
                                {item.productName || 'Product'} × {item.quantity}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td className="p-4 text-right font-semibold text-primary">
                        ${parseFloat(order.totalAmount).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Badge className={STATUS_STYLES[order.paymentStatus] || ''}>
                            {order.paymentStatus}
                          </Badge>
                          <Select
                            value={order.paymentStatus}
                            onChange={(v: string) => updateStatus(order.transactionId, v)}
                          >
                            <SelectTrigger className="w-28 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground text-center whitespace-nowrap">
                        {new Date(order.dateOfTransaction).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {!loading && orders.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No orders found{statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''}.
          </div>
        )}
        {loading && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading orders...
          </div>
        )}
      </div>
    </div>
  );
}
