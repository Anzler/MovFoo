// ~/Projects/movfoo/backend/src/db.js
//
// Centralised Supabase client for the backend.
// Uses the *service‑role* key – never expose this file to the front‑end.

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    '❌  Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
    'Add them in Render → Environment or in a local .env file.'
  );
  process.exit(1);
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false } // stateless API
});

