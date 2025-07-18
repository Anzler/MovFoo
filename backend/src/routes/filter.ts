import express from 'express';
import { getFilteredMovies } from '../filters/movieFilter';

const router = express.Router();

router.post('/filter', async (req, res) => {
  try {
    const answers = req.body.answers;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid input format.' });
    }

    const movies = await getFilteredMovies(answers);
    res.json({ results: movies });
  } catch (error) {
    console.error('Error in /filter:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;

