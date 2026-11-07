/* Hobby Café — engines: ciphers, math dojo, word search, companion art. */

/* ═════════ Ciphers ═════════ */
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MORSE = { A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',
  0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.','.':'.-.-.-',',':'--..--','?':'..--..','!':'-.-.--' };
const MORSE_REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

function shiftChar(ch, n) {
  const up = ch.toUpperCase(), i = ABC.indexOf(up);
  if (i < 0) return ch;
  const out = ABC[(i + n % 26 + 26) % 26];
  return ch === up ? out : out.toLowerCase();
}
function keyAlphabet(key) {
  const seen = new Set();
  (key.toUpperCase().replace(/[^A-Z]/g, '') + ABC).split('').forEach(c => seen.add(c));
  return [...seen].join('');
}

window.CIPHERS = {
  caesar: {
    name: 'Caesar Shift', icon: '🎡', param: { label: 'Shift', type: 'number', def: 3 },
    about: 'Every letter slides along the alphabet. Shift 3: A→D, B→E. Julius Caesar used it for real military messages!',
    enc: (t, p) => t.replace(/[a-z]/gi, c => shiftChar(c, +p || 0)),
    dec: (t, p) => t.replace(/[a-z]/gi, c => shiftChar(c, -(+p || 0))),
  },
  atbash: {
    name: 'Atbash Mirror', icon: '🪞', about: 'The alphabet is flipped like a mirror: A↔Z, B↔Y, C↔X. Over 2,500 years old!',
    enc: t => t.replace(/[a-z]/gi, c => { const u = c.toUpperCase(), o = ABC[25 - ABC.indexOf(u)]; return c === u ? o : o.toLowerCase(); }),
    dec: t => window.CIPHERS.atbash.enc(t),
  },
  a1z26: {
    name: 'Number Code (A1Z26)', icon: '🔢', about: 'Each letter becomes its number: A=1 … Z=26. Letters split by dashes, words by slashes.',
    enc: t => t.toUpperCase().split(/\s+/).filter(Boolean).map(w => w.split('').map(c => ABC.includes(c) ? ABC.indexOf(c) + 1 : c).join('-')).join(' / '),
    dec: t => t.split('/').map(w => w.trim().split(/[-\s]+/).filter(Boolean).map(n => /^\d+$/.test(n) ? (ABC[+n - 1] || '?') : n).join('')).join(' '),
  },
  morse: {
    name: 'Morse Code', icon: '📡', about: 'Dots and dashes for radio & flashlights. Letters split by spaces, words by " / ".',
    enc: t => t.toUpperCase().split(/\s+/).filter(Boolean).map(w => w.split('').map(c => MORSE[c] || '').filter(Boolean).join(' ')).join(' / '),
    dec: t => t.trim().split(/\s*\/\s*/).map(w => w.split(/\s+/).map(s => MORSE_REV[s] || (s ? '?' : '')).join('')).join(' '),
  },
  reverse: {
    name: 'Mirror Writing', icon: '🔄', about: 'Leonardo da Vinci wrote his notebooks backwards! Simple, but sneaky.',
    enc: t => t.split('').reverse().join(''), dec: t => t.split('').reverse().join(''),
  },
  keyword: {
    name: 'Keyword Cipher', icon: '🔑', param: { label: 'Secret keyword', type: 'text', def: 'PEANUT' },
    about: 'A keyword scrambles the alphabet. Only friends who know the keyword can read it. Much harder to crack!',
    enc: (t, k) => { const a = keyAlphabet(k || ''); return t.replace(/[a-z]/gi, c => { const u = c.toUpperCase(), o = a[ABC.indexOf(u)]; return c === u ? o : o.toLowerCase(); }); },
    dec: (t, k) => { const a = keyAlphabet(k || ''); return t.replace(/[a-z]/gi, c => { const u = c.toUpperCase(), o = ABC[a.indexOf(u)]; return c === u ? o : o.toLowerCase(); }); },
  },
};

/* ═════════ Seeded random ═════════ */
window.seeded = function (seed) {
  let s = typeof seed === 'string' ? [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7) : seed;
  return () => { s = (s * 1664525 + 1013904223) | 0; return ((s >>> 0) % 100000) / 100000; };
};
const R = Math.random;
const ri = (a, b, r = R) => a + Math.floor(r() * (b - a + 1));
const pick = (arr, r = R) => arr[Math.floor(r() * arr.length)];
window.ri = ri; window.pick = pick;

/* ═════════ Math Dojo ═════════
   Each belt = a generator returning { q, a } where a is a number or "p/q" fraction string. */
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const frac = (n, d) => { const g = gcd(n, d); n /= g; d /= g; if (d < 0) { n = -n; d = -d; } return d === 1 ? String(n) : n + '/' + d; };

window.BELTS = [
  { name: 'White Belt', color: '#F5F1E8', ink: '#333', topic: 'Addition & subtraction',
    gen: () => { const t = ri(0, 2);
      if (t === 0) { const a = ri(12, 99), b = ri(12, 99); return { q: `${a} + ${b}`, a: a + b }; }
      if (t === 1) { const a = ri(30, 150), b = ri(10, a); return { q: `${a} − ${b}`, a: a - b }; }
      const a = ri(100, 900), b = ri(100, 900); return { q: `${a} + ${b}`, a: a + b }; } },
  { name: 'Yellow Belt', color: '#F2D14B', ink: '#333', topic: 'Times tables & division',
    gen: () => { const a = ri(2, 12), b = ri(2, 12);
      return R() < .55 ? { q: `${a} × ${b}`, a: a * b } : { q: `${a * b} ÷ ${a}`, a: b }; } },
  { name: 'Orange Belt', color: '#EE8C3A', ink: '#fff', topic: 'Fractions',
    gen: () => { const t = ri(0, 3), d1 = ri(2, 9), d2 = ri(2, 9), n1 = ri(1, d1 - 1 || 1), n2 = ri(1, d2 - 1 || 1);
      if (t === 0) return { q: `${n1}/${d1} + ${n2}/${d2}`, a: frac(n1 * d2 + n2 * d1, d1 * d2), hint: 'Answer as a fraction like 5/6' };
      if (t === 1) return { q: `${n1}/${d1} × ${n2}/${d2}`, a: frac(n1 * n2, d1 * d2), hint: 'Simplify!' };
      if (t === 2) { const k = ri(2, 6), n = ri(1, 7), d = ri(n + 1, 9); return { q: `Simplify ${n * k}/${d * k}`, a: frac(n, d) }; }
      const whole = ri(2, 9) * d1; return { q: `${n1}/${d1} of ${whole}`, a: n1 * whole / d1 }; } },
  { name: 'Green Belt', color: '#4BA56A', ink: '#fff', topic: 'Decimals & percentages',
    gen: () => { const t = ri(0, 3);
      if (t === 0) { const p = pick([10, 20, 25, 50, 75, 5, 15]), n = ri(2, 40) * 20; return { q: `${p}% of ${n}`, a: p * n / 100 }; }
      if (t === 1) { const a = ri(11, 99) / 10, b = ri(11, 99) / 10; return { q: `${a} + ${b}`, a: +(a + b).toFixed(2) }; }
      if (t === 2) { const a = ri(2, 9) / 10, b = ri(2, 9); return { q: `${a} × ${b}`, a: +(a * b).toFixed(2) }; }
      const price = ri(4, 20) * 10, off = pick([10, 20, 25, 50]); return { q: `A $${price} book is ${off}% off. New price?`, a: price * (100 - off) / 100 }; } },
  { name: 'Blue Belt', color: '#3C78C8', ink: '#fff', topic: 'Negatives & order of operations',
    gen: () => { const t = ri(0, 2);
      if (t === 0) { const a = ri(-15, 15), b = ri(-15, 15); return { q: `${a} + (${b})`.replace(/-/g, '−'), a: a + b }; }
      if (t === 1) { const a = ri(-9, 9) || 3, b = ri(-9, 9) || -2; return { q: `${a} × (${b})`.replace(/-/g, '−'), a: a * b }; }
      const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9), d = ri(1, 9); return { q: `${a} + ${b} × ${c} − ${d}`, a: a + b * c - d }; } },
  { name: 'Purple Belt', color: '#7B4FB0', ink: '#fff', topic: 'Solve for x',
    gen: () => { const x = ri(-10, 12), a = ri(2, 9), b = ri(-20, 20), t = ri(0, 2);
      if (t === 0) return { q: `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${a * x + b}`, a: x, hint: 'x = ?' };
      if (t === 1) { const c = ri(1, a - 1 || 1); const r = (a - c) * x + b, sg = n => n < 0 ? `− ${-n}` : `+ ${n}`; return { q: `${a}x ${sg(b)} = ${c === 1 ? '' : c}x ${sg(r)}`, a: x, hint: 'x = ?' }; }
      const d = ri(2, 6); return { q: `x/${d} + ${a} = ${a + x}`, a: x * d, hint: 'x = ?' }; } },
  { name: 'Brown Belt', color: '#8A5A3C', ink: '#fff', topic: 'Powers, roots & geometry',
    gen: () => { const t = ri(0, 4);
      if (t === 0) { const a = ri(2, 15); return { q: `${a}²`, a: a * a }; }
      if (t === 1) { const a = ri(2, 20); return { q: `√${a * a}`, a }; }
      if (t === 2) { const a = ri(2, 5), b = ri(2, 4); return { q: `${a}^${b}`, a: a ** b }; }
      if (t === 3) { const w = ri(3, 20), h = ri(3, 20); return { q: `Triangle: base ${w}, height ${h}. Area?`, a: w * h / 2 }; }
      const [p, q, r] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]); return { q: `Right triangle legs ${p} and ${q}. Hypotenuse?`, a: r }; } },
  { name: 'Red Belt', color: '#C8423C', ink: '#fff', topic: 'Quadratics & systems',
    gen: () => { const t = ri(0, 2);
      if (t === 0) { const r1 = ri(1, 9), r2 = ri(-9, -1); const b = -(r1 + r2), c = r1 * r2;
        return { q: `x² ${b < 0 ? '−' : '+'} ${Math.abs(b)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)} = 0. Positive root?`, a: r1 }; }
      if (t === 1) { const x = ri(-6, 9), y = ri(-6, 9); return { q: `x + y = ${x + y}, x − y = ${x - y}. x = ?`, a: x }; }
      const a = ri(2, 5), x = ri(1, 6); return { q: `f(x) = ${a}x² − 1. f(${x}) = ?`, a: a * x * x - 1 }; } },
  { name: 'Black Belt', color: '#1E1B1C', ink: '#fff', topic: 'Word problems & probability',
    gen: () => { const t = ri(0, 4);
      if (t === 0) { const s = ri(3, 8), m = ri(2, 6); return { q: `A café sells ${s} scones per hour. How many in ${m} hours and 30 minutes?`, a: s * m + s / 2 }; }
      if (t === 1) { const r = ri(2, 6), b = ri(2, 6); return { q: `A jar has ${r} red and ${b} blue marbles. P(red)? (fraction)`, a: frac(r, r + b) }; }
      if (t === 2) { const sp = ri(4, 12) * 5, h = ri(2, 5); return { q: `A train goes ${sp} km/h for ${h} hours. Distance in km?`, a: sp * h }; }
      if (t === 3) { const n = ri(4, 7); return { q: `How many ways to arrange ${n} different books on a shelf? (${n}!)`, a: [1, 1, 2, 6, 24, 120, 720, 5040][n] }; }
      const age = ri(5, 12), d = ri(20, 30); return { q: `Mom is ${d} years older than her kid. Together they are ${2 * age + d}. Kid's age?`, a: age }; } },
];

