import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories, products } from '@/db/schema';
import { desc, asc, eq, sql } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin-auth';

// GET /api/admin/categories - List all categories with product counts
export async function GET() {

  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const allCategories = await db
      .select({
        categoryId: categories.categoryId,
        categoryName: categories.categoryName,
        description: categories.description,
        imageUrl: categories.imageUrl,
        createdAt: categories.createdAt,
        productCount: sql<number>`count(${products.productId})`,
      })
      .from(categories)
      .leftJoin(products, eq(products.categoryId, categories.categoryId))
      .groupBy(categories.categoryId)
      .orderBy(asc(categories.categoryName));
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/admin/categories - Create a category
export async function POST(request: NextRequest) {

  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const body = await request.json();
    const { categoryName, description, imageUrl } = body;
    if (!categoryName) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }
    const [created] = await db
      .insert(categories)
      .values({ categoryName, description, imageUrl })
      .returning();
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 409 });
    }
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

// PUT /api/admin/categories - Update a category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, categoryName, description, imageUrl } = body;
    if (!categoryId) {
      return NextResponse.json({ error: 'categoryId is required' }, { status: 400 });
    }
    const [updated] = await db
      .update(categories)
      .set({ categoryName, description, imageUrl, updatedAt: new Date() })
      .where(eq(categories.categoryId, categoryId))
      .returning();
    if (!updated) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 409 });
    }
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE /api/admin/categories?id=X - Delete a category
export async function DELETE(request: NextRequest) {

  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const id = parseInt(request.nextUrl.searchParams.get('id') || '0');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const [deleted] = await db
      .delete(categories)
      .where(eq(categories.categoryId, id))
      .returning();
    if (!deleted) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === '23503') {
      return NextResponse.json({ error: 'Cannot delete: category still has products' }, { status: 409 });
    }
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
