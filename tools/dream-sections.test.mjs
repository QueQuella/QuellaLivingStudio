import test from 'node:test';
import assert from 'node:assert/strict';
import {scrollCoordinate, sectionMotion} from '../src/runtime/dream-sections.mjs';

test('nested section coordinates remain stable while their scroll parent moves', () => {
  assert.equal(scrollCoordinate(3876, 76, 0), 3800);
  assert.equal(scrollCoordinate(576, 76, 3300), 3800);
  assert.equal(scrollCoordinate(-324, 76, 4200), 3800);
});
test('a pinned title enters, stays readable, then exits before the next section', () => {
  const top = 4000, viewport = 800, height = 1680;
  assert.equal(sectionMotion(top - viewport, top, height, viewport).title, 0);
  assert.equal(sectionMotion(top, top, height, viewport).title, 1);
  assert.equal(sectionMotion(top + 400, top, height, viewport).title, 1);
  assert.equal(sectionMotion(top + height - viewport, top, height, viewport).title, 0);
});
test('title motion reverses without triggering a second animation or hiding content', () => {
  const states = Array.from({length: 100}, (_, i) => sectionMotion(3000 + i * 24, 3800, 1600, 800));
  for (let i = 99; i >= 0; i--) {
    assert.deepEqual(sectionMotion(3000 + i * 24, 3800, 1600, 800), states[i]);
    assert.ok(states[i].title >= 0 && states[i].title <= 1);
  }
});
