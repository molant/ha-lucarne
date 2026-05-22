import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { filterAndSortEvents } from '../../src/components/agenda-strip.js';
import type { CalendarEvent } from '../../src/shared/types.js';

function makeEvent(start: string, end: string, summary = 'Test'): CalendarEvent {
  return { start, end, summary };
}

const now = new Date('2026-05-21T10:00:00.000Z');

describe('filterAndSortEvents', () => {
  it('returns empty array for no events', () => {
    assert.deepEqual(filterAndSortEvents([], now, 5), []);
  });

  it('filters out events that have already ended', () => {
    const events = [
      makeEvent('2026-05-21T07:00:00Z', '2026-05-21T09:00:00Z', 'Past'),
      makeEvent('2026-05-21T11:00:00Z', '2026-05-21T12:00:00Z', 'Future'),
    ];
    const result = filterAndSortEvents(events, now, 5);
    assert.equal(result.length, 1);
    assert.equal(result[0].summary, 'Future');
  });

  it('includes events that are currently happening', () => {
    const events = [makeEvent('2026-05-21T09:30:00Z', '2026-05-21T10:30:00Z', 'Active')];
    const result = filterAndSortEvents(events, now, 5);
    assert.equal(result.length, 1);
    assert.equal(result[0].summary, 'Active');
  });

  it('sorts events by start time', () => {
    const events = [
      makeEvent('2026-05-21T14:00:00Z', '2026-05-21T15:00:00Z', 'C'),
      makeEvent('2026-05-21T11:00:00Z', '2026-05-21T12:00:00Z', 'A'),
      makeEvent('2026-05-21T13:00:00Z', '2026-05-21T14:00:00Z', 'B'),
    ];
    const result = filterAndSortEvents(events, now, 5);
    assert.deepEqual(result.map((e) => e.summary), ['A', 'B', 'C']);
  });

  it('respects the limit', () => {
    const events = Array.from({ length: 10 }, (_, i) => {
      const h = String(i + 11).padStart(2, '0');
      return makeEvent(`2026-05-21T${h}:00:00Z`, `2026-05-21T${h}:30:00Z`, `Event${i}`);
    });
    const result = filterAndSortEvents(events, now, 3);
    assert.equal(result.length, 3);
  });

  it('returns all if events count is less than limit', () => {
    const events = [
      makeEvent('2026-05-21T11:00:00Z', '2026-05-21T12:00:00Z', 'One'),
      makeEvent('2026-05-21T13:00:00Z', '2026-05-21T14:00:00Z', 'Two'),
    ];
    const result = filterAndSortEvents(events, now, 10);
    assert.equal(result.length, 2);
  });
});
