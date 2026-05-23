import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RollingWindowController } from '../../src/shared/rolling-window.js';
import type { RollingWindowOptions } from '../../src/shared/rolling-window.js';
import type { ReactiveControllerHost } from 'lit';
import type { HomeAssistant, CalendarEvent, CalendarConfig } from '../../src/shared/types.js';

// TZ=America/Los_Angeles is set in the npm test script

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeHostStub(): ReactiveControllerHost & { updateCount: number } {
  return {
    updateCount: 0,
    addController() {},
    removeController() {},
    requestUpdate() { (this as { updateCount: number }).updateCount++; },
    get updateComplete() { return Promise.resolve(true); },
  };
}

function makeCannedEvent(uid: string, summary = 'Event'): CalendarEvent {
  return {
    start: '2026-05-22',
    end: '2026-05-23',
    summary,
    uid,
  };
}

function makeStubHass(entityId: string, events: CalendarEvent[]): HomeAssistant {
  return {
    connection: {
      async sendMessagePromise() {
        return { response: { [entityId]: { events } } };
      },
    },
  } as unknown as HomeAssistant;
}

function makeTrackingFetcher(entityId: string, events: CalendarEvent[]) {
  const calls: Array<{ start: Date; end: Date }> = [];
  const fetcher = async (_hass: HomeAssistant, _ids: string[], start: Date, end: Date) => {
    calls.push({ start, end });
    const m = new Map<string, CalendarEvent[]>();
    m.set(entityId, events);
    return { events: m, failed: new Set<string>() };
  };
  return { fetcher, calls };
}

const ENTITY_ID = 'calendar.foo';
const CALENDARS: CalendarConfig[] = [{ entity: ENTITY_ID, color: '#a8d8b9' }];

// Canonical "today" for tests: 2026-05-22T10:00:00 (local)
function makeNow(isoLocal: string) {
  return () => new Date(isoLocal);
}

const NOW_2026_05_22 = makeNow('2026-05-22T10:00:00');

function makeBaseOpts(overrides?: Partial<RollingWindowOptions>): RollingWindowOptions {
  const { fetcher } = makeTrackingFetcher(ENTITY_ID, []);
  return {
    calendars: CALENDARS,
    visibleCount: 5,
    now: NOW_2026_05_22,
    pollIntervalMs: 0,
    tickIntervalMs: 0,
    fetcher,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RollingWindowController — cached range', () => {
  it('setVisibleCount(5) with dayOffset=0 and now=2026-05-22 → cache [May 17, Jun 1)', async () => {
    const { fetcher, calls } = makeTrackingFetcher(ENTITY_ID, []);
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, {
      ...makeBaseOpts({ fetcher }),
      visibleCount: 5,
      now: NOW_2026_05_22,
    });

    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));

    // Wait for all async fetches to settle
    await Promise.resolve();
    await Promise.resolve();

    assert.ok(calls.length >= 1, `expected at least 1 fetch, got ${calls.length}`);
    const { start, end } = calls[calls.length - 1];

    const expectedStart = new Date('2026-05-17T00:00:00');
    const expectedEnd = new Date('2026-06-01T00:00:00');

    assert.equal(start.getTime(), expectedStart.getTime(),
      `start expected ${expectedStart.toISOString()} got ${start.toISOString()}`);
    assert.equal(end.getTime(), expectedEnd.getTime(),
      `end expected ${expectedEnd.toISOString()} got ${end.toISOString()}`);

    ctrl.hostDisconnected();
  });

  it('shrinking visibleCount 5 → 3 does NOT trigger a re-fetch', async () => {
    const { fetcher, calls } = makeTrackingFetcher(ENTITY_ID, []);
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, {
      ...makeBaseOpts({ fetcher }),
      visibleCount: 5,
    });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    const fetchesBefore = calls.length;
    ctrl.setVisibleCount(3);
    await Promise.resolve();
    await Promise.resolve();
    assert.equal(calls.length, fetchesBefore, 'shrinking vc should not fetch');

    ctrl.hostDisconnected();
  });

  it('growing visibleCount 3 → 7 triggers a re-fetch', async () => {
    const { fetcher, calls } = makeTrackingFetcher(ENTITY_ID, []);
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, {
      ...makeBaseOpts({ fetcher }),
      visibleCount: 3,
    });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    const fetchesBefore = calls.length;
    ctrl.setVisibleCount(7);
    await Promise.resolve();
    await Promise.resolve();
    assert.ok(calls.length > fetchesBefore, 'growing vc should fetch');

    ctrl.hostDisconnected();
  });
});

