/**
 * CanvasBackground — performant neural-network particle mesh.
 *
 * Performance guarantees:
 * - clearRect each frame (no compositing artifacts)
 * - IntersectionObserver on the hero section pauses RAF when hero is off-screen
 * - Page Visibility API pauses RAF when tab is backgrounded
 * - ResizeObserver instead of window 'resize' (fires less often)
 * - prefers-reduced-motion: skips animation entirely
 * - Object pool: particles are reused, not recreated on resize
 */

export default function CanvasBackground() {
  return `
    <canvas
      id="bg-canvas"
      aria-hidden="true"
      focusable="false"
      style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;"
    ></canvas>
  `;
}

export function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  // Respect user's motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let W = 0;
  let H = 0;
  let rafId = null;
  let heroVisible = true;
  let tabVisible = true;

  const PARTICLE_COUNT = 65;
  const CONNECT_DIST = 135;
  const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;
  const SPEED = 0.28;
  const COLOR = '129, 140, 248';

  // Pre-allocate typed arrays for hot path performance
  const px = new Float32Array(PARTICLE_COUNT);
  const py = new Float32Array(PARTICLE_COUNT);
  const pvx = new Float32Array(PARTICLE_COUNT);
  const pvy = new Float32Array(PARTICLE_COUNT);
  const pSize = new Float32Array(PARTICLE_COUNT);
  const pAlpha = new Float32Array(PARTICLE_COUNT);

  function initParticles() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      px[i] = Math.random() * W;
      py[i] = Math.random() * H;
      pvx[i] = (Math.random() - 0.5) * SPEED;
      pvy[i] = (Math.random() - 0.5) * SPEED;
      pSize[i] = Math.random() * 1.2 + 0.5;
      pAlpha[i] = Math.random() * 0.35 + 0.1;
    }
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    initParticles();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Move
      px[i] += pvx[i];
      py[i] += pvy[i];

      // Wrap at edges
      if (px[i] < 0) px[i] = W;
      else if (px[i] > W) px[i] = 0;
      if (py[i] < 0) py[i] = H;
      else if (py[i] > H) py[i] = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(px[i], py[i], pSize[i], 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR}, ${pAlpha[i]})`;
      ctx.fill();

      // Draw connections (O(n²/2) — acceptable for 65 particles)
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = px[i] - px[j];
        const dy = py[i] - py[j];
        const dSq = dx * dx + dy * dy;

        if (dSq < CONNECT_DIST_SQ) {
          const alpha = (1 - Math.sqrt(dSq) / CONNECT_DIST) * 0.1;
          ctx.beginPath();
          ctx.moveTo(px[i], py[i]);
          ctx.lineTo(px[j], py[j]);
          ctx.strokeStyle = `rgba(${COLOR}, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (!rafId && heroVisible && tabVisible) tick();
  }

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function sync() {
    if (heroVisible && tabVisible) {
      start();
    } else {
      stop();
    }
  }

  // Page Visibility API — stop when tab is backgrounded
  document.addEventListener('visibilitychange', () => {
    tabVisible = !document.hidden;
    sync();
  });

  // IntersectionObserver on hero — pause when hero scrolls fully out of view.
  // Canvas is fixed, so visually it's always there, but there's no point
  // animating it when the user is deep in the form section.
  requestAnimationFrame(() => {
    const hero = document.getElementById('hero');
    if (!hero) {
      start();
      return;
    }

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );

    heroObserver.observe(hero);
    start();
  });

  // ResizeObserver is more efficient than window 'resize'
  const ro = new ResizeObserver(resize);
  ro.observe(document.documentElement);

  resize();
}
