/* ═══════════════════════════════════════════
   EFFECTS.JS — GBC Layer 1 Visual Effects
   All effects in one file — no dependencies
   except Typed.js (loaded via CDN in HTML)
   ═══════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════
   1. CUSTOM INK CURSOR + TRAIL
   ══════════════════════════════════════════ */
function initCursor() {
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  // Ink trail canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'ink-canvas';
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  const trail = [];
  const MAX_TRAIL = 28;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Add trail point
    trail.push({ x: mouseX, y: mouseY, life: 1.0, r: Math.random() * 3 + 1.5 });
    if (trail.length > MAX_TRAIL) trail.shift();
  });

  // Cursor state — hover
  document.querySelectorAll('a, button, .nav-links a, .social-pill, .event-card, .build-card, .manifesto-line')
    .forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

  // Cursor state — input/text
  document.querySelectorAll('input, textarea')
    .forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-text'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
    });

  // Cursor state — click
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

  function render() {
    // Move dot instantly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    // Ring follows with lag
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    // Draw ink trail
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = trail.length - 1; i >= 0; i--) {
      const p = trail[i];
      p.life -= 0.038;
      if (p.life <= 0) { trail.splice(i, 1); continue; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(26, 26, 26, ${p.life * 0.55})`;
      ctx.fill();
    }

    requestAnimationFrame(render);
  }
  render();
}

/* ══════════════════════════════════════════
   2. TYPEWRITER HERO
   Requires: Typed.js loaded before this file
   ══════════════════════════════════════════ */
function initTypewriter() {
  // Find the hero h1 — replace last word with typed span
  const h1 = document.querySelector('.hero-h1');
  if (!h1) return;

  // Inject typed target — replaces "Build" span
  const underlinedSpan = h1.querySelector('.underlined');
  if (!underlinedSpan) return;

  // Keep the underline highlight effect, animate text inside
  underlinedSpan.innerHTML = '<span id="gbc-typed"></span>';

  // Wait for Typed.js to be available
  const tryTyped = setInterval(() => {
    if (typeof Typed === 'undefined') return;
    clearInterval(tryTyped);

    new Typed('#gbc-typed', {
      strings: ['Build.', 'Ship.', 'Create.', 'Lead.', 'Grow.'],
      typeSpeed:    55,
      backSpeed:    35,
      backDelay:   1800,
      startDelay:   600,
      loop:          true,
      cursorChar:    '|',
    });
  }, 100);
}

/* ══════════════════════════════════════════
   3. PARALLAX NOTEBOOK LINES (Hero section)
   ══════════════════════════════════════════ */
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.getElementById('hero');
  if (!hero) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      // Lines move at 0.3x scroll speed — subtle notebook depth effect
      hero.style.setProperty(
        '--parallax-offset',
        `${scrollY * 0.3}px`
      );
      // Apply directly to ::before via a CSS variable trick
      hero.style.backgroundPositionY = `${scrollY * 0.3}px`;
      ticking = false;
    });
    ticking = true;
  });
}

/* ══════════════════════════════════════════
   4. MAGNETIC BUTTONS
   ══════════════════════════════════════════ */
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const STRENGTH = 0.35; // How strongly button pulls (0 = none, 1 = full)
  const MAX_PULL = 10;   // Max pixel displacement

  document.querySelectorAll('.btn-primary, .btn-secondary, .join-submit, .social-pill').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect   = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const dx = (e.clientX - centerX) * STRENGTH;
      const dy = (e.clientY - centerY) * STRENGTH;
      const moveX = Math.max(-MAX_PULL, Math.min(MAX_PULL, dx));
      const moveY = Math.max(-MAX_PULL, Math.min(MAX_PULL, dy));
      btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      // Spring back
      btn.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════════
   5. SCROLL REVEAL
   Upgrades existing IntersectionObserver
   with staggered reveal-delay classes
   ══════════════════════════════════════════ */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Add reveal class to all cards and sections
  const targets = [
    ...document.querySelectorAll('.event-card'),
    ...document.querySelectorAll('.build-card'),
    ...document.querySelectorAll('.manifesto-line'),
    ...document.querySelectorAll('.roadmap-step'),
    ...document.querySelectorAll('.section-header'),
    ...document.querySelectorAll('.doodle-stat'),
  ];

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger siblings within same parent
    const siblings = el.parentElement.querySelectorAll('.reveal');
    const idx = Array.from(siblings).indexOf(el);
    if (idx > 0 && idx <= 4) el.classList.add(`reveal-delay-${idx}`);
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════
   6. HERO STAT COUNTER ROLL
   Numbers count up on first view
   ══════════════════════════════════════════ */
function initCounterRoll() {
  const stats = document.querySelectorAll('.doodle-stat-num');
  if (!stats.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();

      // Only animate pure numbers
      const num = parseInt(raw.replace(/\D/g, ''));
      if (isNaN(num) || num === 0) return;

      obs.unobserve(el);
      const suffix = raw.replace(/[0-9]/g, '');
      let start = 0;
      const duration = 2000;
      const startTime = performance.now();

      function tick(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * num) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════
   7. SECTION LABEL DASH DRAW
   The red line after section labels draws in
   ══════════════════════════════════════════ */
function initLabelDraw() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const labels = document.querySelectorAll('.section-label');
  labels.forEach(label => {
    // The ::after pseudo line
    label.style.setProperty('--line-width', '0px');
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = '--line-width 0.6s ease';
        entry.target.classList.add('label-drawn');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  labels.forEach(l => obs.observe(l));
}

/* ══════════════════════════════════════════
   8. DOODLE CARD TILT (hero right card)
   3D tilt on mouse move
   ══════════════════════════════════════════ */
function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const card = document.querySelector('.hero-doodle-card');
  if (!card) return;

  const MAX_TILT = 8;

  card.addEventListener('mousemove', (e) => {
    const rect    = card.getBoundingClientRect();
    const centerX = rect.left + rect.width  / 2;
    const centerY = rect.top  + rect.height / 2;
    const rotateY =  ((e.clientX - centerX) / (rect.width  / 2)) * MAX_TILT;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * MAX_TILT;
    card.style.transform = `rotate(1.5deg) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotate(1.5deg)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
  });
}

/* ══════════════════════════════════════════
   9. TICKER CLICK TO PAUSE
   ══════════════════════════════════════════ */
function initTickerControl() {
  const ticker = document.querySelector('.ticker-wrap');
  const inner  = document.querySelector('.ticker-inner');
  if (!ticker || !inner) return;

  let paused = false;
  ticker.addEventListener('click', () => {
    paused = !paused;
    inner.style.animationPlayState = paused ? 'paused' : 'running';
    ticker.style.cursor = paused ? 'pointer' : 'default';
    ticker.title = paused ? 'Click to resume' : 'Click to pause';
  });
  ticker.title = 'Click to pause';
}

/* ══════════════════════════════════════════
   BOOT — init all effects
   ══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initTypewriter();
  initParallax();
  initMagneticButtons();
  initScrollReveal();
  initCounterRoll();
  initLabelDraw();
  initCardTilt();
  initUpdatesModal();
  initTickerControl();
});

/* ══════════════════════════════════════════
   10. MODAL POP-UP LOGIC
   ══════════════════════════════════════════ */
function initUpdatesModal() {
  const openBtn = document.getElementById('btn-open-updates');
  const closeBtn = document.getElementById('btn-close-updates');
  const modal = document.getElementById('updates-modal');

  if (openBtn && closeBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Unlock background scrolling
    });
  }
}