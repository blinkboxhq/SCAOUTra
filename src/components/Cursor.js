/**
 * Custom cursor — green dot + lagging ring.
 * Desktop-only. Degrades gracefully on touch / reduced-motion.
 */
export default function Cursor() {
  return `
    <div id="cursor-dot"  aria-hidden="true" focusable="false"></div>
    <div id="cursor-ring" aria-hidden="true" focusable="false"></div>
  `;
}

export function initCursor() {
  // Skip on touch devices and reduced-motion
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Hide native cursor globally
  document.documentElement.classList.add('has-cursor');

  let mouseX = -200, mouseY = -200;
  let ringX  = -200, ringY  = -200;
  let visible = false;

  // Snap dot to cursor immediately
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

    if (!visible) {
      visible = true;
      dot.classList.add('is-visible');
      ring.classList.add('is-visible');
    }
  });

  document.addEventListener('mouseleave', () => {
    visible = false;
    dot.classList.remove('is-visible');
    ring.classList.remove('is-visible');
  });

  // Lerp ring behind cursor
  function tick() {
    const speed = ring.classList.contains('is-hovering') ? 0.18 : 0.11;
    ringX += (mouseX - ringX) * speed;
    ringY += (mouseY - ringY) * speed;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();

  // React to interactive elements
  function attachHover() {
    document.querySelectorAll('a, button, [role="button"], label, input, textarea, select').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
    });
  }

  attachHover();

  // Re-attach when DOM mutates (modals, dynamic content)
  const observer = new MutationObserver(attachHover);
  observer.observe(document.body, { childList: true, subtree: true });
}
