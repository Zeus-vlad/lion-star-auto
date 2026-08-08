import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, categories, customers } from '@/db/schema';
import { eq, ilike, and, gte, lte, desc, asc, sql, ne } from 'drizzle-orm';

// GET /api/products - Fetch all products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search') || searchParams.get('q');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';
    const featured = searchParams.get('featured');
    const productId = searchParams.get('id');

    const offset = (page - 1) * limit;

    // Single product fetch
    if (productId) {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.productId, parseInt(productId)))
        .limit(1);
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      const [category] = product.categoryId
        ? await db.select().from(categories).where(eq(categories.categoryId, product.categoryId)).limit(1)
        : [];
      return NextResponse.json({ ...product, category: category ?? null });
    }

    // Build where conditions
    const conditions: any[] = [];

    if (category && category !== 'All Brands' && category !== 'all') {
      // Support both category ID and name (UI sends brand names like "Mercedes Benz")
      const catId = parseInt(category);
      if (!isNaN(catId)) {
        conditions.push(eq(products.categoryId, catId));
      } else {
        const [cat] = await db
          .select({ categoryId: categories.categoryId })
          .from(categories)
          .where(eq(categories.categoryName, category))
          .limit(1);
        if (cat) {
          conditions.push(eq(products.categoryId, cat.categoryId));
        }
      }
    }

    if (search) {
      conditions.push(ilike(products.name, `%${search}%`));
    }

    if (minPrice) {
      conditions.push(gte(products.price, minPrice));
    }

    if (maxPrice) {
      conditions.push(lte(products.price, maxPrice));
    }

    if (featured === 'true') {
      conditions.push(eq(products.quantityRemaining, 0)); // Use Sold Out as featured filter for testing
    }

    // Always exclude products with 0 quantity for public view (unless specifically requested)
    if (!searchParams.get('includeOutOfStock')) {
      conditions.push(ne(products.quantityRemaining, 0));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Build order by
    let orderByClause;
    switch (sort) {
      case 'price-asc':
        orderByClause = asc(products.price);
        break;
      case 'price-desc':
        orderByClause = desc(products.price);
        break;
      case 'newest':
      default:
        orderByClause = desc(products.createdAt);
        break;
    }

    // Fetch products
    const productsData = await db.select().from(products).where(whereClause).orderBy(orderByClause).limit(limit).offset(offset);

    // Fetch categories for filter
    const categoriesData = await db.select().from(categories).orderBy(asc(categories.categoryName));

    // Count total
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(products).where(whereClause);

    return NextResponse.json({
      products: productsData,
      categories: categoriesData.map(c => c.categoryName),
      pagination: {
        page,
        limit,
        total: countResult[0]?.count || 0,
        totalPages: Math.ceil((countResult[0]?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}