// frontend/src/hooks/useQuestions.js

import { useEffect, useState } from 'react';

export function useQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/questions`);
        const data = await response.json();
        setQuestions(data.questions);
      } catch (err) {
        setError('Failed to load quiz questions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  return { questions, loading, error };
}

