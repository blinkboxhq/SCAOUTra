/**
 * MagicBento — interactive bento grid (ported from React Bits to vanilla ES modules).
 *
 * Renders an asymmetric card grid with a cursor spotlight, per-card border glow,
 * particle stars, tilt, magnetism and a click ripple.
 *
 * Differences from the React Bits original, driven by this site's content:
 *  - textAutoHide defaults to false. The stock component clamps descriptions to
 *    two lines, which would truncate the system copy.
 *  - Cards accept an icon and a watermark number so they match the rest of the
 *    site rather than the demo's plain title/description.
 *  - All animation is disabled under prefers-reduced-motion, not just on mobile.
 *  - gsap is loaded lazily. It is ~30kB gzipped and this section sits far below
 *    the fold, so it is fetched only once the grid nears the viewport.
 */
let gsap = null;

const DEFAULT_PARTICLE_COUNT = 10;
const DEFAULT_SPOTLIGHT_RADIUS = 320;
const DEFAULT_GLOW_COLOR = '74, 222, 128'; // --accent
const MOBILE_BREAKPOINT = 768;

const DEFAULTS = {
  textAutoHide: false,
  enableStars: true,
  enableSpotlight: true,
  enableBorderGlow: true,
  enableTilt: true,
  enableMagnetism: true,
  clickEffect: true,
  enableFlip: false,
  disableAnimations: false,
  spotlightRadius: DEFAULT_SPOTLIGHT_RADIUS,
  particleCount: DEFAULT_PARTICLE_COUNT,
  glowColor: DEFAULT_GLOW_COLOR,
  tiltMax: 6, // degrees; the original uses 10, softened here for readability
};

/* Flip and tilt both drive rotateY, and the click ripple duplicates the
   feedback the flip already gives — so turning flip on turns both off. */
function resolveOptions(options) {
  const o = { ...DEFAULTS, ...options };
  if (o.enableFlip) {
    o.enableTilt = false;
    o.clickEffect = false;
  }
  return o;
}

/* ---------------------------------------------------------------- markup -- */

/**
 * @param {Array<{number,title,body,label,color,icon}>} cards
 * @param {{id?:string, textAutoHide?:boolean, enableBorderGlow?:boolean, glowColor?:string}} options
 */
export default function MagicBento(cards, options = {}) {
  const {
    id = 'magic-bento',
    textAutoHide = DEFAULTS.textAutoHide,
    enableBorderGlow = DEFAULTS.enableBorderGlow,
    enableFlip = DEFAULTS.enableFlip,
    glowColor = DEFAULTS.glowColor,
    detailHref = '/systems',
  } = options;

  const cardMarkup = cards
    .map((card, i) => {
      const cls = [
        'magic-bento-card',
        'particle-container',
        textAutoHide ? 'magic-bento-card--text-autohide' : '',
        enableBorderGlow ? 'magic-bento-card--border-glow' : '',
        enableFlip ? 'magic-bento-card--flip' : '',
      ]
        .filter(Boolean)
        .join(' ');

      const face = `
        <span class="magic-bento-card__watermark" style="color:${card.color};" aria-hidden="true">${card.number}</span>

        <div class="magic-bento-card__header">
          <div
            class="magic-bento-card__icon"
            style="background:${card.bg}; color:${card.color};"
            aria-hidden="true"
          >${card.icon}</div>
          <div class="magic-bento-card__label">${card.tier || card.label || ''}</div>
        </div>`;

      const shared = `
        class="${cls}"
        role="listitem"
        style="--glow-color: ${card.color ? hexToRgbString(card.color) : glowColor};"
        aria-labelledby="bento-title-${card.number}"
        data-reveal
        data-reveal-delay="${(i % 3) + 1}"`;

      if (!enableFlip) {
        return `
      <article ${shared}>
        ${face}
        <div class="magic-bento-card__content">
          <h3 id="bento-title-${card.number}" class="magic-bento-card__title">${card.title}</h3>
          <p class="magic-bento-card__description">${card.body}</p>
        </div>
      </article>`;
      }

      return `
      <article ${shared} data-flip tabindex="0" aria-expanded="false">
        <div class="magic-bento-card__inner">

          <div class="magic-bento-card__face magic-bento-card__face--front">
            ${face}
            <div class="magic-bento-card__content">
              <h3 id="bento-title-${card.number}" class="magic-bento-card__title">${card.title}</h3>
              <p class="magic-bento-card__description">${card.short}</p>
              <span class="magic-bento-card__hint" aria-hidden="true">Tap to read more</span>
            </div>
          </div>

          <div class="magic-bento-card__face magic-bento-card__face--back" aria-hidden="true">
            <div class="magic-bento-card__content">
              <h3 class="magic-bento-card__title">${card.title}</h3>
              <p class="magic-bento-card__description">${card.body}</p>
            </div>
            <a
              class="magic-bento-card__link"
              href="${detailHref}#${card.slug}"
              tabindex="-1"
            >Full breakdown &rarr;</a>
          </div>

        </div>
      </article>`;
    })
    .join('');

  // The asymmetric 2x2 layout only earns its keep with long copy on the face;
  // with one-line fronts the big cells read as empty, so flip mode goes uniform.
  const gridCls = `card-grid bento-section${enableFlip ? ' card-grid--uniform' : ''}`;
  return `<div id="${id}" class="${gridCls}" role="list">${cardMarkup}</div>`;
}

