import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, categories, customers, purchases, transactions } from '@/db/schema';
import { desc, count, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get all products with category info
    const allProducts = await db
      .select({
        productId: products.productId,
        name: products.name,
        price: products.price,
        description: products.description,
        quantityRemaining: products.quantityRemaining,
        categoryId: products.categoryId,
        categoryName: categories.categoryName,
        imgUrl: products.imgUrl,
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.categoryId))
      .orderBy(desc(products.createdAt));

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// Import eq
import { eq } from 'drizzle-orm';