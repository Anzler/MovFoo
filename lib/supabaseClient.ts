// ~/Projects/movfoo/lib/supabaseClient.ts
'use client';

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './supabase.types';

// Avoid throwing errors on build or browser hydration
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = url && key
  ? createPagesBrowserClient<Database>({ supabaseUrl: url, supabaseKey: key })
  : null;

