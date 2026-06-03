require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./Backend/config/db');

// ─── Connect to Database ───────────────────────────────────────────────────
connectDB();

// ─── App Setup ────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────
const authRoutes       = require('./Backend/routes/auth');
const submissionRoutes = require('./Backend/routes/submissions');
const adminRoutes      = require('./Backend/routes/admin');

app.use('/api/auth',        authRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin',       adminRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'CampusIQ API running' });
});

// ─── 404 Handler (unknown routes) ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong. Please try again later.'
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`CampusIQ API running on port ${PORT}`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err.message);
  server.close(() => process.exit(1));
});