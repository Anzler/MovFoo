// ~/Projects/movfoo/lib/supabaseClient.ts
'use client';

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './supabase.types';

export const supabase = createPagesBrowserClient<Database>();

