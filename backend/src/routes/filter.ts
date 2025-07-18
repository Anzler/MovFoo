import express from 'express';
import dotenv from 'dotenv';
import { supabase } from '../../supabaseClient'; // ✅ Corrected path

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
    let query = supabase.from('movies').select('*');

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
