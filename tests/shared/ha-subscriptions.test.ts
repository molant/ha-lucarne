import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { fetchCalendarEvents, deleteCalendarEvent, entitySupportsDelete } from '../../src/shared/ha-subscriptions.js';
import type { HomeAssistant } from '../../src/shared/types.js';

interface SentMessage {
  type: string;
  domain: string;
  service: string;
  service_data: { start_date_time: string; end_date_time: string };
  target: { entity_id: string };
  return_response: boolean;
}

type MessageResponse = { response: Record<string, { events: unknown[] }> } | Error;

function makeHass(handler: (msg: SentMessage) => Promise<MessageResponse>): {
  hass: HomeAssistant;
  sent: SentMessage[];
} {
  const sent: SentMessage[] = [];
  const hass = {
    connection: {
      sendMessagePromise: async (msg: SentMessage) => {
        sent.push(msg);
        const result = await handler(msg);
        if (result instanceof Error) throw result;
        return result;
      },
    },
  } as unknown as HomeAssistant;
  return { hass, sent };
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

  it('dispatches calendar.get_events with return_response and ISO times', async () => {
    const { hass, sent } = makeHass(async (msg) => ({
      response: { [msg.target.entity_id]: { events: [] } },
    }));
    await fetchCalendarEvents(hass, ['calendar.family'], START, END);

    assert.equal(sent.length, 1);
    assert.equal(sent[0].type, 'call_service');
    assert.equal(sent[0].domain, 'calendar');
    assert.equal(sent[0].service, 'get_events');
    assert.equal(sent[0].return_response, true);
    assert.deepEqual(sent[0].target, { entity_id: 'calendar.family' });
    assert.equal(sent[0].service_data.start_date_time, START.toISOString());
    assert.equal(sent[0].service_data.end_date_time, END.toISOString());
  });

  it('unwraps response keyed by entity_id and returns a Map', async () => {
    const peloton = { start: '2026-05-22T09:00:00-07:00', end: '2026-05-22T10:00:00-07:00', summary: 'Peloton' };
    const smoke = { start: '2026-05-22T10:00:00-07:00', end: '2026-05-22T11:00:00-07:00', summary: 'smoke' };
    const eventsByEntity: Record<string, unknown[]> = {
      'calendar.ingrid': [peloton],
      'calendar.family': [smoke],
    };
    const { hass } = makeHass(async (msg) => ({
      response: { [msg.target.entity_id]: { events: eventsByEntity[msg.target.entity_id] ?? [] } },
    }));

    const result = await fetchCalendarEvents(
      hass,
      ['calendar.ingrid', 'calendar.family'],
      START,
      END,
    );

    assert.equal(result.events.size, 2);
    assert.deepEqual(result.events.get('calendar.ingrid'), [peloton]);
    assert.deepEqual(result.events.get('calendar.family'), [smoke]);
    assert.equal(result.failed.size, 0, 'no failures expected on success');
  });

  it('returns empty array (no throw) when the service call rejects, and logs a warning', async () => {
    const { hass } = makeHass(async () => new Error('boom'));
    const result = await fetchCalendarEvents(hass, ['calendar.broken'], START, END);

    assert.deepEqual(result.events.get('calendar.broken'), []);
    assert.ok(result.failed.has('calendar.broken'), 'failed entity tracked in result.failed');
    assert.equal(warnCalls.length, 1);
    assert.match(String(warnCalls[0][0]), /calendar\.get_events failed for calendar\.broken/);
  });

  it('returns empty array when response is missing the entity key', async () => {
    const { hass } = makeHass(async () => ({ response: {} }));
    const result = await fetchCalendarEvents(hass, ['calendar.missing'], START, END);
    assert.deepEqual(result.events.get('calendar.missing'), []);
    assert.equal(result.failed.size, 0, 'missing entity key is not a fetch failure (call succeeded)');
  });

  it('isolates per-entity failures — one rejection does not poison the batch', async () => {
    const { hass } = makeHass(async (msg) => {
      if (msg.target.entity_id === 'calendar.bad') return new Error('nope');
      return { response: { [msg.target.entity_id]: { events: [{ start: 'x', end: 'y', summary: 'ok' }] } } };
    });
    const result = await fetchCalendarEvents(
      hass,
      ['calendar.ok', 'calendar.bad'],
      START,
      END,
    );

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
