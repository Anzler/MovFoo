// ~/Projects/movfoo/backend/src/routes/v1/quiz/pairing.js

import express from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { supabase } from '../../../db.js';

const router = express.Router();

/**
 * POST /v1/quiz/pairing/submit
 */
router.post('/submit', async (req, res) => {
  const PairingInput = z.object({
    genre: z.string(),
    releaseWindow: z.enum(['new', 'classic']),
  });

  const parsed = PairingInput.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
  }

  const { genre, releaseWindow } = parsed.data;
  const sessionId = uuidv4();

  try {
    const movieResults = await fetchMoviesFromTMDB(genre, releaseWindow);
    const foodResults = await fetchFoodFromSpoonacular();

    const { error } = await supabase.from('quiz_sessions').insert([
      {
        id: sessionId,
        movie_results: movieResults,
        food_results: foodResults,
      },
    ]);

    if (error) throw error;

    res.status(200).json({ sessionId });
  } catch (err) {
    console.error('❌ Error submitting pairing quiz:', err);
    res.status(500).json({ error: 'Server error submitting quiz' });
  }
});

/**
 * GET /v1/quiz/pairing/results?s=<sessionId>
 */
router.get('/results', async (req, res) => {
  const sessionId = req.query.s;
  if (!sessionId) {
    return res.status(400).json({ error: 'Missing sessionId in query param (s)' });
  }

  try {
    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .select('movie_results, food_results')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('❌ Supabase fetch error:', error);
      return res.status(500).json({ error: 'Failed to load session from database' });
    }

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.status(200).json({
      movie: session.movie_results || [],
      recipe: session.food_results || [],
    });
  } catch (err) {
    console.error('❌ Pairing results error:', err);
    res.status(500).json({ error: 'Unexpected server error while loading pairing results' });
  }
});

export default router;

/* ─────────────── Helpers ─────────────── */

async function fetchMoviesFromTMDB(genre, releaseWindow) {
  const genreMap = { Action: 28, Comedy: 35, Drama: 18, Horror: 27 };
  const genreId = genreMap[genre] ?? 35;
  const currentYear = new Date().getFullYear();
  const year = releaseWindow === 'new' ? currentYear - 3 : 2000;

  const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
    params: {
      api_key: process.env.TMDB_API_KEY,
      with_genres: genreId,
      primary_release_date_gte: `${year}-01-01`,
      sort_by: 'popularity.desc',
      page: 1,
    },
  });

  return response.data.results.slice(0, 3).map((movie) => ({
    id: movie.id,
    title: movie.title,
    synopsis: movie.overview || '',
    rating: movie.vote_average,
    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  }));
}

async function fetchFoodFromSpoonacular() {
  const response = await axios.get('https://api.spoonacular.com/recipes/random', {
    params: {
      apiKey: process.env.SPOONACULAR_API_KEY,
      number: 3,
    },
  });

  return response.data.recipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    summary: recipe.summary || '',
    image_url: recipe.image,
  }));
}

