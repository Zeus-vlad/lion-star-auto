import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions, customers, states, purchases, products } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

interface OrderItemRow {
  productName: string | null;
  quantity: number;
  priceAtPurchase: string;
  totalAmount: string;
}

// GET /api/admin/orders - List all orders (transactions) with customer + line items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');

    const whereClause = status && status !== 'all' ? eq(transactions.paymentStatus, status) : undefined;

    const orders = await db
      .select({
        transactionId: transactions.transactionId,
        purchaseId: transactions.purchaseId,
        totalAmount: transactions.totalAmount,
        taxAmount: transactions.taxAmount,
        paymentMethod: transactions.paymentMethod,
        paymentStatus: transactions.paymentStatus,
        shippingCity: transactions.shippingCity,
        shippingStateId: transactions.shippingStateId,
        dateOfTransaction: transactions.dateOfTransaction,
        customerId: customers.customerId,
        customerName: sql<string>`concat(${customers.firstName}, ' ', ${customers.lastName})`,
        customerEmail: customers.email,
        stateCode: states.code,
      })
      .from(transactions)
      .leftJoin(customers, eq(transactions.customerId, customers.customerId))
      .leftJoin(states, eq(transactions.shippingStateId, states.id))
      .where(whereClause)
      .orderBy(desc(transactions.dateOfTransaction))
      .limit(limit);

    // Fetch line items for each order (joined through transactions.purchaseId)
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        if (order.purchaseId == null) return { ...order, items: [] as OrderItemRow[] };
        const items = await db
          .select({
            productName: products.name,
            quantity: purchases.quantity,
            priceAtPurchase: purchases.priceAtPurchase,
            totalAmount: purchases.totalAmount,
          })
          .from(purchases)
          .leftJoin(products, eq(purchases.productId, products.productId))
          .where(eq(purchases.purchaseId, order.purchaseId));
        return { ...order, items };
      })
    );

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// PATCH /api/admin/orders - Update order status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, paymentStatus } = body;
    if (!transactionId || !paymentStatus) {
      return NextResponse.json({ error: 'transactionId and paymentStatus required' }, { status: 400 });
    }
    const [updated] = await db
      .update(transactions)
      .set({ paymentStatus })
      .where(eq(transactions.transactionId, transactionId))
      .returning();
    if (!updated) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