function hexToRgbString(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return DEFAULT_GLOW_COLOR;
  return `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
}

/* ------------------------------------------------------------ behaviour -- */

function createParticleElement(x, y, color) {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 3;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
}

function cardGlowColor(card, fallback) {
  return (card.style.getPropertyValue('--glow-color') || fallback).trim();
}

function attachCardBehaviour(card, o) {
  const glowColor = cardGlowColor(card, o.glowColor);

  let particles = [];
  let timeouts = [];
  let memoized = [];
  let initialized = false;
  let isHovered = false;
  let magnetismTween = null;

  function initParticles() {
    if (initialized) return;
    const { width, height } = card.getBoundingClientRect();
    memoized = Array.from({ length: o.particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor),
    );
    initialized = true;
  }

  function clearParticles() {
    timeouts.forEach(clearTimeout);
    timeouts = [];
    magnetismTween?.kill();

    particles.forEach(p => {
      gsap.to(p, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => p.parentNode?.removeChild(p),
      });
    });
    particles = [];
  }

  function animateParticles() {
    if (!isHovered) return;
    initParticles();

    memoized.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHovered) return;

        const clone = particle.cloneNode(true);
        card.appendChild(clone);
        particles.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' },
        );
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        });
        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        });
      }, index * 100);

      timeouts.push(timeoutId);
    });
  }

  function handleMouseEnter() {
    isHovered = true;
    if (o.enableStars) animateParticles();
    if (o.enableTilt) {
      gsap.to(card, {
        rotateX: o.tiltMax * 0.5,
        rotateY: o.tiltMax * 0.5,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    }
  }

  function handleMouseLeave() {
    isHovered = false;
    clearParticles();
    if (o.enableTilt) {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' });
    }
    if (o.enableMagnetism) {
      gsap.to(card, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
    }
  }

  function handleMouseMove(e) {
    if (!o.enableTilt && !o.enableMagnetism) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    if (o.enableTilt) {
      gsap.to(card, {
        rotateX: ((y - centerY) / centerY) * -o.tiltMax,
        rotateY: ((x - centerX) / centerX) * o.tiltMax,
        duration: 0.1,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    }

    if (o.enableMagnetism) {
      magnetismTween = gsap.to(card, {
        x: (x - centerX) * 0.05,
        y: (y - centerY) * 0.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }

  function handleClick(e) {
    if (!o.clickEffect) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const maxDistance = Math.max(
      Math.hypot(x, y),
      Math.hypot(x - rect.width, y),
      Math.hypot(x, y - rect.height),
      Math.hypot(x - rect.width, y - rect.height),
    );

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: ${maxDistance * 2}px;
      height: ${maxDistance * 2}px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
      left: ${x - maxDistance}px;
      top: ${y - maxDistance}px;
      pointer-events: none;
      z-index: 4;
    `;
    card.appendChild(ripple);

    gsap.fromTo(
      ripple,
      { scale: 0, opacity: 1 },
      { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() },
    );
  }

  card.addEventListener('mouseenter', handleMouseEnter);
  card.addEventListener('mouseleave', handleMouseLeave);
  card.addEventListener('mousemove', handleMouseMove);
  card.addEventListener('click', handleClick);

  return function detach() {
    isHovered = false;
    card.removeEventListener('mouseenter', handleMouseEnter);
    card.removeEventListener('mouseleave', handleMouseLeave);
    card.removeEventListener('mousemove', handleMouseMove);
    card.removeEventListener('click', handleClick);
    clearParticles();
    gsap.killTweensOf(card);
    gsap.set(card, { clearProps: 'all' });
  };
}

