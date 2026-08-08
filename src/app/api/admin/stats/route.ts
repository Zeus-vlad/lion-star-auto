import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { customers, products, transactions, purchases } from '@/db/schema';
import { eq, count, desc, sql } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {

  const { error: authError } = await requireAdmin();
  if (authError) return authError;
  try {
    const customerCount = await db.select({ count: count() }).from(customers);
    const productCount = await db.select({ count: count() }).from(products);
    const transactionCount = await db.select({ count: count() }).from(transactions);

    // Total revenue from purchases
    const revenueResult = await db.select({
      total: sql<number>`SUM(${purchases.quantity} * ${purchases.priceAtPurchase})`
    }).from(purchases);

    // Recent orders
    const recentTransactions = await db
      .select({
        id: transactions.transactionId,
        customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
        amount: transactions.totalAmount,
        date: transactions.dateOfTransaction,
        status: transactions.paymentStatus,
      })
      .from(transactions)
      .leftJoin(customers, eq(transactions.customerId, customers.customerId))
      .leftJoin(purchases, eq(transactions.purchaseId, purchases.purchaseId))
      .orderBy(desc(transactions.dateOfTransaction))
      .limit(10);

    return NextResponse.json({
      totalCustomers: customerCount[0]?.count || 0,
      totalProducts: productCount[0]?.count || 0,
      totalTransactions: transactionCount[0]?.count || 0,
      totalRevenue: (revenueResult[0]?.total || 0).toString(),
      recentOrders: recentTransactions.map(t => ({
        id: t.id,
        customerName: t.customerName,
        amount: parseFloat(t.amount),
        date: t.date ? new Date(t.date).toISOString().split('T')[0] : '',
        status: t.status,
      })),
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
