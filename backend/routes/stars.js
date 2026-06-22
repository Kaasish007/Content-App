const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Rank thresholds
const RANKS = [
  { name: 'Icon', emoji: '🌟', min: 1000 },
  { name: 'Legend', emoji: '👑', min: 500 },
  { name: 'Visionary', emoji: '💎', min: 150 },
  { name: 'Stellar', emoji: '⭐', min: 50 },
  { name: 'Blazer', emoji: '🔥', min: 10 },
  { name: 'Newcomer', emoji: '🌱', min: 0 },
];

async function updateRank(user_id) {
  try {
    // Calculate total stars earned/received (not spent/gifted)
    const { data: starsData } = await supabase
      .from('stars')
      .select('amount, type')
      .eq('user_id', user_id);

    const totalEarned = starsData?.reduce((acc, s) => {
      if (s.type === 'earned' || s.type === 'received') return acc + s.amount;
      return acc;
    }, 0) || 0;

    // Find correct rank
    const rank = RANKS.find(r => totalEarned >= r.min);
    const rankLabel = `${rank.emoji} ${rank.name}`;

    // Update profiles table
    await supabase
      .from('profiles')
      .update({ rank: rankLabel })
      .eq('user_id', user_id);

    return rankLabel;
  } catch (err) {
    console.error('Rank update error:', err);
  }
}

// Get user's star balance
router.get('/balance', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { data } = await supabase
      .from('stars')
      .select('amount, type')
      .eq('user_id', user.id);

    const balance = data?.reduce((acc, star) => {
      if (star.type === 'earned' || star.type === 'received') return acc + star.amount;
      if (star.type === 'spent' || star.type === 'gifted') return acc - star.amount;
      return acc;
    }, 0) || 0;

    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Award daily login star
router.post('/daily-login', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
      .from('stars')
      .select('*')
      .eq('user_id', user.id)
      .eq('reason', 'daily_login')
      .gte('created_at', today)
      .single();

    if (existing) {
      return res.json({ message: 'Already claimed today', claimed: false });
    }

    await supabase.from('stars').insert({
      user_id: user.id,
      amount: 1,
      reason: 'daily_login',
      type: 'earned'
    });

    // Update rank after earning
    const newRank = await updateRank(user.id);

    res.json({ message: '⭐ Daily login star awarded!', claimed: true, rank: newRank });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get star history
router.get('/history', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { data } = await supabase
      .from('stars')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    res.json({ history: data || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check daily generation limit
router.get('/check-limit', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const today = new Date().toISOString().split('T')[0];
    const { count } = await supabase
      .from('content_inputs')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .gte('created_at', today);

    const limit = 5;
    const used = count || 0;
    const remaining = Math.max(0, limit - used);

    res.json({ used, limit, remaining, canGenerate: remaining > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gift stars to another user
router.post('/gift', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { to_user_id, amount, post_id } = req.body;
    if (!to_user_id || !amount || amount < 1) return res.status(400).json({ error: 'Invalid gift' });
    if (to_user_id === user.id) return res.status(400).json({ error: 'Cannot gift yourself' });

    // Check sender balance
    const { data: starsData } = await supabase
      .from('stars')
      .select('amount, type')
      .eq('user_id', user.id);

    const balance = starsData?.reduce((acc, s) => {
      if (s.type === 'earned' || s.type === 'received') return acc + s.amount;
      if (s.type === 'spent' || s.type === 'gifted') return acc - s.amount;
      return acc;
    }, 0) || 0;

    if (balance < amount) return res.status(400).json({ error: 'Not enough stars' });

    // Deduct from sender
    await supabase.from('stars').insert({
      user_id: user.id,
      amount,
      reason: post_id ? `gifted_to_post_${post_id}` : `gifted_to_${to_user_id}`,
      type: 'gifted'
    });

    // Add to receiver
    await supabase.from('stars').insert({
      user_id: to_user_id,
      amount,
      reason: `received_from_${user.id}`,
      type: 'received'
    });

    // Update rank for receiver
    const newRank = await updateRank(to_user_id);

    // Send notification
    await supabase.from('notifications').insert({
      user_id: to_user_id,
      type: 'star_gift',
      message: `You received ${amount} ⭐ star${amount > 1 ? 's' : ''} from ${user.email?.split('@')[0]}`,
      from_user_id: user.id,
      is_read: false
    });

    res.json({ success: true, message: `Gifted ${amount} star(s)!`, receiverRank: newRank });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manually trigger rank update (called on login/profile load)
router.post('/update-rank', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const rank = await updateRank(user.id);
    res.json({ success: true, rank });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;