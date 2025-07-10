/******************************************************************************
 * ~/Projects/movfoo-backend/src/index.js
 *
 * Production-ready Express API for the MovFoo “What do I want to watch?”
 * and pairing quizzes. Supports session tracking via Supabase and dynamic
 * filtering via content_view and recipe_view.
 ******************************************************************************/

// ✅ MUST load env before any imports that might use it
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// (Optional) Debug print — remove after testing
console.log("🧪 ENV DEBUG:", {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  TMDB_API_KEY: !!process.env.TMDB_API_KEY,
  SPOONACULAR_API_KEY: !!process.env.SPOONACULAR_API_KEY,
});

import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { supabase } from './db.js';

const helmet = (await import('helmet')).default;

// Routers
import watchlistRouter from './routes/v1/watchlist.js';
import pairingRouter from './routes/v1/quiz/pairing.js';
import foodQuizRouter from './routes/v1/quiz/food.js';
import movieQuizRouter from './routes/v1/quiz/movie.js';
import spoonacularRouter from './routes/v1/spoonacular.js';

// ✅ Validate required env-vars
const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'TMDB_API_KEY', 'SPOONACULAR_API_KEY'];
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
app.use("/v1/quiz/movie", movieQuizRouter);
app.use("/api/v1/spoonacular", spoonacularRouter);

/* ── Start server ─────────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`✅ MovFoo API listening on :${PORT} (${process.env.NODE_ENV || 'dev'})`);
});

