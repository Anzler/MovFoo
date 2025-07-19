import express from 'express';
import { getFilteredMovies } from '../filters/movieFilter';

const router = express.Router();

// POST /api/filter
router.post('/filter', async (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid input format. Expected answers array.' });
  }

  try {
    const movies = await getFilteredMovies(answers);
    console.log('[filter] Returning', movies.length, 'filtered movie(s)');
    res.json({ results: movies });
  } catch (err) {
    console.error('❌ Error in /filter:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