describe('RollingWindowController — pan', () => {
  it('pan(+5) shifts dayOffset by 5', async () => {
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, makeBaseOpts());
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    ctrl.pan(5);
    assert.equal(ctrl.dayOffset, 5);

    ctrl.hostDisconnected();
  });

  it('goToToday resets dayOffset to 0', async () => {
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, makeBaseOpts());
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    ctrl.pan(10);
    assert.equal(ctrl.dayOffset, 10);
    ctrl.goToToday();
    assert.equal(ctrl.dayOffset, 0);

    ctrl.hostDisconnected();
  });
});

describe('RollingWindowController — midnight tick', () => {
  it('tick() with midnight crossed and dayOffset=0 re-anchors and re-fetches', async () => {
    let day = 22;
    const now = () => {
      const d = new Date(`2026-05-${String(day).padStart(2, '0')}T10:00:00`);
      return d;
    };
    const { fetcher, calls } = makeTrackingFetcher(ENTITY_ID, []);
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, {
      ...makeBaseOpts({ fetcher }),
      now,
    });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    const fetchesBefore = calls.length;
    day = 23; // advance past midnight
    ctrl.tick();
    await Promise.resolve();
    await Promise.resolve();

    assert.ok(calls.length > fetchesBefore, 'should re-fetch on midnight when at today anchor');
    ctrl.hostDisconnected();
  });

  it('tick() with midnight crossed and dayOffset !== 0 does NOT re-anchor', async () => {
    let day = 22;
    const now = () => new Date(`2026-05-${String(day).padStart(2, '0')}T10:00:00`);
    const { fetcher, calls } = makeTrackingFetcher(ENTITY_ID, []);
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, {
      ...makeBaseOpts({ fetcher }),
      now,
    });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    ctrl.pan(5); // user panned away
    const fetchesBefore = calls.length;
    day = 23; // midnight passes
    ctrl.tick();
    await Promise.resolve();
    await Promise.resolve();

    assert.equal(calls.length, fetchesBefore, 'should NOT re-fetch when user has panned away');
    ctrl.hostDisconnected();
  });
});

describe('RollingWindowController — pan bounds', () => {
  it('pan(+100) clamps to +85 (panBound=90, visibleCount=5)', async () => {
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, {
      ...makeBaseOpts(),
      visibleCount: 5,
      panBoundDays: 90,
    });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    ctrl.pan(100);
    assert.equal(ctrl.dayOffset, 85, `expected dayOffset=85, got ${ctrl.dayOffset}`);
    assert.equal(ctrl.canPanForward, false, 'canPanForward should be false at right bound');
    assert.equal(ctrl.canPanBack, true, 'canPanBack should be true');

    // Rightmost visible day should be today + 89 (not today + 90)
    const today = new Date('2026-05-22T00:00:00');
    const expectedRightmost = new Date(today);
    expectedRightmost.setDate(today.getDate() + 89);
    const actualRightmost = ctrl.days[ctrl.days.length - 1];
    assert.equal(
      actualRightmost.getTime(),
      expectedRightmost.getTime(),
      `rightmost visible day expected ${expectedRightmost.toDateString()} got ${actualRightmost.toDateString()}`
    );

    ctrl.hostDisconnected();
  });

  it('pan(-100) clamps to -90 (panBound=90, visibleCount=5)', async () => {
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, {
      ...makeBaseOpts(),
      visibleCount: 5,
      panBoundDays: 90,
    });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    ctrl.pan(-100);
    assert.equal(ctrl.dayOffset, -90, `expected dayOffset=-90, got ${ctrl.dayOffset}`);
    assert.equal(ctrl.canPanBack, false, 'canPanBack should be false at left bound');
    assert.equal(ctrl.canPanForward, true, 'canPanForward should be true');

    // Leftmost visible day should be today - 90
    const today = new Date('2026-05-22T00:00:00');
    const expectedLeftmost = new Date(today);
    expectedLeftmost.setDate(today.getDate() - 90);
    const actualLeftmost = ctrl.days[0];
    assert.equal(
      actualLeftmost.getTime(),
      expectedLeftmost.getTime(),
      `leftmost visible day expected ${expectedLeftmost.toDateString()} got ${actualLeftmost.toDateString()}`
    );

    ctrl.hostDisconnected();
  });
});

