// backend/src/filters/movieFilter.ts

import { supabase } from '../supabaseClient';

/**
 * Filters Supabase "movies" based on quiz answers.
 */
export async function getFilteredMovies(
  answers: { field: string; value: any }[]
) {
  let query = supabase.from('movies').select('*').limit(25);

  for (const { field, value } of answers) {
    if (!field || value === '' || value === null || value === 'Any' || value === 'any') continue;

    switch (field) {
      case 'release_date': {
        const decade = parseInt(value);
        const start = `${decade}-01-01`;
        const end = `${decade + 9}-12-31`;
        query = query.gte('release_date', start).lte('release_date', end);
        break;
      }

      case 'watch_providers':
      case 'spoken_languages':
      case 'production_countries':
      case 'genres': {
        query = query.ilike(field, `%${value}%`);
        break;
      }

      case 'runtime': {
        if (value.includes('hour and a half')) {
          query = query.gte('runtime', 80).lte('runtime', 100);
        } else if (value.includes('2 hours')) {
          query = query.gte('runtime', 101).lte('runtime', 130);
        } else if (value.includes('Epic')) {
          query = query.gt('runtime', 130);
        }
        break;
      }

      case 'theme':
      case 'sub_theme': {
        query = query.ilike(field, `%${value}%`);
        break;
      }

      case 'revenue': {
        if (value === 'Indie') {
          query = query.lt('revenue', 10000000);
        } else if (value === 'Blockbuster') {
          query = query.gte('revenue', 100000000);
        }
        break;
      }

      case 'is_franchise': {
        if (value === 'Yes') query = query.eq(field, true);
        else if (value === 'No') query = query.eq(field, false);
        break;
      }

      default: {
        query = query.eq(field, value);
      }
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getFilteredMovies] Supabase error:', error.message);
    throw new Error('Supabase query failed');
  }

  return data || [];
}

