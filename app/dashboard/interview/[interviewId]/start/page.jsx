import { MockInterview } from '@/utils/schema';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import StartClientWrapper from './StartClientWrapper';

export default async function Start({ params }) {
  // Await params to resolve Next.js promise-like object
  const resolvedParams = await params;
  const interviewId = resolvedParams?.interviewId;
  
  console.log('Start page - interviewId:', interviewId);
   
  try {
    const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, interviewId));

    const jsonMockResponse = result[0]?.jsonMockResponse ? JSON.parse(result[0].jsonMockResponse) : null;
    const normalized = jsonMockResponse?.questions ?? jsonMockResponse ?? [];

    return (
      <div>
        <StartClientWrapper mockInterviewQuestions={normalized} interviewData={result[0] ?? null} />
      </div>
    );
  } catch (e) {
    console.error('Failed fetching interview server-side:', e);
    return <div className='p-6'>Error loading interview.</div>;
  }
}
