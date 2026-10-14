/**
 * ROUTE: /api/builds
 * GET  / — list all builds
 * GET  /:id — single build
 * POST / — submit a new build
 */

const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');

const DATA_FILE = path.join(__dirname, '../../data/builds.json');

function readBuilds() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

/* GET all builds */
router.get('/', (req, res) => {
  try {
    const builds = readBuilds();
    res.json(builds);
  } catch (err) {
    res.status(500).json({ error: 'Could not load builds' });
  }
});

/* GET single build */
router.get('/:id', (req, res) => {
  try {
    const builds = readBuilds();
    const build  = builds.find(b => b.id === req.params.id);
    if (!build) return res.status(404).json({ error: 'Build not found' });
    res.json(build);
  } catch (err) {
    res.status(500).json({ error: 'Could not load build' });
  }
});

/* POST submit a build */
router.post('/', (req, res) => {
  try {
    const builds   = readBuilds();
    const newBuild = {
      id:          `build-${Date.now()}`,
      tag:         req.body.tag         || 'Project',
      title:       req.body.title       || 'Untitled Build',
      author:      req.body.author      || '@anonymous',
      role:        req.body.role        || 'Builder',
      description: req.body.description || '',
      link:        req.body.link        || null,
      image:       req.body.image       || null,
    };
    builds.push(newBuild);
    fs.writeFileSync(DATA_FILE, JSON.stringify(builds, null, 2));
    res.status(201).json(newBuild);
  } catch (err) {
    res.status(500).json({ error: 'Could not submit build' });
  }
});

module.exports = router;
