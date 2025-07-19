router.post('/filter', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('title, release_date')
      .limit(10);

    if (error) {
      console.error('[filter] Supabase error:', error.message);
      return res.status(500).json({ error: 'Supabase query failed' });
    }

    res.json({ results: data || [] });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

