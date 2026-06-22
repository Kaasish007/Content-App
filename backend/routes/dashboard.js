const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

router.get('/stats', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { count: totalGenerated } = await supabase
      .from('generated_outputs')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    const { count: generatedThisMonth } = await supabase
      .from('generated_outputs')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .gte('created_at', monthAgo);

    const { count: followersCount } = await supabase
      .from('followers')
      .select('*', { count: 'exact' })
      .eq('following_id', user.id);

    const { data: weekStars } = await supabase
      .from('stars')
      .select('amount, type')
      .eq('user_id', user.id)
      .gte('created_at', weekAgo);

    const starsThisWeek = weekStars?.reduce((acc, s) => {
      if (s.type === 'earned' || s.type === 'received') return acc + s.amount;
      return acc;
    }, 0) || 0;

    const { data: allStars } = await supabase
      .from('stars')
      .select('amount, type')
      .eq('user_id', user.id);

    const totalStars = allStars?.reduce((acc, s) => {
      if (s.type === 'earned' || s.type === 'received') return acc + s.amount;
      if (s.type === 'spent' || s.type === 'gifted') return acc - s.amount;
      return acc;
    }, 0) || 0;

    const { count: todayCount } = await supabase
      .from('content_inputs')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .gte('created_at', today);

    const { data: recentActivity } = await supabase
      .from('generated_outputs')
      .select('id, output_type, created_at, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      totalGenerated: totalGenerated || 0,
      generatedThisMonth: generatedThisMonth || 0,
      followersCount: followersCount || 0,
      starsThisWeek,
      totalStars,
      todayCount: todayCount || 0,
      dailyLimit: 5,
      recentActivity: recentActivity || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    // Check plan
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    if (profile?.plan !== 'masterpiece') {
      return res.status(403).json({ error: 'Masterpiece plan required' });
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Generations per platform
    const { data: byPlatform } = await supabase
      .from('generated_outputs')
      .select('output_type')
      .eq('user_id', user.id);

    const platformCounts = {};
    byPlatform?.forEach(row => {
      const p = row.output_type || 'unknown';
      platformCounts[p] = (platformCounts[p] || 0) + 1;
    });

    // Generations per day (last 30 days)
    const { data: byDay } = await supabase
      .from('generated_outputs')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: true });

    const dayCounts = {};
    byDay?.forEach(row => {
      const day = row.created_at?.split('T')[0];
      if (day) dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    // Canvas posts performance
    const { data: canvasPosts } = await supabase
      .from('canvas_posts')
      .select('id, content, platform, likes, created_at')
      .eq('user_id', user.id)
      .order('likes', { ascending: false })
      .limit(5);

    // Stars earned per week (last 4 weeks)
    const weeklyStars = [];
    for (let i = 3; i >= 0; i--) {
      const from = new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString();
      const to = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: ws } = await supabase
        .from('stars')
        .select('amount, type')
        .eq('user_id', user.id)
        .gte('created_at', from)
        .lt('created_at', to);
      const earned = ws?.reduce((acc, s) => {
        if (s.type === 'earned' || s.type === 'received') return acc + s.amount;
        return acc;
      }, 0) || 0;
      weeklyStars.push({ week: `Week ${4 - i}`, stars: earned });
    }

    // Total canvas likes
    const { data: allPosts } = await supabase
      .from('canvas_posts')
      .select('likes')
      .eq('user_id', user.id);
    const totalLikes = allPosts?.reduce((acc, p) => acc + (p.likes || 0), 0) || 0;

    // Followers over time (approximate from followers table)
    const { count: totalFollowers } = await supabase
      .from('followers')
      .select('*', { count: 'exact' })
      .eq('following_id', user.id);

    res.json({
      platformCounts,
      dayCounts,
      canvasPosts: canvasPosts || [],
      weeklyStars,
      totalLikes,
      totalFollowers: totalFollowers || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;