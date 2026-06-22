/**
 * Number count-up animation.
 * Triggers when [data-count] elements enter the viewport.
 *
 * Attributes:
 *   data-count      — target number (float ok)
 *   data-decimals   — decimal places (default 0)
 *   data-prefix     — prefix shown before number (e.g. "€")
 *   data-separator  — if "true", adds comma thousands separator
 */
export function initCounters() {
  const elements = document.querySelectorAll('[data-count]');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => {
      el.textContent = formatNum(el, parseFloat(el.dataset.count));
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      animateCount(entry.target);
    });
  }, { threshold: 0.4 });

  elements.forEach(el => observer.observe(el));
}

function formatNum(el, value) {
  const decimals   = parseInt(el.dataset.decimals  || '0', 10);
  const prefix     = el.dataset.prefix || '';
  const separator  = el.dataset.separator === 'true';
  let str = value.toFixed(decimals);
  if (separator) str = addCommas(str);
  return prefix + str;
}

function addCommas(str) {
  const [int, dec] = str.split('.');
  const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return dec !== undefined ? `${formatted}.${dec}` : formatted;
}

function animateCount(el) {
  const target   = parseFloat(el.dataset.count);
  const duration = 1600;
  const start    = performance.now();

  // Set starting display
  el.textContent = formatNum(el, 0);

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = target * eased;
    el.textContent = formatNum(el, current);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}