describe('RollingWindowController — poll and stale responses', () => {
  it('_poll calls fetcher with the full visible+buffer range', async () => {
    const { fetcher, calls } = makeTrackingFetcher(ENTITY_ID, []);
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, {
      ...makeBaseOpts({ fetcher }),
      visibleCount: 5,
    });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    const prevLen = calls.length;
    await ctrl._poll();
    await Promise.resolve();

    assert.ok(calls.length > prevLen, 'poll should call fetcher');
    // Verify it's the full range: 15 days for vc=5
    const last = calls[calls.length - 1];
    const rangeMs = last.end.getTime() - last.start.getTime();
    const expectedDays = 3 * 5; // 15 days
    const expectedMs = expectedDays * 24 * 60 * 60 * 1000;
    assert.equal(rangeMs, expectedMs, `fetch range should be ${expectedDays} days`);

    ctrl.hostDisconnected();
  });

  it('stale fetch responses are discarded', async () => {
    let resolveFirst!: (value: { events: Map<string, CalendarEvent[]>; failed: Set<string> }) => void;
    let callCount = 0;
    const fetcher = async (_hass: HomeAssistant, _ids: string[], _start: Date, _end: Date) => {
      callCount++;
      if (callCount === 1) {
        // First fetch hangs until we resolve it
        return new Promise<{ events: Map<string, CalendarEvent[]>; failed: Set<string> }>((res) => { resolveFirst = res; });
      }
      const m = new Map<string, CalendarEvent[]>();
      m.set(ENTITY_ID, [makeCannedEvent('evt-2')]);
      return { events: m, failed: new Set<string>() };
    };

    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, {
      ...makeBaseOpts({ fetcher }),
    });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    // First fetch in flight

    // Trigger a second fetch (poll) — bumps sequence
    await ctrl._poll();
    await Promise.resolve();

    // Now resolve the stale first fetch with different data
    const staleMap = new Map<string, CalendarEvent[]>();
    staleMap.set(ENTITY_ID, [makeCannedEvent('stale-evt')]);
    resolveFirst({ events: staleMap, failed: new Set<string>() });
    await Promise.resolve();
    await Promise.resolve();

    // cachedEvents should have the second fetch's data, not the stale first
    const events = ctrl.cachedEvents.get(ENTITY_ID) ?? [];
    assert.ok(
      !events.some((e) => e.uid?.includes('stale-evt')),
      'stale response should be discarded'
    );

    ctrl.hostDisconnected();
  });
});

describe('RollingWindowController — setHass first-arrival', () => {
  it('does not fetch when hostConnected but hass not yet set', async () => {
    const { fetcher, calls } = makeTrackingFetcher(ENTITY_ID, []);
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, { ...makeBaseOpts({ fetcher }) });
    ctrl.hostConnected();
    await Promise.resolve();
    await Promise.resolve();
    assert.equal(calls.length, 0, 'should not fetch without hass');
    ctrl.hostDisconnected();
  });

  it('fetches on first setHass call', async () => {
    const { fetcher, calls } = makeTrackingFetcher(ENTITY_ID, []);
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, { ...makeBaseOpts({ fetcher }) });
    ctrl.hostConnected();
    assert.equal(calls.length, 0);

    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();
    assert.ok(calls.length >= 1, 'should fetch on first setHass');
    ctrl.hostDisconnected();
  });

  it('does NOT re-fetch on subsequent setHass calls', async () => {
    const { fetcher, calls } = makeTrackingFetcher(ENTITY_ID, []);
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, { ...makeBaseOpts({ fetcher }) });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    const fetchesAfterFirst = calls.length;
    ctrl.setHass(makeStubHass(ENTITY_ID, [])); // second call with same/new hass
    await Promise.resolve();
    await Promise.resolve();
    assert.equal(calls.length, fetchesAfterFirst, 'subsequent setHass should NOT re-fetch');
    ctrl.hostDisconnected();
  });
});

