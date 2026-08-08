import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';

// GET /api/cart - List all products currently in the cart
export async function GET() {
  try {
    const items = await db
      .select({
        productId: products.productId,
        name: products.name,
        price: products.price,
        imgUrl: products.imgUrl,
        count: products.count,
        total: products.total,
        config: products.config,
        quantityRemaining: products.quantityRemaining,
      })
      .from(products)
      .where(eq(products.inCart, true))
      .orderBy(desc(products.updatedAt));
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST /api/cart { productId, config? } - Add one unit to the cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = parseInt(body.productId);
    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }
    // Optional configuration: { wheel: {name, price}, color: {name, price} }
    const config = body.config && typeof body.config === 'object' ? body.config : null;

    const [product] = await db
      .select({
        productId: products.productId,
        price: products.price,
        count: products.count,
        quantityRemaining: products.quantityRemaining,
      })
      .from(products)
      .where(eq(products.productId, productId))
      .limit(1);

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    if (product.quantityRemaining <= (product.count ?? 0)) {
      return NextResponse.json({ error: 'No more stock available' }, { status: 409 });
    }

    const newCount = (product.count ?? 0) + 1;
    const addons = config ? (config.wheel?.price ?? 0) + (config.color?.price ?? 0) : 0;
    const [updated] = await db
      .update(products)
      .set({
        inCart: true,
        count: newCount,
        config: config ? JSON.stringify(config) : null,
        total: sql`cast(${product.price} as numeric) * ${newCount} + ${addons}`,
        updatedAt: new Date(),
      })
      .where(eq(products.productId, productId))
      .returning({ productId: products.productId, count: products.count, total: products.total });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

// PATCH /api/cart { productId, action: 'inc' | 'dec' } - Change quantity
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = parseInt(body.productId);
    const action = body.action === 'dec' ? 'dec' : 'inc';
    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    const [product] = await db
      .select({
        productId: products.productId,
        price: products.price,
        count: products.count,
        quantityRemaining: products.quantityRemaining,
      })
      .from(products)
      .where(eq(products.productId, productId))
      .limit(1);

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    let newCount = (product.count ?? 0) + (action === 'inc' ? 1 : -1);
    if (newCount > product.quantityRemaining) {
      return NextResponse.json({ error: 'No more stock available' }, { status: 409 });
    }
    if (newCount <= 0) {
      const [cleared] = await db
        .update(products)
        .set({ inCart: false, count: 0, total: sql`0`, updatedAt: new Date() })
        .where(eq(products.productId, productId))
        .returning({ productId: products.productId, inCart: products.inCart });
      return NextResponse.json(cleared);
    }

    const [updated] = await db
      .update(products)
      .set({
        inCart: true,
        count: newCount,
        total: sql`cast(${product.price} as numeric) * ${newCount}`,
        updatedAt: new Date(),
      })
      .where(eq(products.productId, productId))
      .returning({ productId: products.productId, count: products.count, total: products.total });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// DELETE /api/cart?productId=N (or no id = clear entire cart)
export async function DELETE(request: NextRequest) {
  try {
    const idParam = request.nextUrl.searchParams.get('productId');
    if (idParam) {
      const productId = parseInt(idParam);
      const [cleared] = await db
        .update(products)
        .set({ inCart: false, count: 0, total: sql`0`, updatedAt: new Date() })
        .where(eq(products.productId, productId))
        .returning({ productId: products.productId });
      if (!cleared) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    await db
      .update(products)
      .set({ inCart: false, count: 0, total: sql`0`, updatedAt: new Date() })
      .where(eq(products.inCart, true));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
