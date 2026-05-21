const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

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

    // Check if already claimed today
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

    // Award 1 star
    await supabase.from('stars').insert({
      user_id: user.id,
      amount: 1,
      reason: 'daily_login',
      type: 'earned'
    });

    res.json({ message: '⭐ Daily login star awarded!', claimed: true });
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

module.exports = router;