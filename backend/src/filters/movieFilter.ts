// backend/src/filters/movieFilter.ts

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Dynamically filters movies based on user answers.
 * Supports many permutations like genre, country, runtime, etc.
 */
export async function getFilteredMovies(
  answers: { field: string; value: any }[]
) {
  let baseQuery = `SELECT * FROM movies WHERE true`;
  const queryParams: any[] = [];

  answers.forEach(({ field, value }) => {
    if (
      !field ||
      value === null ||
      value === undefined ||
      value === '' ||
      value === 'Any' ||
      value === 'any'
    )
      return;

    switch (field) {
      // 1. Release Date by Decade
      case 'release_date': {
        const decadeStart = parseInt(value);
        const decadeEnd = decadeStart + 9;
        queryParams.push(`${decadeStart}-01-01`, `${decadeEnd}-12-31`);
        baseQuery += ` AND release_date BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
        break;
      }

      // 2. Streaming Providers (JSONB)
      case 'watch_providers': {
        // Expects "Netflix", "Disney+" etc
        queryParams.push(`"${value}"`);
        baseQuery += ` AND watch_providers::text ILIKE '%' || $${queryParams.length} || '%'`;
        break;
      }

      // 3. JSONB Filters (genres, languages, countries)
      case 'spoken_languages':
      case 'production_countries':
      case 'genres': {
        queryParams.push(value);
        baseQuery += ` AND ${field}::text ILIKE '%' || $${queryParams.length} || '%'`;
        break;
      }

      // 4. Runtime Categories
      case 'runtime': {
        if (value.includes('hour and a half')) {
          baseQuery += ` AND runtime BETWEEN 80 AND 100`;
        } else if (value.includes('2 hours')) {
          baseQuery += ` AND runtime BETWEEN 101 AND 130`;
        } else if (value.includes('Epic')) {
          baseQuery += ` AND runtime > 130`;
        }
        break;
      }

      // 5. Thematic Matching
      case 'theme':
      case 'sub_theme': {
        queryParams.push(value);
        baseQuery += ` AND ${field} ILIKE $${queryParams.length}`;
        break;
      }

      // 6. Revenue Buckets
      case 'revenue': {
        if (value === 'Indie') {
          baseQuery += ` AND revenue < 10000000`;
        } else if (value === 'Blockbuster') {
          baseQuery += ` AND revenue >= 100000000`;
        }
        break;
      }

      // 7. Fallback match (e.g. is_franchise, status, etc.)
      default: {
        queryParams.push(value);
        baseQuery += ` AND ${field} = $${queryParams.length}`;
      }
    }
  });

  // Debug log
  console.log('[getFilteredMovies] SQL:', baseQuery);
  console.log('[getFilteredMovies] Params:', queryParams);

  const result = await pool.query(baseQuery, queryParams);
  return result.rows;
}

