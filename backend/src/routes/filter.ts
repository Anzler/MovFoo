import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/filter
router.post('/filter', async (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid input format. Expected answers array.' });
  }

  try {
    const conditions: string[] = [];
    const values: any[] = [];

    answers.forEach(({ field, value }) => {
      if (!field || !value || value === 'Any') return;

      switch (field) {
        case 'release_date': {
          const decade = parseInt(value);
          const startDate = `${decade}-01-01`;
          const endDate = `${decade + 9}-12-31`;
          values.push(startDate, endDate);
          conditions.push(`release_date BETWEEN $${values.length - 1} AND $${values.length}`);
          break;
        }

        case 'spoken_languages':
        case 'production_countries':
        case 'genres': {
          values.push(value);
          conditions.push(`${field}::text ILIKE '%' || $${values.length} || '%'`);
          break;
        }

        case 'runtime': {
          if (value.includes('hour and a half')) {
            conditions.push('runtime < 90');
          } else if (value.includes('2 hours')) {
            conditions.push('runtime BETWEEN 90 AND 120');
          } else if (value.includes('Epic')) {
            conditions.push('runtime > 120');
          }
          break;
        }

        case 'revenue': {
          if (value.includes('Indie')) {
            conditions.push('revenue < 10000000');
          } else if (value.includes('Blockbuster')) {
            conditions.push('revenue > 100000000');
          }
          break;
        }

        case 'is_franchise': {
          if (value === 'Yes') {
            values.push(true);
            conditions.push(`${field} = $${values.length}`);
          } else if (value === 'No') {
            values.push(false);
            conditions.push(`${field} = $${values.length}`);
          }
          break;
        }

        default: {
          values.push(value);
          conditions.push(`${field} ILIKE $${values.length}`);
        }
      }
    });

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const query = `SELECT * FROM movies ${whereClause} LIMIT 25`;

    console.log('[filter] Executing query:\n', query, '\nWith values:', values);

    const { rows } = await pool.query(query, values);
    res.json({ results: rows });
  } catch (error) {
    console.error('❌ Error filtering movies:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

