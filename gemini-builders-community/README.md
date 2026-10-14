# Gemini Builders Community — Website

Brutalist + Sketchbook design. Student-run AI builder community at UIT Prayagraj.

---

## Folder Structure

```
gemini-builders-community/
│
├── index.html                  ← Main entry point (open this)
│
├── assets/
│   ├── css/
│   │   ├── tokens.css          ← Design tokens (colors, fonts, spacing)
│   │   ├── base.css            ← Reset + utility classes + buttons
│   │   ├── components.css      ← Nav, cards, form, footer, ticker
│   │   ├── sections.css        ← Hero, about, events, builds, roadmap, join
│   │   └── responsive.css      ← Mobile + tablet breakpoints
│   ├── js/
│   │   └── main.js             ← Renders all dynamic content from JSON
│   └── images/
│       ├── icons/              ← Put icon PNGs/SVGs here
│       ├── events/             ← Event photos
│       ├── builds/             ← Project screenshots
│       └── team/               ← Member photos
│
├── data/
│   ├── config.json             ← Site name, stats, socials, manifesto, roadmap
│   ├── events.json             ← All events data
│   ├── builds.json             ← All community builds/projects
│   └── members.json            ← Created auto by backend when someone joins
│
├── backend/
│   └── routes/
│       ├── events.js           ← GET/POST /api/events
│       ├── builds.js           ← GET/POST /api/builds
│       └── join.js             ← POST /api/join (member signup)
│
├── server.js                   ← Express backend server
├── package.json
├── .env.example                ← Copy to .env and fill values
└── .gitignore
```

---

## Quick Start

### Option A — Frontend Only (no backend needed)

Just open `index.html` in a browser. Data loads directly from `/data/*.json`.

> ⚠️ Note: Some browsers block `fetch()` on local `file://` URLs.
> Use VS Code Live Server extension, or run `npx serve .` in the folder.

```bash
# Install serve globally (one time)
npm install -g serve

# Run from inside the project folder
serve .
# → Opens at http://localhost:3000
```

---

### Option B — With Backend (full stack)

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Start server
npm start
# → http://localhost:3000

# Dev mode (auto-restart on file changes)
npm run dev
```

---

## How to Customize

### Update stats, socials, manifesto, roadmap
Edit `data/config.json` — everything updates automatically.

### Add a new event
Edit `data/events.json` — add a new object following the same structure.

### Add a build/project
Edit `data/builds.json` — add your project details.

### Update social links
In `data/config.json`, fill in the `social` section:
```json
"social": {
  "discord":   "https://discord.gg/YOUR_SERVER",
  "linkedin":  "https://linkedin.com/company/YOUR_PAGE",
  "whatsapp":  "https://wa.me/YOUR_NUMBER",
  "googleDev": "https://g.dev/YOUR_PROFILE"
}
```

### Switch to backend API
In `assets/js/main.js`, change line 8:
```js
const USE_API = true;   // false = local JSON, true = backend
```

---

## Tech Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | Vanilla HTML + CSS + JS       |
| Fonts    | Permanent Marker, Special Elite, Space Mono (Google Fonts) |
| Backend  | Node.js + Express             |
| Data     | JSON files (swap for MongoDB/PostgreSQL anytime) |
| Deploy   | Any static host (Vercel, Netlify, GitHub Pages) for frontend |

---

## Deployment (Frontend only — recommended for now)

**Vercel (easiest):**
```bash
npm install -g vercel
vercel
```

**Netlify:** Drag and drop the folder at netlify.com/drop

**GitHub Pages:** Push to repo → Settings → Pages → Deploy from main branch

---

## Made by
Gemini Builders Community · United Institute of Technology, Prayagraj
Google Student Ambassadors Program
