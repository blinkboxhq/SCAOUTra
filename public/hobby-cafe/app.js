/* Hobby Café — app shell, state & views. Vanilla JS, no build step. */
(() => {
'use strict';

/* ═════════ State ═════════ */
const KEY = 'hobby-cafe-v1';
const today = () => new Date().toISOString().slice(0, 10);
const DEFAULT = {
  name: 'Agent', companion: 'Anya', avatar: null,
  xp: 0, log: [], tried: {}, wish: [],
  streak: { last: '', count: 0, best: 0 },
  belt: 0, beltBest: {},
  riddles: [], codes: [], puzzles: 0,
  energy: 2, mood: 'surprise',
};
let S;
try { S = Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { S = { ...DEFAULT }; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };

const LEVELS = ['New Customer', 'Curious Regular', 'Window-Seat Regular', 'Barista Apprentice', 'Hobby Hunter', 'Head Barista', 'Secret Agent', 'Master of Many Things', 'Café Legend', 'Golden-Heart Grandmaster'];
const level = () => Math.min(LEVELS.length - 1, Math.floor(Math.sqrt(S.xp / 60)));
const levelXp = l => l * l * 60;

function bumpStreak() {
  const t = today(); if (S.streak.last === t) return;
  const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  S.streak.count = S.streak.last === y ? S.streak.count + 1 : 1;
  S.streak.best = Math.max(S.streak.best, S.streak.count);
  S.streak.last = t;
}
function gainXp(n, why) {
  const before = level();
  S.xp += n; bumpStreak(); save();
  toast(`+${n} XP · ${why}`);
  if (level() > before) setTimeout(() => { confetti(); say(`LEVEL UP! You're now a ${LEVELS[level()]}! I knew it. I read your mind.`, 'sparkle'); }, 600);
}

/* ═════════ Helpers ═════════ */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const H = window.HOBBIES, C = window.CATEGORIES, L = window.LINES;
const byId = id => H.find(h => h.id === id);
const yt = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
const dots = (n, max = 3, ch = '●') => ch.repeat(n) + '<span class="dim">' + ch.repeat(max - n) + '</span>';
const ENERGY = { 1: ['🔋', 'Cozy'], 2: ['⚡', 'Steady'], 3: ['🔥', 'Hyper'] };
const LVL = { 1: 'Beginner', 2: 'Explorer', 3: 'Master' };
const cname = () => esc(S.companion || 'Anya');

function avatar(mood = 'happy', cls = '') {
  if (S.avatar) return `<div class="avatar ${cls}"><img src="${S.avatar}" alt="${cname()}"></div>`;
  return `<div class="avatar ${cls}">${companionSVG(mood)}</div>`;
}

function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  $('#toasts').appendChild(t); setTimeout(() => t.classList.add('out'), 2200); setTimeout(() => t.remove(), 2700);
}
function say(text, mood = 'happy') {
  const b = $('#buddy');
  b.innerHTML = `${avatar(mood, 'sm')}<div class="bubble"><b>${cname()}</b><span>${esc(text)}</span></div>`;
  b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
  clearTimeout(say.t); say.t = setTimeout(() => b.classList.remove('show'), 5200);
}
function confetti() {
  const box = $('#confetti'); const cols = ['#F4A3B0', '#F2C94C', '#7DD3A6', '#E8833A', '#7B4FB0', '#3C78C8'];
  for (let i = 0; i < 70; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw'; p.style.background = cols[i % cols.length];
    p.style.animationDelay = Math.random() * .4 + 's'; p.style.animationDuration = 1.6 + Math.random() * 1.4 + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`; box.appendChild(p); setTimeout(() => p.remove(), 3400);
  }
}
const daySeed = (extra = '') => seeded(today() + extra);

/* ═════════ Recommendation ═════════ */
function recommend(exclude = []) {
  const lv = level();
  let pool = H.filter(h => !exclude.includes(h.id) && h.level <= (lv >= 4 ? 3 : lv >= 1 ? 2 : 1) + 0);
  if (S.mood !== 'surprise') pool = pool.filter(h => C[h.cat].mood === S.mood);
  pool = pool.filter(h => Math.abs(h.energy - S.energy) <= (S.energy === 2 ? 1 : 0) || h.energy === S.energy);
  if (!pool.length) pool = H.filter(h => !exclude.includes(h.id));
  const weights = pool.map(h => (S.tried[h.id] ? 1 : 4) * (S.wish.includes(h.id) ? 2 : 1));
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < pool.length; i++) { r -= weights[i]; if (r <= 0) return pool[i]; }
  return pool[0];
}
const todaysSpecial = () => H[Math.floor(daySeed('special')() * H.length)];

/* ═════════ Router ═════════ */
const TABS = [
  ['cafe', '☕', 'Café'], ['menu', '📜', 'Menu'], ['puzzles', '🧩', 'Puzzles'],
  ['spy', '🕵️', 'Spy HQ'], ['dojo', '🥋', 'Dojo'], ['me', '🎫', 'Passport'],
];
let route = 'cafe', param = '';
function go(r) { location.hash = r; }
window.addEventListener('hashchange', parseRoute);
function parseRoute() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (h.startsWith('challenge=')) { route = 'spy'; param = h.slice(10); }
  else { [route, param = ''] = (h || 'cafe').split('/'); }
  if (!VIEWS[route]) route = 'cafe';
  render();
}
function render() {
  stopTimers();
  $('#nav').innerHTML = TABS.map(([r, i, l]) => `<a href="#${r}" class="${route === r || (route === 'mission' && r === 'menu') || (route === 'rest' && r === 'cafe') ? 'on' : ''}"><span>${i}</span><small>${l}</small></a>`).join('');
  const main = $('#main'); main.innerHTML = VIEWS[route](param); main.scrollTop = 0; window.scrollTo(0, 0);
  AFTER[route]?.(param);
}

/* ═════════ Views ═════════ */
const VIEWS = {}, AFTER = {};
let timers = [];
const every = (fn, ms) => timers.push(setInterval(fn, ms));
function stopTimers() { timers.forEach(clearInterval); timers = []; }

/* ── Café (home) ── */
VIEWS.cafe = () => {
  const lv = level(), next = levelXp(lv + 1), cur = levelXp(lv);
  const pct = lv >= LEVELS.length - 1 ? 100 : Math.round((S.xp - cur) / (next - cur) * 100);
  const sp = todaysSpecial();
  const greet = pick(L.greet);
  return `
  <section class="storefront">
    <div class="shelves" aria-hidden="true">${shelves()}</div>
    <div class="sign"><span>HOBBY</span> CAFÉ</div>
    <div class="hours">OPEN · for fun, adventure & rest</div>
    <div class="hero-row">
      <div class="hero-avatar">${avatar(pick(['happy', 'smug', 'cool']), 'lg')}</div>
      <div class="hero-talk">
        <div class="speech"><b>${cname()}</b><p id="heroLine">${esc(greet)}</p></div>
        <div class="checkin">
          <div class="label">Your energy right now</div>
          <div class="chips" id="energyChips">${[1, 2, 3].map(e => `<button class="chip ${S.energy === e ? 'on' : ''}" data-energy="${e}">${ENERGY[e][0]} ${ENERGY[e][1]}</button>`).join('')}</div>
          <div class="label">You're craving…</div>
          <div class="chips" id="moodChips">${[['adventure', '🗺️ Adventure'], ['drama', '🎭 Drama'], ['calm', '🍵 Calm'], ['surprise', '🎁 Surprise me']].map(([m, l]) => `<button class="chip ${S.mood === m ? 'on' : ''}" data-mood="${m}">${l}</button>`).join('')}</div>
          <button class="btn big" data-act="idea">✨ ${cname()}, give me an idea!</button>
        </div>
      </div>
    </div>
  </section>
  <div id="ideaSlot"></div>

  <section class="stats">
    <div class="stat"><div class="k">${LEVELS[lv]}</div><div class="bar"><i style="width:${pct}%"></i></div><small>${S.xp} XP · level ${lv + 1}</small></div>
    <div class="stat"><div class="k">🔥 ${S.streak.count}</div><small>day streak</small></div>
    <div class="stat"><div class="k">🎫 ${Object.keys(S.tried).length}</div><small>of ${H.length} hobbies tried</small></div>
  </section>

  <h2 class="sec">Today at the café</h2>
  <section class="tiles">
    <button class="tile rescue" data-act="rescue"><span>🚨</span><b>Doom-scroll rescue</b><small>Caught yourself scrolling? 5-minute counter-mission.</small></button>
    <a class="tile special" href="#menu/${sp.id}"><span>${sp.emoji}</span><b>Today's special</b><small>${esc(sp.name)} · ${sp.mins} min</small></a>
    <a class="tile" href="#spy"><span>📜</span><b>Secret mission</b><small>${S.codes.includes(today()) ? 'Decoded ✓ — great work, agent' : 'An intercepted message awaits decoding'}</small></a>
    <a class="tile" href="#dojo"><span>🥋</span><b>Math Dojo</b><small>${BELTS[S.belt].name} · ${BELTS[S.belt].topic}</small></a>
    <a class="tile" href="#puzzles"><span>🧩</span><b>Puzzle Corner</b><small>Word search, scrambles, riddles & puzzle maker</small></a>
    <a class="tile calm" href="#rest"><span>🛋️</span><b>Rest Nook</b><small>Breathing, do-nothing timer, cozy picks</small></a>
  </section>

  <h2 class="sec">The café rooms</h2>
  <section class="rooms">${Object.entries(C).map(([k, c]) => {
    const tot = H.filter(h => h.cat === k).length, done = H.filter(h => h.cat === k && S.tried[h.id]).length;
    return `<a class="room" href="#menu" data-cat="${k}" style="--c:${c.color}"><span>${c.emoji}</span><b>${c.name}</b><small>${c.blurb}</small><em>${done}/${tot}</em></a>`;
  }).join('')}</section>`;
};
function shelves() {
  const r = seeded('shelf'), cols = ['#C8423C', '#3C78C8', '#E8833A', '#4BA56A', '#7B4FB0', '#D9B44A', '#8A5A3C', '#F4A3B0', '#2F7F8F'];
  let out = '';
  for (let row = 0; row < 3; row++) {
    out += '<div class="shelf">';
    for (let i = 0; i < 34; i++) out += `<i style="height:${58 + r() * 40}%;width:${6 + r() * 8}px;background:${cols[Math.floor(r() * cols.length)]}"></i>`;
    out += '</div>';
  }
  return out;
}
AFTER.cafe = () => {
  document.querySelectorAll('[data-cat]').forEach(a => a.addEventListener('click', () => { menuF.cat = a.dataset.cat; }));
};
function ideaCard(h, line) {
  const c = C[h.cat];
  return `<section class="idea" style="--c:${c.color}">
    <div class="idea-head">${avatar('sparkle', 'sm')}<p><b>${cname()}:</b> ${esc(line)}</p></div>
    <div class="idea-body">
      <div class="idea-emoji">${h.emoji}</div>
      <div><h3>${esc(h.name)}</h3>
        <div class="meta">${c.emoji} ${c.name} · ${ENERGY[h.energy][0]} ${ENERGY[h.energy][1]} · ${LVL[h.level]} · ⏱ ${h.mins} min ${S.tried[h.id] ? '· <b>tried ✓</b>' : '· <b>new!</b>'}</div>
        <p class="first">First step: ${esc(h.steps[0])}</p></div>
    </div>
    <div class="row"><a class="btn" href="#mission/${h.id}">🎯 Accept mission</a><a class="btn ghost" href="#menu/${h.id}">Details</a><button class="btn ghost" data-act="idea">🔄 Another one</button></div>
  </section>`;
}

/* ── Menu ── */
const menuF = { cat: 'all', energy: 0, level: 0, q: '', fresh: false };
VIEWS.menu = (id) => {
  if (id && byId(id)) return detail(byId(id));
  return `
  <header class="page-head"><h1>📜 The Hobby Menu</h1><p>${H.length} hobbies, served fresh. Pick by mood, energy, or courage.</p></header>
  <div class="filters">
    <input id="q" type="search" placeholder="Search hobbies… (kung fu, tea, code…)" value="${esc(menuF.q)}">
    <div class="chips scroll">${[['all', '✨ All']].concat(Object.entries(C).map(([k, c]) => [k, c.emoji + ' ' + c.name])).map(([k, l]) => `<button class="chip ${menuF.cat === k ? 'on' : ''}" data-fcat="${k}">${l}</button>`).join('')}</div>
    <div class="chips">
      ${[0, 1, 2, 3].map(e => `<button class="chip sm ${menuF.energy === e ? 'on' : ''}" data-fen="${e}">${e ? ENERGY[e][0] + ' ' + ENERGY[e][1] : 'Any energy'}</button>`).join('')}
      <span class="sep"></span>
      ${[0, 1, 2, 3].map(l => `<button class="chip sm ${menuF.level === l ? 'on' : ''}" data-flv="${l}">${l ? LVL[l] : 'Any level'}</button>`).join('')}
      <span class="sep"></span>
      <button class="chip sm ${menuF.fresh ? 'on' : ''}" data-ffresh>🆕 Untried only</button>
    </div>
  </div>
  <div id="menuGrid" class="menu-grid"></div>`;
};
function menuGrid() {
  const q = menuF.q.toLowerCase();
  const list = H.filter(h => (menuF.cat === 'all' || h.cat === menuF.cat) && (!menuF.energy || h.energy === menuF.energy)
    && (!menuF.level || h.level === menuF.level) && (!menuF.fresh || !S.tried[h.id])
    && (!q || (h.name + ' ' + C[h.cat].name + ' ' + h.steps.join(' ')).toLowerCase().includes(q)));
  $('#menuGrid').innerHTML = list.length ? list.map(h => `
    <a class="card" href="#menu/${h.id}" style="--c:${C[h.cat].color}">
      <span class="e">${h.emoji}</span>
      <b>${esc(h.name)}</b>
      <small>${C[h.cat].name}</small>
      <div class="foot"><span title="energy">${ENERGY[h.energy][0]}</span><span>${LVL[h.level]}</span><span>⏱${h.mins}m</span>${S.tried[h.id] ? '<span class="stamp">✓</span>' : ''}${S.wish.includes(h.id) ? '<span>💖</span>' : ''}</div>
    </a>`).join('') : `<p class="empty">Nothing matches… ${cname()} says try fewer filters!</p>`;
}
AFTER.menu = (id) => {
  if (id) return;
  menuGrid();
  $('#q').addEventListener('input', e => { menuF.q = e.target.value; menuGrid(); });
  $('.filters').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.fcat) menuF.cat = b.dataset.fcat;
    if (b.dataset.fen) menuF.energy = +b.dataset.fen;
    if (b.dataset.flv) menuF.level = +b.dataset.flv;
    if (b.hasAttribute('data-ffresh')) menuF.fresh = !menuF.fresh;
    const y = window.scrollY; render(); window.scrollTo(0, y);
  });
};
function detail(h) {
  const c = C[h.cat], logs = S.log.filter(l => l.id === h.id);
  return `
  <a class="back" href="#menu">← Back to menu</a>
  <article class="detail" style="--c:${c.color}">
    <div class="detail-top"><span class="big-e">${h.emoji}</span>
      <div><div class="tag">${c.emoji} ${c.name}</div><h1>${esc(h.name)}</h1>
      <div class="meta">${ENERGY[h.energy][0]} ${ENERGY[h.energy][1]} energy · ${LVL[h.level]} · ⏱ about ${h.mins} min</div></div></div>
    <h3>Your mission briefing</h3>
    <ol class="steps">${h.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    ${h.yt ? `<a class="yt" href="${yt(h.yt)}" target="_blank" rel="noopener">▶ Watch a tutorial on YouTube <small>(learn it, then close the tab, agent!)</small></a>` : ''}
    <div class="row">
      <a class="btn big" href="#mission/${h.id}">🎯 Start mission</a>
      <button class="btn ghost" data-act="wish" data-id="${h.id}">${S.wish.includes(h.id) ? '💖 On your wishlist' : '🤍 Save for later'}</button>
    </div>
    ${logs.length ? `<h3>Your notes</h3><ul class="journal">${logs.map(l => `<li><b>${l.date}</b> ${['', '😐', '🙂', '😍'][l.rating] || ''} ${esc(l.note || '')}</li>`).join('')}</ul>` : ''}
  </article>`;
}

/* ── Mission (focus mode) ── */
let mission = null;
VIEWS.mission = (id) => {
  const h = byId(id); if (!h) return VIEWS.menu();
  if (!mission || mission.id !== id) mission = { id, start: Date.now(), checks: [] };
  return `
  <section class="mission" style="--c:${C[h.cat].color}">
    <div class="scroll-paper">
      <div class="stamp-top">TOP SECRET</div>
      <h1>Secret Mission</h1>
      <h2>${h.emoji} ${esc(h.name)}</h2>
      <div class="clock" id="clock">00:00</div>
      <small class="target">Target: about ${h.mins} minutes — no rush</small>
      <ul class="checks">${h.steps.map((s, i) => `<li><label><input type="checkbox" data-step="${i}" ${mission.checks.includes(i) ? 'checked' : ''}> ${esc(s)}</label></li>`).join('')}</ul>
      ${h.yt ? `<a class="yt" href="${yt(h.yt)}" target="_blank" rel="noopener">▶ Tutorial search</a>` : ''}
      <div class="row center">
        <button class="btn ghost" data-act="screenoff">🌙 Screen-off mode</button>
        <button class="btn big" data-act="finish">✅ Mission complete</button>
      </div>
      <a class="abort" href="#menu/${h.id}" data-act="abort">abort mission</a>
    </div>
  </section>
  <div class="sheet" id="finishSheet" hidden>
    <div class="sheet-card">
      ${avatar('sparkle', 'md')}
      <h2>Mission report, agent!</h2>
      <p>How was <b>${esc(h.name)}</b>?</p>
      <div class="chips center" id="rate">${[[3, '😍 Loved it'], [2, '🙂 It was nice'], [1, '😐 Not for me']].map(([v, l]) => `<button class="chip" data-rate="${v}">${l}</button>`).join('')}</div>
      <textarea id="note" rows="3" placeholder="One line for your journal: what surprised you?"></textarea>
      <button class="btn big" data-act="report">Stamp my passport 🎫</button>
    </div>
  </div>`;
};
AFTER.mission = () => {
  const tick = () => { const s = Math.floor((Date.now() - mission.start) / 1000); const t = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; const c = $('#clock'); if (c) c.textContent = t; const so = $('#soClock'); if (so) so.textContent = t; };
  tick(); every(tick, 1000);
  $('.checks').onchange = e => { const i = +e.target.dataset.step; mission.checks = mission.checks.filter(x => x !== i); if (e.target.checked) mission.checks.push(i); };
};

/* ── Puzzles ── */
let ptab = 'search', ws = null, wsFound = [], wsSel = null, scr = null, scrScore = 0, rid = null;
VIEWS.puzzles = () => `
  <header class="page-head"><h1>🧩 Puzzle Corner</h1><p>Like the puzzle pages at the back of old magazines — but you can also make your own for friends.</p></header>
  <div class="tabs">${[['search', '🔤 Word Search'], ['scramble', '🔀 Scramble'], ['riddle', '❓ Riddles'], ['maker', '🖨️ Puzzle Maker']].map(([k, l]) => `<button class="${ptab === k ? 'on' : ''}" data-ptab="${k}">${l}</button>`).join('')}</div>
  <div id="pbody">${PZ[ptab]()}</div>`;
const PZ = {
  search: () => {
    if (!ws) newSearch(Object.keys(WORD_THEMES)[0]);
    return `<div class="row"><select id="wsTheme">${Object.keys(WORD_THEMES).map(t => `<option ${ws.theme === t ? 'selected' : ''}>${t}</option>`).join('')}</select>
      <button class="btn ghost sm" data-act="wsnew">New grid</button><span class="muted">Tap the first letter, then the last letter of a word.</span></div>
      <div class="ws-wrap"><div class="ws" style="--n:${ws.size}">${ws.grid.map((row, r) => row.map((ch, c) => `<button data-r="${r}" data-c="${c}" class="${cellFound(r, c) ? 'found' : ''} ${wsSel && wsSel[0] === r && wsSel[1] === c ? 'sel' : ''}">${ch}</button>`).join('')).join('')}</div>
      <ul class="ws-words">${ws.placed.map(p => `<li class="${wsFound.includes(p.word) ? 'done' : ''}">${p.word}</li>`).join('')}</ul></div>`;
  },
  scramble: () => {
    if (!scr) nextScramble();
    return `<div class="scr"><div class="scr-word">${scr.s.split('').map(c => `<span>${c}</span>`).join('')}</div>
      <p class="muted">Hint: ${esc(scr.hint)}</p>
      <form id="scrForm" class="row center"><input id="scrIn" autocomplete="off" placeholder="Unscramble…" autofocus><button class="btn">Check</button><button type="button" class="btn ghost" data-act="scrskip">Skip</button></form>
      <p class="score">Solved this session: <b>${scrScore}</b></p></div>`;
  },
  riddle: () => {
    if (rid == null) rid = RIDDLES.findIndex((_, i) => !S.riddles.includes(i)); if (rid < 0) rid = 0;
    const [q, a] = RIDDLES[rid];
    return `<div class="riddle"><div class="riddle-n">Riddle ${rid + 1} of ${RIDDLES.length} · solved ${S.riddles.length}</div><p class="rq">${esc(q)}</p>
      <details><summary>Reveal answer</summary><p class="ra">${esc(a)}</p></details>
      <div class="row center"><button class="btn" data-act="rgot">I got it! ✓</button><button class="btn ghost" data-act="rnext">Next riddle →</button></div></div>`;
  },
  maker: () => `<div class="maker">
      <p>Make a printable word search for a friend (or a puzzle night). Use their favourite things, inside jokes, names…</p>
      <input id="mkTitle" placeholder="Puzzle title — e.g. “For Mia: Our Summer”" value="My Secret Word Search">
      <textarea id="mkWords" rows="4" placeholder="Words separated by commas or new lines (max 12 letters each)">PEANUT, SPY, CAFE, BOOKS, KUNGFU, TEA, ADVENTURE, FRIEND</textarea>
      <div class="row"><label>Size <select id="mkSize">${[10, 12, 14, 16].map(n => `<option ${n === 12 ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      <button class="btn" data-act="mkgo">Generate</button><button class="btn ghost" data-act="mkprint">🖨️ Print</button></div>
      <div id="printArea"></div></div>`,
};
function newSearch(theme) { ws = { ...makeWordSearch(WORD_THEMES[theme].slice(0, 10), 12), theme }; wsFound = []; wsSel = null; }
function cellFound(r, c) {
  return ws.placed.some(p => wsFound.includes(p.word) && onLine(p, r, c));
}
function onLine(p, r, c) {
  const n = p.word.length, dr = Math.sign(p.r1 - p.r0), dc = Math.sign(p.c1 - p.c0);
  for (let i = 0; i < n; i++) if (p.r0 + dr * i === r && p.c0 + dc * i === c) return true; return false;
}
function nextScramble() { const [w, hint] = pick(SCRAMBLE_WORDS); scr = { w, hint, s: scramble(w) }; }
function rerenderP() { $('#pbody').innerHTML = PZ[ptab](); AFTER.puzzles(); }
AFTER.puzzles = () => {
  if (ptab === 'search') {
    $('#wsTheme').onchange = e => { newSearch(e.target.value); rerenderP(); };
    $('.ws').onclick = e => {
      const b = e.target.closest('button'); if (!b) return; const r = +b.dataset.r, c = +b.dataset.c;
      if (!wsSel) { wsSel = [r, c]; rerenderP(); return; }
      const hit = ws.placed.find(p => !wsFound.includes(p.word) && ((p.r0 === wsSel[0] && p.c0 === wsSel[1] && p.r1 === r && p.c1 === c) || (p.r1 === wsSel[0] && p.c1 === wsSel[1] && p.r0 === r && p.c0 === c)));
      wsSel = null;
      if (hit) { wsFound.push(hit.word); if (wsFound.length === ws.placed.length) { confetti(); S.puzzles++; gainXp(25, 'word search cleared'); say('You found them ALL! Detective-level eyes!', 'sparkle'); } }
      rerenderP();
    };
  }
  if (ptab === 'scramble') {
    $('#scrForm').onsubmit = e => { e.preventDefault(); const v = $('#scrIn').value.trim().toUpperCase();
      if (v === scr.w) { scrScore++; gainXp(5, 'word unscrambled'); nextScramble(); rerenderP(); $('#scrIn')?.focus(); }
      else { $('#scrIn').classList.add('shake'); setTimeout(() => $('#scrIn')?.classList.remove('shake'), 400); } };
  }
};

/* ── Spy HQ ── */
let cip = { type: 'caesar', p: 3, dir: 'enc' };
function dailyIntercept() {
  const r = daySeed('intercept'), msg = pick(SECRET_MESSAGES, r);
  const types = ['caesar', 'atbash', 'a1z26', 'morse', 'reverse', 'caesar'];
  const type = pick(types, r), p = type === 'caesar' ? ri(1, 25, r) : '';
  return { msg, type, p, enc: CIPHERS[type].enc(msg, p) };
}
function readChallenge(s) { try { return JSON.parse(decodeURIComponent(escape(atob(s)))); } catch { return null; } }
VIEWS.spy = (chal) => {
  const ch = chal ? readChallenge(chal) : null;
  const d = dailyIntercept(), solved = S.codes.includes(today());
  return `
  <header class="page-head spy-head"><h1>🕵️ Spy HQ</h1><p>Codes, ciphers & secret messages to swap with friends. ${cname()} is wearing her sunglasses.</p>${avatar('cool', 'sm')}</header>
  ${ch ? `<section class="intercept friend"><div class="stamp-top">FROM A FRIEND</div><h2>📨 Incoming challenge${ch.f ? ' from ' + esc(ch.f) : ''}</h2>
    <pre class="code">${esc(ch.t)}</pre><p class="muted">Cipher: <b>${esc(CIPHERS[ch.c]?.name || '?')}</b>${ch.c === 'keyword' ? ' — ask your friend for the keyword!' : ''}</p>
    <div class="row"><input id="chGuess" placeholder="Your decoded message"><button class="btn" data-act="chcheck">Check</button></div>
    <p class="muted">Tip: paste it into the Code Machine below and try decoding.</p></section>` : ''}
  <section class="intercept">
    <div class="stamp-top">${solved ? 'DECODED' : 'INTERCEPTED'}</div>
    <h2>📜 Today's secret mission</h2>
    <p>We intercepted this message. Decode it, agent.</p>
    <pre class="code">${esc(d.enc)}</pre>
    ${solved ? `<p class="win">✓ “${d.msg}” — mission accomplished.</p>` : `
    <div class="row"><input id="icGuess" placeholder="Type the decoded message…"><button class="btn" data-act="iccheck">Submit</button></div>
    <details><summary>Need a hint?</summary><p>The cipher is <b>${CIPHERS[d.type].name}</b>. ${CIPHERS[d.type].about}${d.type === 'caesar' ? ' Try different shifts in the Code Machine!' : ''}</p></details>`}
  </section>
  <section class="machine">
    <h2>⚙️ Code Machine</h2>
    <div class="chips">${Object.entries(CIPHERS).map(([k, c]) => `<button class="chip ${cip.type === k ? 'on' : ''}" data-cip="${k}">${c.icon} ${c.name}</button>`).join('')}</div>
    <p class="muted">${CIPHERS[cip.type].about}</p>
    ${CIPHERS[cip.type].param ? `<label class="param">${CIPHERS[cip.type].param.label} <input id="cipP" type="${CIPHERS[cip.type].param.type}" value="${esc(cip.p)}"></label>` : ''}
    <div class="io">
      <textarea id="cipIn" rows="4" placeholder="Write your secret message here…"></textarea>
      <div class="io-mid"><button class="chip ${cip.dir === 'enc' ? 'on' : ''}" data-dir="enc">🔒 Encode</button><button class="chip ${cip.dir === 'dec' ? 'on' : ''}" data-dir="dec">🔓 Decode</button></div>
      <textarea id="cipOut" rows="4" readonly placeholder="…result appears here"></textarea>
    </div>
    <div class="row"><input id="cipFrom" placeholder="Your code name (optional)" value="${esc(S.name)}">
      <button class="btn" data-act="chlink">🔗 Make friend challenge link</button><button class="btn ghost" data-act="copyout">Copy result</button></div>
    <p class="muted">The link opens this app with your coded message waiting for your friend. Plain-text links — fun secrets only, never passwords!</p>
  </section>
  <section class="guide"><h2>📘 Field guide: spy skills to try off-screen</h2>
    <div class="menu-grid">${H.filter(h => h.cat === 'spy').map(h => `<a class="card" href="#menu/${h.id}" style="--c:${C.spy.color}"><span class="e">${h.emoji}</span><b>${esc(h.name)}</b><small>${h.mins} min · ${LVL[h.level]}</small></a>`).join('')}</div></section>`;
};
AFTER.spy = () => {
  const run = () => { const c = CIPHERS[cip.type]; $('#cipOut').value = c[cip.dir]($('#cipIn').value, cip.p); };
  $('#cipIn').addEventListener('input', run);
  $('#cipP')?.addEventListener('input', e => { cip.p = e.target.value; run(); });
  $('.machine').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.cip) { const keep = $('#cipIn').value; cip.type = b.dataset.cip; cip.p = CIPHERS[cip.type].param?.def ?? ''; const y = scrollY; render(); scrollTo(0, y); $('#cipIn').value = keep; AFTER_spyRun(); }
    if (b.dataset.dir) { cip.dir = b.dataset.dir; document.querySelectorAll('[data-dir]').forEach(x => x.classList.toggle('on', x === b)); run(); }
  });
};
function AFTER_spyRun() { const c = CIPHERS[cip.type]; $('#cipOut').value = c[cip.dir]($('#cipIn').value, cip.p); }
const norm = s => s.toUpperCase().replace(/[^A-Z0-9]/g, '');

/* ── Math Dojo ── */
let round = null;
VIEWS.dojo = () => {
  if (round && !round.done) return dojoRound();
  if (round && round.done) return dojoResult();
  return `
  <header class="page-head"><h1>🥋 Math Dojo</h1><p>From white belt to black belt — one small round at a time. Score 8/10 to earn the next belt. Paper and pencil are encouraged!</p></header>
  <div class="dojo-intro">${avatar('smug', 'sm')}<p><b>${cname()}:</b> ${esc(pick(L.math))}</p></div>
  <section class="belts">${BELTS.map((b, i) => {
    const locked = i > S.belt, best = S.beltBest[i];
    return `<button class="belt ${locked ? 'locked' : ''}" data-belt="${i}" ${locked ? 'disabled' : ''} style="--b:${b.color};--bi:${b.ink}">
      <span class="knot"></span><b>${b.name}</b><small>${b.topic}</small><em>${locked ? '🔒' : best != null ? `best ${best}/10` : 'start →'}</em></button>`;
  }).join('')}</section>`;
};
function dojoRound() {
  const p = round.qs[round.i], b = BELTS[round.belt];
  return `<section class="round" style="--b:${b.color};--bi:${b.ink}">
    <div class="round-top"><span class="belt-pill">${b.name}</span><span>Question ${round.i + 1}/10</span><span>✓ ${round.score}</span><span id="rtime">0s</span></div>
    <div class="progress">${round.qs.map((_, i) => `<i class="${i < round.i ? (round.res[i] ? 'ok' : 'no') : i === round.i ? 'cur' : ''}"></i>`).join('')}</div>
    <div class="question">${esc(p.q)}</div>${p.hint ? `<p class="muted center">${esc(p.hint)}</p>` : ''}
    <form id="ansForm" class="row center"><input id="ans" inputmode="decimal" autocomplete="off" placeholder="Answer" autofocus><button class="btn big">Enter</button></form>
    <p id="fb" class="fb"></p>
    <button class="abort" data-act="quitround">leave round</button></section>`;
}
function dojoResult() {
  const pass = round.score >= 8, b = BELTS[round.belt];
  return `<section class="round result" style="--b:${b.color};--bi:${b.ink}">
    ${avatar(pass ? 'sparkle' : 'happy', 'md')}
    <h2>${round.score}/10 ${pass ? '— passed!' : ''}</h2>
    <p>${pass ? (round.belt + 1 < BELTS.length && S.belt === round.belt + 1 && round.unlocked ? `You earned your <b>${BELTS[round.belt + 1].name}</b>! 🎉` : 'Excellent form, disciple.') : 'Every master was once a beginner. Try again — the dojo is patient.'}</p>
    <details><summary>Review answers</summary><ul class="review">${round.qs.map((q, i) => `<li class="${round.res[i] ? 'ok' : 'no'}">${esc(q.q)} = <b>${q.a}</b>${round.res[i] ? '' : ` <small>(you: ${esc(round.given[i] || '—')})</small>`}</li>`).join('')}</ul></details>
    <div class="row center"><button class="btn" data-belt="${round.belt}">Again</button>${pass && round.belt + 1 < BELTS.length ? `<button class="btn" data-belt="${round.belt + 1}">Next belt →</button>` : ''}<button class="btn ghost" data-act="dojohome">All belts</button></div>
  </section>`;
}
AFTER.dojo = () => {
  if (round && !round.done) {
    $('#ans')?.focus();
    every(() => { const t = $('#rtime'); if (t) t.textContent = Math.floor((Date.now() - round.start) / 1000) + 's'; }, 1000);
    $('#ansForm').onsubmit = e => {
      e.preventDefault(); const v = $('#ans').value; if (!v.trim()) return;
      const p = round.qs[round.i], ok = checkAnswer(v, p.a);
      round.res.push(ok); round.given.push(v); if (ok) round.score++;
      $('#fb').textContent = ok ? pick(['Correct! ✓', 'Sugoi! ✓', 'Nice! ✓', 'Elegant! ✓']) : `Not quite — it was ${p.a}`;
      $('#fb').className = 'fb ' + (ok ? 'ok' : 'no');
      $('#ans').disabled = true;
      setTimeout(() => {
        round.i++;
        if (round.i >= 10) {
          round.done = true;
          S.beltBest[round.belt] = Math.max(S.beltBest[round.belt] || 0, round.score);
          if (round.score >= 8 && S.belt === round.belt && S.belt < BELTS.length - 1) { S.belt++; round.unlocked = true; confetti(); }
          gainXp(round.score * 3 + (round.unlocked ? 40 : 0), round.unlocked ? 'new belt!' : 'dojo round');
        }
        render();
      }, ok ? 650 : 1500);
    };
  }
};

/* ── Rest Nook ── */
VIEWS.rest = () => `
  <a class="back" href="#cafe">← Back to café</a>
  <header class="page-head"><h1>🛋️ Rest Nook</h1><p>Balance is part of the adventure. Real rest, not scroll-rest.</p></header>
  <section class="breathe-box">
    <div class="breath" id="breath"><span id="bLabel">Tap to begin</span></div>
    <div class="row center"><button class="btn" data-act="breathe">🫁 Box breathing (4·4·4·4)</button><button class="btn ghost" data-act="breathe478">🌙 4·7·8 sleepy breath</button></div>
  </section>
  <section class="nothing">
    <h2>🍃 The Do-Nothing Timer</h2>
    <p>No phone, no book, no plan. Just sit. Let your mind wander like a cat in a sunbeam.</p>
    <div class="row center">${[3, 5, 10].map(m => `<button class="btn ghost" data-nothing="${m}">${m} min</button>`).join('')}</div>
  </section>
  <h2 class="sec">Cozy picks</h2>
  <div class="menu-grid">${H.filter(h => h.cat === 'rest' || (h.energy === 1 && h.cat === 'nature')).map(h => `<a class="card" href="#menu/${h.id}" style="--c:${C[h.cat].color}"><span class="e">${h.emoji}</span><b>${esc(h.name)}</b><small>${h.mins} min</small></a>`).join('')}</div>`;
let breathRun = 0;
function breathe(pattern) {
  const run = ++breathRun, el = $('#breath'), lab = $('#bLabel');
  const phases = pattern === '478' ? [['Breathe in', 4, 1], ['Hold', 7, 1], ['Breathe out', 8, 0]] : [['Breathe in', 4, 1], ['Hold', 4, 1], ['Breathe out', 4, 0], ['Hold', 4, 0]];
  let i = 0, rounds = 0;
  const step = () => {
    if (run !== breathRun || !$('#breath')) return;
    const [l, s, big] = phases[i];
    el.style.transitionDuration = s + 's'; el.classList.toggle('big', !!big);
    let left = s; lab.textContent = `${l} · ${left}`;
    const iv = setInterval(() => { left--; if (left > 0 && run === breathRun) lab.textContent = `${l} · ${left}`; }, 1000);
    setTimeout(() => { clearInterval(iv); i = (i + 1) % phases.length; if (i === 0) rounds++;
      if (rounds >= 5) { lab.textContent = 'Beautiful. ✨'; el.classList.remove('big'); gainXp(10, 'breathing'); return; } step(); }, s * 1000);
  };
  step();
}

/* ── Passport (me) ── */
VIEWS.me = () => {
  const lv = level();
  return `
  <header class="passport-head">
    ${avatar('happy', 'md')}
    <div><div class="tag">HOBBY CAFÉ PASSPORT</div><h1>${esc(S.name)}</h1>
    <p>${LEVELS[lv]} · ${S.xp} XP · 🔥 ${S.streak.count} day streak (best ${S.streak.best})</p>
    <p class="muted">Companion: ${cname()} · ${BELTS[S.belt].name} in the dojo · ${S.codes.length} codes cracked · ${S.riddles.length} riddles</p></div>
  </header>
  <h2 class="sec">Stamps</h2>
  <section class="stamps">${Object.entries(C).map(([k, c]) => {
    const all = H.filter(h => h.cat === k), done = all.filter(h => S.tried[h.id]);
    return `<div class="stamp-card" style="--c:${c.color}"><div class="stamp-circle ${done.length ? 'got' : ''}">${c.emoji}</div><b>${c.name}</b><small>${done.length}/${all.length}</small>
      <div class="mini">${all.map(h => `<a href="#menu/${h.id}" title="${esc(h.name)}" class="${S.tried[h.id] ? 'got' : ''}">${h.emoji}</a>`).join('')}</div></div>`;
  }).join('')}</section>
  ${S.wish.length ? `<h2 class="sec">💖 Wishlist</h2><div class="menu-grid">${S.wish.map(byId).filter(Boolean).map(h => `<a class="card" href="#menu/${h.id}" style="--c:${C[h.cat].color}"><span class="e">${h.emoji}</span><b>${esc(h.name)}</b></a>`).join('')}</div>` : ''}
  <h2 class="sec">📓 Adventure journal</h2>
  ${S.log.length ? `<ul class="journal">${S.log.slice().reverse().map(l => { const h = byId(l.id); return h ? `<li><b>${l.date}</b> ${h.emoji} ${esc(h.name)} ${['', '😐', '🙂', '😍'][l.rating] || ''} <span>${esc(l.note || '')}</span> <small>${l.mins} min</small></li>` : ''; }).join('')}</ul>` : `<p class="empty">No missions yet. Your first stamp is waiting — ask ${cname()} for an idea!</p>`}
  <h2 class="sec">⚙️ Settings</h2>
  <section class="settings">
    <label>Your code name <input id="setName" value="${esc(S.name)}"></label>
    <label>Companion's name <input id="setComp" value="${esc(S.companion)}"></label>
    <label>Companion picture <input id="setAvatar" type="file" accept="image/*"> <small>Use any picture you like — it stays on this device only.</small></label>
    ${S.avatar ? '<button class="btn ghost sm" data-act="clearavatar">Use the drawn companion again</button>' : ''}
    <div class="row"><button class="btn ghost sm" data-act="export">⬇ Back up my progress</button><label class="btn ghost sm">⬆ Restore backup<input id="importF" type="file" accept="application/json" hidden></label><button class="btn ghost sm danger" data-act="reset">Reset everything</button></div>
  </section>`;
};
AFTER.me = () => {
  $('#setName').onchange = e => { S.name = e.target.value.trim() || 'Agent'; save(); toast('Saved'); };
  $('#setComp').onchange = e => { S.companion = e.target.value.trim() || 'Anya'; save(); toast('Saved'); render(); };
  $('#setAvatar').onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const img = new Image(), rd = new FileReader();
    rd.onload = () => { img.onload = () => { const cv = document.createElement('canvas'), s = 320; cv.width = cv.height = s;
      const m = Math.min(img.width, img.height); cv.getContext('2d').drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, s, s);
      S.avatar = cv.toDataURL('image/jpeg', .85); save(); render(); say('Ooh! Do I look cool? I look cool.', 'cool'); }; img.src = rd.result; };
    rd.readAsDataURL(f);
  };
  $('#importF').onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { try { S = Object.assign({}, DEFAULT, JSON.parse(t)); save(); render(); toast('Progress restored!'); } catch { toast('That file didn\'t work'); } }); };
};

