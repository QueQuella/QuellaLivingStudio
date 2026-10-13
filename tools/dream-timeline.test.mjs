import test from 'node:test';
import assert from 'node:assert/strict';
import {timeline} from '../dream-timeline.mjs';

test('the journey starts at sea and completes with an opaque dark portal', () => {
  const start = timeline(0), end = timeline(1);
  assert.equal(start.approach, 0); assert.equal(start.enter, 0);
  assert.equal(start.light, 0); assert.equal(start.dark, 0); assert.equal(start.intro, 1);
  assert.equal(end.approach, 1); assert.equal(end.enter, 1);
  assert.equal(end.light, 1); assert.equal(end.dark, 1); assert.equal(end.intro, 0);
});
test('approach completes before screen entry; darkness follows full portal light', () => {
  assert.equal(timeline(.66).approach, 1);
  assert.equal(timeline(.66).enter, 0);
  assert.equal(timeline(.94).light, 1);
  assert.equal(timeline(.94).dark, 0);
});
test('every scroll stage remains continuous, bounded and monotonic', () => {
  let previous = timeline(0);
  for (let i = 1; i <= 1000; i++) {
    const current = timeline(i / 1000);
    for (const key of ['approach', 'enter', 'light', 'dark']) {
      assert.ok(current[key] >= previous[key]);
      assert.ok(current[key] <= 1 && current[key] >= 0);
      assert.ok(Math.abs(current[key] - previous[key]) < .04);
    }
    previous = current;
  }
});
test('reverse scrolling reconstructs identical states without one-way triggers', () => {
  const forward = Array.from({length: 101}, (_, i) => timeline(i / 100));
  for (let i = 100; i >= 0; i--) assert.deepEqual(timeline(i / 100), forward[i]);
  assert.deepEqual(timeline(-1), timeline(0));
  assert.deepEqual(timeline(2), timeline(1));
});
