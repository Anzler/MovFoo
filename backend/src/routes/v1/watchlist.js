import express from 'express';
import { z } from 'zod';
import { supabase } from '../../db.js';

const router = express.Router();

/**
 * GET /v1/watchlist?userId={uuid}
 * Returns all watchlist items for a user.
 */
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  try {
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase fetch error:', error.message);
      return res.status(500).json({ message: 'Failed to fetch watchlist' });
    }

    res.json({ items: data });
  } catch (err) {
    console.error('❌ Unexpected GET error:', err.message);
    res.status(500).json({ message: 'Unexpected server error' });
  }
});

/**
 * POST /v1/watchlist
 * Adds a new item to the user's watchlist.
 */
router.post('/', async (req, res) => {
  const schema = z
    .object({
      user_id: z.string().uuid(),
      title: z.string(),
      type: z.string(),
      platform: z.string(),
      season: z.number().optional(),
      episode: z.number().optional(),
      progress: z.number().optional(),
      status: z.enum(['watching', 'watched', 'saved']).default('watching'),
    })
    .strict();

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid input',
      issues: parsed.error.issues,
    });
  }

  try {
    const { data, error } = await supabase
      .from('watchlist')
      .insert(parsed.data)
      .select('*')
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error.message);
      return res.status(500).json({ message: 'Failed to add item' });
    }

    res.status(201).json({ item: data });
  } catch (err) {
    console.error('❌ Unexpected POST error:', err.message);
    res.status(500).json({ message: 'Unexpected server error' });
  }
});

/**
 * PATCH /v1/watchlist/:id
 * Updates progress/status for a specific item.
 */
router.patch('/:id', async (req, res) => {
  const { id } = req.params;

  const patchSchema = z
    .object({
      user_id: z.string().uuid(),
      season: z.number().optional(),
      episode: z.number().optional(),
      progress: z.number().optional(),
      status: z.enum(['watching', 'watched', 'saved']).optional(),
    })
    .strict();

  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid input',
      issues: parsed.error.issues,
    });
  }

  try {
    const { data, error } = await supabase
      .from('watchlist')
      .update(parsed.data)
      .eq('id', id)
      .eq('user_id', parsed.data.user_id)
      .select('*')
      .single();

    if (error) {
      console.error('❌ Supabase update error:', error.message);
      return res.status(500).json({ message: 'Failed to update item' });
    }

    res.json({ item: data });
  } catch (err) {
    console.error('❌ Unexpected PATCH error:', err.message);
    res.status(500).json({ message: 'Unexpected server error' });
  }
});

export default router;

