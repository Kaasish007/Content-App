const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// POST /api/follow/toggle — follow or unfollow
router.post('/toggle', async (req, res) => {
  const { follower_id, following_id } = req.body;

  if (!follower_id || !following_id) {
    return res.status(400).json({ error: 'Missing follower_id or following_id' });
  }

  if (follower_id === following_id) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }

  try {
    // Check if already following
    const { data: existing } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', follower_id)
      .eq('following_id', following_id)
      .single();

    if (existing) {
      // Unfollow
      await supabase
        .from('followers')
        .delete()
        .eq('follower_id', follower_id)
        .eq('following_id', following_id);

      return res.json({ following: false });
    } else {
      // Follow
      await supabase
        .from('followers')
        .insert({ follower_id, following_id });

      // Create notification for the followed user
      await supabase
        .from('notifications')
        .insert({
          user_id: following_id,
          from_user_id: follower_id,
          type: 'follow',
          message: 'started following you'
        });

      return res.json({ following: true });
    }
  } catch (err) {
    console.error('Follow toggle error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/follow/status?follower_id=x&following_id=y
router.get('/status', async (req, res) => {
  const { follower_id, following_id } = req.query;

  try {
    const { data } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', follower_id)
      .eq('following_id', following_id)
      .single();

    res.json({ following: !!data });
  } catch (err) {
    res.json({ following: false });
  }
});

// GET /api/follow/counts?user_id=x
router.get('/counts', async (req, res) => {
  const { user_id } = req.query;

  try {
    const { count: followers } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', user_id);

    const { count: following } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', user_id);

    res.json({ followers: followers || 0, following: following || 0 });
  } catch (err) {
    console.error('Counts error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/follow/following-ids?user_id=x — for For You feed
router.get('/following-ids', async (req, res) => {
  const { user_id } = req.query;

  try {
    const { data } = await supabase
      .from('followers')
      .select('following_id')
      .eq('follower_id', user_id);

    const ids = data ? data.map(row => row.following_id) : [];
    res.json({ ids });
  } catch (err) {
    console.error('Following IDs error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;