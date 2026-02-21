/* ═══════════════════════════════════════════════════════════
   TRENDEX — Event Handling in JavaScript
   script.js — All event handler logic
═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────
   TRENDING DATA
───────────────────────────────────── */
const trends = [
  {
    rank: '#1', emoji: '🤖', cat: 'Technology',
    name: 'AI Companions',
    desc: 'Personal AI assistants that adapt to your personality and schedule throughout the day.',
    heat: 'hot', tag: 'tech', searches: '2.4M', rise: '+340%'
  },
  {
    rank: '#2', emoji: '🍵', cat: 'Food & Drink',
    name: 'Matcha Rituals',
    desc: 'Ceremonial-grade matcha preparation kits flying off shelves globally.',
    heat: 'hot', tag: 'food', searches: '1.8M', rise: '+210%'
  },
  {
    rank: '#3', emoji: '🧥', cat: 'Fashion',
    name: 'Quiet Luxury',
    desc: 'Understated, high-quality basics replacing loud logos and seasonal micro-trends.',
    heat: 'warm', tag: 'style', searches: '1.5M', rise: '+180%'
  },
  {
    rank: '#4', emoji: '🎵', cat: 'Music',
    name: 'Vinyl Revival',
    desc: 'Record sales surging as Gen Z discovers the warmth of analogue sound.',
    heat: 'warm', tag: 'style', searches: '980K', rise: '+95%'
  },
  {
    rank: '#5', emoji: '🌿', cat: 'Wellness',
    name: 'Forest Bathing',
    desc: 'Shinrin-yoku wellness retreats becoming the new weekend staple.',
    heat: 'cool', tag: 'style', searches: '760K', rise: '+88%'
  },
  {
    rank: '#6', emoji: '🕹️', cat: 'Technology',
    name: 'Haptic Wear',
    desc: 'Smart clothing with embedded haptic feedback for immersive experiences.',
    heat: 'hot', tag: 'tech', searches: '1.1M', rise: '+290%'
  },
  {
    rank: '#7', emoji: '🫙', cat: 'Food & Drink',
    name: 'Fermented Foods',
    desc: 'Home fermentation kits for kimchi, kefir, and sourdough at record highs.',
    heat: 'warm', tag: 'food', searches: '870K', rise: '+130%'
  },
  {
    rank: '#8', emoji: '🌐', cat: 'Technology',
    name: 'Spatial Computing',
    desc: 'Augmented overlays blending digital and physical retail experiences.',
    heat: 'hot', tag: 'tech', searches: '1.3M', rise: '+420%'
  },
  {
    rank: '#9', emoji: '👟', cat: 'Fashion',
    name: 'Tabi Footwear',
    desc: 'Split-toe Japanese-inspired shoes crossing into mainstream streetwear.',
    heat: 'cool', tag: 'style', searches: '540K', rise: '+74%'
  },
];

/* ─────────────────────────────────────
   RENDER CARDS
───────────────────────────────────── */
function renderCards(filter = 'all') {
  const grid = document.getElementById('cards-grid');
  grid.innerHTML = '';
  const data = filter === 'all' ? trends : trends.filter(t => t.tag === filter);

  data.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'trend-card';
    card.dataset.index = i;

    card.innerHTML = `
      <div class="card-img-wrap">
        <span class="card-rank">${t.rank}</span>
        <span class="card-heat ${t.heat}">${t.heat.toUpperCase()}</span>
        <div class="card-emoji">${t.emoji}</div>
        <div class="card-overlay">
          <button class="overlay-cta" data-idx="${i}">View Details</button>
        </div>
      </div>
      <div class="card-body">
        <div class="card-category">${t.cat}</div>
        <div class="card-name">${t.name}</div>
        <div class="card-desc">${t.desc}</div>
      </div>
      <div class="card-footer">
        <div class="card-stat">Searches: <strong>${t.searches}</strong></div>
        <div class="card-stat" style="margin-left:16px">Rise: <strong style="color:var(--rust)">${t.rise}</strong></div>
        <button class="like-btn" data-idx="${i}">♡ Save</button>
      </div>
    `;

    grid.appendChild(card);
    attachCardEvents(card, t);
  });
}

