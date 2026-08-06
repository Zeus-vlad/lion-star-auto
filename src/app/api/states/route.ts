import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { states } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const allStates = await db.select().from(states).orderBy(asc((states as any).name));
    return NextResponse.json(allStates);
  } catch (error) {
    console.error('Error fetching states:', error);
    return NextResponse.json({ error: 'Failed to fetch states' }, { status: 500 });
  }
}