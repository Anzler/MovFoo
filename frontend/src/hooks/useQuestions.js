import { useEffect, useState } from 'react';

export function useQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/questions`);

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();

        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error('Response format is invalid');
        }

        console.log('[useQuestions] Loaded questions:', data.questions);
        setQuestions(data.questions);
      } catch (err) {
        console.error('[useQuestions] Error:', err);
        setError('Failed to load quiz questions.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  return { questions, loading, error };
}

