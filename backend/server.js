const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://content-app-kryj.vercel.app'
  ],
  credentials: true
}));

// Webhook needs raw body — must come before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/generate', require('./routes/generate'));
app.use('/api/stripe', require('./routes/stripe'));
app.use('/api/stars', require('./routes/stars'));
app.use('/api/follow', require('./routes/follow'));
app.use('/api/dashboard', require('./routes/dashboard'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});