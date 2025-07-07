/******************************************************************************
 * ~/Projects/movfoo-backend/src/index.js
 *
 * Production-ready Express API for the MovFoo “What do I want to watch?”
 * and pairing quizzes. Supports session tracking via Supabase and dynamic
 * filtering via content_view and recipe_view.
 ******************************************************************************/

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const { z } = require('zod');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { supabase } = require('./db.js');

// Routers
const watchlistRouter = require('./routes/v1/watchlist.js');
const pairingRouter = require('./routes/v1/quiz/pairing.js');
const foodQuizRouter = require('./routes/v1/quiz/food.js');
const movieQuizRouter = require('./routes/v1/quiz/movie.js'); // ✅ ADDED

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
app.use("/v1/quiz/movie", movieQuizRouter); // ✅ ADDED

/* ── Start server ─────────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`✅ MovFoo API listening on :${PORT} (${process.env.NODE_ENV || 'dev'})`);
});

