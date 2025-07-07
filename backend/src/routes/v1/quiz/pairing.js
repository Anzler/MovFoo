// ~/Projects/movfoo/backend/src/routes/v1/quiz/pairing.js

import express from 'express';
import { supabase } from '../../../db.js';

const router = express.Router();

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
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('❌ Supabase fetch error:', error);
      return res.status(500).json({ error: 'Failed to load session from database' });
    }

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const answers = session.answers || {};
    const movie = await fetchMovieRecommendation(answers);
    const recipe = await fetchRecipeRecommendation(answers);

    res.status(200).json({ movie, recipe });
  } catch (err) {
    console.error('❌ Pairing results error:', err);
    res.status(500).json({ error: 'Unexpected server error while loading pairing results' });
  }
});

export default router;

/* ─────────────── Helpers ─────────────── */

async function fetchMovieRecommendation(answers) {
  let q = supabase.from("content_view").select("*");

  if (answers.movie_genre) q = q.eq("genre", answers.movie_genre);
  if (answers.movie_tone) q = q.ilike("tone", `%${answers.movie_tone}%`);

  q = q.order("rating", { ascending: false }).limit(1);

  const { data, error } = await q;
  if (error || !data?.length) return null;

  const movie = data[0];
  return {
    title: movie.title,
    poster_url: movie.poster_url,
    synopsis: movie.synopsis,
    rating: movie.rating,
  };
}

async function fetchRecipeRecommendation(answers) {
  let q = supabase.from("recipe_view").select("*");

  if (answers.meal_type) q = q.eq("meal_type", answers.meal_type);
  if (answers.cuisine && answers.cuisine !== "Surprise me") {
    q = q.eq("cuisine", answers.cuisine);
  }

  q = q.order("popularity", { ascending: false }).limit(1);

  const { data, error } = await q;
  if (error || !data?.length) return null;

  const recipe = data[0];
  return {
    name: recipe.name,
    poster_url: recipe.image_url,
    description: recipe.description,
    prep_time: recipe.prep_time,
  };
}

