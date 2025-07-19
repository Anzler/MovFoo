export function useQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { decades } = useDecades();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/questions`;
        console.log('[useQuestions] Fetching from:', url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error('Invalid format: missing or malformed `questions` array');
        }

        const loaded = data.questions.map((q) => ({ ...q }));

        if (decades && decades.length > 0) {
          loaded.forEach((q) => {
            if (q.field === 'release_date') {
            if (
              q.field === 'release_date' &&
              (!q.choices || q.choices.length === 0)
            ) {
              q.choices = decades.map((d) => ({
                value: String(d),
                label: `${d}s`,
              }));
            }
          });
        }

        setQuestions(loaded);
      } catch (err) {
        console.error('[useQuestions] Error:', err);
        setError('Failed to load quiz questions.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [decades]);

  return { questions, loading, error };
}


