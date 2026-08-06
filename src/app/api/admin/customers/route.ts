import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { customers, states } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

// GET /api/admin/customers - List customers with order counts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const whereClause = search
      ? sql`(${customers.firstName} ilike ${`%${search}%`} or ${customers.lastName} ilike ${`%${search}%`} or ${customers.email} ilike ${`%${search}%`})`
      : undefined;

    const allCustomers = await db
      .select({
        customerId: customers.customerId,
        firstName: customers.firstName,
        lastName: customers.lastName,
        email: customers.email,
        phone: customers.phone,
        city: customers.city,
        stateCode: states.code,
        zipCode: customers.zipCode,
        isAdmin: customers.isAdmin,
        createdAt: customers.createdAt,
      })
      .from(customers)
      .leftJoin(states, eq(customers.stateId, states.id))
      .where(whereClause)
      .orderBy(desc(customers.createdAt))
      .limit(200);

    return NextResponse.json(allCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
