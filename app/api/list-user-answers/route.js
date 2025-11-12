import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const mockId = url.searchParams.get('mockId');
    console.log('list-user-answers called, mockId:', mockId);

    if (!mockId) {
      console.warn('list-user-answers: no mockId provided — returning ALL rows for debugging (dev only).');
      const all = await db.select().from(UserAnswer).orderBy(UserAnswer.id);
      console.log('list-user-answers: total rows returned:', Array.isArray(all) ? all.length : 'unknown');
      return NextResponse.json({ rows: all });
    }

    const rows = await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef, String(mockId))).orderBy(UserAnswer.id);
    console.log('list-user-answers: rows returned for mockId', mockId, Array.isArray(rows) ? rows.length : 'unknown');
    return NextResponse.json({ rows });
  } catch (e) {
    console.error('list-user-answers error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const mockId = url.searchParams.get('mockId');
    if (!mockId) return NextResponse.json({ error: 'mockId required' }, { status: 400 });

    const rows = await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef, mockId)).orderBy(UserAnswer.answeredAt);
    return NextResponse.json({ rows });
  } catch (e) {
    console.error('Error listing user answers:', e);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