/* ─────────────────────────────────────
   CARD EVENT LISTENERS
   Events: mouseenter, mouseleave, click
───────────────────────────────────── */
function attachCardEvents(card, t) {

  // --- HOVER: mouseenter ---
  card.addEventListener('mouseenter', () => {
    flashChip('chip-hover');
    logEvent('mouseover', `"${t.name}"`);
    document.body.classList.add('hovering');
  });

  // --- HOVER: mouseleave ---
  card.addEventListener('mouseleave', () => {
    document.body.classList.remove('hovering');
  });

  // --- CLICK: Like / Save button ---
  const likeBtn = card.querySelector('.like-btn');
  likeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // stop event bubbling up to card
    likeBtn.classList.toggle('liked');
    likeBtn.textContent = likeBtn.classList.contains('liked') ? '♥ Saved' : '♡ Save';
    flashChip('chip-click');
    logEvent('click', `Like → "${t.name}"`);
  });

  // --- CLICK: Overlay CTA ---
  const overlayCta = card.querySelector('.overlay-cta');
  overlayCta.addEventListener('click', () => {
    flashChip('chip-click');
    logEvent('click', `Open details → "${t.name}"`);
    showToast(`Viewing: ${t.name}`);
  });
}

/* ─────────────────────────────────────
   FILTER TABS — click event
───────────────────────────────────── */
document.querySelectorAll('.ftab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderCards(tab.dataset.filter);
    flashChip('chip-click');
    logEvent('click', `Filter → ${tab.textContent}`);
  });
});

/* ─────────────────────────────────────
   CUSTOM CURSOR
   Events: mousemove, mousedown, mouseup
───────────────────────────────────── */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let cursorX = 0, cursorY = 0;
let ringX   = 0, ringY   = 0;

// Track cursor position
document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  cursorDot.style.left = cursorX + 'px';
  cursorDot.style.top  = cursorY + 'px';
});

