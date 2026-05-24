import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { fetchCalendarEvents, deleteCalendarEvent, entitySupportsDelete } from '../../src/shared/ha-subscriptions.js';
import type { HomeAssistant } from '../../src/shared/types.js';
import { makeFakeHass } from '../setup/ha-mock.mjs';
import type { FakeHass } from '../setup/ha-mock.mjs';

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
  const base: FakeHass = makeFakeHass();
  const calls: ApiCallRecord[] = [];
  base.callApi = async (method: string, path: string) => {
    calls.push({ method, path });
    const result = await handler(path);
    if (result instanceof Error) throw result;
    return result;
  };
  return { hass: base as unknown as HomeAssistant, calls };
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

  // Regression guard: an earlier version of this fetcher used
  // `hass.connection.sendMessagePromise({type: 'call_service', service:
  // 'calendar.get_events', return_response: true, ...})`. The service-call
  // response deliberately STRIPS uid from events, which broke delete (no uid
  // to address the event with). The fix is the REST endpoint
  // `/api/calendars/<entity>` — see commit `ae86d62f` and the JSDoc on
  // `fetchCalendarEvents`. This test fails if someone reverts the fetcher
  // to either the call_service WS path or the `callService` helper.
  it('regression: uses hass.callApi (REST), NOT callService or sendMessagePromise', async () => {
    let callApiCalls = 0;
    let sendMessageCalls = 0;
    let callServiceCalls = 0;
    const base: FakeHass = makeFakeHass();
    base.callApi = async () => { callApiCalls++; return []; };
    base.callService = async () => { callServiceCalls++; };
    base.connection.sendMessagePromise = async () => { sendMessageCalls++; return undefined; };
    await fetchCalendarEvents(base as unknown as HomeAssistant, ['calendar.family'], START, END);
    assert.equal(callApiCalls, 1, 'callApi must be the fetch path (REST endpoint returns uid)');
    assert.equal(sendMessageCalls, 0, 'sendMessagePromise must NOT be used — HA call_service strips uid');
    assert.equal(callServiceCalls, 0, 'callService must NOT be used for the same reason');
  });
});

describe('deleteCalendarEvent', () => {
  function makeDeleteHass(): {
    hass: HomeAssistant;
    msgs: Array<Record<string, unknown>>;
    rejectNext: boolean;
  } {
    const base: FakeHass = makeFakeHass();
    const msgs: Array<Record<string, unknown>> = [];
    let rejectNext = false;
    base.connection.sendMessagePromise = async (msg: unknown) => {
      msgs.push(msg as Record<string, unknown>);
      if (rejectNext) throw new Error('ws command failed');
    };
    return {
      hass: base as unknown as HomeAssistant,
      msgs,
      get rejectNext() { return rejectNext; },
      set rejectNext(v) { rejectNext = v; },
    };
  }

  it('sends calendar/event/delete WebSocket command with uid and entity_id', async () => {
    const { hass, msgs } = makeDeleteHass();
    await deleteCalendarEvent(hass, 'calendar.family', 'abc-123');

    assert.equal(msgs.length, 1);
    assert.equal(msgs[0].type, 'calendar/event/delete');
    assert.equal(msgs[0].entity_id, 'calendar.family');
    assert.equal(msgs[0].uid, 'abc-123');
    assert.equal(msgs[0].recurrence_id, undefined, 'no recurrence_id by default');
    assert.equal(msgs[0].recurrence_range, undefined, 'no recurrence_range by default');
  });

  it('forwards optional recurrence_id and recurrence_range for recurring-event variants', async () => {
    const { hass, msgs } = makeDeleteHass();
    await deleteCalendarEvent(hass, 'calendar.family', 'abc-123', 'rec-1', 'THISANDFUTURE');

    assert.equal(msgs[0].recurrence_id, 'rec-1');
    assert.equal(msgs[0].recurrence_range, 'THISANDFUTURE');
  });

  it('rejects with the same error when the WS command rejects', async () => {
    const stub = makeDeleteHass();
    stub.rejectNext = true;
    await assert.rejects(
      () => deleteCalendarEvent(stub.hass, 'calendar.family', 'abc-123'),
      /ws command failed/,
    );
  });

  // Regression guard for the actual bug we shipped: an earlier version of this
  // helper called `hass.callService('calendar', 'delete_event', ...)`, but
  // `calendar.delete_event` is NOT a registered HA service (only
  // `calendar.create_event` and `calendar.get_events` exist — confirmed via
  // `ha_list_services`). HA's frontend deletes via the
  // `calendar/event/delete` WebSocket command. This test fails if someone
  // re-introduces the service-call path.
  it('regression: does NOT call hass.callService (HA has no calendar.delete_event service)', async () => {
    let callServiceCalls = 0;
    const base: FakeHass = makeFakeHass();
    base.callService = async () => { callServiceCalls++; };
    base.connection.sendMessagePromise = async () => undefined;
    await deleteCalendarEvent(base as unknown as HomeAssistant, 'calendar.family', 'abc-123');
    assert.equal(callServiceCalls, 0, 'callService must not be called — delete is a WS command');
  });
});

describe('entitySupportsDelete', () => {
  function makeStateHass(entityId: string, supportedFeatures: unknown): HomeAssistant {
    const base: FakeHass = makeFakeHass();
    // Cast through unknown to allow non-number values (e.g. 'yes') in negative test cases.
    base.states[entityId] = {
      attributes: { supported_features: supportedFeatures },
    } as unknown as import('home-assistant-js-websocket').HassEntity;
    return base as unknown as HomeAssistant;
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
    const base: FakeHass = makeFakeHass();
    assert.equal(entitySupportsDelete(base as unknown as HomeAssistant, 'calendar.missing'), false);
  });
});
