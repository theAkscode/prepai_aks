import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req);
    
    // Extract email from query params (passed from client)
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('email');
    
    if (!userEmail) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    // Fetch interviews created by this user, ordered by most recent first
    const interviews = await db.select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, String(userEmail)))
      .orderBy(desc(MockInterview.createdAt));

    return NextResponse.json({ interviews });
  } catch (e) {
    console.error('Error in list-user-interviews route:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
