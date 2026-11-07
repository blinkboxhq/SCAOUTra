/* Hobby Café — original scrapbook sticker sheet (all hand-made SVG, no borrowed characters).
   Each sticker has a white die-cut outline like a real paper sticker. */
(() => {
const OUT = 'stroke="#fff" stroke-width="7" stroke-linejoin="round" paint-order="stroke"';
const S = {
  star: (c = '#E9C46A') => `<svg viewBox="0 0 100 100"><path ${OUT} d="M50 6 L62 37 L95 38 L69 58 L79 91 L50 72 L21 91 L31 58 L5 38 L38 37Z" fill="${c}"/><path d="M50 22 L57 40" stroke="#fff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/></svg>`,
  clover: () => `<svg viewBox="0 0 100 100"><g ${OUT} fill="#8DB580"><circle cx="35" cy="35" r="19"/><circle cx="65" cy="35" r="19"/><circle cx="35" cy="63" r="19"/><circle cx="65" cy="63" r="19"/></g>
    <g fill="#8DB580"><circle cx="35" cy="35" r="19"/><circle cx="65" cy="35" r="19"/><circle cx="35" cy="63" r="19"/><circle cx="65" cy="63" r="19"/></g>
    <path d="M50 49 Q58 76 72 94" stroke="#6E9A62" stroke-width="5" fill="none" stroke-linecap="round"/><g stroke="#6E9A62" stroke-width="2" fill="none"><path d="M50 49 L35 35 M50 49 L65 35 M50 49 L35 63 M50 49 L65 63"/></g></svg>`,
  sprout: () => `<svg viewBox="0 0 100 100"><g ${OUT}><path d="M50 92 Q48 70 50 52" stroke="#7FAF5A" stroke-width="7" fill="none"/>
    <path d="M50 54 Q20 60 10 34 Q40 24 50 54Z" fill="#B7D86B"/><path d="M50 50 Q78 54 92 26 Q58 16 50 50Z" fill="#A4CC5A"/></g>
    <path d="M50 54 Q30 46 20 36 M50 50 Q70 40 82 30" stroke="#7FAF5A" stroke-width="2.5" fill="none"/></svg>`,
  spiral: () => `<svg viewBox="0 0 100 100"><path ${OUT} d="M50 50 m0 -6 a6 6 0 1 1 -6 6 a12 12 0 1 1 12 12 a20 20 0 1 1 -20 -20 a28 28 0 1 1 28 28 a36 36 0 0 1 -36 -36" stroke="#9B2C35" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`,
  strawberry: () => `<svg viewBox="0 0 100 100"><path ${OUT} d="M50 92 Q14 70 18 42 Q24 26 50 30 Q76 26 82 42 Q86 70 50 92Z" fill="#D9454E"/>
    <g fill="#FFE1A8">${[[34, 48], [50, 44], [66, 48], [40, 62], [58, 62], [50, 76], [30, 60], [70, 60]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="3"/>`).join('')}</g>
    <path d="M30 32 L40 20 L50 30 L60 18 L70 32 Q50 40 30 32Z" fill="#5E9B4A"/><path d="M50 26 L52 8" stroke="#5E9B4A" stroke-width="5" stroke-linecap="round"/></svg>`,
  ladybug: () => `<svg viewBox="0 0 100 100"><circle ${OUT} cx="50" cy="56" r="34" fill="#D9454E"/><path d="M28 30 Q50 6 72 30Z" fill="#2B2230"/><path d="M50 22 V90" stroke="#2B2230" stroke-width="3"/>
    <g fill="#2B2230"><circle cx="34" cy="50" r="7"/><circle cx="66" cy="50" r="7"/><circle cx="36" cy="72" r="6"/><circle cx="64" cy="72" r="6"/></g><circle cx="42" cy="20" r="2.5" fill="#fff"/><circle cx="58" cy="20" r="2.5" fill="#fff"/></svg>`,
  button: (c = '#6E9A62') => `<svg viewBox="0 0 100 100"><circle ${OUT} cx="50" cy="50" r="40" fill="${c}"/><circle cx="50" cy="50" r="30" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="3"/>
    <g fill="#fff" opacity=".85"><circle cx="40" cy="40" r="5"/><circle cx="60" cy="40" r="5"/><circle cx="40" cy="60" r="5"/><circle cx="60" cy="60" r="5"/></g><path d="M40 40 L60 60 M60 40 L40 60" stroke="#F3E3C7" stroke-width="3"/></svg>`,
  mushroom: () => `<svg viewBox="0 0 100 100"><g ${OUT}><path d="M38 56 Q36 84 42 90 H58 Q64 84 62 56Z" fill="#FFF3DE"/><path d="M10 58 Q12 16 50 14 Q88 16 90 58 Q50 66 10 58Z" fill="#D9454E"/></g>
    <g fill="#fff"><circle cx="32" cy="36" r="7"/><circle cx="58" cy="28" r="6"/><circle cx="72" cy="46" r="5"/><circle cx="46" cy="48" r="4"/></g>
    <g fill="#3B2418"><circle cx="45" cy="72" r="2.4"/><circle cx="55" cy="72" r="2.4"/></g><path d="M47 78 Q50 81 53 78" stroke="#3B2418" stroke-width="2" fill="none"/></svg>`,
  frog: () => `<svg viewBox="0 0 100 100"><g ${OUT} fill="#A9CF8E"><ellipse cx="50" cy="62" rx="40" ry="28"/><circle cx="30" cy="34" r="15"/><circle cx="70" cy="34" r="15"/></g>
    <g fill="#A9CF8E"><ellipse cx="50" cy="62" rx="40" ry="28"/><circle cx="30" cy="34" r="15"/><circle cx="70" cy="34" r="15"/></g>
    <g fill="#2B2230"><circle cx="30" cy="34" r="6"/><circle cx="70" cy="34" r="6"/></g><g fill="#fff"><circle cx="28" cy="32" r="2"/><circle cx="68" cy="32" r="2"/></g>
    <path d="M38 62 Q50 72 62 62" stroke="#2B2230" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#F6A9B6" opacity=".8"><ellipse cx="24" cy="58" rx="6" ry="4"/><ellipse cx="76" cy="58" rx="6" ry="4"/></g></svg>`,
  peanut: () => `<svg viewBox="0 0 100 100"><path ${OUT} d="M50 8 Q74 8 72 32 Q70 44 64 50 Q72 58 72 70 Q72 92 50 92 Q28 92 28 70 Q28 58 36 50 Q30 44 28 32 Q26 8 50 8Z" fill="#E2B475"/>
    <g stroke="#C08F4F" stroke-width="2" fill="none" opacity=".7"><path d="M36 22 Q50 18 64 22 M34 76 Q50 82 66 76 M38 64 Q50 68 62 64"/></g>
    <g fill="#3B2418"><circle cx="42" cy="34" r="3"/><circle cx="58" cy="34" r="3"/></g><path d="M44 42 Q50 47 56 42" stroke="#3B2418" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <g fill="#F6A9B6" opacity=".8"><ellipse cx="36" cy="40" rx="4" ry="2.5"/><ellipse cx="64" cy="40" rx="4" ry="2.5"/></g></svg>`,
  catloaf: () => `<svg viewBox="0 0 100 100"><g ${OUT}><path d="M12 84 Q8 50 26 38 L24 18 L40 32 Q50 29 60 32 L76 18 L74 38 Q92 50 88 84Z" fill="#E8A35C"/></g>
    <path d="M30 38 L28 26 L36 34 M70 38 L72 26 L64 34" fill="#F6C9A0"/><g stroke="#C77B36" stroke-width="4" stroke-linecap="round"><path d="M44 36 V44 M50 34 V44 M56 36 V44 M16 66 H28 M84 66 H72"/></g>
    <path d="M34 54 Q39 58 44 54 M56 54 Q61 58 66 54" stroke="#3B2418" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M47 62 L53 62 L50 65Z" fill="#D9566E"/>
    <path d="M50 65 Q46 70 42 68 M50 65 Q54 70 58 68" stroke="#3B2418" stroke-width="2" fill="none" stroke-linecap="round"/><g fill="#F6A9B6" opacity=".7"><ellipse cx="32" cy="64" rx="5" ry="3"/><ellipse cx="68" cy="64" rx="5" ry="3"/></g></svg>`,
  moon: () => `<svg viewBox="0 0 100 100"><path ${OUT} d="M64 8 A44 44 0 1 0 92 70 A36 36 0 1 1 64 8Z" fill="#F2D06B"/><circle cx="40" cy="58" r="3" fill="#3B2418"/><path d="M48 70 Q54 74 58 68" stroke="#3B2418" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>`,
  flower: (c = '#E7A0B6') => `<svg viewBox="0 0 100 100"><g ${OUT} fill="${c}">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="50" cy="26" rx="15" ry="22" transform="rotate(${a} 50 50)"/>`).join('')}</g>
    <g fill="${c}">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="50" cy="26" rx="15" ry="22" transform="rotate(${a} 50 50)"/>`).join('')}</g><circle cx="50" cy="50" r="11" fill="#F2C94C"/></svg>`,
  ticket: (t = 'ADMIT ONE') => `<svg viewBox="0 0 200 90"><path ${OUT} d="M8 10 H192 V32 A12 12 0 0 0 192 58 V80 H8 V58 A12 12 0 0 0 8 32Z" fill="#F4C7B8"/>
    <path d="M150 14 V76" stroke="#9B2C35" stroke-width="2" stroke-dasharray="4 4"/><text x="78" y="54" text-anchor="middle" font-family="Special Elite, monospace" font-size="17" fill="#9B2C35">${t}</text>
    <text x="171" y="52" text-anchor="middle" font-family="Special Elite, monospace" font-size="13" fill="#9B2C35" transform="rotate(-90 171 47)">No.07</text></svg>`,
  tag: (t = 'hobby café') => `<svg viewBox="0 0 200 90"><path ${OUT} d="M40 10 H188 V80 H40 L8 45Z" fill="#F7EEDC"/><circle cx="34" cy="45" r="7" fill="#fff" stroke="#B79A6E" stroke-width="2"/>
    <path d="M27 45 Q10 70 -4 60" stroke="#8A6E5A" stroke-width="2" fill="none"/><text x="114" y="54" text-anchor="middle" font-family="Caveat, cursive" font-size="28" font-weight="700" fill="#5A3A22">${t}</text></svg>`,
};
window.STICKERS = S;
/* sticker(name, {x, y, size, rot, arg}) → absolutely positioned decorative sticker */
window.sticker = (name, o = {}) => `<i class="stk ${o.cls || ''}" aria-hidden="true" style="${o.x != null ? `left:${o.x};` : ''}${o.r != null ? `right:${o.r};` : ''}${o.y != null ? `top:${o.y};` : ''}${o.b != null ? `bottom:${o.b};` : ''}width:${o.size || 54}px;--rot:${o.rot || 0}deg">${S[name](o.arg)}</i>`;

