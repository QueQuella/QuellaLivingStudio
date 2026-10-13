import * as THREE from './vendor/three.module.js';
import config from './dream-config.js';
import {clamp, timeline, smoothRange} from './dream-timeline.mjs';
import {scrollCoordinate, sectionMotion} from './dream-sections.mjs';

const view = document.getElementById('programmingDream');
const host = document.getElementById('pdCanvas');
const story = document.getElementById('pdStory');
const about = document.getElementById('pdAbout');
const showcase = document.getElementById('pdShowcase');
const question = document.getElementById('pdQuestion');
const filmTransition = document.getElementById('pdFilmTransition');
const further = document.getElementById('pdFurther');
const reveals = [...view.querySelectorAll('[data-pd-reveal]')];
const portal = document.getElementById('pdPortal');
const intro = document.getElementById('pdIntro');
const chapter = document.getElementById('pdChapter');
const status = document.getElementById('pdStatus');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let active = !view.hidden, started = false, frameId = 0, progress = 0, goal = 0;
let renderer, scene, camera, computer, screenCenter, ocean;
let lastTime = 0, sceneTime = 0, failed = false;
const direction = new THREE.Vector3(0, 0, 1);
const startPosition = new THREE.Vector3(...config.startPosition);
const startTarget = new THREE.Vector3(...config.startTarget);
const nearPosition = new THREE.Vector3(), endPosition = new THREE.Vector3(), target = new THREE.Vector3();
const pointer = new THREE.Vector2(), drift = new THREE.Vector2();
let routeTransition = false;
let questionLayout, filmLayout;

function sectionTop(section) {
  return scrollCoordinate(section.getBoundingClientRect().top, view.getBoundingClientRect().top, view.scrollTop);
}
function measureSections() {
  if (view.hidden) return;
  questionLayout = {top: sectionTop(question), height: question.offsetHeight};
  filmLayout = {top: sectionTop(filmTransition), height: filmTransition.offsetHeight};
}

function scrollToSection(section, focus = true) {
  view.scrollTo({top: sectionTop(section), behavior: reduced.matches ? 'instant' : 'smooth'});
  if (focus) section.querySelector('h2')?.focus({preventScroll: true});
}
document.getElementById('pdSkip').addEventListener('click', () => scrollToSection(about));
document.getElementById('pdToShowcase').addEventListener('click', () => scrollToSection(filmTransition));
document.getElementById('pdBegin').addEventListener('click', () => {
  view.scrollTo({top: Math.min(view.clientHeight * .75, story.offsetHeight - view.clientHeight), behavior: reduced.matches ? 'instant' : 'smooth'});
});
document.getElementById('pdReplay').addEventListener('click', () => {
  view.scrollTo({top: 0, behavior: reduced.matches ? 'instant' : 'smooth'});
  document.getElementById('pdTitle').focus({preventScroll: true});
});
function readScroll() {
  if (view.hidden) return;
  goal = clamp(view.scrollTop / Math.max(1, story.offsetHeight - view.clientHeight));
  if (reduced.matches) progress = goal;
  updateText();
  updateSectionMotion();
  schedule();
}
function updateText() {
  const state = timeline(goal);
  intro.style.opacity = state.intro;
  intro.style.visibility = state.intro < .01 ? 'hidden' : 'visible';
  const scroll = view.scrollTop + view.clientHeight * .45;
  const label = scroll >= sectionTop(further) ? '06 / BEHIND THE DREAM' : scroll >= sectionTop(showcase) ? '05 / SHOWCASE' : scroll >= sectionTop(filmTransition) ? '04 / THE DREAM IN MOTION' : scroll >= sectionTop(about) ? '03 / ABOUT THE PROJECT' : goal >= .99 ? '02 / A QUESTION' : state.chapter;
  if (chapter.textContent !== label) chapter.textContent = label;
  document.getElementById('pdSkip').style.visibility = goal < .98 ? 'visible' : 'hidden';
}
function updateSectionMotion() {
  if (!questionLayout || !filmLayout) measureSections();
  const h = view.clientHeight;
  for (const [section, layout, prefix] of [[question, questionLayout, 'q'], [filmTransition, filmLayout, 'film']]) {
    if (!layout) continue;
    const state = sectionMotion(view.scrollTop, layout.top, layout.height, h);
    section.style.setProperty(`--pd-${prefix}-opacity`, reduced.matches ? 1 : state.title);
    section.style.setProperty(`--pd-${prefix}-shift`, reduced.matches ? '0px' : `${(1 - state.enter) * 32 - state.exit * 28}px`);
    section.style.setProperty(`--pd-${prefix}-scale`, reduced.matches ? 1 : 1 + state.travel * .065);
    if (prefix === 'film') {
      section.style.setProperty('--pd-film-frame-scale', reduced.matches ? 1 : .55 + state.travel * .9);
      section.style.setProperty('--pd-film-light', reduced.matches ? 0 : Math.sin(state.exit * Math.PI) * .35);
    }
  }
  for (const element of reveals) {
    const y = element.getBoundingClientRect().top - view.getBoundingClientRect().top;
    // Stay visible after entrance so tall About copy never disappears mid-reading.
    const visible = reduced.matches || element.contains(document.activeElement) ? 1 : smoothRange((h - y) / h, .05, .38);
    element.style.setProperty('--pd-reveal', visible);
    element.style.setProperty('--pd-reveal-y', `${(1 - visible) * 28}px`);
  }
}

