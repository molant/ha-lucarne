import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { LucarneChoresCard } from '../../src/cards/lucarne-chores-card.js';
import type { HomeAssistant } from '../../src/shared/types.js';
import type { FamilyState } from '../../src/shared/family-subscription.js';
import { makeFakeHass } from '../setup/ha-mock.mjs';

await import('../../src/cards/lucarne-chores-card.js');

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
    {
      slug: 'bob',
      name: 'Bob',
      color: '#b8e0d2',
      avatar: null,
      todo_entity_id: 'todo.bob',
      streak_counter_id: 'counter.bob_streak',
    },
  ],
  task_metadata: [],
  reset_time: '03:00',
  streak_check_time: '02:00',
  household_entity_id: 'todo.lucarne_household',
};

function makeFakeHassWithMembers() {
  const base = makeFakeHass();
  const conn = {
    ...base.connection,
    async sendMessagePromise(payload: Record<string, unknown>) {
      if (payload['type'] === 'lucarne_family/get_family') return GET_FAMILY_RESPONSE;
      return { response: {} };
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
      return undefined;
    },
  };
  return { ...base, connection: conn };
}

async function makeCard(members: string[], hass = makeFakeHassWithMembers()): Promise<LucarneChoresCard> {
  const el = document.createElement('lucarne-chores-card') as LucarneChoresCard;
  el.setConfig({ type: 'custom:lucarne-chores-card', members });
  el.hass = hass as unknown as HomeAssistant;
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 50));
  await el.updateComplete;
  return el;
}

function shadow(el: LucarneChoresCard, sel: string) {
  return el.shadowRoot?.querySelector(sel) ?? null;
}

afterEach(() => {
  document.querySelectorAll('lucarne-chores-card').forEach((el) => el.remove());
});

describe('lucarne-chores-card', () => {
  it('setConfig throws when members is not an array', () => {
    const el = document.createElement('lucarne-chores-card') as LucarneChoresCard;
    assert.throws(
      () => el.setConfig({ type: 'custom:lucarne-chores-card', members: 'bad' as unknown as string[] }),
      /members must be an array/,
    );
  });

  it('setConfig accepts empty members array without throwing', () => {
    const el = document.createElement('lucarne-chores-card') as LucarneChoresCard;
    assert.doesNotThrow(() => el.setConfig({ type: 'custom:lucarne-chores-card', members: [] }));
  });

  it('renders a member column for each configured member slug', async () => {
    const el = await makeCard(['anna', 'bob']);
    const cells = el.shadowRoot!.querySelectorAll('.member-cell');
    assert.equal(cells.length, 2, 'one cell per configured member');
  });

  it('renders only configured slugs — not all integration members', async () => {
    const el = await makeCard(['anna']);
    const cells = el.shadowRoot!.querySelectorAll('.member-cell');
    assert.equal(cells.length, 1, 'only anna column shown');
  });

  it('renders integration error block when integration is not installed', async () => {
    const el = await makeCard(['anna'], makeFakeHassIntegrationMissing());
    const errorBlock = shadow(el, '.error-block');
    assert.ok(errorBlock, 'error block shown');
    assert.ok(
      errorBlock!.textContent!.toLowerCase().includes('lucarne family') ||
        errorBlock!.textContent!.toLowerCase().includes('not set up'),
      'error mentions integration',
    );
  });

  it('renders upgrade message text for old kids: config after hass is set', async () => {
    const el = document.createElement('lucarne-chores-card') as LucarneChoresCard;
    el.setConfig({
      type: 'custom:lucarne-chores-card',
      kids: [{ name: 'Alice', chores: [] }],
    } as unknown as Parameters<LucarneChoresCard['setConfig']>[0]);
    el.hass = makeFakeHassWithMembers() as unknown as HomeAssistant;
    document.body.appendChild(el);
    await el.updateComplete;

    const errorBlock = shadow(el, '.error-block');
    assert.ok(errorBlock, 'upgrade error block rendered');
    const text = errorBlock!.textContent!.toLowerCase();
    assert.ok(
      text.includes('upgraded') || text.includes('update your yaml') || text.includes('card upgraded'),
      'upgrade message displayed',
    );
  });

  it('shows loading state before family state arrives', async () => {
    // Use a hass whose get_family never resolves during the test
    const base = makeFakeHass();
    let resolveFamily!: (v: unknown) => void;
    const conn = {
      ...base.connection,
      sendMessagePromise(payload: Record<string, unknown>) {
        if (payload['type'] === 'lucarne_family/get_family') {
          return new Promise((r) => { resolveFamily = r; });
        }
        return Promise.resolve({ response: {} });
      },
    };
    const el = document.createElement('lucarne-chores-card') as LucarneChoresCard;
    el.setConfig({ type: 'custom:lucarne-chores-card', members: ['anna'] });
    el.hass = { ...base, connection: conn } as unknown as HomeAssistant;
    document.body.appendChild(el);
    await el.updateComplete;

    const loading = shadow(el, '.loading');
    assert.ok(loading, 'loading state shown before data arrives');

    // Resolve so teardown doesn't hang
    resolveFamily(GET_FAMILY_RESPONSE);
    el.remove();
  });

  it('card re-renders when _familyState is updated', async () => {
    const el = await makeCard(['anna']);
    const initial = el.shadowRoot!.querySelectorAll('.member-cell').length;
    assert.equal(initial, 1);

    // Directly update the reactive _familyState to simulate a live push
    const newState: FamilyState = {
      members: [
        { slug: 'anna', name: 'Anna', color: '#f5c89c', avatar: null, todo_entity_id: 'todo.anna', streak_counter_id: 'counter.anna_streak' },
        { slug: 'bob', name: 'Bob', color: '#b8e0d2', avatar: null, todo_entity_id: 'todo.bob', streak_counter_id: 'counter.bob_streak' },
      ],
      tasksByMember: new Map([['anna', []], ['bob', []]]),
      streakByMember: new Map([['anna', 3], ['bob', 1]]),
      resetTime: '03:00',
      streakCheckTime: '02:00',
      integrationError: null,
    };
    (el as unknown as { _familyState: FamilyState })._familyState = newState;
    // Also update config to include bob
    el.setConfig({ type: 'custom:lucarne-chores-card', members: ['anna', 'bob'] });
    await el.updateComplete;

    const after = el.shadowRoot!.querySelectorAll('.member-cell').length;
    assert.equal(after, 2, 'card re-renders with updated family state');
  });
});
