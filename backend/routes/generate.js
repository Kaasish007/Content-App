const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function generateContent(rawText, outputType, platform, audience) {
  const audienceContext = {
    Professional: 'Write in a professional, polished tone suitable for industry experts and working professionals.',
    Student: 'Write in a friendly, relatable tone suitable for students and young learners.',
    Creator: 'Write in a creative, engaging tone suitable for content creators and influencers.',
    Business: 'Write in a formal, results-driven tone suitable for business owners and entrepreneurs.'
  };

  const platformContext = {
    LinkedIn: 'This is for LinkedIn — focus on professional insights, career growth, and industry knowledge.',
    Twitter: 'This is for Twitter/X — keep it punchy, concise, and engaging.',
    Instagram: 'This is for Instagram — make it visual, emotional, and hashtag-friendly.',
    YouTube: 'This is for YouTube — focus on storytelling, hooks, and viewer engagement.',
    Blog: 'This is for a Blog — make it detailed, informative, and SEO-friendly.'
  };

  const prompts = {
    linkedin: `${audienceContext[audience]} ${platformContext[platform]} Convert this into an engaging LinkedIn post with emojis, key insights, and a call-to-action. Keep it under 300 words:\n\n${rawText}`,
    twitter: `${audienceContext[audience]} ${platformContext[platform]} Convert this into a Twitter/X thread of 5-7 tweets. Number each tweet. Make each tweet punchy:\n\n${rawText}`,
    instagram: `${audienceContext[audience]} ${platformContext[platform]} Create an engaging Instagram caption with 15-20 hashtags. Include emojis:\n\n${rawText}`,
    blog: `${audienceContext[audience]} ${platformContext[platform]} Write a blog post summary (200 words) with a compelling title and 3 key takeaways:\n\n${rawText}`,
    newsletter: `${audienceContext[audience]} ${platformContext[platform]} Write a newsletter section (150 words) with a subject line, intro, key points, and CTA:\n\n${rawText}`
  };

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompts[outputType] }]
    })
  });

  const data = await response.json();
  if (!data.choices) {
    console.log('Groq error:', JSON.stringify(data));
    throw new Error(JSON.stringify(data));
  }
  return data.choices[0].message.content;
}

router.post('/', async (req, res) => {
  try {
    const { rawText, platform, audience } = req.body;
    const outputTypes = ['linkedin', 'twitter', 'instagram', 'blog', 'newsletter'];

    const results = {};
    for (const type of outputTypes) {
      results[type] = await generateContent(rawText, type, platform || 'LinkedIn', audience || 'Professional');
    }

    // Save to database
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        const { data: input } = await supabase.from('content_inputs').insert({
          user_id: user.id,
          type: 'text',
          raw_content: rawText,
          status: 'completed'
        }).select().single();

        if (input) {
          await supabase.from('generated_outputs').insert(
            Object.keys(results).map(type => ({
              input_id: input.id,
              user_id: user.id,
              output_type: type,
              content: results[type]
            }))
          );
        }
      }
    }

    res.json({ success: true, outputs: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;