// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// This lets your React app talk to this server
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Test route - visit http://localhost:5000/api/health
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Import your routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/generate', require('./routes/generate'));
app.use('/api/stripe', require('./routes/stripe'));
app.use('/api/stars', require('./routes/stars'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});