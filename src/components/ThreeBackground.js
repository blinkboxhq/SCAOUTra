/**
 * Lightweight Three.js hero background.
 * Replaces @splinetool/runtime — no external scene file, no cursor tracking loop.
 * 30 fps cap + pixelRatio ≤ 1.5 keep GPU load minimal.
 */
import * as THREE from 'three';

export default function ThreeBackground() {
  return `
    <div id="three-bg" aria-hidden="true">
      <canvas id="three-canvas"></canvas>
      <div class="three-overlay"></div>
    </div>
  `;
}

export function initThreeBackground() {
  const wrap   = document.getElementById('three-bg');
  const canvas = document.getElementById('three-canvas');
  if (!wrap || !canvas) return;

  if (window.matchMedia('(max-width: 768px)').matches) {
    wrap.remove();
    return;
  }

  // Move inside hero so it's clipped by hero's overflow:hidden
  const hero = document.getElementById('hero');
  if (hero) hero.prepend(wrap);

  // Remove video background — Three.js takes over
  document.getElementById('video-bg')?.remove();

  const W = wrap.offsetWidth  || window.innerWidth;
  const H = wrap.offsetHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(W, H);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
  camera.position.set(0, 0.4, 6);

  // ── Particle field ──────────────────────────────────────────────────────
  const COUNT = 420;
  const pos   = new Float32Array(COUNT * 3);
  const col   = new Float32Array(COUNT * 3);

  // Brand palette
  const GREEN = new THREE.Color(0x4ade80);
  const CYAN  = new THREE.Color(0x22d3ee);

  for (let i = 0; i < COUNT; i++) {
    // Spread in a wide sphere-ish volume
    const r     = 5 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);

    const c = GREEN.clone().lerp(CYAN, Math.random());
    col[i * 3]     = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }

  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  ptGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

  const ptMat = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(ptGeo, ptMat);
  scene.add(particles);

  // ── Wireframe icosahedron (the "AI core") ───────────────────────────────
  const icoGeo = new THREE.IcosahedronGeometry(1.35, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    wireframe: true,
    transparent: true,
    opacity: 0.13,
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.set(0, 0.3, 0);
  scene.add(ico);

  // Inner solid (very faint glow at center)
  const innerGeo = new THREE.IcosahedronGeometry(0.6, 0);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x4ade80,
    wireframe: true,
    transparent: true,
    opacity: 0.07,
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  inner.position.copy(ico.position);
  scene.add(inner);

  // ── Mouse parallax (gentle camera drift) ───────────────────────────────
  let targetX = 0;
  let targetY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 0.6;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  }, { passive: true });

  // ── Render loop — 30 fps cap ────────────────────────────────────────────
  const FPS_INTERVAL = 1000 / 30;
  let lastFrame = 0;

  function animate(now) {
    rafId = requestAnimationFrame(animate);
    if (document.hidden) return;
    if (now - lastFrame < FPS_INTERVAL) return;
    lastFrame = now;

    // Rotate
    ico.rotation.x      += 0.003;
    ico.rotation.y      += 0.004;
    inner.rotation.x    -= 0.004;
    inner.rotation.y    += 0.006;
    particles.rotation.y += 0.0004;

    // Lerp camera to mouse
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (-targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  let rafId = requestAnimationFrame(animate);

  // ── Resize ──────────────────────────────────────────────────────────────
  const ro = new ResizeObserver(() => {
    const w = wrap.offsetWidth;
    const h = wrap.offsetHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  ro.observe(wrap);

  // ── Cleanup ─────────────────────────────────────────────────────────────
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(animate);
    }
  });
}
