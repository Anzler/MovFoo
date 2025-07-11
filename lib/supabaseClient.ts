// ~/Projects/movfoo/lib/supabaseClient.ts
'use client';

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './supabase.types';

/**
 * Returns a Supabase client initialized with required environment variables.
 * This function delays initialization to avoid running at build time.
 */
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      '❌ Supabase client failed to initialize. Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return createPagesBrowserClient<Database>({
    supabaseUrl: url,
    supabaseKey: key,
  });
}

