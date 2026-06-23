export default function VideoBackground() {
  return `
    <div id="video-bg" aria-hidden="true">
      <video id="vbg-main" muted playsinline loop preload="auto"></video>
      <div class="vbg-overlay"></div>
    </div>
  `;
}

export function initVideoBackground() {
  const wrap = document.getElementById('video-bg');
  if (!wrap) return;

  if (window.matchMedia('(max-width: 768px)').matches) {
    wrap.remove();
    return;
  }

  // Contain inside hero so it's clipped by hero's overflow:hidden
  const hero = document.getElementById('hero');
  if (hero) hero.prepend(wrap);

  const v = document.getElementById('vbg-main');
  v.src = '/videos/hero-2.mp4';
  v.play().catch(() => {});

  document.addEventListener('visibilitychange', () => {
    document.hidden ? v.pause() : v.play().catch(() => {});
  });
}
