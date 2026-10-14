/**
 * ROUTE: /api/join
 * POST / — save a new member signup
 * GET  / — list all signups (admin)
 */

const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');

const DATA_FILE = path.join(__dirname, '../../data/members.json');

function readMembers() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

/* POST — join community */
router.post('/', (req, res) => {
  try {
    const { name, email, goal } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const members = readMembers();

    // Prevent duplicate emails
    if (members.find(m => m.email === email)) {
      return res.status(409).json({ error: 'This email is already registered' });
    }

    const newMember = {
      id:        `mbr-${Date.now()}`,
      name:      name.trim(),
      email:     email.trim().toLowerCase(),
      goal:      goal?.trim() || '',
      joinedAt:  new Date().toISOString(),
    };

    members.push(newMember);
    fs.writeFileSync(DATA_FILE, JSON.stringify(members, null, 2));

    res.status(201).json({
      message: 'Welcome to the community!',
      member:  { id: newMember.id, name: newMember.name }
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not process signup' });
  }
});

/* GET — list all members (protect this in production!) */
router.get('/', (req, res) => {
  try {
    const members = readMembers();
    // Strip emails in response for basic safety
    const safe = members.map(({ id, name, goal, joinedAt }) => ({ id, name, goal, joinedAt }));
    res.json(safe);
  } catch (err) {
    res.status(500).json({ error: 'Could not load members' });
  }
});

module.exports = router;
