/**
 * Lightweight scroll parallax for hero elements.
 * Elements with [data-parallax="N"] move at N × scroll speed.
 * Negative N = moves up faster (receding). Positive = slower than scroll.
 * Uses transform: translateY for GPU compositing — no layout thrash.
 */
export function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 768px)').matches) return; // skip mobile

  const layers = [...document.querySelectorAll('[data-parallax]')].map(el => ({
    el,
    speed: parseFloat(el.dataset.parallax) || 0.2,
  }));

  if (!layers.length) return;

  let ticking = false;

  function update() {
    const y = window.scrollY;
    layers.forEach(({ el, speed }) => {
      el.style.transform = `translateY(${y * speed}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}