describe('RollingWindowController — event uid tagging', () => {
  it('tags events with entity prefix and synthesises uid when upstream is missing', async () => {
    const canned: CalendarEvent[] = [makeCannedEvent('abc'), makeCannedEvent(undefined as unknown as string)];
    canned[1].uid = undefined;
    const fetcher = async (_hass: HomeAssistant, _ids: string[], _start: Date, _end: Date) => {
      const m = new Map<string, CalendarEvent[]>();
      m.set(ENTITY_ID, canned);
      return { events: m, failed: new Set<string>() };
    };
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, { ...makeBaseOpts({ fetcher }) });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    const events = ctrl.cachedEvents.get(ENTITY_ID) ?? [];
    assert.ok(events.length >= 2, `expected at least 2 events, got ${events.length}`);
    assert.equal(events[0].uid, `${ENTITY_ID}::abc`, 'real uid should be tagged with entity prefix');
    // Synthetic uid is `syn:start|end|summary`, deterministic from the event content.
    // Verifies (a) the synthesis fires when upstream uid is missing and (b) it includes the syn: marker.
    assert.match(
      events[1].uid ?? '',
      /^calendar\.foo::syn:/,
      `missing uid should become a synthetic 'syn:'-prefixed uid, got ${events[1].uid}`,
    );
  });

  it('two uid-less events with different content get distinct synthetic uids', async () => {
    const e1: CalendarEvent = { start: '2026-05-22T09:00:00', end: '2026-05-22T10:00:00', summary: 'Standup' };
    const e2: CalendarEvent = { start: '2026-05-22T14:00:00', end: '2026-05-22T15:00:00', summary: 'Lunch' };
    const fetcher = async () => ({ events: new Map([[ENTITY_ID, [e1, e2]]]), failed: new Set<string>() });
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, { ...makeBaseOpts({ fetcher }) });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    const events = ctrl.cachedEvents.get(ENTITY_ID) ?? [];
    assert.equal(events.length, 2);
    assert.notEqual(events[0].uid, events[1].uid, 'distinct content → distinct synthetic uids');
  });

  it('same event content across two fetches yields the same synthetic uid (stable)', async () => {
    const evt: CalendarEvent = { start: '2026-05-22T09:00:00', end: '2026-05-22T10:00:00', summary: 'Standup' };
    let callCount = 0;
    const fetcher = async () => {
      callCount++;
      return { events: new Map([[ENTITY_ID, [evt]]]), failed: new Set<string>() };
    };
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, { ...makeBaseOpts({ fetcher }) });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();
    const uid1 = (ctrl.cachedEvents.get(ENTITY_ID) ?? [])[0]?.uid;
    await ctrl._poll();
    await Promise.resolve();
    await Promise.resolve();
    const uid2 = (ctrl.cachedEvents.get(ENTITY_ID) ?? [])[0]?.uid;
    assert.ok(callCount >= 2, 'fetcher should have run at least twice');
    assert.equal(uid1, uid2, 'stable synthetic uid across fetches');
  });
});

describe('RollingWindowController — cachedRange and isDayCached', () => {
  it('before any fetch: cachedRange is empty and isDayCached returns false', () => {
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, makeBaseOpts());
    // Do NOT connect or call setHass — no fetch has fired
    assert.equal(ctrl.cachedRange.length, 0, 'cachedRange should be empty before fetch');
    assert.equal(ctrl.isDayCached(new Date('2026-05-22T00:00:00')), false, 'isDayCached should be false before fetch');
  });

  it('after fetch for [May 17, Jun 1): isDayCached(May 22) is true and cachedRange.length === 15', async () => {
    // visibleCount=5, dayOffset=0, now=May 22 → buffer range = [May 22-5, May 22+10) = [May 17, Jun 1)
    const { fetcher } = makeTrackingFetcher(ENTITY_ID, []);
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, {
      ...makeBaseOpts({ fetcher }),
      visibleCount: 5,
      now: NOW_2026_05_22,
    });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    assert.equal(ctrl.isDayCached(new Date('2026-05-22T00:00:00')), true, 'May 22 should be cached');
    assert.equal(ctrl.cachedRange.length, 15, `cachedRange should cover 15 days (May 17–31), got ${ctrl.cachedRange.length}`);

    ctrl.hostDisconnected();
  });
});

