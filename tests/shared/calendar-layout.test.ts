import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { layoutEvents } from '../../src/shared/calendar-layout.js';
import type { CalendarEvent } from '../../src/shared/types.js';

// TZ=America/Los_Angeles is set in the npm test script

// Week of 2026-01-05 (Monday) through 2026-01-11 (Sunday)
const WEEK_START = new Date('2026-01-05T00:00:00');
const BAND_START = '07:00';
const BAND_END = '21:00';

function makeEvent(start: string, end: string, summary = 'Event'): CalendarEvent {
  return { start, end, summary };
}

function makeAllDay(dateStart: string, dateEnd: string, summary = 'AllDay'): CalendarEvent {
  return { start: dateStart, end: dateEnd, summary };
}

describe('layoutEvents', () => {
  it('returns 7 week days', () => {
    const result = layoutEvents([], WEEK_START, BAND_START, BAND_END, 'monday');
    assert.equal(result.weekDays.length, 7);
  });

  it('perDay map has an entry for each of the 7 days', () => {
    const result = layoutEvents([], WEEK_START, BAND_START, BAND_END, 'monday');
    assert.equal(result.perDay.size, 7);
  });

  it('1 in-band event → 1 inBand entry with lane=0, laneCount=1', () => {
    const events = [makeEvent('2026-01-05T10:00:00', '2026-01-05T11:00:00')];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    const day = result.perDay.get('2026-01-05')!;
    assert.equal(day.inBand.length, 1);
    assert.equal(day.inBand[0].lane, 0);
    assert.equal(day.inBand[0].laneCount, 1);
  });

  it('1 in-band event → correct topPercent and heightPercent', () => {
    // Band is 07:00–21:00 = 14 hours = 840 min
    // Event 10:00–11:00 = 3h from start, 1h duration
    // topPercent = 3/14 * 100 = ~21.43%
    // heightPercent = 1/14 * 100 = ~7.14%
    const events = [makeEvent('2026-01-05T10:00:00', '2026-01-05T11:00:00')];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    const block = result.perDay.get('2026-01-05')!.inBand[0];
    const expectedTop = (3 / 14) * 100;
    const expectedHeight = (1 / 14) * 100;
    assert.ok(Math.abs(block.topPercent - expectedTop) < 0.01, `topPercent=${block.topPercent} expected ~${expectedTop}`);
    assert.ok(Math.abs(block.heightPercent - expectedHeight) < 0.01, `heightPercent=${block.heightPercent} expected ~${expectedHeight}`);
  });

  it('2 overlapping events → 2 lanes', () => {
    const events = [
      makeEvent('2026-01-05T10:00:00', '2026-01-05T12:00:00', 'A'),
      makeEvent('2026-01-05T11:00:00', '2026-01-05T13:00:00', 'B'),
    ];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    const day = result.perDay.get('2026-01-05')!;
    assert.equal(day.inBand.length, 2);
    const lanes = new Set(day.inBand.map((b) => b.lane));
    assert.equal(lanes.size, 2);
    for (const b of day.inBand) {
      assert.equal(b.laneCount, 2);
    }
  });

  it('3 mutually overlapping events → 3 lanes', () => {
    const events = [
      makeEvent('2026-01-05T10:00:00', '2026-01-05T13:00:00', 'A'),
      makeEvent('2026-01-05T10:30:00', '2026-01-05T13:30:00', 'B'),
      makeEvent('2026-01-05T11:00:00', '2026-01-05T14:00:00', 'C'),
    ];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    const day = result.perDay.get('2026-01-05')!;
    assert.equal(day.inBand.length, 3);
    const lanes = new Set(day.inBand.map((b) => b.lane));
    assert.equal(lanes.size, 3);
    for (const b of day.inBand) {
      assert.equal(b.laneCount, 3);
    }
  });

  it('event spanning before band start to mid-band → clipped, top at 0%', () => {
    const events = [makeEvent('2026-01-05T05:00:00', '2026-01-05T10:00:00')];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    const day = result.perDay.get('2026-01-05')!;
    assert.equal(day.inBand.length, 1);
    assert.equal(day.inBand[0].topPercent, 0);
    assert.ok(day.inBand[0].heightPercent > 0);
  });

  it('event spanning mid-band to after band end → clipped, bottom at 100%', () => {
    // Band 07:00–21:00. Event 20:00–23:00 → clipped to 20:00–21:00
    // top = (20-7)/(21-7) * 100 = 13/14 * 100
    // height = 1/14 * 100
    // top + height = 14/14 * 100 = 100%
    const events = [makeEvent('2026-01-05T20:00:00', '2026-01-05T23:00:00')];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    const day = result.perDay.get('2026-01-05')!;
    assert.equal(day.inBand.length, 1);
    const block = day.inBand[0];
    assert.ok(Math.abs(block.topPercent + block.heightPercent - 100) < 0.01, `top+height=${block.topPercent + block.heightPercent} should be 100`);
  });

  it('event fully before band start → in earlier bucket', () => {
    const events = [makeEvent('2026-01-05T04:00:00', '2026-01-05T06:00:00')];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    const day = result.perDay.get('2026-01-05')!;
    assert.equal(day.earlier.length, 1);
    assert.equal(day.inBand.length, 0);
  });

  it('event fully after band end → in later bucket', () => {
    const events = [makeEvent('2026-01-05T22:00:00', '2026-01-05T23:30:00')];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    const day = result.perDay.get('2026-01-05')!;
    assert.equal(day.later.length, 1);
    assert.equal(day.inBand.length, 0);
  });

  it('all-day event → in allDay bucket, not inBand', () => {
    const events = [makeAllDay('2026-01-05', '2026-01-06')];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    const day = result.perDay.get('2026-01-05')!;
    assert.equal(day.allDay.length, 1);
    assert.equal(day.inBand.length, 0);
  });

  it('all-day event only appears on the correct day(s)', () => {
    // Single-day all-day: start=Jan5, end=Jan6 (exclusive end)
    const events = [makeAllDay('2026-01-05', '2026-01-06')];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    // Jan 5 should have it
    assert.equal(result.perDay.get('2026-01-05')!.allDay.length, 1);
    // Jan 6 should NOT
    assert.equal(result.perDay.get('2026-01-06')!.allDay.length, 0);
  });

  it('multi-day all-day event spans multiple days', () => {
    // Jan 5–7 (exclusive end Jan 8)
    const events = [makeAllDay('2026-01-05', '2026-01-08')];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    assert.equal(result.perDay.get('2026-01-05')!.allDay.length, 1);
    assert.equal(result.perDay.get('2026-01-06')!.allDay.length, 1);
    assert.equal(result.perDay.get('2026-01-07')!.allDay.length, 1);
    assert.equal(result.perDay.get('2026-01-08')!.allDay.length, 0);
  });

  it('multi-day timed event appears in each covered day inBand', () => {
    // Event spans Mon–Tue, well within band both days
    const events = [makeEvent('2026-01-05T09:00:00', '2026-01-06T17:00:00')];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    assert.equal(result.perDay.get('2026-01-05')!.inBand.length, 1);
    assert.equal(result.perDay.get('2026-01-06')!.inBand.length, 1);
  });

  it('event outside the visible week → not placed in any day', () => {
    const events = [makeEvent('2026-01-12T09:00:00', '2026-01-12T10:00:00')];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    for (const day of result.perDay.values()) {
      assert.equal(day.inBand.length, 0);
      assert.equal(day.allDay.length, 0);
    }
  });

  it('disjoint clusters have independent laneCount (not day-global max)', () => {
    // Morning cluster: A and B overlap (need 2 lanes)
    // Afternoon cluster: C, D, E mutually overlap (need 3 lanes)
    // Morning blocks should report laneCount=2, afternoon blocks laneCount=3
    const events = [
      makeEvent('2026-01-05T09:00:00', '2026-01-05T10:00:00', 'A'),
      makeEvent('2026-01-05T09:30:00', '2026-01-05T10:30:00', 'B'),
      makeEvent('2026-01-05T13:00:00', '2026-01-05T15:00:00', 'C'),
      makeEvent('2026-01-05T13:15:00', '2026-01-05T15:15:00', 'D'),
      makeEvent('2026-01-05T13:30:00', '2026-01-05T15:30:00', 'E'),
    ];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    const day = result.perDay.get('2026-01-05')!;
    assert.equal(day.inBand.length, 5);

    const morning = day.inBand.filter((b) => b.event.summary === 'A' || b.event.summary === 'B');
    const afternoon = day.inBand.filter((b) => ['C', 'D', 'E'].includes(b.event.summary));

    for (const b of morning) {
      assert.equal(b.laneCount, 2, `Morning block ${b.event.summary} should have laneCount=2`);
    }
    for (const b of afternoon) {
      assert.equal(b.laneCount, 3, `Afternoon block ${b.event.summary} should have laneCount=3`);
    }
  });

  it('overlapping events in unsorted input order get distinct lanes', () => {
    // Input order: mid, earliest, latest — the two earliest overlap
    const events = [
      makeEvent('2026-01-05T09:30:00', '2026-01-05T10:30:00', 'Mid'),
      makeEvent('2026-01-05T09:00:00', '2026-01-05T10:00:00', 'Early'),
      makeEvent('2026-01-05T11:00:00', '2026-01-05T12:00:00', 'Late'),
    ];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    const day = result.perDay.get('2026-01-05')!;
    assert.equal(day.inBand.length, 3);
    // Mid and Early overlap → distinct lanes, cluster laneCount=2
    const midBlock = day.inBand.find((b) => b.event.summary === 'Mid')!;
    const earlyBlock = day.inBand.find((b) => b.event.summary === 'Early')!;
    const lateBlock = day.inBand.find((b) => b.event.summary === 'Late')!;
    assert.notEqual(midBlock.lane, earlyBlock.lane);
    assert.equal(midBlock.laneCount, 2);
    assert.equal(earlyBlock.laneCount, 2);
    // Late is disjoint → its own cluster with laneCount=1
    assert.equal(lateBlock.laneCount, 1);
  });

  it('non-overlapping events share the same lane sequentially (lane reuse)', () => {
    // A: 10:00–11:00, B: 12:00–13:00 — they don't overlap so both get lane 0
    const events = [
      makeEvent('2026-01-05T10:00:00', '2026-01-05T11:00:00', 'A'),
      makeEvent('2026-01-05T12:00:00', '2026-01-05T13:00:00', 'B'),
    ];
    const result = layoutEvents(events, WEEK_START, BAND_START, BAND_END, 'monday');
    const day = result.perDay.get('2026-01-05')!;
    assert.equal(day.inBand.length, 2);
    // Both should be lane 0 since they don't overlap
    assert.equal(day.inBand[0].lane, 0);
    assert.equal(day.inBand[1].lane, 0);
    assert.equal(day.inBand[0].laneCount, 1);
    assert.equal(day.inBand[1].laneCount, 1);
  });
});
