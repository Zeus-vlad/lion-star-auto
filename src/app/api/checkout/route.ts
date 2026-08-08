import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { customers, products, purchases, transactions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// POST /api/checkout - Place an order from the current cart
// Auth required: only signed-in customers can pay.
// Body: { customer: {firstName, lastName, email, phone?, address, city, stateId, zipCode}, paymentMethod }
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Please sign in to complete your purchase.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const cust = body.customer || {};

    if (!cust.firstName || !cust.lastName || !cust.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // 1. Load cart items
    const cartItems = await db
      .select({
        productId: products.productId,
        name: products.name,
        price: products.price,
        count: products.count,
        config: products.config,
      })
      .from(products)
      .where(eq(products.inCart, true));

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    // 2. Upsert customer by email
    const email = cust.email.toLowerCase().trim();
    const [existing] = await db
      .select({ customerId: customers.customerId })
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1);

    let customerId: number;
    if (existing) {
      customerId = existing.customerId;
    } else {
      const [created] = await db
        .insert(customers)
        .values({
          firstName: cust.firstName,
          lastName: cust.lastName,
          email,
          phone: cust.phone || null,
          address: cust.address || null,
          city: cust.city || null,
          stateId: cust.stateId ? parseInt(cust.stateId) : null,
          zipCode: cust.zipCode || null,
          passwordHash: 'oauth:guest', // guests checkout without a password
        })
        .returning({ customerId: customers.customerId });
      customerId = created.customerId;
    }

    // 3. Create a purchase + transaction per cart item
    const orderIds: number[] = [];
    for (const item of cartItems) {
      const unitPrice = parseFloat(item.price);
      const qty = item.count ?? 1;
      const lineTotal = unitPrice * qty;

      const [purchase] = await db
        .insert(purchases)
        .values({
          productId: item.productId,
          customerId,
          quantity: qty,
          priceAtPurchase: unitPrice.toFixed(2),
          totalAmount: lineTotal.toFixed(2),
          config: item.config ? JSON.stringify(item.config) : null,
        })
        .returning({ purchaseId: purchases.purchaseId });

      const [tx] = await db
        .insert(transactions)
        .values({
          customerId,
          purchaseId: purchase.purchaseId,
          totalAmount: lineTotal.toFixed(2),
          taxAmount: body.taxAmount ? parseFloat(body.taxAmount).toFixed(2) : '0.00',
          paymentMethod: body.paymentMethod || 'card',
          paymentStatus: 'completed',
          paymentPlan: body.paymentPlan ? JSON.stringify(body.paymentPlan) : null,
          shippingAddress: cust.address || null,
          shippingCity: cust.city || null,
          shippingStateId: cust.stateId ? parseInt(cust.stateId) : null,
          shippingZipCode: cust.zipCode || null,
        })
        .returning({ transactionId: transactions.transactionId });

      orderIds.push(tx.transactionId);
    }

    // 4. Clear the cart
    await db
      .update(products)
      .set({ inCart: false, count: 0 })
      .where(eq(products.inCart, true));

    return NextResponse.json({ orderIds, primaryOrderId: orderIds[0] }, { status: 201 });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 });
  }
}
