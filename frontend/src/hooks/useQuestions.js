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

      console.log('[useQuestions] Loaded questions:', data.questions);
      const loaded = data.questions.map((q) => ({ ...q }));

      if (decades && decades.length > 0) {
        loaded.forEach((q) => {
          if (q.field === 'release_date') {
            q.choices = decades.map((d) => ({ value: String(d), label: `${d}s` }));
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
}, [decades]); // ✅ correct placement

