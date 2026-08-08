import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';

// POST /api/auth/register { firstName, lastName, email, password }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // Check for existing customer
    const [existing] = await db
      .select({ customerId: customers.customerId })
      .from(customers)
      .where(eq(customers.email, normalizedEmail))
      .limit(1);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);

    const [created] = await db
      .insert(customers)
      .values({
        firstName,
        lastName,
        email: normalizedEmail,
        passwordHash,
      })
      .returning({ customerId: customers.customerId, email: customers.email });

    return NextResponse.json({ customerId: created.customerId, email: created.email }, { status: 201 });
  } catch (error) {
    console.error('Error registering customer:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
