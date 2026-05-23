import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { LucarneCalendarEventPopover } from '../../src/components/calendar-event-popover.js';
import type { HomeAssistant, CalendarEvent } from '../../src/shared/types.js';

await import('../../src/components/calendar-event-popover.js');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    start: '2026-05-25T14:00:00',
    end: '2026-05-25T15:00:00',
    summary: 'Test event',
    uid: 'calendar.family::abc-123',
    ...overrides,
  };
}

function makeHass(supportedFeatures: number | undefined): HomeAssistant {
  return {
    states: {
      'calendar.family': {
        attributes: {
          ...(supportedFeatures !== undefined ? { supported_features: supportedFeatures } : {}),
        },
      },
    },
    callService: async () => {},
  } as unknown as HomeAssistant;
}

function makeEl(
  opts: {
    event?: CalendarEvent | null;
    entityId?: string;
    hass?: HomeAssistant;
  } = {},
): LucarneCalendarEventPopover {
  const el = document.createElement('lucarne-calendar-event-popover') as LucarneCalendarEventPopover;
  el.event = opts.event !== undefined ? opts.event : makeEvent();
  el.entityId = opts.entityId !== undefined ? opts.entityId : 'calendar.family';
  el.hass = opts.hass !== undefined ? opts.hass : makeHass(5); // bit 4 set → supports delete
  document.body.appendChild(el);
  return el;
}

function shadowQuery(el: LucarneCalendarEventPopover, selector: string): Element | null {
  return el.shadowRoot?.querySelector(selector) ?? null;
}

function shadowQueryAll(el: LucarneCalendarEventPopover, selector: string): Element[] {
  return Array.from(el.shadowRoot?.querySelectorAll(selector) ?? []);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('LucarneCalendarEventPopover — Delete button visibility', () => {
  let el: LucarneCalendarEventPopover;

  afterEach(() => el?.remove());

  it('renders Delete button when entity supports delete and event is non-recurring', async () => {
    el = makeEl({ hass: makeHass(5) }); // bit 4 set
    await el.updateComplete;
    const btn = shadowQuery(el, '.btn-delete');
    assert.ok(btn, 'Delete button should be rendered');
    assert.equal(btn!.textContent?.trim(), 'Delete');
  });

  it('does NOT render Delete button when entity does not support delete', async () => {
    el = makeEl({ hass: makeHass(3) }); // bits 1+2, no bit 4
    await el.updateComplete;
    assert.equal(shadowQuery(el, '.btn-delete'), null);
  });

  it('does NOT render Delete button when supported_features is missing', async () => {
    el = makeEl({ hass: makeHass(undefined) });
    await el.updateComplete;
    assert.equal(shadowQuery(el, '.btn-delete'), null);
  });

  it('does NOT render Delete button when entityId is empty', async () => {
    el = makeEl({ entityId: '', hass: makeHass(5) });
    await el.updateComplete;
    assert.equal(shadowQuery(el, '.btn-delete'), null);
  });

  it('does NOT render Delete button when event has no uid', async () => {
    el = makeEl({ event: makeEvent({ uid: undefined }), hass: makeHass(5) });
    await el.updateComplete;
    assert.equal(shadowQuery(el, '.btn-delete'), null);
  });

  it('does NOT render Delete button when event has rrule (recurring)', async () => {
    el = makeEl({ event: makeEvent({ rrule: 'FREQ=WEEKLY' }), hass: makeHass(5) });
    await el.updateComplete;
    assert.equal(shadowQuery(el, '.btn-delete'), null);
  });

  it('does NOT render Delete button when event has recurrence_id (recurring instance)', async () => {
    el = makeEl({ event: makeEvent({ recurrence_id: '2026-05-25T14:00:00' }), hass: makeHass(5) });
    await el.updateComplete;
    assert.equal(shadowQuery(el, '.btn-delete'), null);
  });
});

describe('LucarneCalendarEventPopover — Delete confirm flow', () => {
  let el: LucarneCalendarEventPopover;

  afterEach(() => el?.remove());

  it('first Delete tap shows confirm state: "Confirm delete?" button + Cancel button', async () => {
    el = makeEl({ hass: makeHass(5) });
    await el.updateComplete;

    const deleteBtn = shadowQuery(el, '.btn-delete') as HTMLButtonElement;
    deleteBtn.click();
    await el.updateComplete;

    const confirmBtn = shadowQuery(el, '.btn-delete') as HTMLButtonElement;
    const cancelBtn = shadowQuery(el, '.btn-cancel') as HTMLButtonElement;
    assert.ok(confirmBtn, 'Confirm delete button should be present');
    assert.equal(confirmBtn.textContent?.trim(), 'Confirm delete?');
    assert.ok(cancelBtn, 'Cancel button should be present');
    assert.equal(cancelBtn.textContent?.trim(), 'Cancel');
  });

  it('Cancel tap returns to non-confirm state', async () => {
    el = makeEl({ hass: makeHass(5) });
    await el.updateComplete;

    (shadowQuery(el, '.btn-delete') as HTMLButtonElement).click();
    await el.updateComplete;

    (shadowQuery(el, '.btn-cancel') as HTMLButtonElement).click();
    await el.updateComplete;

    const deleteBtn = shadowQuery(el, '.btn-delete') as HTMLButtonElement;
    assert.ok(deleteBtn, 'Delete button should be back');
    assert.equal(deleteBtn.textContent?.trim(), 'Delete');
    assert.equal(shadowQuery(el, '.btn-cancel'), null);
  });

  it('second Delete tap (Confirm delete?) dispatches lucarne-event-deleted with entityId and uid', async () => {
    const events: CustomEvent[] = [];
    el = makeEl({ hass: makeHass(5) });
    el.addEventListener('lucarne-event-deleted', (e) => events.push(e as CustomEvent));
    await el.updateComplete;

    (shadowQuery(el, '.btn-delete') as HTMLButtonElement).click();
    await el.updateComplete;
    (shadowQuery(el, '.btn-delete') as HTMLButtonElement).click();
    await el.updateComplete;
    // Wait for async _confirmDelete to complete
    await new Promise((r) => setTimeout(r, 10));

    assert.equal(events.length, 1);
    assert.equal(events[0].detail.entityId, 'calendar.family');
    assert.equal(events[0].detail.uid, 'calendar.family::abc-123');
  });

  it('strips entityId:: prefix before calling callService', async () => {
    const calls: Array<{ domain: string; service: string; serviceData: unknown; target: unknown }> = [];
    const hass = makeHass(5);
    (hass as unknown as Record<string, unknown>).callService = async (
      domain: string, service: string, serviceData: unknown, target: unknown,
    ) => { calls.push({ domain, service, serviceData, target }); };

    el = makeEl({ hass });
    await el.updateComplete;

    (shadowQuery(el, '.btn-delete') as HTMLButtonElement).click();
    await el.updateComplete;
    (shadowQuery(el, '.btn-delete') as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 10));

    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0].serviceData, { uid: 'abc-123' });
    assert.deepEqual(calls[0].target, { entity_id: 'calendar.family' });
  });
});

