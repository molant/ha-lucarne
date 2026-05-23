import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { snapToDay, rubberBand } from '../../src/shared/pan-math.js';

describe('snapToDay', () => {
  it('snapToDay(0, 150, 0) → 0 days', () => {
    assert.equal(snapToDay(0, 150, 0), 0);
  });

  it('snapToDay(80, 150, 0) → 1 day (more than half a column)', () => {
    assert.equal(snapToDay(80, 150, 0), 1);
  });

  it('snapToDay(70, 150, 0) → 0 days (less than half)', () => {
    assert.equal(snapToDay(70, 150, 0), 0);
  });

  it('snapToDay(50, 150, +800) → 1 day (velocity overcomes the threshold)', () => {
    assert.equal(snapToDay(50, 150, 800), 1);
  });

  it('snapToDay(-50, 150, -800) → -1 day', () => {
    assert.equal(snapToDay(-50, 150, -800), -1);
  });

  it('snapToDay(0, 0, 0) → 0 (dayWidthPx <= 0 guard)', () => {
    assert.equal(snapToDay(0, 0, 0), 0);
  });

  it('snapToDay(200, 0, 0) → 0 (dayWidthPx <= 0 guard)', () => {
    assert.equal(snapToDay(200, 0, 0), 0);
  });

  it('velocity exactly at threshold (500 px/s) → velocity-snap applies', () => {
    // |500| >= 500 → round in direction of motion: positive velocity + positive delta
    assert.equal(snapToDay(10, 150, 500), 1);
  });

  it('velocity just below threshold (499 px/s) → standard round applies', () => {
    // 10/150 = 0.067 → rounds to 0
    assert.equal(snapToDay(10, 150, 499), 0);
  });
});

describe('rubberBand', () => {
  it('deltaPx within bound → returns deltaPx unchanged', () => {
    assert.equal(rubberBand(50, 100), 50);
    assert.equal(rubberBand(-50, 100), -50);
    assert.equal(rubberBand(100, 100), 100);
  });

  it('deltaPx beyond bound → linear up to bound, then 1/3 rate', () => {
    // deltaPx=130, maxPx=100 → overshoot=30 → 100 + 30*0.33 = 109.9
    assert.ok(Math.abs(rubberBand(130, 100) - 109.9) < 0.01, `expected ~109.9 got ${rubberBand(130, 100)}`);
  });

  it('negative overshoot mirrors positive', () => {
    const pos = rubberBand(130, 100);
    const neg = rubberBand(-130, 100);
    assert.ok(Math.abs(pos + neg) < 0.001, `expected symmetric result, got +${pos} / ${neg}`);
  });

  it('zero deltaPx → 0', () => {
    assert.equal(rubberBand(0, 100), 0);
  });

  it('zero maxPx → full 1/3 from the start', () => {
    // maxPx=0 → overshoot = |50| - 0 = 50 → 0 + 50*0.33 = 16.5
    assert.ok(Math.abs(rubberBand(50, 0) - 16.5) < 0.01, `expected ~16.5 got ${rubberBand(50, 0)}`);
  });
});
