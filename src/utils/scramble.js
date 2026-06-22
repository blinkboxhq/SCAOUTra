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

function triggerScramble(el) {
  const text = el.dataset.scramble || el.textContent.trim();
  el.dataset.scramble = text; // preserve original
  scramble(el, text, parseInt(el.dataset.scrambleDuration || '900'));
}

export function initScramble() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const elements = document.querySelectorAll('[data-scramble]');
  if (!elements.length) return;

  // Store original text before any IntersectionObserver fires
  elements.forEach((el) => {
    if (!el.dataset.scramble) el.dataset.scramble = el.textContent.trim();
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el = entry.target;

      // If the element is part of the reveal system and hasn't been shown yet,
      // wait for is-visible to be added before running the scramble so it
      // doesn't fire while the element is still opacity: 0.
      if (el.hasAttribute('data-reveal') && !el.classList.contains('is-visible')) {
        const mo = new MutationObserver(() => {
          if (el.classList.contains('is-visible')) {
            mo.disconnect();
            triggerScramble(el);
          }
        });
        mo.observe(el, { attributes: true, attributeFilter: ['class'] });
      } else {
        triggerScramble(el);
      }
    });
  }, { threshold: 0.5 });

  elements.forEach((el) => observer.observe(el));
}