window.checkAnswer = function (input, ans) {
  const parse = s => { s = String(s).trim().replace(/\s/g, '').replace('−', '-').replace(/^x=/i, '').replace(/^\$/, '');
    if (/^-?\d+\/-?\d+$/.test(s)) { const [n, d] = s.split('/').map(Number); return n / d; }
    return s === '' ? NaN : Number(s); };
  const a = parse(input), b = parse(ans);
  return !isNaN(a) && Math.abs(a - b) < 0.01;
};

/* ═════════ Word Search ═════════ */
window.makeWordSearch = function (words, size = 12, seed = Date.now()) {
  const r = seeded(seed);
  const dirs = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [1, -1]];
  const grid = Array.from({ length: size }, () => Array(size).fill(''));
  const placed = [];
  words = [...new Set(words.map(w => w.toUpperCase().replace(/[^A-Z]/g, '')).filter(w => w.length > 1 && w.length <= size))]
    .sort((a, b) => b.length - a.length);
  for (const w of words) {
    let ok = false;
    for (let tries = 0; tries < 300 && !ok; tries++) {
      const [dr, dc] = dirs[Math.floor(r() * dirs.length)];
      const r0 = Math.floor(r() * size), c0 = Math.floor(r() * size);
      const r1 = r0 + dr * (w.length - 1), c1 = c0 + dc * (w.length - 1);
      if (r1 < 0 || r1 >= size || c1 < 0 || c1 >= size) continue;
      let fits = true;
      for (let i = 0; i < w.length; i++) { const g = grid[r0 + dr * i][c0 + dc * i]; if (g && g !== w[i]) { fits = false; break; } }
      if (!fits) continue;
      for (let i = 0; i < w.length; i++) grid[r0 + dr * i][c0 + dc * i] = w[i];
      placed.push({ word: w, r0, c0, r1, c1 }); ok = true;
    }
  }
  for (let i = 0; i < size; i++) for (let j = 0; j < size; j++) if (!grid[i][j]) grid[i][j] = ABC[Math.floor(r() * 26)];
  return { grid, placed, size };
};

