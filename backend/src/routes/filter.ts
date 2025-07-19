import express from 'express';
import { getFilteredMovies } from '../filters/movieFilter'; // this exists and is working

const router = express.Router();

// POST /api/filter
router.post('/filter', async (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid input format. Expected answers array.' });
  }

  try {
    const filtered = await getFilteredMovies(answers);
    console.log(`[filter] Returned ${filtered.length} movies based on ${answers.length} answers`);
    res.json({ results: filtered });
  } catch (err) {
    console.error('[filter] Internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

