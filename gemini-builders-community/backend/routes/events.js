/**
 * ROUTE: /api/events
 * GET  / — list all events
 * GET  /:id — single event
 * POST / — create event (admin)
 */

const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');

const DATA_FILE = path.join(__dirname, '../../data/events.json');

function readEvents() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

/* GET all events */
router.get('/', (req, res) => {
  try {
    const events = readEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Could not load events' });
  }
});

/* GET single event */
router.get('/:id', (req, res) => {
  try {
    const events = readEvents();
    const event  = events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Could not load event' });
  }
});

/* POST create event (simple — writes to JSON; swap for DB later) */
router.post('/', (req, res) => {
  try {
    const events   = readEvents();
    const newEvent = {
      id:          `evt-${Date.now()}`,
      title:       req.body.title       || 'Untitled Event',
      date:        req.body.date        || 'TBA',
      description: req.body.description || '',
      status:      req.body.status      || 'upcoming',
      mode:        req.body.mode        || '',
      attendees:   req.body.attendees   || null,
    };
    events.push(newEvent);
    fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: 'Could not create event' });
  }
});

module.exports = router;
