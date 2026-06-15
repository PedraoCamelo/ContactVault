require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authMiddleware = require('./middleware/auth');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', require('./routes/auth'));

app.use('/contacts', authMiddleware, require('./routes/contacts'));

app.get('/', (req, res) => {
  res.json({ message: 'ContactVault backend is running' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
