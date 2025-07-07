// ~/Projects/movfoo-backend/src/routes/v1/watchlist.js

import express from 'express';
import { z } from 'zod';
import { supabase } from '../../db.js';

const router = express.Router();

/**
 * GET /v1/watchlist
 * List all items for the authenticated user (via userId in query)
 */
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ message: 'Failed to fetch watchlist' });
  }

  res.json({ items: data });
});

/**
 * POST /v1/watchlist
 * Add a new item to the watchlist
 */
router.post('/', async (req, res) => {
  const schema = z.object({
    user_id: z.string().uuid(),
    title: z.string(),
    type: z.string(),
    platform: z.string(),
    season: z.number().optional(),
    episode: z.number().optional(),
    progress: z.number().optional(),
    status: z.enum(['watching', 'watched', 'saved']).default('watching'),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', issues: parsed.error.issues });
  }

  const { data, error } = await supabase
    .from('watchlist')
    .insert(parsed.data)
    .select('*')
    .single();

  if (error) {
    console.error('Insert error:', error);
    return res.status(500).json({ message: 'Failed to add item' });
  }

  res.status(201).json({ item: data });
});

/**
 * PATCH /v1/watchlist/:id
 * Update progress or status for a given watchlist item
 */
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const patchSchema = z.object({
    user_id: z.string().uuid(),
    season: z.number().optional(),
    episode: z.number().optional(),
    progress: z.number().optional(),
    status: z.enum(['watching', 'watched', 'saved']).optional(),
  });

  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', issues: parsed.error.issues });
  }

  const { data, error } = await supabase
    .from('watchlist')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', parsed.data.user_id)
    .select('*')
    .single();

  if (error) {
    console.error('Update error:', error);
    return res.status(500).json({ message: 'Failed to update item' });
  }

  res.json({ item: data });
});

export default router;

