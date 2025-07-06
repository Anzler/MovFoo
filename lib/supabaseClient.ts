// ~/Projects/movfoo/lib/supabaseClient.ts
//
// Front‑end Supabase client (browser‑side or React Server Components).
// Uses the **public ANON KEY** only – safe to expose.

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './supabase.types'; // ↙︎ generated types (optional)

export const supabase = createBrowserSupabaseClient<Database>({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
});

