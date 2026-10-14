/* ═══════════════════════════════════════════
   MAIN JS — Gemini Builders Community
   ═══════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════
   INLINE FALLBACK DATA
   Used when fetch() fails (e.g. file:// or Live Server path issues)
   Edit this directly if you're not using a server
   ══════════════════════════════════════════ */
const FALLBACK = {
  config: {
    site: {
      name: "Gemini Builders Community",
      shortName: "GBC",
      tagline: "Building the next generation of AI Builders.",
    },
    stats: { members: "40+", sessionsRun: 3, buildsAhead: "∞", campuses: "01" },
    social: {
      discord:   "#",
      linkedin:  "#",
      whatsapp:  "#",
      googleDev: "#"
    },
    ticker: [
      "Prompt Engineering","Gemini API","AI Research","Build in Public",
      "Google Student Ambassadors","UIT Prayagraj","Ship It","Learn Together"
    ],
    manifesto: [
      "Builders over consumers — we create, not just use",
      "Learning is a team sport — share what you know",
      "Ship ugly early — perfect kills momentum",
      "Real problems only — no toy demos, build for impact",
      "India needs its own AI story — we're writing it"
    ],
    roadmap: [
      { icon: "📖", title: "Learn",      desc: "Attend sessions. Read docs. Build your mental model of how AI actually works." },
      { icon: "🧪", title: "Experiment", desc: "Break things on purpose. Test every assumption. Fail fast in your own sandbox." },
      { icon: "🔨", title: "Build",      desc: "Ship something real. Ugly is fine. Working beats perfect every single time." },
      { icon: "📢", title: "Share",      desc: "Post what you built. Teach someone else. Knowledge compounds when it moves." },
      { icon: "🚀", title: "Lead",       desc: "Run a session. Mentor a new member. Become the person you wished you had." }
    ]
  },
  events: [
    {
      id: "evt-001",
      title: "Prompt Engineering Masterclass",
      date: "May 2025",
      description: "Hands-on deep dive into prompt patterns — zero-shot, few-shot, chain-of-thought. Participants left with a personal prompt library.",
      status: "completed",
      mode: "✓ Completed · 40+ Attendees"
    },
    {
      id: "evt-002",
      title: "Gemini API Builders Sprint",
      date: "TBA · 2025",
      description: "48-hour build sprint using the Gemini API. Teams pitch, build, and demo a working prototype. No theory — only execution.",
      status: "upcoming",
      mode: "🔨 Hackathon Format"
    },
    {
      id: "evt-003",
      title: "AI for Real Problems",
      date: "TBA · 2025",
      description: "A workshop focused on applying AI to actual problems in agriculture, healthcare, and local governance — not just tech demos.",
      status: "upcoming",
      mode: "🌍 Impact Focus"
    }
  ],
  builds: [
    { id:"b1", tag:"Prompt Tool",  title:"Project Name Here", author:"@handle", role:"Role", description:"Short description of what was built, what problem it solves, and what tech was used. Replace with real project data.", link:null },
    { id:"b2", tag:"AI Research",  title:"Project Name Here", author:"@handle", role:"Role", description:"Short description of what was built, what problem it solves, and what tech was used. Replace with real project data.", link:null },
    { id:"b3", tag:"Automation",   title:"Project Name Here", author:"@handle", role:"Role", description:"Short description of what was built, what problem it solves, and what tech was used. Replace with real project data.", link:null },
    { id:"b4", tag:"Web App",      title:"Project Name Here", author:"@handle", role:"Role", description:"Short description of what was built, what problem it solves, and what tech was used. Replace with real project data.", link:null },
    { id:"b5", tag:"Vision AI",    title:"Project Name Here", author:"@handle", role:"Role", description:"Short description of what was built, what problem it solves, and what tech was used. Replace with real project data.", link:null }
  ]
};

/* ══════════════════════════════════════════
   DATA LOADER — relative path, with fallback
   ══════════════════════════════════════════ */
