import express from 'express';
import dotenv from 'dotenv';
import { supabase } from '../supabaseClient';

dotenv.config();

const router = express.Router();

// POST /api/filter
router.post('/filter', async (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid input format. Expected answers array.' });
  }

  try {
    let query = supabase.from('movies').select('*').limit(25);

    answers.forEach(({ field, value }) => {
      if (!field || !value || value === 'Any') return;

      switch (field) {
        case 'release_date': {
          const decade = parseInt(value);
          const startDate = `${decade}-01-01`;
          const endDate = `${decade + 9}-12-31`;
          query = query.gte('release_date', startDate).lte('release_date', endDate);
          break;
        }

        case 'spoken_languages':
        case 'production_countries':
        case 'genres': {
          query = query.ilike(field, `%${value}%`);
          break;
        }

        case 'runtime': {
          if (value.includes('hour and a half')) {
            query = query.lt('runtime', 90);
          } else if (value.includes('2 hours')) {
            query = query.gte('runtime', 90).lte('runtime', 120);
          } else if (value.includes('Epic')) {
            query = query.gt('runtime', 120);
          }
          break;
        }

        case 'revenue': {
          if (value.includes('Indie')) {
            query = query.lt('revenue', 10000000);
          } else if (value.includes('Blockbuster')) {
            query = query.gt('revenue', 100000000);
          }
          break;
        }

        case 'is_franchise': {
          if (value === 'Yes') {
            query = query.eq(field, true);
          } else if (value === 'No') {
            query = query.eq(field, false);
          }
          break;
        }

        default: {
          query = query.ilike(field, `%${value}%`);
        }
      }
    });

    const { data, error } = await query;

    if (error) {
      console.error('[filter] Supabase error:', error.message);
      return res.status(500).json({ error: 'Supabase query failed' });
    }

    res.json({ results: data || [] });
  } catch (error) {
    console.error('❌ Error filtering movies:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

