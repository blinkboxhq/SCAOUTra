/**
 * Grainient — grainy animated gradient field (ported from React Bits to vanilla ES modules).
 *
 * Used as the backdrop for the "Your Automation Hub" scroll-reveal section.
 *
 * Requires WebGL2 (the shader is GLSL ES 3.00). If unavailable the mount bails
 * silently and the section keeps its flat --bg-base background.
 *
 * Performance: pauses when the container scrolls off-screen and when the tab is
 * hidden. Renders a single static frame under prefers-reduced-motion.
 */
import { Renderer, Program, Mesh, Triangle } from 'ogl';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
}

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);

  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;

  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);

  vec3 colLav=uColor1;
  vec3 colOrg=uColor2;
  vec3 colDark=uColor3;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));

  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;

  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);

  o=vec4(col,1.0);
}
void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}
`;

/* Tuned to the Scoutra palette. color3 is the page background so the field
   dissolves into the section instead of sitting on it as a coloured slab, and
   the motion is slowed well below the demo default. */
const DEFAULTS = {
  color1: '#22d3ee',
  color2: '#4ade80',
  color3: '#050508',
  timeSpeed: 0.12,
  colorBalance: 0.0,
  warpStrength: 1.0,
  warpFrequency: 4.0,
  warpSpeed: 1.4,
  warpAmplitude: 50.0,
  blendAngle: 0.0,
  blendSoftness: 0.12,
  rotationAmount: 320.0,
  noiseScale: 2.0,
  grainAmount: 0.09,
  grainScale: 2.0,
  grainAnimated: false,
  contrast: 1.2,
  gamma: 1.0,
  saturation: 0.9,
  centerX: 0.0,
  centerY: 0.0,
  zoom: 0.9,
};

export default function Grainient({ id = 'grainient', className = '' } = {}) {
  const cls = `grainient-container ${className}`.trim();
  return `<div id="${id}" class="${cls}" aria-hidden="true" focusable="false"></div>`;
}

/**
 * Mounts the gradient canvas into `container`.
 * @param {HTMLElement} container
 * @param {Partial<typeof DEFAULTS>} options
 * @returns {() => void} cleanup function
 */
export function mountGrainient(container, options = {}) {
  if (!container) return () => {};

  const o = { ...DEFAULTS, ...options };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
  } catch {
    return () => {};
  }

  // The shader is GLSL ES 3.00 — a WebGL1 fallback context would fail to compile.
  if (!renderer.isWebgl2) {
    renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
    return () => {};
  }

  const gl = renderer.gl;
  const canvas = gl.canvas;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);

  const geometry = new Triangle(gl);
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new Float32Array([1, 1]) },
      uTimeSpeed: { value: o.timeSpeed },
      uColorBalance: { value: o.colorBalance },
      uWarpStrength: { value: o.warpStrength },
      uWarpFrequency: { value: o.warpFrequency },
      uWarpSpeed: { value: o.warpSpeed },
      uWarpAmplitude: { value: o.warpAmplitude },
      uBlendAngle: { value: o.blendAngle },
      uBlendSoftness: { value: o.blendSoftness },
      uRotationAmount: { value: o.rotationAmount },
      uNoiseScale: { value: o.noiseScale },
      uGrainAmount: { value: o.grainAmount },
      uGrainScale: { value: o.grainScale },
      uGrainAnimated: { value: o.grainAnimated ? 1.0 : 0.0 },
      uContrast: { value: o.contrast },
      uGamma: { value: o.gamma },
      uSaturation: { value: o.saturation },
      uCenterOffset: { value: new Float32Array([o.centerX, o.centerY]) },
      uZoom: { value: o.zoom },
      uColor1: { value: new Float32Array(hexToRgb(o.color1)) },
      uColor2: { value: new Float32Array(hexToRgb(o.color2)) },
      uColor3: { value: new Float32Array(hexToRgb(o.color3)) },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });

  function setSize() {
    const rect = container.getBoundingClientRect();
    renderer.setSize(
      Math.max(1, Math.floor(rect.width)),
      Math.max(1, Math.floor(rect.height)),
    );
    const res = program.uniforms.iResolution.value;
    res[0] = gl.drawingBufferWidth;
    res[1] = gl.drawingBufferHeight;
    renderer.render({ scene: mesh });
  }

  const resizeObserver = new ResizeObserver(setSize);
  resizeObserver.observe(container);
  setSize();

  let raf = 0;
  let isVisible = true;
  let isPageVisible = !document.hidden;
  const t0 = performance.now();

  function loop(t) {
    program.uniforms.iTime.value = (t - t0) * 0.001;
    renderer.render({ scene: mesh });
    raf = requestAnimationFrame(loop);
  }

  function tryStart() {
    if (reduceMotion) return;
    if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
  }

  function tryStop() {
    if (raf !== 0) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) tryStart();
      else tryStop();
    },
    { threshold: 0 },
  );
  intersectionObserver.observe(container);

  function onVisibility() {
    isPageVisible = !document.hidden;
    if (isPageVisible) tryStart();
    else tryStop();
  }
  document.addEventListener('visibilitychange', onVisibility);

  tryStart(); // no-op under reduced motion — setSize() already drew one frame

  return function destroy() {
    tryStop();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.remove();
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}

const instances = new Map();

export function initGrainient(id = 'grainient', options = {}) {
  const existing = instances.get(id);
  if (existing) {
    existing();
    instances.delete(id);
  }
  const container = document.getElementById(id);
  if (!container) return;
  instances.set(id, mountGrainient(container, options));
}
