const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const prices = {
  creator: 'price_1TZULNHRGkPaEqTdmCxXkWBc',
  masterpiece: 'price_1TZUMKHRGkPaEqTd1kXwRLnd'
};

router.post('/checkout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const { plan } = req.body;
    if (!prices[plan]) return res.status(400).json({ error: 'Invalid plan' });
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: prices[plan], quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      customer_email: user.email,
      metadata: { userId: user.id, plan }
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook — saves plan to profiles after successful Stripe payment
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;
    if (userId && plan) {
      await supabase
        .from('profiles')
        .update({ plan })
        .eq('user_id', userId);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const customer = await stripe.customers.retrieve(subscription.customer);
    if (customer?.email) {
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const user = users?.find(u => u.email === customer.email);
      if (user) {
        await supabase
          .from('profiles')
          .update({ plan: 'spark' })
          .eq('user_id', user.id);
      }
    }
  }

  res.json({ received: true });
});

// Get current user plan
router.get('/my-plan', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    res.json({ plan: profile?.plan || 'spark' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/plans', (req, res) => {
  res.json({
    plans: [
      {
        id: 'spark',
        name: 'Spark',
        icon: '✏️',
        price: 0,
        currency: '₹',
        period: 'forever',
        color: '#94a3b8',
        features: [
          '5 AI generations per day',
          'Access to The Canvas',
          'Basic profile',
          'Daily login stars',
        ]
      },
      {
        id: 'creator',
        name: 'Creator',
        icon: '🎨',
        price: 299,
        currency: '₹',
        period: 'month',
        color: '#3b82f6',
        features: [
          'Unlimited AI generations',
          'All platform templates',
          'Audience type selector',
          'Priority support',
          'Earn 2x stars',
        ]
      },
      {
        id: 'masterpiece',
        name: 'Masterpiece',
        icon: '🌌',
        price: 999,
        currency: '₹',
        period: 'month',
        color: '#a855f7',
        features: [
          'Everything in Creator',
          'Analytics dashboard',
          'Team accounts',
          'Custom branding',
          'Earn 3x stars',
          'Early access to features',
        ]
      }
    ]
  });
});

module.exports = router;