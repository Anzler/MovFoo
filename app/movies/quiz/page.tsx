/* ──────────────────────────────────────────────────────────────
   FRONTEND FILE: app/movies/quiz/page.tsx
   Purpose  : Interactive “What do I want to watch?” quiz
   Framework: Next.js 13 (client component)
   Database : Queries the unified view `content_view`
   Styling  : Tailwind CSS
──────────────────────────────────────────────────────────────── */

'use client';

import { useState, useEffect } from 'react';
import { createClient, User } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

/*──────────────── Quiz Questions ────────────────*/
type Q = {
  id: number;
  text: string;
  options: string[];
  field: string;
};

const quizQuestions: Q[] = [
  {
    id: 1,
    text: 'Who are you watching with?',
    options: ['Alone', 'Partner', 'Family', 'Friends'],
    field: 'audience',
  },
  {
    id: 2,
    text: 'Which genre suits your mood?',
    options: [
      'Action',
      'Comedy',
      'Drama',
      'Horror',
      'Romance',
      'Thriller',
      'Any',
    ],
    field: 'genre',
  },
  {
    id: 3,
    text: 'Movie or TV Show?',
    options: ['Movie', 'TV Show', 'No preference'],
    field: 'type',
  },
  {
    id: 4,
    text: 'How much time do you have?',
    options: ['Less than 2 hours', 'Several hours (binge)', 'No preference'],
    field: 'duration',
  },
  {
    id: 5,
    text: 'Prefer only top‑rated titles?',
    options: ['Yes, 8+ rating', 'No preference'],
    field: 'rating',
  },
  {
    id: 6,
    text: 'Pick a special category (if any):',
    options: [
      'Based on a true story',
      'Classic (20+ years old)',
      'New release (last 2 years)',
      'No preference',
    ],
    field: 'special',
  },
];

/*──────────────── Types ─────────────────────────*/
interface ContentRow {
  id: number;
  title: string;
  poster_url: string | null;
  description: string | null;
  streaming_service: string | null;
}

/*──────────────── Component ─────────────────────*/
export default function MovieQuizPage() {
  const totalSteps = quizQuestions.length;

  /* State */
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [yuckIds, setYuckIds] = useState<number[]>([]);

  /* Get user + yuck list once */
  useEffect(() => {
    const initUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return;
      setUser(data.user);

      if (data.user) {
        const { data: yuck, error: yuckErr } = await supabase
          .from('yuck_list')
          .select('content_id')
          .eq('user_id', data.user.id);

        if (!yuckErr && yuck) {
          setYuckIds(yuck.map((r) => r.content_id));
        }
      }
    };
    initUser();
  }, []);

  /* Main filter function */
  const fetchFilteredResults = async (nextAnswers: Record<number, string>) => {
    setLoading(true);
    let query = supabase.from('content_view').select('*');

    for (const q of quizQuestions) {
      const ans = nextAnswers[q.id];
      if (!ans || ans === 'No preference' || ans === 'Any') continue;

      switch (q.field) {
        case 'duration':
          if (ans === 'Less than 2 hours') {
            query = query.lte('runtime_minutes', 120);
          } else if (ans === 'Several hours (binge)') {
            query = query.eq('type', 'TV Show');
          }
          break;

        case 'rating':
          if (ans === 'Yes, 8+ rating') query = query.gte('rating', 8);
          break;

        case 'special':
          if (ans === 'Based on a true story') {
            query = query.eq('based_on_true_story', true);
          } else if (ans === 'Classic (20+ years old)') {
            const cutoff = new Date().getFullYear() - 20;
            query = query.lte('release_year', cutoff);
          } else if (ans === 'New release (last 2 years)') {
            const cutoff = new Date().getFullYear() - 2;
            query = query.gte('release_year', cutoff);
          }
          break;

        default:
          // Simple equality filter
          query = query.eq(q.field, ans);
      }
    }

    // Exclude yuck‑list IDs
    if (yuckIds.length) {
      query = query.not('id', 'in', `(${yuckIds.join(',')})`);
    }

    // Finally, order by rating descending for consistency
    query = query.order('rating', { ascending: false });

    const { data, error } = await query;
    setLoading(false);
    if (!error && data) setResults(data as ContentRow[]);
  };

  /* Answer handler */
  const handleAnswer = async (choice: string) => {
    const next = { ...answers, [currentStep]: choice };
    setAnswers(next);
    await fetchFilteredResults(next);

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  /* Surprise‑Me handler */
  const handleSurprise = () => {
    if (results.length === 0) return;
    const random = results[Math.floor(Math.random() * results.length)];
    setResults([random]); // collapse to single surprise result
    setCurrentStep(totalSteps); // jump to results view
  };

  /* Restart quiz */
  const restartQuiz = () => {
    setAnswers({});
    setResults([]);
    setCurrentStep(1);
  };

  /* Derived values */
  const currentQuestion = quizQuestions.find((q) => q.id === currentStep);

  /*──────────────── UI ──────────────────────────*/
  return (
    <main className="p-6 max-w-xl mx-auto">
      {/* ── RESULTS ───────────────────────────────*/}
      {currentStep > totalSteps ? (
        <section>
          {results.length === 0 ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                No matches – try again
              </h2>
              <button
                onClick={restartQuiz}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Restart Quiz
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {results.length === 1 ? 'Your Pick' : 'Top Matches'}
              </h2>

              {results.slice(0, 5).map((row) => (
                <div
                  key={row.id}
                  className="mb-6 p-4 rounded-lg shadow bg-white flex flex-col"
                >
                  {row.poster_url && (
                    <img
                      src={row.poster_url}
                      alt={row.title}
                      className="w-full max-h-72 object-cover rounded mb-3"
                    />
                  )}

                  <h3 className="text-xl font-bold mb-1">{row.title}</h3>

                  {row.streaming_service && (
                    <p className="text-sm text-gray-600 mb-1">
                      📺 Available on {row.streaming_service}
                    </p>
                  )}

                  {row.description && (
                    <p className="text-sm text-gray-700">{row.description}</p>
                  )}
                </div>
              ))}

              <div className="flex gap-2">
                <button
                  onClick={restartQuiz}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  New Quiz
                </button>
                {results.length > 1 && (
                  <button
                    onClick={handleSurprise}
                    className="px-4 py-2 bg-orange-500 text-white rounded"
                  >
                    Surprise Me Again
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      ) : (
        /* ── QUESTION VIEW ───────────────────────*/
        <section>
          <h2 className="text-lg font-semibold mb-6">
            Question {currentStep} / {totalSteps}
          </h2>

          {currentQuestion && (
            <>
              <p className="mb-4">{currentQuestion.text}</p>

              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center text-sm">
                <button
                  onClick={handleSurprise}
                  className="text-orange-600 underline"
                >
                  Surprise Me 🔀
                </button>

                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="text-gray-600 underline"
                  >
                    Back
                  </button>
                )}
              </div>

              {loading && (
                <p className="mt-4 text-gray-600">Refining results…</p>
              )}
              {!loading && results.length > 0 && (
                <p className="mt-4 text-gray-700 text-sm">
                  ~ <strong>{results.length}</strong> matches so far
                </p>
              )}
            </>
          )}
        </section>
      )}
    </main>
  );
}