// Capture before the existing hash router; route exactly once under the cover.
view.addEventListener('click', async event => {
  const link = event.target.closest('a[data-pd-route]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (link.dataset.pdPass === 'true' || reduced.matches) return;
  event.preventDefault(); event.stopPropagation();
  if (routeTransition) return;
  routeTransition = true;
  const overlay = document.createElement('div');
  overlay.className = `pd-route-transition pd-route-${link.dataset.pdRoute}`;
  overlay.setAttribute('aria-hidden', 'true');
  if (link.dataset.pdRoute === 'tape') {
    for (let i = 0; i < 10; i++) {
      const strip = document.createElement('i'); strip.style.setProperty('--strip', i); overlay.append(strip);
    }
  }
  document.body.append(overlay);
  try {
    const cover = overlay.animate([{opacity: 0}, {opacity: 1}], {duration: link.dataset.pdRoute === 'tape' ? 360 : 300, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards'});
    await cover.finished;
    link.dataset.pdPass = 'true';
    link.click();
    delete link.dataset.pdPass;
    // The destination paints behind a fully opaque cover before the reveal.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const uncover = overlay.animate([{opacity: 1}, {opacity: 0}], {duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards'});
    await uncover.finished;
  } catch (error) {
    // Navigation still works if the animation API is unavailable or interrupted.
    if (location.hash !== link.hash) { link.dataset.pdPass = 'true'; link.click(); delete link.dataset.pdPass; }
  } finally { overlay.remove(); routeTransition = false; }
}, {capture: true});
view.addEventListener('scroll', readScroll, {passive: true});
view.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || reduced.matches) return;
  const rect = view.getBoundingClientRect();
  pointer.set((event.clientX - rect.left) / rect.width - .5, (event.clientY - rect.top) / rect.height - .5);
});
view.addEventListener('pointerleave', () => pointer.set(0, 0));

window.ProgrammingDream = {
  enter() { active = true; initialise(); resize(); measureSections(); readScroll(); schedule(); },
  setActive(value) { active = value; if (value) this.enter(); else if (frameId) { cancelAnimationFrame(frameId); frameId = 0; lastTime = 0; } },
};
// Script modules load after the site's initial route; handle direct hash entry too.
if (active) window.ProgrammingDream.enter();
new MutationObserver(() => window.ProgrammingDream.setActive(!view.hidden)).observe(view, {attributes: true, attributeFilter: ['hidden']});
new ResizeObserver(() => { resize(); measureSections(); readScroll(); }).observe(view);
new ResizeObserver(() => { measureSections(); readScroll(); }).observe(document.querySelector('.pd-content'));
document.fonts.ready.then(() => { measureSections(); readScroll(); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden && frameId) { cancelAnimationFrame(frameId); frameId = 0; lastTime = 0; }
  else schedule();
});
reduced.addEventListener('change', readScroll);

