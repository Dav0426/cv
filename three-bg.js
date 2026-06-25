import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

// Fond animé : sphère de particules (shader) qui tourne doucement et réagit à
// la position de la souris (parallaxe). Purement décoratif, derrière le contenu.

const canvas = document.getElementById("bg-canvas");
const BG = 0x080a12;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(BG, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 5);

const group = new THREE.Group();
scene.add(group);

// --- Particules sur sphère (Fibonacci) ---
const COUNT = 6500;
const RADIUS = 1.9;
const positions = new Float32Array(COUNT * 3);
const randoms = new Float32Array(COUNT);
const golden = Math.PI * (3 - Math.sqrt(5));
for (let i = 0; i < COUNT; i++) {
  const y = 1 - (i / (COUNT - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const t = golden * i;
  positions[i * 3] = Math.cos(t) * r * RADIUS;
  positions[i * 3 + 1] = y * RADIUS;
  positions[i * 3 + 2] = Math.sin(t) * r * RADIUS;
  randoms[i] = Math.random();
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

const GLSL_SNOISE = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const uniforms = {
  uTime: { value: 0 },
  uSize: { value: 14.0 * renderer.getPixelRatio() },
  uAmp: { value: 0.3 },
  uColorA: { value: new THREE.Color(0x2dd4bf) },
  uColorB: { value: new THREE.Color(0x6366f1) },
};

const material = new THREE.ShaderMaterial({
  uniforms,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexShader: /* glsl */ `
    uniform float uTime; uniform float uSize; uniform float uAmp;
    attribute float aRandom; varying float vDisp;
    ${GLSL_SNOISE}
    void main() {
      vec3 dir = normalize(position);
      float n = snoise(dir * 1.5 + uTime * 0.16);
      float breathe = sin(uTime * 0.8 + aRandom * 6.2831) * 0.09;
      float disp = n * uAmp + breathe;
      vDisp = n;
      vec3 displaced = position + dir * disp;
      vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = uSize * (0.5 + aRandom) * (1.0 / -mv.z);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uColorA; uniform vec3 uColorB; varying float vDisp;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float alpha = smoothstep(0.5, 0.06, d) * 0.9;
      vec3 color = mix(uColorA, uColorB, smoothstep(-0.6, 0.6, vDisp));
      gl_FragColor = vec4(color, alpha);
    }
  `,
});

group.add(new THREE.Points(geometry, material));

// --- Étoiles de fond ---
const starCount = 900;
const sp = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const r = 10 + Math.random() * 8;
  const t = Math.random() * Math.PI * 2;
  const p = Math.acos(2 * Math.random() - 1);
  sp[i * 3] = r * Math.sin(p) * Math.cos(t);
  sp[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
  sp[i * 3 + 2] = r * Math.cos(p);
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x7c87a8, size: 0.025, transparent: true, opacity: 0.5, depthWrite: false }));
scene.add(stars);

// --- Bloom ---
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.42, 0.5, 0.2));
composer.addPass(new OutputPass());

// --- Parallaxe souris ---
const mouse = { x: 0, y: 0 };
const target = { x: 0, y: 0 };
window.addEventListener("pointermove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
});

function onResize() {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h; camera.updateProjectionMatrix();
  renderer.setSize(w, h); composer.setSize(w, h);
  uniforms.uSize.value = 14.0 * renderer.getPixelRatio();
}
window.addEventListener("resize", onResize);

const clock = new THREE.Clock();
function animate() {
  uniforms.uTime.value = clock.getElapsedTime();
  // la sphère suit doucement la souris + rotation continue
  target.x += (mouse.y * 0.35 - target.x) * 0.04;
  target.y += (mouse.x * 0.45 - target.y) * 0.04;
  group.rotation.x = target.x;
  group.rotation.y += 0.0014;
  group.rotation.z = target.y * 0.15;
  stars.rotation.y += 0.0003;
  composer.render();
}
renderer.setAnimationLoop(animate);

requestAnimationFrame(() => document.body.classList.add("bg-ready"));
