/**
 * Spline 3D interactive background.
 * Uses @splinetool/runtime (vanilla JS — no React needed).
 * Replace SCENE_URL with your own Spline scene for brand colors.
 *
 * Desktop only — canvas removed on mobile to save battery.
 */

// Default: abstract robot/tech scene. User can swap for their own branded scene.
const SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

export default function SplineBackground() {
  return `
    <div id="spline-bg" aria-hidden="true">
      <canvas id="spline-canvas"></canvas>
      <div class="spline-overlay"></div>
    </div>
  `;
}

export async function initSplineBackground() {
  const wrap   = document.getElementById('spline-bg');
  const canvas = document.getElementById('spline-canvas');
  if (!wrap || !canvas) return;

  // Mobile: skip — too heavy
  if (window.matchMedia('(max-width: 768px)').matches) {
    wrap.remove();
    return;
  }

  try {
    const { Application } = await import('@splinetool/runtime');
    const app = new Application(canvas);
    await app.load(SCENE_URL);

    // Spline loaded — remove the video background, no longer needed
    const videoBg = document.getElementById('video-bg');
    if (videoBg) videoBg.remove();

    // Pause render when tab is hidden
    document.addEventListener('visibilitychange', () => {
      wrap.style.visibility = document.hidden ? 'hidden' : 'visible';
    });
  } catch (err) {
    // Silently fall back to video → shader if Spline fails
    console.warn('Spline failed, video/shader takes over:', err.message);
    wrap.remove();
  }
}
