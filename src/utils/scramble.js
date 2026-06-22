/**
 * Text scramble effect.
 * Adds [data-scramble] to any element — on reveal, letters cycle
 * through random chars before resolving to the real text.
 * Works with the existing IntersectionObserver reveal system.
 */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

function scramble(el, finalText, duration = 900) {
  const len   = finalText.length;
  const start = performance.now();
  let   frame;

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Resolve chars left-to-right
    const resolved = Math.floor(progress * len);

    let output = '';
    for (let i = 0; i < len; i++) {
      if (finalText[i] === ' ') {
        output += ' ';
      } else if (i < resolved) {
        output += finalText[i];
      } else {
        output += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }

    el.textContent = output;

    if (progress < 1) {
      frame = requestAnimationFrame(tick);
    } else {
      el.textContent = finalText;
    }
  }

  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

export function initScramble() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const elements = document.querySelectorAll('[data-scramble]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el   = entry.target;
      const text = el.dataset.scramble || el.textContent;
      el.dataset.scramble = text; // preserve original
      scramble(el, text, parseInt(el.dataset.scrambleDuration || '900'));
    });
  }, { threshold: 0.5 });

  elements.forEach((el) => {
    // Store original text in attribute if not already set
    if (!el.dataset.scramble) el.dataset.scramble = el.textContent.trim();
    observer.observe(el);
  });
}
