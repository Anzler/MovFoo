// ~/Projects/movfoo/lib/supabaseClient.ts
//
// Front‑end Supabase client (browser‑side or React Server Components).
// Uses the **public ANON KEY** only – safe to expose.

'use client';

import { createPagesBrowserClient } from '@supabase/ssr';
import type { Database } from './supabase.types'; // ↙︎ generated types (optional)

export const supabase = createPagesBrowserClient<Database>();

