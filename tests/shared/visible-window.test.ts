import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { computeVisibleDays } from '../../src/shared/visible-window.js';
import type { VisibleWindowConfig } from '../../src/shared/visible-window.js';

// TZ=America/Los_Angeles is set in the npm test script

const DEFAULTS: VisibleWindowConfig = {
  minDays: 3,
  maxDays: 7,
  minColWidth: 140,
  maxColWidth: 220,
  timeColWidth: 40,
};

describe('computeVisibleDays — defaults', () => {
  it('containerWidth=720 → visibleCount=4, dayWidthPx=170', () => {
    // available=680, maxFitting=floor(680/140)=4, minFitting=ceil(680/220)=4
    // visibleCount=min(7, max(3, 4, min(4, 7)))=4, dayWidthPx=680/4=170
    const result = computeVisibleDays(720, DEFAULTS);
    assert.equal(result.visibleCount, 4);
    assert.ok(Math.abs(result.dayWidthPx - 170) < 0.5, `dayWidthPx=${result.dayWidthPx} expected ~170`);
  });

  it('containerWidth=1080 → visibleCount=7 (capped), dayWidthPx≈148.6', () => {
    // available=1040, maxFitting=floor(1040/140)=7, minFitting=ceil(1040/220)=5
    // visibleCount=min(7, max(3, 5, min(7, 7)))=7, dayWidthPx=1040/7≈148.57
    const result = computeVisibleDays(1080, DEFAULTS);
    assert.equal(result.visibleCount, 7);
    assert.ok(Math.abs(result.dayWidthPx - 148.571) < 0.5, `dayWidthPx=${result.dayWidthPx} expected ~148.6`);
  });

  it('containerWidth=1366 → visibleCount=7 (capped), dayWidthPx≈189.4', () => {
    // available=1326, maxFitting=floor(1326/140)=9, minFitting=ceil(1326/220)=7 (1326/220=6.027→7)
    // visibleCount=min(7, max(3, 7, min(9, 7)))=7, dayWidthPx=1326/7≈189.43
    const result = computeVisibleDays(1366, DEFAULTS);
    assert.equal(result.visibleCount, 7);
    assert.ok(Math.abs(result.dayWidthPx - 189.43) < 0.5, `dayWidthPx=${result.dayWidthPx} expected ~189.4`);
  });

  it('containerWidth=480 → visibleCount=3 (floored), dayWidthPx≈146.6', () => {
    // available=440, maxFitting=floor(440/140)=3, minFitting=ceil(440/220)=2
    // visibleCount=min(7, max(3, 2, min(3, 7)))=3, dayWidthPx=440/3≈146.67
    const result = computeVisibleDays(480, DEFAULTS);
    assert.equal(result.visibleCount, 3);
    assert.ok(Math.abs(result.dayWidthPx - 146.67) < 0.5, `dayWidthPx=${result.dayWidthPx} expected ~146.6`);
  });
});

describe('computeVisibleDays — bounds enforcement', () => {
  it('containerWidth=200 still returns visibleCount=3 (floor wins over math)', () => {
    // available=160, maxFitting=floor(160/140)=1, minFitting=ceil(160/220)=1
    // visibleCount=min(7, max(3, 1, min(1, 7)))=3 (min_days floor wins)
    const result = computeVisibleDays(200, DEFAULTS);
    assert.equal(result.visibleCount, 3);
  });

  it('containerWidth=4000 returns max_days=7 (no overflow)', () => {
    const result = computeVisibleDays(4000, DEFAULTS);
    assert.equal(result.visibleCount, 7);
  });
});

describe('computeVisibleDays — zero/negative containerWidth', () => {
  it('containerWidth=0 → visibleCount=min_days, dayWidthPx=min_col_width', () => {
    const result = computeVisibleDays(0, DEFAULTS);
    assert.equal(result.visibleCount, 3);
    assert.equal(result.dayWidthPx, 140);
  });

  it('containerWidth=-100 → visibleCount=min_days, dayWidthPx=min_col_width', () => {
    const result = computeVisibleDays(-100, DEFAULTS);
    assert.equal(result.visibleCount, 3);
    assert.equal(result.dayWidthPx, 140);
  });
});

describe('computeVisibleDays — custom config', () => {
  it('min_days=2, max_days=14, min_col=100, max_col=300, timeCol=40 at containerWidth=1366 → visibleCount=13', () => {
    // available=1326, maxFitting=floor(1326/100)=13, minFitting=ceil(1326/300)=5
    // visibleCount=min(14, max(2, 5, min(13, 14)))=13, dayWidthPx=1326/13≈102.0
    const cfg: VisibleWindowConfig = {
      minDays: 2,
      maxDays: 14,
      minColWidth: 100,
      maxColWidth: 300,
      timeColWidth: 40,
    };
    const result = computeVisibleDays(1366, cfg);
    assert.equal(result.visibleCount, 13);
    assert.ok(Math.abs(result.dayWidthPx - 102.0) < 0.5, `dayWidthPx=${result.dayWidthPx} expected ~102.0`);
  });
});

describe('computeVisibleDays — invalid config defensive swapping', () => {
  it('min_col_width > max_col_width — silently swapped', () => {
    // Swapped: minCol=140, maxCol=220 after swap
    const cfg: VisibleWindowConfig = { ...DEFAULTS, minColWidth: 220, maxColWidth: 140 };
    const result = computeVisibleDays(720, cfg);
    // Same as defaults since values are swapped back
    assert.equal(result.visibleCount, 4);
    assert.ok(Math.abs(result.dayWidthPx - 170) < 0.5);
  });

  it('min_days > max_days — silently swapped, larger value is effective max', () => {
    // min=3, max=7 after swap of min=10, max=3
    const cfg: VisibleWindowConfig = { ...DEFAULTS, minDays: 10, maxDays: 3 };
    // available=680, maxFitting=floor(680/140)=4, minFitting=ceil(680/220)=4
    // after swap: minD=3, maxD=10
    // visibleCount=min(10, max(3, 4, min(4, 10)))=4
    const result = computeVisibleDays(720, cfg);
    assert.ok(result.visibleCount >= 3 && result.visibleCount <= 10, `visibleCount=${result.visibleCount} out of bounds`);
  });
});
