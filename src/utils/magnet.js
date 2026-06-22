/**
 * Magnetic button effect.
 * Elements with [data-magnet] attract the cursor when it comes close.
 * [data-magnet="strong"] = 0.5 pull, [data-magnet] default = 0.35 pull
 */
export function initMagnet() {
  if (window.matchMedia('(hover: none)').matches) return;

  const elements = document.querySelectorAll('[data-magnet]');
  if (!elements.length) return;

  elements.forEach((el) => {
    const strength = el.dataset.magnet === 'strong' ? 0.5 : 0.35;

    el.addEventListener('mousemove', (e) => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = e.clientX - cx;
      const dy     = e.clientY - cy;
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform  = 'translate(0, 0)';
      // Remove inline transition after snap-back so normal hover states work
      el.addEventListener('transitionend', () => {
        el.style.transition = '';
      }, { once: true });
    });
  });
}