window.scramble = function (w) {
  let s; do { s = w.split('').sort(() => R() - .5).join(''); } while (s === w && w.length > 1);
  return s;
};

/* ═════════ Companion art ═════════
   An original chibi café-agent drawn in SVG. Moods: happy, smug, sparkle, cool, sleepy, shock. */
window.companionSVG = function (mood = 'happy') {
  const hair = '#F4A3B0', hairDk = '#D97A8C', skin = '#FDEDE0', line = '#5A3A3F';
  const eyeG = '#2E7A5A', eyeL = '#7DD3A6';
  const eye = (x) => {
    switch (mood) {
      case 'smug': return `<path d="M${x - 11},116 Q${x},110 ${x + 11},116" stroke="${line}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M${x - 9},117 Q${x},126 ${x + 9},117 Z" fill="${eyeG}"/>`;
      case 'sparkle': return `<ellipse cx="${x}" cy="118" rx="10" ry="12" fill="${eyeG}"/>
        <path d="M${x},109 L${x + 2.5},115.5 L${x + 9},118 L${x + 2.5},120.5 L${x},127 L${x - 2.5},120.5 L${x - 9},118 L${x - 2.5},115.5 Z" fill="#FFF6B0"/>`;
      case 'sleepy': return `<path d="M${x - 9},119 Q${x},126 ${x + 9},119" stroke="${line}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      case 'shock': return `<circle cx="${x}" cy="118" r="9" fill="#fff" stroke="${line}" stroke-width="2"/><circle cx="${x}" cy="118" r="3" fill="${line}"/>`;
      case 'cool': return '';
      default: return `<ellipse cx="${x}" cy="118" rx="10" ry="12.5" fill="${eyeG}"/>
        <ellipse cx="${x}" cy="121" rx="6" ry="7" fill="${eyeL}"/>
        <circle cx="${x - 3.5}" cy="112.5" r="3.6" fill="#fff"/><circle cx="${x + 3.5}" cy="124" r="1.6" fill="#fff"/>`;
    }
  };
  const mouth = {
    happy: `<path d="M91,139 Q100,149 109,139 Q100,143 91,139 Z" fill="#D9566E"/>`,
    smug: `<path d="M84,137 Q100,147 116,136" stroke="${line}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    sparkle: `<ellipse cx="100" cy="142" rx="7" ry="8" fill="#D9566E"/><ellipse cx="100" cy="146" rx="4" ry="3" fill="#F3A0AE"/>`,
    cool: `<path d="M93,142 L107,142" stroke="${line}" stroke-width="2.4" stroke-linecap="round"/>`,
    sleepy: `<ellipse cx="100" cy="142" rx="3" ry="3.5" fill="#D9566E"/>`,
    shock: `<ellipse cx="100" cy="143" rx="6" ry="8" fill="#D9566E"/>`,
  }[mood] || '';
  const shades = mood === 'cool' ? `<g><rect x="61" y="106" width="34" height="22" rx="5" fill="#1C1A20"/><rect x="105" y="106" width="34" height="22" rx="5" fill="#1C1A20"/>
    <path d="M95,112 L105,112" stroke="#1C1A20" stroke-width="4"/><path d="M66,111 L76,111" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
    <path d="M110,111 L120,111" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/></g>` : '';
  const extra = mood === 'sleepy' ? `<text x="150" y="70" font-size="20" fill="${hairDk}" font-family="sans-serif" font-weight="700">z</text><text x="164" y="54" font-size="14" fill="${hairDk}" font-family="sans-serif" font-weight="700">z</text>`
    : mood === 'sparkle' ? `<path d="M168,60 l3,8 8,3 -8,3 -3,8 -3,-8 -8,-3 8,-3z" fill="#F2C94C"/><path d="M28,84 l2,5 5,2 -5,2 -2,5 -2,-5 -5,-2 5,-2z" fill="#F2C94C"/>`
    : mood === 'shock' ? `<path d="M160,48 L166,74 M172,52 L170,74" stroke="${hairDk}" stroke-width="3" stroke-linecap="round"/>` : '';
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Your café companion, feeling ${mood}">
  <path d="M38,112 Q30,38 100,32 Q170,38 162,112 L166,172 Q152,182 142,166 L58,166 Q48,182 34,172 Z" fill="${hair}" stroke="${hairDk}" stroke-width="2"/>
  <path d="M70,160 L130,160 L136,200 L64,200 Z" fill="#2A2530"/><path d="M88,160 L100,176 L112,160 Z" fill="#fff"/><path d="M96,168 L104,168 L100,184 Z" fill="#C8423C"/>
  <ellipse cx="100" cy="114" rx="53" ry="51" fill="${skin}" stroke="${line}" stroke-width="1.5"/>
  <ellipse cx="70" cy="134" rx="9" ry="5" fill="#F7AFBD" opacity=".7"/><ellipse cx="130" cy="134" rx="9" ry="5" fill="#F7AFBD" opacity=".7"/>
  ${eye(78)}${eye(122)}${shades}${mouth}
  <path d="M44,112 Q44,46 100,42 Q156,46 156,112 L148,88 L140,104 L131,80 L120,100 L108,76 L97,98 L86,78 L75,101 L64,84 L54,106 Z" fill="${hair}" stroke="${hairDk}" stroke-width="2" stroke-linejoin="round"/>
  <path d="M44,104 Q36,140 46,172 L58,154 Q53,128 56,104 Z" fill="${hair}" stroke="${hairDk}" stroke-width="2"/>
  <path d="M156,104 Q164,140 154,172 L142,154 Q147,128 144,104 Z" fill="${hair}" stroke="${hairDk}" stroke-width="2"/>
  <path d="M62,58 Q58,58 56,54 L40,22 Q38,18 43,20 L80,40 Q83,43 79,46 Z" fill="#2A2530"/><path d="M50,52 Q60,44 74,44" stroke="#D9B44A" stroke-width="3" fill="none" stroke-dasharray="3 3"/>
  <path d="M138,58 Q142,58 144,54 L160,22 Q162,18 157,20 L120,40 Q117,43 121,46 Z" fill="#2A2530"/><path d="M150,52 Q140,44 126,44" stroke="#D9B44A" stroke-width="3" fill="none" stroke-dasharray="3 3"/>
  <path d="M100,43 Q90,22 106,14 Q96,26 106,42" fill="none" stroke="${hairDk}" stroke-width="2.4" stroke-linecap="round"/>
  <ellipse cx="80" cy="60" rx="10" ry="5" fill="#fff" opacity=".35" transform="rotate(-20 80 60)"/><ellipse cx="124" cy="58" rx="7" ry="4" fill="#fff" opacity=".35" transform="rotate(20 124 58)"/>
  ${extra}</svg>`;
};
