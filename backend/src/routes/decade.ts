import express from 'express';
import { supabase } from '../../supabaseClient';

const router = express.Router();

// GET /api/decades
router.get('/decades', async (_req, res) => {
  try {
    const { data, error } = await supabase.from('movies').select('release_date');

    if (error) {
      console.error('[decades] Supabase error:', error.message);
      return res.status(500).json({ error: 'Supabase query failed' });
    }

    const decades = Array.from(
      new Set(
        (data || []).map((row) =>
          Math.floor(new Date(row.release_date).getFullYear() / 10) * 10
        )
      )
    ).sort((a, b) => a - b);

    res.json({ decades });
  } catch (err) {
    console.error('❌ Error fetching decades:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/movies/decade/:year
router.get('/movies/decade/:year', async (req, res) => {
  const { year } = req.params;
  const startYear = parseInt(year, 10);
  if (isNaN(startYear)) {
    return res.status(400).json({ error: 'Invalid decade year' });
  }
  const startDate = `${startYear}-01-01`;
  const endDate = `${startYear + 9}-12-31`;

  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .gte('release_date', startDate)
      .lte('release_date', endDate);

    if (error) {
      console.error('[decade] Supabase error:', error.message);
      return res.status(500).json({ error: 'Supabase query failed' });
    }

    res.json({ results: data || [] });
  } catch (err) {
    console.error('❌ Error fetching movies by decade:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
