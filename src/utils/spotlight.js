/**
 * Cursor spotlight effect — ported from Aceternity/ibelick to vanilla JS.
 * A radial gradient follows the cursor inside each [data-spotlight] element.
 * On hover the glow appears; on leave it fades out.
 */
export function initSpotlight() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('[data-spotlight]').forEach((el) => {
    const color = el.dataset.spotlight || 'rgba(74,222,128,0.07)';

    // Inject the glow layer
    const glow = document.createElement('div');
    glow.className = 'spotlight-glow';
    glow.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
    `;
    // Ensure parent is positioned
    const pos = getComputedStyle(el).position;
    if (pos === 'static') el.style.position = 'relative';
    el.prepend(glow);

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.background = `radial-gradient(400px circle at ${x}px ${y}px, ${color}, transparent 70%)`;
      glow.style.opacity = '1';
    });

    el.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
    });
  });
}
