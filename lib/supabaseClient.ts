/** lib/supabaseClient.ts
 *  Centralised Supabase browser client.
 *  Usage: import { supabase } from '@/lib/supabaseClient';
 */
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