/* ═════════ Actions ═════════ */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act],[data-energy],[data-mood],[data-belt],[data-ptab],[data-rate],[data-nothing]');
  if (!t) return;
  if (t.dataset.energy) { S.energy = +t.dataset.energy; save(); document.querySelectorAll('[data-energy]').forEach(b => b.classList.toggle('on', b === t));
    $('#heroLine').textContent = pick(L[['', 'low', 'mid', 'high'][S.energy]]); return; }
  if (t.dataset.mood) { S.mood = t.dataset.mood; save(); document.querySelectorAll('[data-mood]').forEach(b => b.classList.toggle('on', b === t)); return; }
  if (t.dataset.belt != null && !t.disabled) { const b = +t.dataset.belt; round = { belt: b, i: 0, score: 0, res: [], given: [], start: Date.now(), qs: Array.from({ length: 10 }, () => BELTS[b].gen()) }; render(); return; }
  if (t.dataset.ptab) { ptab = t.dataset.ptab; render(); return; }
  if (t.dataset.rate) { document.querySelectorAll('[data-rate]').forEach(b => b.classList.toggle('on', b === t)); mission.rating = +t.dataset.rate; return; }
  if (t.dataset.nothing) { doNothing(+t.dataset.nothing); return; }
  const a = t.dataset.act;
  ACTIONS[a]?.(t, e);
});
const ACTIONS = {
  idea: () => { const last = ACTIONS.idea.last ? [ACTIONS.idea.last] : []; const h = recommend(last); ACTIONS.idea.last = h.id;
    $('#ideaSlot').innerHTML = ideaCard(h, pick(L.pick)); $('#ideaSlot').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); },
  rescue: () => {
    const m = pick(RESCUES);
    overlay(`${avatar('shock', 'md')}<h2>🚨 Scroll detected!</h2><p class="muted">${esc(pick(L.rescue))}</p><p class="rescue-task">${esc(m)}</p>
      <div class="big-clock" id="ovClock">5:00</div><div class="row center"><button class="btn big" data-act="rescuedone">Done! 💪</button><button class="btn ghost" data-act="closeov">Not now</button></div>`);
    const end = Date.now() + 300000; every(() => { const s = Math.max(0, Math.round((end - Date.now()) / 1000)); const c = $('#ovClock'); if (c) c.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }, 1000);
  },
  rescuedone: () => { closeOverlay(); gainXp(10, 'scroll rescued'); say('Phone: 0. You: 1. Heh.', 'smug'); },
  closeov: () => closeOverlay(),
  wish: (t) => { const id = t.dataset.id; S.wish = S.wish.includes(id) ? S.wish.filter(x => x !== id) : [...S.wish, id]; save(); render(); },
  abort: () => { mission = null; },
  screenoff: () => {
    const h = byId(mission.id);
    overlay(`<div class="screenoff"><p>${h.emoji} ${esc(h.name)}</p><div class="big-clock" id="soClock">00:00</div><p class="muted">Screen-off mode. Put the device face down — I'll keep time. Tap anywhere to return.</p></div>`, 'dark');
    $('#overlay').onclick = () => closeOverlay();
  },
  finish: () => { $('#finishSheet').hidden = false; },
  report: () => {
    const h = byId(mission.id), mins = Math.max(1, Math.round((Date.now() - mission.start) / 60000)), first = !S.tried[h.id];
    S.log.push({ id: h.id, date: today(), rating: mission.rating || 0, note: $('#note').value.trim(), mins });
    S.tried[h.id] = (S.tried[h.id] || 0) + 1; S.wish = S.wish.filter(x => x !== h.id);
    mission = null; confetti();
    gainXp(20 + Math.min(40, mins) + (first ? 30 : 0), first ? 'new hobby stamped!' : 'mission complete');
    say(pick(L.done), 'sparkle'); go('me');
  },
  wsnew: () => { newSearch(ws.theme); rerenderP(); },
  scrskip: () => { nextScramble(); rerenderP(); },
  rgot: () => { if (!S.riddles.includes(rid)) { S.riddles.push(rid); gainXp(5, 'riddle solved'); } ACTIONS.rnext(); },
  rnext: () => { const open = RIDDLES.map((_, i) => i).filter(i => !S.riddles.includes(i) && i !== rid); rid = open.length ? pick(open) : (rid + 1) % RIDDLES.length; rerenderP(); },
  mkgo: () => {
    const words = $('#mkWords').value.split(/[,\n]+/).map(w => w.trim()).filter(Boolean), size = +$('#mkSize').value;
    const p = makeWordSearch(words, size), title = $('#mkTitle').value;
    const skipped = words.map(w => w.toUpperCase().replace(/[^A-Z]/g, '')).filter(w => w && !p.placed.some(x => x.word === w));
    $('#printArea').innerHTML = `<div class="printable"><h2>${esc(title)}</h2><div class="ws print" style="--n:${size}">${p.grid.flat().map(c => `<span>${c}</span>`).join('')}</div>
      <ul class="ws-words">${p.placed.map(x => `<li>${x.word}</li>`).join('')}</ul><p class="tiny">Made at the Hobby Café ☕</p></div>
      ${skipped.length ? `<p class="muted">Couldn't fit: ${skipped.join(', ')} — try a bigger size.</p>` : ''}`;
    S.puzzles++; save();
  },
  mkprint: () => { if (!$('.printable')) ACTIONS.mkgo(); window.print(); },
  iccheck: () => {
    const d = dailyIntercept();
    if (norm($('#icGuess').value) === norm(d.msg)) { S.codes.push(today()); confetti(); gainXp(30, 'message decoded'); say(pick(L.spy), 'cool'); render(); }
    else { $('#icGuess').classList.add('shake'); setTimeout(() => $('#icGuess')?.classList.remove('shake'), 400); say('Hmm, not quite. Check the hint, agent!', 'smug'); }
  },
  chcheck: () => {
    const ch = readChallenge(param); if (!ch) return;
    if (norm($('#chGuess').value) === norm(ch.m)) { confetti(); gainXp(30, 'friend\'s code cracked'); say('Cracked it! Your friend is gonna be SO shocked.', 'sparkle'); }
    else say('Not yet! Try the Code Machine below.', 'smug');
  },
  chlink: () => {
    const msg = $('#cipIn').value.trim(); if (!msg) { toast('Write a message first'); return; }
    const t = CIPHERS[cip.type].enc(msg, cip.p);
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ c: cip.type, t, m: msg, f: $('#cipFrom').value.trim() }))));
    const url = location.href.split('#')[0] + '#challenge=' + payload;
    navigator.clipboard?.writeText(url).then(() => toast('Challenge link copied! Send it to a friend 📨'), () => prompt('Copy this link:', url));
    if (!navigator.clipboard) prompt('Copy this link:', url);
  },
  copyout: () => { navigator.clipboard?.writeText($('#cipOut').value).then(() => toast('Copied!')); },
  quitround: () => { round = null; render(); },
  dojohome: () => { round = null; render(); },
  breathe: () => breathe('box'),
  breathe478: () => breathe('478'),
  clearavatar: () => { S.avatar = null; save(); render(); },
  export: () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' })); a.download = `hobby-cafe-backup-${today()}.json`; a.click(); },
  reset: () => { if (confirm('Erase ALL progress, stamps and journal? This cannot be undone.')) { localStorage.removeItem(KEY); S = { ...DEFAULT }; render(); } },
};
function doNothing(m) {
  overlay(`<div class="screenoff"><p>🍃 Doing absolutely nothing</p><div class="big-clock" id="dnClock">${m}:00</div><p class="muted">Tap to stop early.</p></div>`, 'dark');
  const end = Date.now() + m * 60000;
  every(() => { const s = Math.max(0, Math.round((end - Date.now()) / 1000)); const c = $('#dnClock'); if (!c) return; c.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    if (s === 0) { closeOverlay(); gainXp(10, 'did nothing, beautifully'); say('You did nothing! Perfectly! Heh.', 'sleepy'); } }, 1000);
  $('#overlay').onclick = () => closeOverlay();
}
function overlay(html, cls = '') { const o = $('#overlay'); o.className = 'overlay ' + cls; o.innerHTML = `<div class="ov-card">${html}</div>`; o.hidden = false; o.onclick = null; }
function closeOverlay() { const o = $('#overlay'); o.hidden = true; o.innerHTML = ''; stopTimers(); if (route === 'mission') AFTER.mission(); if (route === 'dojo') AFTER.dojo(); }

/* ═════════ Boot ═════════ */
parseRoute();
if (!S.log.length && !S.xp) setTimeout(() => say(`Hi! I'm ${S.companion}, your café buddy. Tell me your energy and I'll find you a mission. Waku waku!`, 'sparkle'), 700);
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