/* Fairy lights: a sagging wire with glowing bulbs. */
window.fairyLights = (n = 14, sag = 26) => {
  const cols = ['#FFD36E', '#FF8FA3', '#8FE3B0', '#8EC8FF', '#C9A2FF', '#FFB36B'];
  const pts = Array.from({ length: n }, (_, i) => { const x = (i + .5) / n * 1000, t = ((i + .5) / n * 2) % 1; return [x, 10 + Math.sin(t * Math.PI) * sag]; });
  return `<svg class="lights" viewBox="0 0 1000 ${sag + 40}" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 6 Q250 ${sag * 2 + 6} 500 6 Q750 ${sag * 2 + 6} 1000 6" stroke="#3A2A1E" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/>
    ${pts.map(([x, y], i) => `<g class="bulb" style="animation-delay:${(i * .37 % 2.4).toFixed(2)}s"><circle cx="${x}" cy="${y + 10}" r="16" fill="${cols[i % cols.length]}" opacity=".35" class="halo"/><ellipse cx="${x}" cy="${y + 10}" rx="5" ry="7" fill="${cols[i % cols.length]}"/><rect x="${x - 3}" y="${y}" width="6" height="5" fill="#3A2A1E"/></g>`).join('')}
  </svg>`;
};

/* Paper-chain garland (like the one on a cozy bookshelf). */
window.paperChain = (n = 22) => {
  const cols = ['#E58A57', '#8DB580', '#B48CD1', '#F2C94C', '#E07A93', '#6FA8C9'];
  return `<div class="chain" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<i style="--c:${cols[i % cols.length]};--y:${Math.sin(i / (n - 1) * Math.PI) * 26}px"></i>`).join('')}</div>`;
};

/* Trailing pothos vine. */
window.vine = (len = 6, flip = false) => `<svg class="vine ${flip ? 'flip' : ''}" viewBox="0 0 80 ${len * 40 + 20}" aria-hidden="true">
  <path d="M40 0 ${Array.from({ length: len }, (_, i) => `Q${i % 2 ? 58 : 22} ${i * 40 + 20} 40 ${i * 40 + 40}`).join(' ')}" stroke="#4E7F44" stroke-width="3" fill="none"/>
  ${Array.from({ length: len }, (_, i) => { const y = i * 40 + 24, x = i % 2 ? 54 : 26, d = i % 2 ? 1 : -1;
    return `<path d="M${x} ${y} q${14 * d} -4 ${18 * d} 8 q-6 10 -18 ${-2 * d < 0 ? -8 : -8}Z" fill="${i % 3 ? '#6FAE5C' : '#8CC56F'}" transform="rotate(${d * 20} ${x} ${y})"/>`; }).join('')}
</svg>`;
})();