function schedule() {
  if (active && !view.hidden && !document.hidden && !frameId) frameId = requestAnimationFrame(frame);
}
function resize() {
  if (!renderer || view.hidden || view.clientWidth < 1) return;
  renderer.setSize(view.clientWidth, view.clientHeight);
  camera.aspect = view.clientWidth / view.clientHeight;
  camera.updateProjectionMatrix();
}
function showFallback(message) {
  failed = true;
  status.textContent = message;
  // The supplied render remains visible even when modules/models/WebGL fail.
  host.style.opacity = '0';
}
async function initialise() {
  if (started) return;
  started = true;
  if (location.protocol === 'file:') {
    showFallback('Scene reference / open this website with a local server for 3D.');
    return;
  }
  try {
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: false, powerPreference: 'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    host.append(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      showFallback('Scene reference / 3D is unavailable. Scroll to read about the project.');
    });
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d182e);
    scene.fog = new THREE.FogExp2(0x243d49, .007);
    camera = new THREE.PerspectiveCamera(config.fieldOfView, 1, .02, 600);
    scene.add(new THREE.HemisphereLight(0xc3dbfb, 0x224038, 2.6));
    const key = new THREE.DirectionalLight(0xffdfbe, 3.6);
    key.position.set(-10, 20, 12); scene.add(key);
    const glow = new THREE.PointLight(0xb6ffcf, 12, 12);
    glow.position.set(-4, 3, -7); scene.add(glow);
    createOcean();
    if (!config.environment) createTemporaryEnvironment();
    resize(); schedule();
    const {GLTFLoader} = await import('./vendor/gltf/GLTFLoader.js');
    const loader = new GLTFLoader();
    const loadWithTimeout = url => Promise.race([
      loader.loadAsync(url),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Model load timed out')), 20000)),
    ]);
    const gltf = await loadWithTimeout(config.computer);
    computer = new THREE.Group();
    const model = gltf.scene;
    // Blender's export has an offset origin. Centre using real bounds, not guessed coordinates.
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const scale = config.computerHeight / box.getSize(new THREE.Vector3()).y;
    model.position.sub(center); model.scale.setScalar(scale); model.position.multiplyScalar(scale);
    computer.add(model);
    computer.position.set(...config.computerPosition);
    computer.position.y += config.computerHeight / 2;
    scene.add(computer); computer.updateMatrixWorld(true);
    const screen = model.getObjectByName(config.screenName);
    if (!screen?.isMesh) throw new Error('Named screen mesh is required for the portal');
    const bounds = new THREE.Box3().setFromObject(screen);
    const screenSize = bounds.getSize(new THREE.Vector3());
    screenCenter = bounds.getCenter(new THREE.Vector3());
    screenCenter.z = bounds.max.z + .025;
    const map = screenTexture();
    const face = new THREE.Mesh(new THREE.PlaneGeometry(screenSize.x * .88, screenSize.y * .82), new THREE.MeshBasicMaterial({map, toneMapped: false}));
    // Separate portal surface keeps the original model and bezel intact.
    face.position.copy(computer.worldToLocal(screenCenter.clone()));
    computer.add(face);
    nearPosition.copy(screenCenter).add(new THREE.Vector3(0, .1, 4.5));
    endPosition.copy(screenCenter).addScaledVector(direction, .065);
    status.textContent = 'Scroll forward to enter · scroll back to return';
    if (config.environment) {
      try {
        const environment = (await loadWithTimeout(config.environment)).scene;
        environment.scale.setScalar(config.environmentScale);
        environment.position.set(...config.environmentPosition);
        scene.add(environment);
      } catch (error) {
        createTemporaryEnvironment();
        status.textContent = 'World preview / scene unavailable. Scroll to continue.';
        console.warn('Programming Dream environment:', error);
      }
    }
    schedule();
  } catch (error) {
    console.warn('Programming Dream:', error);
    showFallback('Scene reference / 3D unavailable. Scroll to continue.');
  }
}

function createOcean() {
  const material = new THREE.ShaderMaterial({
    uniforms: {time: {value: 0}},
    vertexShader: `
      uniform float time;
      varying vec3 world;
      varying float wave;
      void main() {
        vec3 p = position;
        wave = sin(p.x * .55 + time * .8) * .07 + sin(p.y * .35 - time * .65) * .08;
        p.z += wave;
        world = (modelMatrix * vec4(p, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: `
      uniform float time;
      varying vec3 world;
      varying float wave;
      void main() {
        float ripples = sin(world.x * 2.3 + world.z * 1.6 + time) * sin(world.z * 3.1 - time * .6);
        float spark = pow(max(0.0, ripples), 22.0);
        float path = exp(-pow((world.x + 2.0) / 8.0, 2.0));
        vec3 color = mix(vec3(.025,.14,.15), vec3(.1,.32,.3), .55 + wave * 2.0);
        color += vec3(.68,.79,.55) * spark * (.15 + path * .6);
        float haze = 1.0 - exp(-length(world.xz - cameraPosition.xz) * .012);
        gl_FragColor = vec4(mix(color, vec3(.12,.23,.27), haze), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  ocean = new THREE.Mesh(new THREE.PlaneGeometry(420, 420, 160, 160), material);
  ocean.rotation.x = -Math.PI / 2; ocean.position.z = -70; scene.add(ocean);
}

function createTemporaryEnvironment() {
  // Temporary spatial framing based on rendered.png, replaced by the real scene GLB.
  const positions = new Float32Array(1500 * 3);
  let seed = 317;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 1500; i++) {
    positions[i * 3] = (random() - .5) * 350;
    positions[i * 3 + 1] = 10 + random() * 145;
    positions[i * 3 + 2] = -50 - random() * 170;
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({color: 0xe7dbcd, size: .26, sizeAttenuation: true})));
  const planetMaterial = new THREE.MeshStandardMaterial({color: 0x988e67, roughness: .85});
  const planet = new THREE.Mesh(new THREE.SphereGeometry(8, 24, 16), planetMaterial);
  planet.position.set(-26, 28, -90); scene.add(planet);
  const ring = new THREE.Mesh(new THREE.RingGeometry(10, 14, 64), new THREE.MeshStandardMaterial({color: 0x978558, roughness: .8, side: THREE.DoubleSide}));
  ring.position.copy(planet.position); ring.rotation.set(-1.3, .1, .25); scene.add(ring);
  for (const [x, y, z, radius, color] of [[30, 40, -110, 5, 0x788b86], [12, 64, -145, 6, 0x887492], [-40, 53, -125, 4, 0x538783]]) {
    const orb = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 12), new THREE.MeshStandardMaterial({color, roughness: .35, metalness: .35}));
    orb.position.set(x, y, z); scene.add(orb);
  }
  for (const sign of [-1, 1]) {
    const column = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 28, 12), new THREE.MeshStandardMaterial({color: 0x755363, roughness: .9}));
    column.position.set(sign * 12, 12, 9); scene.add(column);
    for (let i = 0; i < 8; i++) {
      const gem = new THREE.Mesh(new THREE.IcosahedronGeometry(.7, 1), new THREE.MeshStandardMaterial({color: [0xb9b398, 0x8ca49e, 0xb89d6e][i % 3], roughness: .25, metalness: .6}));
      gem.position.set(sign * 12, 2 + i * 3, 10); scene.add(gem);
    }
    const rockMaterial = new THREE.MeshStandardMaterial({color: 0x4d5648, roughness: 1, flatShading: true});
    for (let i = 0; i < 15; i++) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1, 0), rockMaterial);
      rock.position.set(sign * (12 + random() * 11), random() * 1.2 - .6, -5 - random() * 32);
      rock.scale.set(1 + random() * 4, 1 + random() * 5, 1 + random() * 4);
      rock.rotation.set(random(), random(), random()); scene.add(rock);
    }
  }
}