// Animate ring with lag (requestAnimationFrame loop)
(function animateRing() {
  ringX += (cursorX - ringX) * 0.14;
  ringY += (cursorY - ringY) * 0.14;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

// Enlarge cursor on hover over interactive elements
document.querySelectorAll('button, a, .trend-card, .trend-badge, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// Shrink dot on click
document.addEventListener('mousedown', () => document.body.classList.add('clicking'));
document.addEventListener('mouseup',   () => document.body.classList.remove('clicking'));

/* ─────────────────────────────────────
   KEYBOARD EVENTS
   Events: keydown, keyup, input, focus
───────────────────────────────────── */
let keyEventCount = 0;
const typeArea = document.getElementById('type-area');

// keydown on the textarea
typeArea.addEventListener('keydown', (e) => {
  keyEventCount++;

  // Update the key property display panel
  document.getElementById('kv-key').textContent   = e.key;
  document.getElementById('kv-code').textContent  = e.code;
  document.getElementById('kv-which').textContent = e.which;
  document.getElementById('kv-shift').textContent = e.shiftKey;
  document.getElementById('kv-ctrl').textContent  = e.ctrlKey;
  document.getElementById('kv-alt').textContent   = e.altKey;
  document.getElementById('kv-type').textContent  = 'keydown';
  document.getElementById('ts-lastkey').textContent = (e.key === ' ') ? 'SPACE' : e.key;
  document.getElementById('ts-events').textContent  = keyEventCount;

  // Highlight relevant rows
  document.querySelectorAll('.key-row').forEach(r => r.classList.remove('highlight'));
  ['kr-key', 'kr-code', 'kr-which'].forEach(id => {
    document.getElementById(id).classList.add('highlight');
  });
  if (e.shiftKey) document.getElementById('kr-shift').classList.add('highlight');
  if (e.ctrlKey)  document.getElementById('kr-ctrl').classList.add('highlight');
  if (e.altKey)   document.getElementById('kr-alt').classList.add('highlight');

  flashChip('chip-key');
  logEvent('keydown', `key="${e.key}" code="${e.code}"`);
  showKeyIndicator(e.key, e.code);
});

// input event — fires on every character change
typeArea.addEventListener('input', (e) => {
  const val   = e.target.value;
  const words = val.trim() ? val.trim().split(/\s+/).length : 0;
  document.getElementById('ts-chars').textContent = val.length;
  document.getElementById('ts-words').textContent = words;
  flashChip('chip-input');
  logEvent('input', `length=${val.length}`);
});

// focus event
typeArea.addEventListener('focus', () => {
  flashChip('chip-focus');
  logEvent('focus', 'textarea focused');
});

// Global keydown — works outside textarea too
document.addEventListener('keydown', (e) => {
  if (document.activeElement !== typeArea) {
    showKeyIndicator(e.key, e.code);
    flashChip('chip-key');
    logEvent('keydown', `key="${e.key}"`);
  }

  // Ctrl+K or Cmd+K shortcut → open search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('hero-search').focus();
    showToast('⌘K — Search opened!');
  }

  // Escape → blur everything & close suggestions
  if (e.key === 'Escape') {
    document.activeElement.blur();
    document.getElementById('search-suggestions').classList.remove('active');
  }
});

/* ─────────────────────────────────────
   KEY INDICATOR POPUP
───────────────────────────────────── */
function showKeyIndicator(key, code) {
  const ki = document.getElementById('key-indicator');
  document.getElementById('ki-key-val').textContent = (key === ' ') ? 'SPACE' : key;
  document.getElementById('ki-code').textContent    = code || '';
  ki.classList.add('visible');
  clearTimeout(ki._timer);
  ki._timer = setTimeout(() => ki.classList.remove('visible'), 1800);
}

/* ─────────────────────────────────────
   MOUSE CANVAS EVENTS
   Events: mousemove, mousedown, mouseup,
           mouseenter, mouseleave, dblclick,
           contextmenu
───────────────────────────────────── */
const canvas = document.getElementById('mouse-canvas');
const feed   = document.getElementById('mouse-feed');
let   lastFeedTime = 0;
const btnNames = { 0: 'Left', 1: 'Middle', 2: 'Right' };

// mousemove — track position and draw trail
canvas.addEventListener('mousemove', (e) => {
  document.getElementById('mx').textContent = e.offsetX;
  document.getElementById('my').textContent = e.offsetY;
  addTrailDot(e.offsetX, e.offsetY);

  // Throttle feed to avoid spam
  const now = Date.now();
  if (now - lastFeedTime > 200) {
    lastFeedTime = now;
    addFeedRow('mousemove', e.offsetX, e.offsetY);
    flashChip('chip-hover');
    logEvent('mousemove', `(${e.offsetX}, ${e.offsetY})`);
  }
});

// mousedown — detect which button
canvas.addEventListener('mousedown', (e) => {
  const btn = btnNames[e.button] || 'Unknown';
  document.getElementById('mbtn').textContent = btn;
  addFeedRow('mousedown', e.offsetX, e.offsetY, btn);
  flashChip('chip-click');
  logEvent('mousedown', `button=${btn}`);

  // Burst effect on click
  for (let i = 0; i < 6; i++) {
    setTimeout(() => addTrailDot(
      e.offsetX + (Math.random() - 0.5) * 40,
      e.offsetY + (Math.random() - 0.5) * 40,
      true
    ), i * 30);
  }
});

canvas.addEventListener('mouseup',    (e) => addFeedRow('mouseup',    e.offsetX, e.offsetY));
canvas.addEventListener('mouseenter', (e) => addFeedRow('mouseenter', e.offsetX, e.offsetY));
canvas.addEventListener('mouseleave', (e) => addFeedRow('mouseleave', e.offsetX, e.offsetY));

// dblclick
canvas.addEventListener('dblclick', (e) => {
  addFeedRow('dblclick', e.offsetX, e.offsetY);
  logEvent('dblclick', 'on canvas');
});

// contextmenu (right-click) — prevent default menu
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  addFeedRow('contextmenu', e.offsetX, e.offsetY, 'Right-click');
});