function attachGlobalSpotlight(grid, o) {
  const spotlight = document.createElement('div');
  spotlight.className = 'global-spotlight';
  spotlight.style.cssText = `
    position: fixed;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle,
      rgba(${o.glowColor}, 0.15) 0%,
      rgba(${o.glowColor}, 0.08) 15%,
      rgba(${o.glowColor}, 0.04) 25%,
      rgba(${o.glowColor}, 0.02) 40%,
      rgba(${o.glowColor}, 0.01) 65%,
      transparent 70%
    );
    z-index: 200;
    opacity: 0;
    transform: translate(-50%, -50%);
    mix-blend-mode: screen;
  `;
  document.body.appendChild(spotlight);

  const proximity = o.spotlightRadius * 0.5;
  const fadeDistance = o.spotlightRadius * 0.75;

  function clearGlow() {
    grid.querySelectorAll('.magic-bento-card').forEach(card => {
      card.style.setProperty('--glow-intensity', '0');
    });
  }

  function handleMouseMove(e) {
    const rect = grid.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    const cards = grid.querySelectorAll('.magic-bento-card');

    if (!inside) {
      gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: 'power2.out' });
      clearGlow();
      return;
    }

    let minDistance = Infinity;

    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const centerX = cardRect.left + cardRect.width / 2;
      const centerY = cardRect.top + cardRect.height / 2;
      const distance =
        Math.hypot(e.clientX - centerX, e.clientY - centerY) -
        Math.max(cardRect.width, cardRect.height) / 2;
      const effectiveDistance = Math.max(0, distance);

      minDistance = Math.min(minDistance, effectiveDistance);

      let glowIntensity = 0;
      if (effectiveDistance <= proximity) {
        glowIntensity = 1;
      } else if (effectiveDistance <= fadeDistance) {
        glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
      }

      card.style.setProperty('--glow-x', `${((e.clientX - cardRect.left) / cardRect.width) * 100}%`);
      card.style.setProperty('--glow-y', `${((e.clientY - cardRect.top) / cardRect.height) * 100}%`);
      card.style.setProperty('--glow-intensity', glowIntensity.toString());
      card.style.setProperty('--glow-radius', `${o.spotlightRadius}px`);
    });

    gsap.to(spotlight, { left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out' });

    const targetOpacity =
      minDistance <= proximity
        ? 0.8
        : minDistance <= fadeDistance
          ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
          : 0;

    gsap.to(spotlight, {
      opacity: targetOpacity,
      duration: targetOpacity > 0 ? 0.2 : 0.5,
      ease: 'power2.out',
    });
  }

  function handleMouseLeave() {
    clearGlow();
    gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: 'power2.out' });
  }

  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  document.addEventListener('mouseleave', handleMouseLeave);

  return function detach() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseleave', handleMouseLeave);
    gsap.killTweensOf(spotlight);
    spotlight.remove();
  };
}

/**
 * Click / Enter / Space turns the card over. Deliberately CSS-only and free of
 * gsap, so it still works on touch devices and under reduced motion — where the
 * rest of the effects are skipped but the detail must stay reachable.
 */
function attachFlip(card) {
  const front = card.querySelector('.magic-bento-card__face--front');
  const back = card.querySelector('.magic-bento-card__face--back');
  const link = back?.querySelector('.magic-bento-card__link');
  if (!front || !back) return () => {};

  function setFlipped(flipped) {
    card.classList.toggle('is-flipped', flipped);
    card.setAttribute('aria-expanded', String(flipped));
    front.setAttribute('aria-hidden', String(flipped));
    back.setAttribute('aria-hidden', String(!flipped));
    if (link) link.tabIndex = flipped ? 0 : -1;
  }

  function toggle(e) {
    // Let the detail link do its job instead of turning the card back over.
    if (e.target.closest('.magic-bento-card__link')) return;
    setFlipped(!card.classList.contains('is-flipped'));
  }

  function onKeydown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (e.target !== card) return;
    e.preventDefault();
    toggle(e);
  }

  card.addEventListener('click', toggle);
  card.addEventListener('keydown', onKeydown);

  return function detach() {
    card.removeEventListener('click', toggle);
    card.removeEventListener('keydown', onKeydown);
    setFlipped(false);
  };
}

let teardown = null;
let flipTeardown = null;

function attachAll(grid, o) {
  const detachers = [...grid.querySelectorAll('.magic-bento-card')].map(card =>
    attachCardBehaviour(card, o),
  );
  if (o.enableSpotlight) detachers.push(attachGlobalSpotlight(grid, o));
  teardown = () => detachers.forEach(fn => fn());
}

export function initMagicBento(id = 'magic-bento', options = {}) {
  if (teardown) {
    teardown();
    teardown = null;
  }
  if (flipTeardown) {
    flipTeardown();
    flipTeardown = null;
  }

  const grid = document.getElementById(id);
  if (!grid) return;

  const o = resolveOptions(options);

  if (o.enableFlip) {
    const detachers = [...grid.querySelectorAll('[data-flip]')].map(attachFlip);
    flipTeardown = () => detachers.forEach(fn => fn());
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(hover: none)').matches;
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

  // Every effect here is pointer-driven, so there is nothing to attach — and no
  // reason to fetch gsap at all — on touch devices or under reduced motion.
  if (o.disableAnimations || reduceMotion || isCoarse || isMobile) return;

  let loading = false;
  const observer = new IntersectionObserver(
    async ([entry]) => {
      if (!entry.isIntersecting || loading) return;
      loading = true;
      observer.disconnect();

      const mod = await import('gsap');
      gsap = mod.gsap;
      attachAll(grid, o);
    },
    { rootMargin: '400px' },
  );
  observer.observe(grid);
}