describe('LucarneCalendarEventPopover — Delete error path', () => {
  let el: LucarneCalendarEventPopover;

  afterEach(() => el?.remove());

  it('shows inline error-msg when deleteCalendarEvent rejects; popover stays open; no event dispatched', async () => {
    const events: CustomEvent[] = [];
    const hass = makeHass(5);
    (hass as unknown as Record<string, unknown>).callService = async () => {
      throw new Error('uid not found');
    };
    el = makeEl({ hass });
    el.addEventListener('lucarne-event-deleted', (e) => events.push(e as CustomEvent));
    await el.updateComplete;

    (shadowQuery(el, '.btn-delete') as HTMLButtonElement).click();
    await el.updateComplete;
    (shadowQuery(el, '.btn-delete') as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 10));
    await el.updateComplete;

    const errEl = shadowQuery(el, '.error-msg');
    assert.ok(errEl, 'error-msg element should be rendered');
    assert.match(errEl!.textContent ?? '', /uid not found/);
    assert.equal(events.length, 0, 'lucarne-event-deleted must not be dispatched');
    // Popover is still open (still has .popover in shadow DOM)
    assert.ok(shadowQuery(el, '.popover'), 'popover should still be open');
  });

  it('error is cleared when Delete is tapped again after an error', async () => {
    let fail = true;
    const hass = makeHass(5);
    (hass as unknown as Record<string, unknown>).callService = async () => {
      if (fail) throw new Error('boom');
    };
    el = makeEl({ hass });
    await el.updateComplete;

    // First attempt — fails
    (shadowQuery(el, '.btn-delete') as HTMLButtonElement).click();
    await el.updateComplete;
    (shadowQuery(el, '.btn-delete') as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 10));
    await el.updateComplete;
    assert.ok(shadowQuery(el, '.error-msg'), 'error should appear');

    // Tap Delete again to start a new attempt
    fail = false;
    (shadowQuery(el, '.btn-delete') as HTMLButtonElement).click();
    await el.updateComplete;
    assert.equal(shadowQuery(el, '.error-msg'), null, 'error should be cleared on new attempt');
  });
});

describe('LucarneCalendarEventPopover — no event', () => {
  let el: LucarneCalendarEventPopover;

  afterEach(() => el?.remove());

  it('renders nothing when event is null', async () => {
    el = makeEl({ event: null });
    await el.updateComplete;
    assert.equal(shadowQueryAll(el, '*').length, 0);
  });
});
