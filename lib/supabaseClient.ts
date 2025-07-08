'use client';

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './supabase.types'; // Adjust this if your types file has a different name or path

export const supabase = createPagesBrowserClient<Database>();

