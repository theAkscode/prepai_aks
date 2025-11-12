import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function GET(_req, { params }) {
  try {
    const { mockId } = params || {};
    if (!mockId) {
      return NextResponse.json({ error: 'Missing mockId' }, { status: 400 });
    }
    const rows = await db.select().from(MockInterview).where(eq(MockInterview.mockId, String(mockId)));
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (e) {
    console.error('Error in get-interview route:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
