import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { LucarneTodayCard, LucarneTodayCardConfig } from '../../src/cards/lucarne-today-card.js';
import type { HomeAssistant } from '../../src/shared/types.js';
import { makeFakeHass } from '../setup/ha-mock.mjs';

await import('../../src/cards/lucarne-today-card.js');

const BASE_CONFIG: LucarneTodayCardConfig = {
  type: 'custom:lucarne-today-card',
  calendars: [{ entity: 'calendar.family', color: '#a8d8b9' }],
};

const GET_FAMILY_RESPONSE = {
  members: [
    {
      slug: 'anna',
      name: 'Anna',
      color: '#f5c89c',
      avatar: null,
      todo_entity_id: 'todo.anna',
      streak_counter_id: 'counter.anna_streak',
    },
  ],
  task_metadata: [],
  reset_time: '04:00',
  streak_check_time: '21:00',
  household_entity_id: 'todo.lucarne_household',
};

function makeFakeHassWithFamily() {
  const base = makeFakeHass();
  const conn = {
    ...base.connection,
    async sendMessagePromise(payload: Record<string, unknown>) {
      if (payload['type'] === 'lucarne_family/get_family') return GET_FAMILY_RESPONSE;
      if (payload['type'] === 'call_service') return { response: {} };
      return undefined;
    },
  };
  return { ...base, connection: conn };
}

function makeFakeHassIntegrationMissing() {
  const base = makeFakeHass();
  const conn = {
    ...base.connection,
    async sendMessagePromise(payload: Record<string, unknown>) {
      if (payload['type'] === 'lucarne_family/get_family') throw new Error('Unknown command');
      if (payload['type'] === 'call_service') return { response: {} };
      return undefined;
    },
  };
  return { ...base, connection: conn };
}

async function makeCard(
  configOverrides: Partial<LucarneTodayCardConfig> = {},
  hass = makeFakeHass(),
): Promise<LucarneTodayCard> {
  const el = document.createElement('lucarne-today-card') as LucarneTodayCard;
  const config = { ...BASE_CONFIG, ...configOverrides };
  el.setConfig(config);
  el.hass = hass as unknown as HomeAssistant;
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 50));
  await el.updateComplete;
  return el;
}

afterEach(() => {
  document.querySelectorAll('lucarne-today-card').forEach((el) => el.remove());
});

describe('lucarne-today-card — flag combinations', () => {
  it('neither flag — renders without family pill or integration tasks section', async () => {
    const el = await makeCard({});
    const pill = el.shadowRoot!.querySelector('lucarne-family-ready-pill');
    assert.equal(pill, null, 'no family-ready pill when show_family_ready_pill is false');
    // tasks-summary should not be present when tasks: is not set
    const summary = el.shadowRoot!.querySelector('lucarne-tasks-summary');
    assert.equal(summary, null, 'no tasks-summary when no tasks config');
  });

  it('household_tasks_from_integration: true — renders integration tasks section', async () => {
    const el = await makeCard(
      { household_tasks_from_integration: true },
      makeFakeHassWithFamily() as unknown as HomeAssistant,
    );
    const summary = el.shadowRoot!.querySelector('lucarne-tasks-summary');
    assert.ok(summary, 'tasks-summary rendered in integration mode');
  });

  it('show_family_ready_pill: true — renders family-ready pill in header', async () => {
    const el = await makeCard(
      { show_family_ready_pill: true },
      makeFakeHassWithFamily() as unknown as HomeAssistant,
    );
    const pill = el.shadowRoot!.querySelector('lucarne-family-ready-pill');
    assert.ok(pill, 'family-ready pill rendered when show_family_ready_pill is true');
  });

  it('both flags: true — renders both pill and integration tasks', async () => {
    const el = await makeCard(
      { household_tasks_from_integration: true, show_family_ready_pill: true },
      makeFakeHassWithFamily() as unknown as HomeAssistant,
    );
    const pill = el.shadowRoot!.querySelector('lucarne-family-ready-pill');
    const summary = el.shadowRoot!.querySelector('lucarne-tasks-summary');
    assert.ok(pill, 'family-ready pill rendered');
    assert.ok(summary, 'tasks-summary rendered in integration mode');
  });

  it('backward compat — tasks: config still renders raw todo tasks when no integration flag', async () => {
    const el = await makeCard({ tasks: 'todo.ingrid_tasks' });
    const summary = el.shadowRoot!.querySelector('lucarne-tasks-summary');
    assert.ok(summary, 'tasks-summary rendered for raw todo entity');
  });

  it('household_tasks_from_integration: true ignores tasks: setting (no double subscription)', async () => {
    // Both set; integration mode should win; no duplicate tasks-summary elements expected
    const el = await makeCard(
      { tasks: 'todo.ingrid_tasks', household_tasks_from_integration: true },
      makeFakeHassWithFamily() as unknown as HomeAssistant,
    );
    const summaries = el.shadowRoot!.querySelectorAll('lucarne-tasks-summary');
    // Only one tasks-summary (integration mode), not two
    assert.equal(summaries.length, 1, 'only one tasks-summary when integration mode overrides tasks:');
  });

  it('household_tasks_from_integration: true with integration missing — renders card but not integration sections', async () => {
    const el = await makeCard(
      { household_tasks_from_integration: true, show_family_ready_pill: true },
      makeFakeHassIntegrationMissing() as unknown as HomeAssistant,
    );
    // Card should render, not throw
    const card = el.shadowRoot!.querySelector('ha-card');
    assert.ok(card, 'ha-card rendered even when integration is missing');
    // Integration-specific sections suppressed (no misleading "no routines today" / "all done")
    const pill = el.shadowRoot!.querySelector('lucarne-family-ready-pill');
    assert.equal(pill, null, 'family-ready pill not shown when integration unavailable');
    const summary = el.shadowRoot!.querySelector('lucarne-tasks-summary');
    assert.equal(summary, null, 'tasks-summary not shown when integration unavailable');
  });

  it('setConfig throws when calendars is missing or empty', () => {
    const el = document.createElement('lucarne-today-card') as LucarneTodayCard;
    assert.throws(
      () => el.setConfig({ type: 'custom:lucarne-today-card', calendars: [] }),
      /calendars/,
    );
  });
});
