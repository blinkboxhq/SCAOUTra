export default function VideoBackground() {
  return `
    <div id="video-bg" aria-hidden="true">
      <video id="vbg-a" muted playsinline preload="auto"></video>
      <video id="vbg-b" muted playsinline preload="auto"></video>
      <div class="vbg-overlay"></div>
    </div>
  `;
}

export function initVideoBackground() {
  const wrap = document.getElementById('video-bg');
  if (!wrap) return;

  // Mobile: skip — too heavy, shader takes over
  if (window.matchMedia('(max-width: 768px)').matches) {
    wrap.remove();
    return;
  }

  const vA = document.getElementById('vbg-a');
  const vB = document.getElementById('vbg-b');

  const SRCS = ['/videos/hero-1.mp4', '/videos/hero-2.mp4'];

  vA.src = SRCS[0];
  vB.src = SRCS[1];

  // Start with A visible
  vA.style.opacity = '1';
  vB.style.opacity = '0';

  vA.play().catch(() => {});

  // When A ends → fade in B
  vA.addEventListener('ended', () => {
    vB.currentTime = 0;
    vB.play().catch(() => {});
    vA.style.opacity = '0';
    vB.style.opacity = '1';
  });

  // When B ends → fade in A
  vB.addEventListener('ended', () => {
    vA.currentTime = 0;
    vA.play().catch(() => {});
    vB.style.opacity = '0';
    vA.style.opacity = '1';
  });

  // Pause when tab is hidden — saves battery & CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      vA.pause();
      vB.pause();
    } else {
      // Only resume the active one
      const active = parseFloat(vA.style.opacity) > 0.5 ? vA : vB;
      active.play().catch(() => {});
    }
  });
}
