// backend/src/routes/filter.ts
import express from 'express';
import { getFilteredMovies } from '../filters/movieFilter';

const router = express.Router();

router.post('/filter', async (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid format: answers must be an array' });
  }

  try {
    const results = await getFilteredMovies(answers);
    return res.json({ results });
  } catch (err) {
    console.error('[filter] Error:', err);
    return res.status(500).json({ error: 'Movie filtering failed' });
  }
});

export default router;

