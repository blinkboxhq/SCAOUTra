/**
 * TextReveal — word-by-word scroll-driven reveal.
 * Translated from the Framer Motion TextRevealByWord component.
 * Uses IntersectionObserver + scroll listener instead of framer-motion.
 */

/**
 * @param {object} opts
 * @param {string} opts.text   - The sentence to reveal.
 * @param {string} [opts.id]   - Section id attribute.
 * @param {string} [opts.badge] - Optional badge label above the text.
 */
export default function TextReveal({ text = '', id = 'text-reveal', badge = '' } = {}) {
  const words = text.split(' ');

  // Ghost is absolute (placeholder dim text); live is in-flow (determines dimensions).
  const spans = words.map((word, i) => `
    <span class="trw-word" data-idx="${i}">
      <span class="trw-ghost" aria-hidden="true">${word}</span>
      <span class="trw-live">${word}</span>
    </span>
  `).join('');

  return `
    <section
      id="${id}"
      class="trw-section"
      data-text-reveal
      aria-label="${text}"
    >
      <div class="trw-sticky">
        ${badge ? `<div class="badge mx-auto mb-8" data-reveal>${badge}</div>` : ''}
        <p class="trw-para" aria-hidden="true">
          ${spans}
        </p>
      </div>
    </section>
  `;
}

export function initTextReveal() {
  const sections = document.querySelectorAll('[data-text-reveal]');
  if (!sections.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  sections.forEach(section => {
    const words = Array.from(section.querySelectorAll('.trw-word'));
    const total = words.length;

    if (reduced) {
      words.forEach(w => {
        const live = w.querySelector('.trw-live');
        if (live) live.style.opacity = '1';
      });
      return;
    }

    function update() {
      const rect       = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));

      words.forEach((word, i) => {
        // Each word starts revealing when progress passes its proportional threshold
        const wordProgress = Math.max(0, Math.min(1, (progress - i / total) * total));
        const live = word.querySelector('.trw-live');
        if (live) live.style.opacity = wordProgress;
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  });
}
