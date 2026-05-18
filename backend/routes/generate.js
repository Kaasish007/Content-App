const express = require('express');
const router = express.Router();

async function generateContent(rawText, outputType) {
  const prompts = {
    linkedin: `You are an expert LinkedIn content creator. Convert this content into an engaging LinkedIn post with emojis, key insights, and a call-to-action. Keep it under 300 words:\n\n${rawText}`,
    twitter: `Convert this content into a Twitter/X thread of 5-7 tweets. Number each tweet. Make each tweet punchy and engaging:\n\n${rawText}`,
    instagram: `Create an engaging Instagram caption with relevant hashtags (15-20 hashtags). Include emojis. Make it conversational:\n\n${rawText}`,
    blog: `Write a blog post summary (200 words) with a compelling title and 3 key takeaways from this content:\n\n${rawText}`,
    newsletter: `Write a newsletter section (150 words) for this content. Include a subject line, intro, key points, and CTA:\n\n${rawText}`
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
  console.log('Groq response:', JSON.stringify(data));
  return data.choices[0].message.content;
}

router.post('/', async (req, res) => {
  try {
    const { rawText } = req.body;
    const outputTypes = ['linkedin', 'twitter', 'instagram', 'blog', 'newsletter'];

    const results = {};
    for (const type of outputTypes) {
      results[type] = await generateContent(rawText, type);
    }

    res.json({ success: true, outputs: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;