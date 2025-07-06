/******************************************************************************
 * ~/Projects/movfoo-backend/src/index.js
 *
 * Production-ready Express API for the MovFoo “What do I want to watch?”
 * and pairing quizzes. Supports session tracking via Supabase and dynamic
 * filtering via content_view and recipe_view.
 ******************************************************************************/

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { supabase } from './db.js';

// Routers
import watchlistRouter from './routes/v1/watchlist.js';
import pairingRouter from './routes/v1/quiz/pairing.js';
import foodQuizRouter from './routes/v1/quiz/food.js';

dotenv.config();

// ── Validate required env-vars ────────────────────────────────────────────────
const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'TMDB_API_KEY'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing required env var: ${key}`);
    process.exit(1);
  }
}

// ── Express app setup ─────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 10000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'] }));
app.use(express.json());

/* ══════════════════════════════════════════════════════════════════════
 * Health check
 * ══════════════════════════════════════════════════════════════════════ */

app.get('/', (_, res) => res.send('🎬 MovFoo backend is running!'));
app.get('/health', (_, res) =>
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV || 'development' })
);

/* ══════════════════════════════════════════════════════════════════════
 * Routes
 * ══════════════════════════════════════════════════════════════════════ */

app.use("/v1/watchlist", watchlistRouter);
app.use("/v1/quiz/pairing", pairingRouter);
app.use("/v1/quiz/food", foodQuizRouter);

/* ══════════════════════════════════════════════════════════════════════
 * QUIZ: “What do I want to watch?”
 * ══════════════════════════════════════════════════════════════════════ */

const quizInputSchema = z.object({
  sessionId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  questionKey: z.string(),
  answerValue: z.union([z.string(), z.number(), z.boolean()]),
});

app.post('/v1/quiz/movie/submit', async (req, res) => {
  const correlationId = uuidv4();
  res.setHeader('x-correlation-id', correlationId);

  const parse = quizInputSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid input', issues: parse.error.issues });
  }

  try {
    const { sessionId, userId, questionKey, answerValue } = parse.data;

    const session = await upsertSession(sessionId, userId, questionKey, answerValue, 'watch');
    const { rows: results } = await getMovies(session.answers);
    res.json({ sessionId: session.id, currentStep: session.current_step, results });
  } catch (err) {
    console.error(`[${correlationId}]`, err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/v1/quiz/movie/results', async (req, res) => {
  const sessionId = req.query.s;
  if (!sessionId) return res.status(400).json({ message: 'sessionId (s) query param required' });

  const { data: session, error } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) return res.status(500).json({ message: 'DB error', details: error });
  if (!session) return res.status(404).json({ message: 'Session not found' });

  try {
    const { rows: results } = await getMovies(session.answers);
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ────────────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────────────── */

async function upsertSession(id, userId, key, val, type = 'watch') {
  let session;

  if (id) {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    session = data;
  } else {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: userId,
        quiz_type: type,
        current_step: 0,
        answers: {},
      })
      .select('*')
      .single();
    if (error) throw error;
    session = data;
  }

  const answers = { ...session.answers, [key]: val };
  const step = session.current_step + 1;

  const { data: updated, error: updErr } = await supabase
    .from('quiz_sessions')
    .update({ answers, current_step: step, updated_at: 'now()' })
    .eq('id', session.id)
    .select('*')
    .single();

  if (updErr) throw updErr;
  return updated;
}

async function getMovies(answers) {
  let q = supabase.from('content_view').select('*');

  if (answers.audience && answers.audience !== 'Any') q = q.eq('audience', answers.audience);
  if (answers.genre && answers.genre !== 'Any') q = q.eq('genre', answers.genre);
  if (answers.type && answers.type !== 'Any') q = q.eq('type', answers.type);
  if (answers.rating_min && !isNaN(answers.rating_min)) q = q.gte('rating', Number(answers.rating_min));
  if (answers.based_on_true_story === true) q = q.eq('based_on_true_story', true);

  if (answers.special_category && answers.special_category !== 'none') {
    const year = new Date().getFullYear();
    switch (answers.special_category) {
      case 'classic':
        q = q.lt('year', year - 20);
        break;
      case 'new_release':
        q = q.gte('year', year - 2);
        break;
    }
  }

  const limit = Math.max(1, 12 - Object.keys(answers).length * 2);
  q = q.order('rating', { ascending: false }).limit(limit);

  const { data, error } = await q;
  if (error) throw error;
  if (!data || data.length === 0) return { rows: await fallbackFromTMDB(answers) };

  return { rows: data };
}

async function fallbackFromTMDB(answers) {
  const genreMap = {
    Action: 28,
    Comedy: 35,
    Drama: 18,
    Horror: 27,
    Romance: 10749,
  };

  const genreId = genreMap[answers.genre];
  const year = new Date().getFullYear();
  const releaseGTE = answers.special_category === 'classic'
    ? `${year - 30}-01-01`
    : `${year - 3}-01-01`;

  const res = await axios.get('https://api.themoviedb.org/3/discover/movie', {
    params: {
      api_key: process.env.TMDB_API_KEY,
      with_genres: genreId,
      primary_release_date_gte: releaseGTE,
      sort_by: 'popularity.desc',
      page: 1,
    },
  });

  return res.data.results.slice(0, 5).map(movie => ({
    id: `tmdb-${movie.id}`,
    title: movie.title,
    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    synopsis: movie.overview,
    rating: movie.vote_average,
    source: 'TMDB',
  }));
}

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
  if (answers.cuisine && answers.cuisine !== "Surprise me")
    q = q.eq("cuisine", answers.cuisine);

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

/* ── Start server ─────────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`✅ MovFoo API listening on :${PORT} (${process.env.NODE_ENV || 'dev'})`);
});