async function loadData(resource) {
  try {
    // Use relative path — works with Live Server, npx serve, and Node backend
    const res = await fetch(`data/${resource}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`fetch(data/${resource}.json) failed — using inline fallback. (${err.message})`);
    return FALLBACK[resource] || null;
  }
}

/* ══════════════════════════════════════════
   RENDER: TICKER
   ══════════════════════════════════════════ */
function renderTicker(items) {
  const inner = document.querySelector('.ticker-inner');
  if (!inner || !items) return;
  const doubled = [...items, ...items];
  inner.innerHTML = doubled.map(t => `<span>${t}</span>`).join('');
}

/* ══════════════════════════════════════════
   RENDER: STATS
   ══════════════════════════════════════════ */
function renderStats(stats) {
  if (!stats) return;
  const map = {
    '[data-stat="members"]':  stats.members,
    '[data-stat="sessions"]': stats.sessionsRun,
    '[data-stat="builds"]':   stats.buildsAhead,
    '[data-stat="campuses"]': stats.campuses,
  };
  Object.entries(map).forEach(([sel, val]) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = val;
  });
}

/* ══════════════════════════════════════════
   RENDER: SOCIALS
   ══════════════════════════════════════════ */
function renderSocials(social) {
  if (!social) return;
  document.querySelectorAll('[data-social]').forEach(el => {
    const key = el.dataset.social;
    if (social[key] && social[key] !== '#') el.href = social[key];
  });
}

/* ══════════════════════════════════════════
   RENDER: MANIFESTO
   ══════════════════════════════════════════ */
function renderManifesto(lines) {
  const container = document.querySelector('.manifesto-lines');
  if (!container || !lines) return;
  container.innerHTML = lines.map((text, i) => `
    <div class="manifesto-line">
      <div class="manifesto-num">0${i + 1}</div>
      <div class="manifesto-text">${text}</div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════
   RENDER: EVENTS
   ══════════════════════════════════════════ */
function renderEvents(events) {
  const grid = document.querySelector('.events-grid');
  if (!grid || !events) return;
  grid.innerHTML = events.map(ev => {
    const isUpcoming = ev.status === 'upcoming';
    const badge = isUpcoming
      ? `<div class="event-badge">Upcoming</div>`
      : `<div class="event-badge completed">✓ Done</div>`;
    return `
      <div class="event-card">
        ${badge}
        <div class="event-date-tag">${ev.date}</div>
        <h3 class="event-title">${ev.title}</h3>
        <p class="event-desc">${ev.description}</p>
        <div class="event-mode">${ev.mode}</div>
      </div>
    `;
  }).join('');
}

/* ══════════════════════════════════════════
   RENDER: BUILDS
   ══════════════════════════════════════════ */
function renderBuilds(builds) {
  const grid = document.querySelector('.builds-grid');
  if (!grid || !builds) return;
  const cards = builds.map(b => {
    const linkHTML = b.link
      ? `<a href="${b.link}" class="build-link" target="_blank" rel="noopener">View Project →</a>`
      : '';
    return `
      <div class="build-card">
        <span class="build-tag">${b.tag}</span>
        <h3 class="build-title">${b.title}</h3>
        <div class="build-author">by ${b.author} · ${b.role}</div>
        <p class="build-desc">${b.description}</p>
        ${linkHTML}
      </div>
    `;
  }).join('');
  const placeholder = `
    <div class="build-card placeholder">
      <div style="text-align:center;">
        <div style="font-family:var(--font-marker);font-size:42px;color:var(--faint);margin-bottom:8px;">+</div>
        <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:2px;color:#aaa;text-transform:uppercase;">Your build<br/>could be here</div>
      </div>
    </div>`;
  grid.innerHTML = cards + placeholder;
}

/* ══════════════════════════════════════════
   RENDER: ROADMAP
   ══════════════════════════════════════════ */
function renderRoadmap(steps) {
  const track = document.querySelector('.roadmap-track');
  if (!track || !steps) return;
  track.innerHTML = steps.map(step => `
    <div class="roadmap-step">
      <div class="roadmap-circle">${step.icon}</div>
      <div class="roadmap-step-title">${step.title}</div>
      <div class="roadmap-step-desc">${step.desc}</div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════
   NAV: hamburger + active highlight
   ══════════════════════════════════════════ */
function initNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }
  const sections = document.querySelectorAll('section[id], div[id]');
  const links    = document.querySelectorAll('.nav-links a');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => obs.observe(s));
}

/* ══════════════════════════════════════════
   JOIN FORM
   ══════════════════════════════════════════ */
function initJoinForm() {
  const form   = document.querySelector('.join-form');
  const thanks = document.querySelector('.join-thanks');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.join-submit');
    btn.textContent = 'Adding you...';
    btn.disabled = true;
    // Try backend, ignore errors
    try {
      await fetch('api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:  form.querySelector('[name="name"]').value,
          email: form.querySelector('[name="email"]').value,
          goal:  form.querySelector('[name="goal"]').value,
        })
      });
    } catch(e) { /* backend not running, that's fine */ }
    form.style.display = 'none';
    if (thanks) thanks.style.display = 'block';
  });
}

/* ══════════════════════════════════════════
   SCROLL FADE-IN
   ══════════════════════════════════════════ */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll(
    '.event-card, .build-card, .manifesto-line, .roadmap-step'
  );
  targets.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════ */
async function init() {
  // Config (manifesto, stats, ticker, roadmap, socials)
  const config = await loadData('config');
  if (config) {
    renderTicker(config.ticker);
    renderStats(config.stats);
    renderSocials(config.social);
    renderManifesto(config.manifesto);
    renderRoadmap(config.roadmap);
    document.querySelectorAll('[data-site-name]').forEach(el => el.textContent = config.site.name);
    document.querySelectorAll('[data-site-tagline]').forEach(el => el.textContent = config.site.tagline);
  }

  // Events
  const events = await loadData('events');
  renderEvents(events);

  // Builds
  const builds = await loadData('builds');
  renderBuilds(builds);

  initNav();
  initJoinForm();
  requestAnimationFrame(() => setTimeout(initScrollAnimations, 80));
}

document.addEventListener('DOMContentLoaded', init);
