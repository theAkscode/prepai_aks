import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

export async function POST(req) {
  try {
  // Validate session with Clerk (pass the incoming request for cookie/header access)
  const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    // Try to fetch canonical user email from Clerk (optional)
    let userEmail = '';
    try {
        // guard: clerkClient or clerkClient.users might be undefined in some dev envs
        if (clerkClient && clerkClient.users && typeof clerkClient.users.getUser === 'function') {
          const user = await clerkClient.users.getUser(userId);
          userEmail = user?.emailAddresses?.[0]?.emailAddress ?? '';
        } else {
          console.warn('clerkClient.users.getUser is not available in this environment; skipping Clerk email lookup.');
          userEmail = '';
        }
    } catch (e) {
      // don't fail the whole request if clerk lookup fails
      console.warn('Could not fetch user info from Clerk:', e);
      userEmail = '';
    }

    const body = await req.json();

    // Basic validation
    if (!body || !body.mockIdRef || !body.question) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Log incoming payload briefly to help debug mockId mismatches
    console.log('save-user-answer payload:', { mockIdRef: body.mockIdRef, question: body.question });

    const insert = await db.insert(UserAnswer).values({
      mockIdRef: String(body.mockIdRef),
      question: String(body.question).slice(0, 1000),
      correctAns: String(body.correctAns || '').slice(0, 1000),
      userAns: String(body.userAns || '').slice(0, 1000),
      feedback: String(body.feedback || '').slice(0, 1000),
      rating: String(body.rating || '').slice(0, 100),
      userEmail: String(userEmail || body.userEmail || '').slice(0, 200),
    }).returning();

    console.log('save-user-answer inserted rows:', insert);
    return NextResponse.json({ success: true, inserted: insert });
  } catch (e) {
    console.error('Error in save-user-answer route:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