function screenTexture() {
  const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = 512;
  const ink = canvas.getContext('2d');
  ink.fillStyle = '#122b28'; ink.fillRect(0, 0, 768, 512);
  ink.strokeStyle = '#80b598'; ink.lineWidth = 3; ink.strokeRect(24, 24, 720, 464);
  ink.fillStyle = '#cfe7bb'; ink.textAlign = 'center';
  ink.font = '24px monospace'; ink.fillText('QUELLA.OS / DREAM PORTAL', 384, 85);
  ink.font = '56px Georgia'; ink.fillText('Programming', 384, 220); ink.fillText('Dream', 384, 285);
  ink.font = '20px monospace'; ink.fillText('SCROLL TO ENTER', 384, 420);
  for (let i = 0; i < 512; i += 4) { ink.fillStyle = '#00000018'; ink.fillRect(0, i, 768, 1); }
  const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace; return map;
}

function frame(now) {
  frameId = 0;
  if (!active || view.hidden || document.hidden) return;
  const dt = Math.min(.05, lastTime ? (now - lastTime) / 1000 : .016); lastTime = now;
  progress = reduced.matches ? goal : THREE.MathUtils.damp(progress, goal, 8, dt);
  const state = timeline(progress);
  portal.style.opacity = Math.max(state.light, state.dark);
  portal.style.backgroundColor = new THREE.Color(0xe8ffe9).lerp(new THREE.Color(0x081415), state.dark).getStyle();
  if (renderer && !failed && progress < 1) {
    sceneTime += reduced.matches ? 0 : dt * (1 - smoothRange(progress, .65, .85));
    ocean.material.uniforms.time.value = sceneTime;
    if (computer && screenCenter) {
      // Freeze bobbing near the portal so the screen and camera stay aligned.
      const bob = reduced.matches ? 0 : Math.sin(sceneTime * .75) * .06 * (1 - state.approach);
      computer.position.y = config.computerPosition[1] + config.computerHeight / 2 + bob;
      camera.position.lerpVectors(startPosition, nearPosition, state.approach);
      camera.position.lerp(endPosition, state.enter);
      target.lerpVectors(startTarget, screenCenter, smoothRange(progress, 0, .55));
      drift.lerp(pointer, 1 - Math.exp(-dt * 5));
      const motion = reduced.matches ? 0 : (1 - state.enter) * .24;
      camera.position.x += drift.x * motion;
      camera.position.y -= drift.y * motion;
      // A narrow screen must fill even a portrait viewport before the light transition.
      camera.fov = THREE.MathUtils.lerp(config.fieldOfView, 40, state.enter);
      camera.updateProjectionMatrix(); camera.lookAt(target);
    } else {
      camera.position.copy(startPosition); camera.lookAt(startTarget);
    }
    renderer.render(scene, camera);
  }
  // Sleep once the cinema is out of sight; scrolling back wakes it up.
  if (progress < .9999 || Math.abs(progress - goal) > .0001) schedule();
}