describe('RollingWindowController — renderDays + bufferDays', () => {
  it('default bufferDays equals visibleCount (matches spec event-buffer range)', () => {
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, makeBaseOpts({ visibleCount: 5 }));
    assert.equal(ctrl.bufferDays, 5);
  });

  it('renderDays defaults to length 3*visibleCount centered on the visible window', () => {
    const host = makeHostStub();
    // visibleCount=5, dayOffset=0, now=May 22 → renderDays = [May 17 .. May 31] (15 days)
    const ctrl = new RollingWindowController(host, makeBaseOpts({ visibleCount: 5 }));
    const render = ctrl.renderDays;
    assert.equal(render.length, 15);
    assert.equal(render[0].toISOString().slice(0, 10), '2026-05-17', 'first renderDay is today - bufferDays');
    assert.equal(render[5].toISOString().slice(0, 10), '2026-05-22', 'visible window starts at index bufferDays');
    assert.equal(render[14].toISOString().slice(0, 10), '2026-05-31', 'last renderDay is today + visibleCount + bufferDays - 1');
  });

  it('explicit bufferDays opt overrides the default', () => {
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, makeBaseOpts({ visibleCount: 5, bufferDays: 1 }));
    assert.equal(ctrl.bufferDays, 1);
    assert.equal(ctrl.renderDays.length, 7); // 1 + 5 + 1
  });

  it('bufferDays=0 means renderDays === days (no buffer)', () => {
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, makeBaseOpts({ visibleCount: 5, bufferDays: 0 }));
    assert.equal(ctrl.bufferDays, 0);
    assert.equal(ctrl.renderDays.length, 5);
    assert.deepEqual(
      ctrl.renderDays.map((d) => d.toISOString().slice(0, 10)),
      ctrl.days.map((d) => d.toISOString().slice(0, 10)),
    );
  });

  it('setBufferDays(undefined) reverts to visibleCount default', () => {
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, makeBaseOpts({ visibleCount: 5, bufferDays: 2 }));
    assert.equal(ctrl.bufferDays, 2);
    ctrl.setBufferDays(undefined);
    assert.equal(ctrl.bufferDays, 5);
  });

  it('setBufferDays clamps negative input to 0', () => {
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, makeBaseOpts({ visibleCount: 5 }));
    ctrl.setBufferDays(-3);
    assert.equal(ctrl.bufferDays, 0);
  });

  it('NaN / Infinity input reverts to default (does not blank the grid)', () => {
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, makeBaseOpts({ visibleCount: 5, bufferDays: 2 }));
    assert.equal(ctrl.bufferDays, 2);
    ctrl.setBufferDays(NaN);
    assert.equal(ctrl.bufferDays, 5, 'NaN should revert to default = visibleCount');
    ctrl.setBufferDays(2);
    ctrl.setBufferDays(Infinity);
    assert.equal(ctrl.bufferDays, 5, 'Infinity should revert to default = visibleCount');
  });

  it('constructor with NaN bufferDays opt → default applies', () => {
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, makeBaseOpts({ visibleCount: 5, bufferDays: NaN as unknown as number }));
    assert.equal(ctrl.bufferDays, 5);
  });
});

describe('RollingWindowController — onChange contract', () => {
  it('pan (in-buffer) fires onChange', async () => {
    let onChangeCalls = 0;
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, {
      ...makeBaseOpts(),
      onChange: () => { onChangeCalls++; },
    });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    const callsBefore = onChangeCalls;
    ctrl.pan(2); // in-buffer pan
    assert.ok(onChangeCalls > callsBefore, 'onChange should fire on pan');
    ctrl.hostDisconnected();
  });

  it('setVisibleCount (shrink, in-buffer) fires onChange', async () => {
    let onChangeCalls = 0;
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, {
      ...makeBaseOpts({ visibleCount: 5 }),
      onChange: () => { onChangeCalls++; },
    });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    const callsBefore = onChangeCalls;
    ctrl.setVisibleCount(3); // shrink — in-buffer
    assert.ok(onChangeCalls > callsBefore, 'onChange should fire on setVisibleCount shrink');
    ctrl.hostDisconnected();
  });

  it('tick at midnight with dayOffset=0 fires onChange', async () => {
    let day = 22;
    const now = () => new Date(`2026-05-${String(day).padStart(2, '0')}T10:00:00`);
    let onChangeCalls = 0;
    const host = makeHostStub();
    const ctrl = new RollingWindowController(host, {
      ...makeBaseOpts({ now }),
      onChange: () => { onChangeCalls++; },
    });
    ctrl.hostConnected();
    ctrl.setHass(makeStubHass(ENTITY_ID, []));
    await Promise.resolve();
    await Promise.resolve();

    const callsBefore = onChangeCalls;
    day = 23;
    ctrl.tick();
    await Promise.resolve();
    await Promise.resolve();
    assert.ok(onChangeCalls > callsBefore, 'onChange should fire on midnight tick at today anchor');
    ctrl.hostDisconnected();
  });
});
