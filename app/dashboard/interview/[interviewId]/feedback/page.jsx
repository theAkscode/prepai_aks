import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { UserAnswer, MockInterview } from '@/utils/schema';


export const dynamic = 'force-dynamic';

export default async function FeedbackPage({ params }) {
  
  // Await params to resolve Next.js promise-like object
  const resolvedParams = await params;
  console.log('FeedbackPage params:', resolvedParams);
  
  // Get the interviewId and handle the "undefined" string case
  let mockIdRef = resolvedParams?.interviewId;
  
  // If the value is literally the string "undefined", treat it as undefined
  if (mockIdRef === "undefined" || mockIdRef === undefined || mockIdRef === null) {
    console.error('Invalid interviewId received:', mockIdRef);
    return (
      <div className="p-10">
        <h2 className="text-3xl font-bold text-red-500">Error!</h2>
        <h2 className="font-bold text-2xl">Invalid Interview ID</h2>
        <p className="mt-4">The interview ID is missing or invalid.</p>
        <p className="text-sm text-gray-600 mt-2">Received: {String(mockIdRef)}</p>
        <div className="mt-6">
          <a href="/dashboard" className="inline-block bg-slate-900 text-white px-4 py-2 rounded-md">Go Home</a>
        </div>
      </div>
    );
  }
  
  console.log('Using mockIdRef:', mockIdRef);
  
  // Query the MockInterview table to get interview details
  let result = [];
  try {
    result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, mockIdRef));
    console.log("result", result);
  } catch (e) {
    console.error('Error querying MockInterview:', e);
  }

  if (!mockIdRef) {
    return (
      
      <div className="p-10">
        <h2 className="text-3xl font-blod text-green-500">Congratulations!</h2>
        <h2 className="font-bold text-2xl">Here is your Interview Feedback!</h2>
        <p className="mt-4">No interview id provided.</p>
      </div>
    );
  }

  // Define interviewData based on UserAnswer table mockIdRef
  const interviewData = {
    mockId: mockIdRef,
    interviewId: mockIdRef
  };

  // Server-side DB query
  let rows = [];
  try {
    rows = await db.select().from(UserAnswer).
    where(eq(UserAnswer.mockIdRef, String(mockIdRef)))
    .orderBy(UserAnswer.id);
  } catch (e) {
    console.error('Failed to query UserAnswer for feedback page:', e);
  }

  return (
    <div className="p-10">
      <h2 className="text-3xl font-blod text-green-500">Congratulations!</h2>
      <h2 className="font-bold text-2xl">Here is your Interview Feedback!</h2>
      <h2 className="text-blue-800 text-lg my-3">Your overall Interview rating : <strong> 7/10 </strong> </h2>
      <h2 className="text-sm text-gray-800">Find Below Interview with correct Answer, Your Answer and Feedback for Improvement! </h2>

      {rows && rows.length > 0 ? (
        rows.map((r) => (
          <div key={r.id} className="border rounded-lg p-4 my-4">
            <div className="mb-2"><strong>Question:</strong> {r.question}</div>
            <div className="mb-2"><strong>Your answer:</strong> {r.userAns}</div>
            <div className="mb-2"><strong>AI feedback:</strong> {r.feedback}</div>
            <div className="mb-2"><strong>Rating:</strong> {r.rating}</div>
          </div>
        ))
      ) : (
        <p>No feedback available.</p>
      )}

      <div className="mt-6">
        <a href="/dashboard" className="inline-block bg-slate-900 text-white px-4 py-2 rounded-md">Go Home</a>
      </div>
    </div>
  );
}