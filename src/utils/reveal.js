/**
 * Scroll-reveal utility using IntersectionObserver.
 * Degrades gracefully: if IntersectionObserver is unavailable,
 * all elements are made visible immediately.
 *
 * Usage: add data-reveal to any element.
 * Optional: data-reveal-delay="1|2|3|4" for staggered timing.
 */
export function initReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  // Graceful degradation
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
}
