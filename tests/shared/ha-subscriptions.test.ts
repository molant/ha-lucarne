import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { fetchCalendarEvents, deleteCalendarEvent, entitySupportsDelete } from '../../src/shared/ha-subscriptions.js';
import type { HomeAssistant } from '../../src/shared/types.js';

// Raw event shape returned by HA's REST endpoint /api/calendars/<entity_id>.
// Matches Google-Calendar-v3-style nesting for start/end.
type RawEvent = {
  start: string | { dateTime?: string; date?: string };
  end: string | { dateTime?: string; date?: string };
  summary?: string;
  description?: string;
  location?: string;
  uid?: string;
  recurrence_id?: string | null;
  rrule?: string | null;
};

type ApiCallRecord = { method: string; path: string };
type ApiResult = RawEvent[] | Error;

function makeHass(handler: (path: string) => Promise<ApiResult>): {
  hass: HomeAssistant;
  calls: ApiCallRecord[];
} {
  const calls: ApiCallRecord[] = [];
  const hass = {
    callApi: async <T,>(method: string, path: string): Promise<T> => {
      calls.push({ method, path });
      const result = await handler(path);
      if (result instanceof Error) throw result;
      return result as T;
    },
  } as unknown as HomeAssistant;
  return { hass, calls };
}

const START = new Date('2026-05-18T00:00:00Z');
const END = new Date('2026-05-25T00:00:00Z');

describe('fetchCalendarEvents', () => {
  // Restore console.warn in afterEach so an assertion that throws mid-test
  // can't leak the stub into later tests (in this file or sibling files).
  let warnCalls: unknown[][];
  const originalWarn = console.warn;
  beforeEach(() => {
    warnCalls = [];
    console.warn = (...args: unknown[]) => warnCalls.push(args);
  });
  afterEach(() => {
    console.warn = originalWarn;
  });

  it('calls GET /api/calendars/<entity>?start=...&end=... with URL-encoded ISO times', async () => {
    const { hass, calls } = makeHass(async () => []);
    await fetchCalendarEvents(hass, ['calendar.family'], START, END);

    assert.equal(calls.length, 1);
    assert.equal(calls[0].method, 'GET');
    assert.match(calls[0].path, /^calendars\/calendar\.family\?start=.+&end=.+$/);
    // URL-encoded ISO strings: ':' → '%3A'
    assert.ok(calls[0].path.includes(encodeURIComponent(START.toISOString())));
    assert.ok(calls[0].path.includes(encodeURIComponent(END.toISOString())));
  });

  it('normalises nested {dateTime} shape to flat string + preserves uid for timed events', async () => {
    const peloton: RawEvent = {
      start: { dateTime: '2026-05-22T09:00:00-07:00' },
      end: { dateTime: '2026-05-22T10:00:00-07:00' },
      summary: 'Peloton',
      uid: 'peloton-uid-123@google.com',
    };
    const { hass } = makeHass(async () => [peloton]);
    const result = await fetchCalendarEvents(hass, ['calendar.ingrid'], START, END);

    const events = result.events.get('calendar.ingrid')!;
    assert.equal(events.length, 1);
    assert.equal(events[0].start, '2026-05-22T09:00:00-07:00');
    assert.equal(events[0].end, '2026-05-22T10:00:00-07:00');
    assert.equal(events[0].summary, 'Peloton');
    assert.equal(events[0].uid, 'peloton-uid-123@google.com', 'uid is preserved end-to-end (the whole point of the REST switch)');
    assert.equal(result.failed.size, 0);
  });

  it('normalises nested {date} shape (all-day events) to flat YYYY-MM-DD string', async () => {
    const birthday: RawEvent = {
      start: { date: '2026-05-25' },
      end: { date: '2026-05-26' },
      summary: 'Birthday',
      uid: 'bday@local',
    };
    const { hass } = makeHass(async () => [birthday]);
    const result = await fetchCalendarEvents(hass, ['calendar.family'], START, END);

    const events = result.events.get('calendar.family')!;
    assert.equal(events[0].start, '2026-05-25');
    assert.equal(events[0].end, '2026-05-26');
  });

  it('accepts flat-string start/end (forward-compat with integrations that already flatten)', async () => {
    const raw: RawEvent = {
      start: '2026-05-22T09:00:00-07:00',
      end: '2026-05-22T10:00:00-07:00',
      summary: 'Flat',
    };
    const { hass } = makeHass(async () => [raw]);
    const result = await fetchCalendarEvents(hass, ['calendar.x'], START, END);
    const e = result.events.get('calendar.x')![0];
    assert.equal(e.start, '2026-05-22T09:00:00-07:00');
    assert.equal(e.end, '2026-05-22T10:00:00-07:00');
  });

  it('preserves recurrence_id and rrule when present; converts null to undefined', async () => {
    const recurring: RawEvent = {
      start: { dateTime: '2026-05-22T09:00:00Z' },
      end: { dateTime: '2026-05-22T10:00:00Z' },
      summary: 'Weekly',
      uid: 'r1',
      rrule: 'FREQ=WEEKLY',
      recurrence_id: null,
    };
    const { hass } = makeHass(async () => [recurring]);
    const events = (await fetchCalendarEvents(hass, ['calendar.x'], START, END)).events.get('calendar.x')!;
    assert.equal(events[0].rrule, 'FREQ=WEEKLY');
    assert.equal(events[0].recurrence_id, undefined, 'null becomes undefined');
  });

  it('returns empty array (no throw) when the REST call rejects, and logs + tracks the entity', async () => {
    const { hass } = makeHass(async () => new Error('boom'));
    const result = await fetchCalendarEvents(hass, ['calendar.broken'], START, END);

    assert.deepEqual(result.events.get('calendar.broken'), []);
    assert.ok(result.failed.has('calendar.broken'), 'failed entity tracked in result.failed');
    assert.equal(warnCalls.length, 1);
    assert.match(String(warnCalls[0][0]), /\/api\/calendars\/calendar\.broken failed/);
  });

  it('isolates per-entity failures — one rejection does not poison the batch', async () => {
    const okEvent: RawEvent = {
      start: { dateTime: '2026-05-22T09:00:00Z' },
      end: { dateTime: '2026-05-22T10:00:00Z' },
      summary: 'ok',
      uid: 'ok-uid',
    };
    const { hass } = makeHass(async (path) => {
      if (path.includes('calendar.bad')) return new Error('nope');
      return [okEvent];
    });
    const result = await fetchCalendarEvents(hass, ['calendar.ok', 'calendar.bad'], START, END);

    assert.equal(result.events.get('calendar.ok')?.length, 1);
    assert.deepEqual(result.events.get('calendar.bad'), []);
    assert.ok(result.failed.has('calendar.bad'), 'failed entity tracked');
    assert.equal(result.failed.has('calendar.ok'), false, 'successful entity NOT in failed set');
  });
});

