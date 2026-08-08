import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, categories, customers, purchases, transactions } from '@/db/schema';
import { desc, count, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {

  const authError = await requireAdmin();
  if (authError) return authError;
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
import { requireAdmin } from '@/lib/admin-auth';

// POST /api/admin/products — create a new product
export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const body = await request.json();
    const { name, price, description, quantityRemaining, categoryId, imgUrl, year, mileage, fuelType, bodyType, transmission, engine } = body;
    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }
    const [created] = await db
      .insert(products)
      .values({
        name,
        price: String(price),
        description: description || null,
        quantityRemaining: parseInt(quantityRemaining) || 1,
        categoryId: categoryId ? parseInt(categoryId) : null,
        imgUrl: imgUrl || null,
        year: year ? parseInt(year) : null,
        mileage: mileage ? parseInt(mileage) : null,
        fuelType: fuelType || null,
        bodyType: bodyType || null,
        transmission: transmission || null,
        engine: engine || null,
      })
      .returning({ productId: products.productId });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// PATCH /api/admin/products — update a product
export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const body = await request.json();
    const allowed = ['name', 'price', 'description', 'quantityRemaining', 'categoryId', 'imgUrl', 'year', 'mileage', 'fuelType', 'bodyType', 'transmission', 'engine', 'topSpeed', 'time60', 'drivetrain', 'colour', 'interior', 'wheel'];
    const updates: Record<string, any> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = key === 'price' ? String(body[key]) : body[key];
    }
    if (updates.categoryId !== undefined) updates.categoryId = parseInt(updates.categoryId) || null;
    if (updates.year !== undefined) updates.year = parseInt(updates.year) || null;
    if (updates.mileage !== undefined) updates.mileage = parseInt(updates.mileage) || null;
    if (updates.quantityRemaining !== undefined) updates.quantityRemaining = parseInt(updates.quantityRemaining) || 0;
    if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    const [updated] = await db.update(products).set(updates).where(eq(products.productId, id)).returning({ productId: products.productId });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/admin/products?id=N — remove a product
export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    await db.delete(products).where(eq(products.productId, id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}