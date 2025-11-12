import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req) {
  try {
    // Optional auth check
    let createdBy = '';
    try {
      const { userId, sessionId } = getAuth(req);
      if (userId) {
        // Prefer email passed in body; fallback to clerk subject id if needed
        createdBy = userId;
      }
    } catch (_) {
      // ignore
    }

    const body = await req.json();
    const {
      jsonMockResponse,
      jobPosition,
      jobDesc,
      jobExperience,
      createdBy: createdByFromBody,
    } = body || {};

    // Basic validation
    if (!jsonMockResponse || !jobPosition || !jobDesc || !jobExperience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payloadCreatedBy = String(createdByFromBody || createdBy || '').slice(0, 200);
    const mockId = uuidv4();

    // Accept either an object or a string for jsonMockResponse
    const jsonString = typeof jsonMockResponse === 'string'
      ? jsonMockResponse
      : JSON.stringify(jsonMockResponse);

    const inserted = await db.insert(MockInterview).values({
      mockId,
      jsonMockResponse: jsonString,
      jobPosition: String(jobPosition).slice(0, 200),
      jobDesc: String(jobDesc).slice(0, 200),
      jobExperience: String(jobExperience).slice(0, 200),
      createdBy: payloadCreatedBy,
      createdAt: new Date(),
    }).returning({ mockId: MockInterview.mockId });

    const returnedId = inserted?.[0]?.mockId || mockId;
    return NextResponse.json({ success: true, mockId: returnedId });
  } catch (e) {
    console.error('Error in create-mock-interview route:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