describe('deleteCalendarEvent', () => {
  function makeDeleteHass(): {
    hass: HomeAssistant;
    calls: Array<{ domain: string; service: string; serviceData: unknown; target: unknown }>;
    rejectNext: boolean;
  } {
    const calls: Array<{ domain: string; service: string; serviceData: unknown; target: unknown }> = [];
    let rejectNext = false;
    const hass = {
      callService: async (domain: string, service: string, serviceData: unknown, target: unknown) => {
        calls.push({ domain, service, serviceData, target });
        if (rejectNext) throw new Error('service failed');
      },
    } as unknown as HomeAssistant;
    return { hass, calls, get rejectNext() { return rejectNext; }, set rejectNext(v) { rejectNext = v; } };
  }

  it('calls hass.callService with correct domain, service, uid, and entity_id', async () => {
    const { hass, calls } = makeDeleteHass();
    await deleteCalendarEvent(hass, 'calendar.family', 'abc-123');

    assert.equal(calls.length, 1);
    assert.equal(calls[0].domain, 'calendar');
    assert.equal(calls[0].service, 'delete_event');
    assert.deepEqual(calls[0].serviceData, { uid: 'abc-123' });
    assert.deepEqual(calls[0].target, { entity_id: 'calendar.family' });
  });

  it('rejects with the same error when callService rejects', async () => {
    const stub = makeDeleteHass();
    stub.rejectNext = true;
    await assert.rejects(
      () => deleteCalendarEvent(stub.hass, 'calendar.family', 'abc-123'),
      /service failed/,
    );
  });
});

describe('entitySupportsDelete', () => {
  function makeStateHass(entityId: string, supportedFeatures: unknown): HomeAssistant {
    return {
      states: {
        [entityId]: {
          attributes: { supported_features: supportedFeatures },
        },
      },
    } as unknown as HomeAssistant;
  }

  it('returns true when supported_features includes bit 2 (DELETE)', () => {
    const hass = makeStateHass('calendar.family', 3); // bits: 1 (CREATE) + 2 (DELETE)
    assert.equal(entitySupportsDelete(hass, 'calendar.family'), true);
  });

  it('returns true when supported_features is exactly 2', () => {
    const hass = makeStateHass('calendar.family', 2);
    assert.equal(entitySupportsDelete(hass, 'calendar.family'), true);
  });

  it('returns false when bit 2 is absent (CREATE+UPDATE only)', () => {
    const hass = makeStateHass('calendar.family', 5); // bits: 1 (CREATE) + 4 (UPDATE)
    assert.equal(entitySupportsDelete(hass, 'calendar.family'), false);
  });

  it('returns false when supported_features is 0', () => {
    const hass = makeStateHass('calendar.family', 0);
    assert.equal(entitySupportsDelete(hass, 'calendar.family'), false);
  });

  it('returns false when supported_features is not a number', () => {
    const hass = makeStateHass('calendar.family', 'yes');
    assert.equal(entitySupportsDelete(hass, 'calendar.family'), false);
  });

  it('returns false when entity does not exist in hass.states', () => {
    const hass = { states: {} } as unknown as HomeAssistant;
    assert.equal(entitySupportsDelete(hass, 'calendar.missing'), false);
  });
});
