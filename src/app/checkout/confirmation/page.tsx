import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/db';
import { transactions, purchases, products, customers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const orderNumber = id ? `LSA-${id}` : 'LSA-' + Math.random().toString(36).substring(2, 10).toUpperCase();

  // Fetch the transaction with payment plan + line items with config
  let order: any = null;
  if (id) {
    try {
      const [tx] = await db
        .select({
          transactionId: transactions.transactionId,
          purchaseId: transactions.purchaseId,
          totalAmount: transactions.totalAmount,
          taxAmount: transactions.taxAmount,
          paymentStatus: transactions.paymentStatus,
          paymentPlan: transactions.paymentPlan,
          customerName: customers.firstName,
          customerEmail: customers.email,
        })
        .from(transactions)
        .leftJoin(customers, eq(transactions.customerId, customers.customerId))
        .where(eq(transactions.transactionId, parseInt(id)))
        .limit(1);

      if (tx && tx.customerName) {
        const items = await db
          .select({
            productName: products.name,
            quantity: purchases.quantity,
            priceAtPurchase: purchases.priceAtPurchase,
            totalAmount: purchases.totalAmount,
            config: purchases.config,
            imgUrl: products.imgUrl,
          })
          .from(purchases)
          .leftJoin(products, eq(purchases.productId, products.productId))
          .where(eq(purchases.purchaseId, tx.purchaseId as number))
          .orderBy(purchases.createdAt);
        order = { ...tx, items };
      }
    } catch {
      order = null;
    }
  }

  const imgSrc = (u: string | null) => (u && u.startsWith('http') ? u : u ? `/images/${u}` : null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Your purchase has been successfully processed.
          </p>

          <Card className="max-w-md mx-auto mb-8 text-left">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-mono font-medium">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-primary font-semibold">Processing</span>
                </div>
                {order?.paymentPlan && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Payment Plan</span>
                    {order.paymentPlan.type === 'installments' ? (
                      <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300">
                        <CreditCard className="w-3 h-3 mr-1" />
                        20% down ${Number(order.paymentPlan.downPayment || 0).toLocaleString()} · {order.paymentPlan.termMonths}mo · ${Number(order.paymentPlan.monthlyPayment || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                      </Badge>
                    ) : (
                      <Badge className="bg-white/10">
                        Paid in Full
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configured items */}
          {order?.items?.length > 0 && (
            <Card className="max-w-md mx-auto mb-8 text-left">
              <CardContent className="pt-6 space-y-4">
                <p className="font-semibold">Your Configuration</p>
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex gap-3 items-start">
                    {imgSrc(item.imgUrl) && (
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgSrc(item.imgUrl)!} alt={item.productName || ''} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.productName}</p>
                      {item.config && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {item.config.wheel && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                              <Circle className="w-2.5 h-2.5" />
                              {item.config.wheel.name} {item.config.wheel.price > 0 && `+$${Number(item.config.wheel.price).toLocaleString()}`}
                            </span>
                          )}
                          {item.config.color && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                              <Circle className="w-2.5 h-2.5" />
                              {item.config.color.name} {item.config.color.price > 0 && `+$${Number(item.config.color.price).toLocaleString()}`}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-primary font-semibold mt-1 text-sm">
                        ${parseFloat(item.totalAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <p className="text-sm text-muted-foreground mb-8">
            A confirmation email has been sent to your inbox. Our concierge team
            will contact you within 24 hours to schedule delivery.
          </p>

          <Button size="lg" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
