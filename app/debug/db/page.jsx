import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';

export const dynamic = 'force-dynamic';

export default async function DebugDbPage() {
  // Dev-only safety
  if (process.env.NODE_ENV === 'production') {
    return <div className="p-10">Not available in production.</div>;
  }

  let rows = [];
  try {
    rows = await db.select().from(UserAnswer).orderBy(UserAnswer.id);
  } catch (e) {
    console.error('debug/db: failed to fetch rows', e);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug: UserAnswer rows</h1>
      <p className="mb-4">Total rows: {rows.length}</p>
      <div className="overflow-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">id</th>
              <th className="border px-2 py-1">mockIdRef</th>
              <th className="border px-2 py-1">question</th>
              <th className="border px-2 py-1">userAns</th>
              <th className="border px-2 py-1">feedback</th>
              <th className="border px-2 py-1">rating</th>
              <th className="border px-2 py-1">answeredAt</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="border px-2 py-1">{r.id}</td>
                <td className="border px-2 py-1">{r.mockIdRef}</td>
                <td className="border px-2 py-1">{r.question}</td>
                <td className="border px-2 py-1">{r.userAns}</td>
                <td className="border px-2 py-1">{r.feedback}</td>
                <td className="border px-2 py-1">{r.rating}</td>
                <td className="border px-2 py-1">{String(r.answeredAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
