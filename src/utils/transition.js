/**
 * Page transition curtain.
 * On load: curtain starts covering → slides up to reveal the page.
 * On internal link click: curtain drops down → navigates.
 *
 * A thin green-to-cyan line sits at the leading edge for a premium feel.
 */
export function initTransition() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Inject curtain — sits above everything including cursor
  const curtain = document.createElement('div');
  curtain.id = 'page-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  document.body.appendChild(curtain);

  // Reveal on load: base CSS has it covering, animate it up
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      curtain.classList.add('curtain-reveal');
    });
  });

  // Cover on internal navigation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    if (link.target === '_blank') return;

    const href = link.getAttribute('href');
    if (!href) return;
    if (href.startsWith('#'))       return; // pure anchor
    if (href.startsWith('/#'))      return; // home-page section links (e.g. /#results)
    if (href.startsWith('http'))    return;
    if (href.startsWith('mailto:')) return;
    if (href.startsWith('tel:'))    return;

    e.preventDefault();

    // Strip reveal, add cover — animates scaleY(0→1) from top
    curtain.classList.remove('curtain-reveal');
    curtain.classList.add('curtain-cover');

    // Navigate after transition — guard against both transitionend AND
    // setTimeout firing (double-navigation race condition).
    let navigated = false;
    const go = () => {
      if (navigated) return;
      navigated = true;
      window.location.href = href;
    };
    curtain.addEventListener('transitionend', go, { once: true });
    setTimeout(go, 650); // safety net
  });
}
