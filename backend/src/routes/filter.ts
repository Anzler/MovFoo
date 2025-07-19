// backend/src/routes/filter.ts

import express, { Request, Response } from 'express';
import { getFilteredMovies } from '../filters/movieFilter';

const router = express.Router();

/**
 * POST /api/filter
 * Accepts user quiz answers and returns filtered movies from Supabase.
 */
router.post('/filter', async (req: Request, res: Response) => {
  const { answers } = req.body;

  // Basic shape validation
  if (!Array.isArray(answers)) {
    console.warn('[filter] Invalid payload structure:', req.body);
    return res
      .status(400)
      .json({ error: 'Invalid format: "answers" must be an array' });
  }

  // Optional: deeper validation
  const isValid = answers.every(
    (a) =>
      typeof a === 'object' &&
      typeof a.field === 'string' &&
      a.field.length > 0 &&
      'value' in a
  );

  if (!isValid) {
    console.warn('[filter] Malformed answer object:', answers);
    return res
      .status(400)
      .json({ error: 'Invalid answer format: must include "field" and "value"' });
  }

  try {
    const results = await getFilteredMovies(answers);

    console.log(`[filter] ✅ Returned ${results.length} result(s)`);
    return res.json({ results });
  } catch (err: any) {
    console.error('[filter] ❌ Error filtering movies:', err.message);
    return res.status(500).json({ error: 'Movie filtering failed' });
  }
});

export default router;