/* Trail dot renderer */
function addTrailDot(x, y, burst = false) {
  const dot   = document.createElement('div');
  dot.className = 'mouse-trail';
  const size   = burst ? (8 + Math.random() * 12) : (4 + Math.random() * 6);
  const colors = ['#c9a84c', '#c24b2a', '#4a7c59', '#1a2744'];
  const color  = colors[Math.floor(Math.random() * colors.length)];
  dot.style.cssText = `
    width:${size}px; height:${size}px;
    left:${x}px; top:${y}px;
    background:${color};
    opacity:0.7;
    transition:opacity 1.2s;
  `;
  canvas.appendChild(dot);
  setTimeout(() => { dot.style.opacity = '0'; }, 50);
  setTimeout(() => dot.remove(), 1300);
}

/* Clear all trail dots */
function clearTrail() {
  canvas.querySelectorAll('.mouse-trail').forEach(d => d.remove());
}

/* Feed row renderer */
function addFeedRow(type, x, y, extra = '') {
  const now  = new Date();
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

  const row = document.createElement('div');
  row.className = 'mouse-event-row fresh';
  row.innerHTML = `
    <span class="me-type">${type}</span>
    <span class="me-coord">(${x}, ${y})</span>
    ${extra ? `<span style="font-size:0.6rem;color:var(--gold)">${extra}</span>` : ''}
    <span class="me-time">${time}</span>
  `;

  feed.insertBefore(row, feed.firstChild);
  setTimeout(() => row.classList.remove('fresh'), 800);

  // Keep max 8 rows
  if (feed.children.length > 8) feed.removeChild(feed.lastChild);
}

/* ─────────────────────────────────────
   SEARCH EVENTS
   Events: focus, input, keydown, blur, click
───────────────────────────────────── */
const heroSearch  = document.getElementById('hero-search');
const suggestions = document.getElementById('search-suggestions');

// focus event
heroSearch.addEventListener('focus', () => {
  suggestions.classList.add('active');
  flashChip('chip-focus');
  logEvent('focus', 'search input focused');
});

// input event — live filtering
heroSearch.addEventListener('input', (e) => {
  const val = e.target.value.toLowerCase();
  suggestions.classList.toggle('active', val.length > 0);
  flashChip('chip-input');
  logEvent('input', `search="${val}"`);
});

// blur event
heroSearch.addEventListener('blur', () => {
  setTimeout(() => suggestions.classList.remove('active'), 200);
});

// keydown — Enter to search, Escape to close
heroSearch.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    suggestions.classList.remove('active');
    showToast(`Searching: "${heroSearch.value}"`);
  }
});

// click on suggestion items
document.querySelectorAll('.suggest-item').forEach(item => {
  item.addEventListener('click', () => {
    heroSearch.value = item.textContent.trim();
    suggestions.classList.remove('active');
    showToast(`Trend selected: ${heroSearch.value}`);
    flashChip('chip-click');
    logEvent('click', 'suggestion selected');
  });
});

/* ─────────────────────────────────────
   HERO PARALLAX
   Event: mousemove, mouseleave
───────────────────────────────────── */
const heroRight  = document.getElementById('hero-right');
const heroBgText = document.getElementById('hero-bg-text');

heroRight.addEventListener('mousemove', (e) => {
  const rect = heroRight.getBoundingClientRect();
  const nx = (e.clientX - rect.left) / rect.width  - 0.5;
  const ny = (e.clientY - rect.top)  / rect.height - 0.5;
  heroBgText.style.transform     = `translate(calc(-50% + ${nx * 20}px), calc(-50% + ${ny * 20}px))`;
  heroBgText.style.letterSpacing = `${nx * 6}px`;
});

