import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db } from '@/db';
import { purchases, products, transactions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Package, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to view your purchase history.
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="gap-2">
              Sign In <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const customerId = parseInt(session.user.id as string, 10);

  const orderList = await db
    .select({
      purchaseId: purchases.purchaseId,
      quantity: purchases.quantity,
      priceAtPurchase: purchases.priceAtPurchase,
      totalAmount: purchases.totalAmount,
      createdAt: purchases.createdAt,
      productName: products.name,
      productImage: products.imgUrl,
      paymentStatus: transactions.paymentStatus,
      paymentMethod: transactions.paymentMethod,
    })
    .from(purchases)
    .leftJoin(products, eq(purchases.productId, products.productId))
    .leftJoin(transactions, eq(transactions.purchaseId, purchases.purchaseId))
    .where(eq(purchases.customerId, customerId))
    .orderBy(desc(purchases.createdAt));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Purchase History</h1>
            <p className="text-muted-foreground">Your orders at Lion Star Auto</p>
          </div>
        </div>

        {orderList.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground text-lg mb-2">No orders yet.</p>
              <p className="text-muted-foreground text-sm mb-6">
                When you purchase a vehicle it will appear here.
              </p>
              <Link href="/#inventory">
                <Button className="gap-2">
                  Browse Inventory <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orderList.map((order) => (
              <Card key={order.purchaseId} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm font-medium">#LSA-{order.purchaseId}</span>
                      <span className="text-sm text-muted-foreground">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <Badge
                      variant={order.paymentStatus === 'completed' ? 'default' : 'secondary'}
                    >
                      {(order.paymentStatus || 'pending').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 p-6">
                    <div className="w-24 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={order.productImage || '/images/placeholder.jpg'}
                        alt={order.productName || ''}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{order.productName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Qty {order.quantity} · {order.paymentMethod || '—'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">
                        ${parseFloat(order.totalAmount || order.priceAtPurchase || '0').toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
