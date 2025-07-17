// backend/src/filters/movieFilter.ts

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Applies sequential filters to the movies table based on user's answers.
 * @param answers Array of user answers [{ field: 'release_date', value: '1980s' }, ...]
 */
export async function getFilteredMovies(answers: { field: string; value: any }[]) {
  let baseQuery = `SELECT * FROM movies WHERE true`;
  const queryParams: any[] = [];

  answers.forEach((answer, index) => {
    const { field, value } = answer;

    // Skip 'any' answers
    if (value === 'any' || value === null || value === '') return;

    switch (field) {
      case 'release_date': {
        const decadeStart = parseInt(value);
        const decadeEnd = decadeStart + 9;
        queryParams.push(`${decadeStart}-01-01`, `${decadeEnd}-12-31`);
        baseQuery += ` AND release_date BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
        break;
      }

      case 'watch_providers': {
        // assumes JSONB array of strings like ["Netflix", "Disney+"]
        queryParams.push(value);
        baseQuery += ` AND watch_providers ?| $${queryParams.length}`;
        break;
      }

      case 'spoken_languages':
      case 'production_countries':
      case 'genres': {
        queryParams.push(value);
        baseQuery += ` AND ${field}::text ILIKE '%' || $${queryParams.length} || '%'`;
        break;
      }

      case 'runtime': {
        // normalize user-friendly buckets
        if (value === 'About an hour and a half') {
          baseQuery += ` AND runtime BETWEEN 80 AND 100`;
        } else if (value === 'About 2 hours') {
          baseQuery += ` AND runtime BETWEEN 101 AND 130`;
        } else if (value === 'Epic') {
          baseQuery += ` AND runtime > 130`;
        }
        break;
      }

      case 'theme':
      case 'sub_theme': {
        queryParams.push(value);
        baseQuery += ` AND ${field} ILIKE $${queryParams.length}`;
        break;
      }

      case 'revenue': {
        // Buckets can be defined from your UI options
        if (value === 'Indie') {
          baseQuery += ` AND revenue < 10000000`;
        } else if (value === 'Blockbuster') {
          baseQuery += ` AND revenue >= 100000000`;
        }
        break;
      }

      default: {
        // fallback: string match
        queryParams.push(value);
        baseQuery += ` AND ${field} = $${queryParams.length}`;
      }
    }
  });

  const result = await pool.query(baseQuery, queryParams);
  return result.rows;
}

