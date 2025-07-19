import express from 'express';
import dotenv from 'dotenv';
import { supabase } from '../../supabaseClient';

dotenv.config();

const router = express.Router(); // ✅ This line was missing

// POST /api/filter
router.post('/filter', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('title, release_date') // test fields
      .limit(10);

    if (error) {
      console.error('[filter] Supabase error:', error.message);
      return res.status(500).json({ error: 'Supabase query failed' });
    }

    res.json({ results: data || [] });
  } catch (err) {
    console.error('❌ Unexpected error in /filter:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

