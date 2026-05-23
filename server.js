const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Routes Modules
const authRouter = require('./routes/auth');
const memberRouter = require('./routes/members');
const trainerRouter = require('./routes/trainers');
const planRouter = require('./routes/plans');
const workoutRouter = require('./routes/workouts');
const dietRouter = require('./routes/diet');
const feeRouter = require('./routes/fees');
const supportRouter = require('./routes/support');

// Mount Routers
app.use('/api/auth', authRouter);
app.use('/api/members', memberRouter);
app.use('/api/member', memberRouter); // Mount on /api/member to support /api/member/me
app.use('/api/trainers', trainerRouter);
app.use('/api/plans', planRouter);
app.use('/api/workout', workoutRouter);
app.use('/api/diet', dietRouter);
app.use('/api/fees', feeRouter);
app.use('/api/support', supportRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'active', message: 'FITCORE Server API' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`[FITCORE] Backend server running on port ${PORT}`);
  });
}

module.exports = app;
