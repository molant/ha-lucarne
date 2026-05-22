import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isAllDone } from '../../src/shared/chore-helpers.js';

describe('isAllDone', () => {
  it('returns false for empty array', () => {
    assert.strictEqual(isAllDone([]), false);
  });

  it('returns true when all chores are on', () => {
    assert.strictEqual(isAllDone([{ state: 'on' }, { state: 'on' }]), true);
  });

  it('returns false when any chore is off', () => {
    assert.strictEqual(isAllDone([{ state: 'on' }, { state: 'off' }]), false);
  });

  it('returns false when a chore is unavailable', () => {
    assert.strictEqual(isAllDone([{ state: 'unavailable' }]), false);
  });

  it('returns false when a chore is unknown', () => {
    assert.strictEqual(isAllDone([{ state: 'unknown' }]), false);
  });

  it('returns false when mix of on and unavailable', () => {
    assert.strictEqual(isAllDone([{ state: 'on' }, { state: 'unavailable' }]), false);
  });

  it('returns true for single on chore', () => {
    assert.strictEqual(isAllDone([{ state: 'on' }]), true);
  });
});