heroRight.addEventListener('mouseleave', () => {
  heroBgText.style.transform     = 'translate(-50%, -50%)';
  heroBgText.style.letterSpacing = '';
});

/* ─────────────────────────────────────
   SCROLL EVENTS
   Events: scroll (window)
───────────────────────────────────── */
const scrollBar  = document.getElementById('scroll-bar');
const navbar     = document.getElementById('navbar');
let   lastScrollY = 0;

window.addEventListener('scroll', () => {
  const scrollY   = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const pct       = Math.min((scrollY / maxScroll) * 100, 100);

  // Update progress bar width
  scrollBar.style.width = pct + '%';

  // Compact navbar on scroll
  navbar.classList.toggle('scrolled', scrollY > 60);

  // Log scroll event (throttled)
  if (Math.abs(scrollY - lastScrollY) > 80) {
    flashChip('chip-scroll');
    logEvent('scroll', `y=${Math.round(scrollY)} (${Math.round(pct)}%)`);
    lastScrollY = scrollY;
  }
});

/* ─────────────────────────────────────
   BUTTON CLICK EVENTS
───────────────────────────────────── */
// Explore button → smooth scroll
document.getElementById('explore-btn').addEventListener('click', () => {
  document.getElementById('trending').scrollIntoView({ behavior: 'smooth' });
  flashChip('chip-click');
  logEvent('click', 'Explore button → scroll to trending');
});

// Demo button → smooth scroll
document.getElementById('demo-btn').addEventListener('click', () => {
  document.getElementById('keyboard-demo').scrollIntoView({ behavior: 'smooth' });
  flashChip('chip-click');
  logEvent('click', 'See Events button → scroll to demo');
});

// Subscribe button
document.getElementById('nav-cta-btn').addEventListener('click', () => {
  showToast('Subscribed! Welcome to TRENDEX ✦');
  flashChip('chip-click');
  logEvent('click', 'Subscribe button clicked');
});

/* ─────────────────────────────────────
   TREND BADGES — mouseenter event
───────────────────────────────────── */
document.querySelectorAll('.trend-badge').forEach(badge => {
  badge.addEventListener('mouseenter', () => {
    flashChip('chip-hover');
    logEvent('mouseover', `badge: ${badge.querySelector('.badge-label').textContent}`);
  });
});

/* ─────────────────────────────────────
   NAV LINKS — hover + click events
───────────────────────────────────── */
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('mouseenter', () => {
    flashChip('chip-hover');
    logEvent('mouseover', `nav: ${a.textContent}`);
  });
  a.addEventListener('click', () => {
    flashChip('chip-click');
    logEvent('click', `nav: ${a.textContent}`);
  });
});

/* ─────────────────────────────────────
   CODE TABS — click event
───────────────────────────────────── */
document.querySelectorAll('.ctab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ctab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.code-block').forEach(b => b.classList.remove('visible'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('visible');
    flashChip('chip-click');
    logEvent('click', `Code tab → ${tab.dataset.tab}`);
  });
});

/* ─────────────────────────────────────
   EVENT STATUS BAR HELPERS
───────────────────────────────────── */
function flashChip(id) {
  const chip = document.getElementById(id);
  if (!chip) return;
  chip.classList.add('active-chip');
  clearTimeout(chip._timer);
  chip._timer = setTimeout(() => chip.classList.remove('active-chip'), 800);
}

function logEvent(type, detail) {
  const log = document.getElementById('live-event-log');
  log.textContent = `▸ ${type}: ${detail}`;
}

/* ─────────────────────────────────────
   TOAST NOTIFICATION
───────────────────────────────────── */
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity   = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.transform = 'translateY(80px)';
    toast.style.opacity   = '0';
  }, 2800);
}

/* ─────────────────────────────────────
   INITIALISE
───────────────────────────────────── */
renderCards();

// Welcome toast after short delay
setTimeout(() => showToast('Move, click, type — events fire live ✦'), 1200);
