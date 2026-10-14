/**
 * ═══════════════════════════════════════════
 * SERVER — Gemini Builders Community Backend
 * Node.js + Express
 *
 * Run:  node server.js
 * Dev:  nodemon server.js
 * ═══════════════════════════════════════════
 */

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const morgan     = require('morgan');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── MIDDLEWARE ──────────────────────────── */
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/* ── STATIC FILES ────────────────────────── */
// Serve the frontend from project root
app.use(express.static(path.join(__dirname)));

/* ── ROUTES ──────────────────────────────── */
const eventsRouter = require('./backend/routes/events');
const buildsRouter = require('./backend/routes/builds');
const joinRouter   = require('./backend/routes/join');

app.use('/api/events', eventsRouter);
app.use('/api/builds', buildsRouter);
app.use('/api/join',   joinRouter);

/* ── HEALTH CHECK ────────────────────────── */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ── FALLBACK: serve index.html for SPA ──── */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* ── ERROR HANDLER ───────────────────────── */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

/* ── START ───────────────────────────────── */
app.listen(PORT, () => {
  console.log(`\n🚀 Gemini Builders Community`);
  console.log(`   Server running at http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
