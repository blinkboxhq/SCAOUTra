/**
 * ShaderBackground — Three.js WebGL shader animation.
 * Replaces CanvasBackground.js.
 *
 * Performance: pauses when hero scrolls off-screen & when tab is hidden.
 * Respects prefers-reduced-motion.
 */
import * as THREE from 'three';

export default function ShaderBackground() {
  return `<div id="shader-bg" aria-hidden="true" focusable="false"></div>`;
}

export function initShaderBackground() {
  const container = document.getElementById('shader-bg');
  if (!container) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const vertexShader = `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;

    void main(void) {
      vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
      float t = time * 0.05;
      float lineWidth = 0.002;

      vec3 color = vec3(0.0);
      for(int j = 0; j < 3; j++){
        for(int i = 0; i < 5; i++){
          color[j] += lineWidth * float(i * i) / abs(
            fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0
            - length(uv)
            + mod(uv.x + uv.y, 0.2)
          );
        }
      }

      gl_FragColor = vec4(color[0], color[1], color[2], 1.0);
    }
  `;

  const camera = new THREE.Camera();
  camera.position.z = 1;

  const scene = new THREE.Scene();
  const geometry = new THREE.PlaneGeometry(2, 2);

  const uniforms = {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() },
  };

  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
  scene.add(new THREE.Mesh(geometry, material));

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  let animId = null;
  let heroVisible = true;
  let tabVisible = true;

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height);
  }

  function tick() {
    animId = requestAnimationFrame(tick);
    uniforms.time.value += 0.05;
    renderer.render(scene, camera);
  }

  function start() { if (!animId && heroVisible && tabVisible) tick(); }
  function stop() { if (animId) { cancelAnimationFrame(animId); animId = null; } }
  function sync() { (heroVisible && tabVisible) ? start() : stop(); }

  document.addEventListener('visibilitychange', () => { tabVisible = !document.hidden; sync(); });
  window.addEventListener('resize', resize, { passive: true });

  resize();

  requestAnimationFrame(() => {
    const hero = document.getElementById('hero');
    if (!hero) { start(); return; }
    const obs = new IntersectionObserver(
      ([e]) => { heroVisible = e.isIntersecting; sync(); },
      { threshold: 0 }
    );
    obs.observe(hero);
    start();
  });
}
