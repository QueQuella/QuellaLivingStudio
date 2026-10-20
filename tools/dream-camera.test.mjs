import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from '../public/vendor/three.module.js';
import config from '../src/runtime/dream-config.js';
import {timeline} from '../src/runtime/dream-timeline.mjs';

const bytes = fs.readFileSync(new URL('../public/assets/programming-dream/computer.glb', import.meta.url));
const length = bytes.readUInt32LE(12);
const gltf = JSON.parse(bytes.subarray(20, 20 + length));
const bounds = [];
for (const node of gltf.nodes) {
  const accessor = gltf.accessors[gltf.meshes[node.mesh].primitives[0].attributes.POSITION];
  const box = new THREE.Box3(new THREE.Vector3(...accessor.min), new THREE.Vector3(...accessor.max));
  const rotation = new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion(...node.rotation));
  bounds.push({name: node.name, box: box.applyMatrix4(rotation)});
}
const full = new THREE.Box3();
bounds.forEach(({box}) => full.union(box));
const scale = config.computerHeight / full.getSize(new THREE.Vector3()).y;
const center = full.getCenter(new THREE.Vector3());
const position = new THREE.Vector3(...config.computerPosition);
position.y += config.computerHeight / 2;
const screenBox = bounds.find(item => item.name === config.screenName).box.clone();
for (const point of [screenBox.min, screenBox.max]) point.sub(center).multiplyScalar(scale).add(position);
const screen = screenBox.getCenter(new THREE.Vector3());
screen.z = screenBox.max.z + .025;
const near = screen.clone().add(new THREE.Vector3(0, .1, 4.5));
const end = screen.clone().add(new THREE.Vector3(0, 0, .065));

test('camera remains above water and in front of the actual screen throughout entry', () => {
  for (let i = 0; i <= 1000; i++) {
    const state = timeline(i / 1000);
    const camera = new THREE.Vector3(...config.startPosition).lerp(near, state.approach).lerp(end, state.enter);
    assert.ok(camera.y > .15, `Camera crosses water at ${i}`);
    assert.ok(camera.z > screen.z, `Camera crosses screen at ${i}`);
  }
});
test('the portal fills portrait, desktop and wide viewports before the handoff', () => {
  const width = screenBox.getSize(new THREE.Vector3()).x * .88;
  const height = screenBox.getSize(new THREE.Vector3()).y * .82;
  const distance = end.z - screen.z;
  for (const aspect of [.45, .75, 1, 16 / 9, 2.4, 4]) {
    const viewportHeight = 2 * distance * Math.tan(40 * Math.PI / 360);
    assert.ok(height > viewportHeight);
    assert.ok(width > viewportHeight * aspect);
  }
});
