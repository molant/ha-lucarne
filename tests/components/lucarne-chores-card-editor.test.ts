import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { LucarneChoresCardEditor } from '../../src/editors/lucarne-chores-card-editor.js';
import type { HomeAssistant } from '../../src/shared/types.js';
import { makeFakeHass } from '../setup/ha-mock.mjs';

await import('../../src/editors/lucarne-chores-card-editor.js');

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
      if (payload['type'] === 'lucarne_family/get_family') {
        return GET_FAMILY_RESPONSE;
      }
      // todo.get_items → return empty items
      return { response: {} };
    },
  };
  return { ...base, connection: conn };
}

async function makeEl(members: string[] = []): Promise<LucarneChoresCardEditor> {
  const el = document.createElement('lucarne-chores-card-editor') as LucarneChoresCardEditor;
  el.setConfig({ type: 'custom:lucarne-chores-card', members });
  el.hass = makeFakeHassWithMembers() as unknown as HomeAssistant;
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 50));
  await el.updateComplete;
  return el;
}

function shadow(el: LucarneChoresCardEditor, sel: string) {
  return el.shadowRoot?.querySelector(sel) ?? null;
}

afterEach(() => {
  document.querySelectorAll('lucarne-chores-card-editor').forEach((el) => el.remove());
});

describe('lucarne-chores-card-editor', () => {
  it('renders General, Members, Display sections', async () => {
    const el = await makeEl();
    const labels = Array.from(el.shadowRoot!.querySelectorAll('.section-label')).map(
      (l) => l.textContent?.trim().toLowerCase(),
    );
    assert.ok(labels.some((l) => l?.includes('general')), 'General section');
    assert.ok(labels.some((l) => l?.includes('member')), 'Members section');
    assert.ok(labels.some((l) => l?.includes('display')), 'Display section');
  });

  it('fires config-changed when title changes', async () => {
    const el = await makeEl();

    const events: CustomEvent[] = [];
    el.addEventListener('config-changed', (e) => events.push(e as CustomEvent));

    const titleInput = shadow(el, '#ed-title') as HTMLInputElement;
    assert.ok(titleInput, 'title input rendered');
    titleInput.value = 'My Chores';
    titleInput.dispatchEvent(new Event('change', { bubbles: true }));

    assert.equal(events.length, 1);
    assert.equal(events[0].detail.config.title, 'My Chores');
  });

  it('clears title when input emptied', async () => {
    const el = await makeEl();

    const events: CustomEvent[] = [];
    el.addEventListener('config-changed', (e) => events.push(e as CustomEvent));

    const titleInput = shadow(el, '#ed-title') as HTMLInputElement;
    titleInput.value = '';
    titleInput.dispatchEvent(new Event('change', { bubbles: true }));

    assert.equal(events.length, 1);
    assert.equal(events[0].detail.config.title, undefined, 'title cleared when empty');
  });

  it('fires config-changed when member checkbox checked', async () => {
    const el = await makeEl([]);

    const events: CustomEvent[] = [];
    el.addEventListener('config-changed', (e) => events.push(e as CustomEvent));

    const annaCheckbox = shadow(el, '#member-anna') as HTMLInputElement;
    assert.ok(annaCheckbox, 'anna checkbox rendered');
    annaCheckbox.checked = true;
    annaCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

    assert.equal(events.length, 1);
    assert.ok(events[0].detail.config.members.includes('anna'), 'anna added to members');
  });

  it('fires config-changed when member checkbox unchecked', async () => {
    const el = await makeEl(['anna', 'bob']);

    const events: CustomEvent[] = [];
    el.addEventListener('config-changed', (e) => events.push(e as CustomEvent));

    const annaCheckbox = shadow(el, '#member-anna') as HTMLInputElement;
    annaCheckbox.checked = false;
    annaCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

    assert.equal(events.length, 1);
    assert.ok(!events[0].detail.config.members.includes('anna'), 'anna removed from members');
    assert.ok(events[0].detail.config.members.includes('bob'), 'bob still in members');
  });

  it('renders household checkbox', async () => {
    const el = await makeEl();
    const householdCheckbox = shadow(el, '#member-household');
    assert.ok(householdCheckbox, 'household checkbox rendered');
  });

  it('fires config-changed when show_routines toggled off', async () => {
    const el = await makeEl();

    const events: CustomEvent[] = [];
    el.addEventListener('config-changed', (e) => events.push(e as CustomEvent));

    const toggle = shadow(el, '#ed-show_routines') as HTMLInputElement;
    assert.ok(toggle, 'show_routines toggle rendered');
    toggle.checked = false;
    toggle.dispatchEvent(new Event('change', { bubbles: true }));

    assert.equal(events.length, 1);
    assert.equal(events[0].detail.config.show_routines, false);
  });

  it('fires config-changed when show_tasks toggled off', async () => {
    const el = await makeEl();

    const events: CustomEvent[] = [];
    el.addEventListener('config-changed', (e) => events.push(e as CustomEvent));

    const toggle = shadow(el, '#ed-show_tasks') as HTMLInputElement;
    assert.ok(toggle, 'show_tasks toggle rendered');
    toggle.checked = false;
    toggle.dispatchEvent(new Event('change', { bubbles: true }));

    assert.equal(events.length, 1);
    assert.equal(events[0].detail.config.show_tasks, false);
  });

  it('fires config-changed when show_streak toggled off', async () => {
    const el = await makeEl();

    const events: CustomEvent[] = [];
    el.addEventListener('config-changed', (e) => events.push(e as CustomEvent));

    const toggle = shadow(el, '#ed-show_streak') as HTMLInputElement;
    assert.ok(toggle, 'show_streak toggle rendered');
    toggle.checked = false;
    toggle.dispatchEvent(new Event('change', { bubbles: true }));

    assert.equal(events.length, 1);
    assert.equal(events[0].detail.config.show_streak, false);
  });

  it('shows integration error placeholder when integration not installed', async () => {
    const el = document.createElement('lucarne-chores-card-editor') as LucarneChoresCardEditor;
    el.setConfig({ type: 'custom:lucarne-chores-card', members: [] });

    const base = makeFakeHass();
    const conn = {
      ...base.connection,
      async sendMessagePromise(payload: Record<string, unknown>) {
        if (payload['type'] === 'lucarne_family/get_family') {
          throw new Error('Unknown command');
        }
        return undefined;
      },
    };
    el.hass = { ...base, connection: conn } as unknown as HomeAssistant;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    const errorBlock = el.shadowRoot?.querySelector('.error-block');
    assert.ok(errorBlock, 'error block shown');
    assert.ok(
      errorBlock!.textContent!.toLowerCase().includes('install') ||
        errorBlock!.textContent!.toLowerCase().includes('lucarne'),
      'error mentions install or lucarne',
    );

    el.remove();
  });

  it('legacy kids config: emitting config-changed always includes members array', async () => {
    const el = document.createElement('lucarne-chores-card-editor') as LucarneChoresCardEditor;
    // Simulate old config with 'kids' key and no 'members'
    el.setConfig({ type: 'custom:lucarne-chores-card', members: [] } as unknown as Parameters<LucarneChoresCardEditor['setConfig']>[0]);
    Object.assign(el as unknown as Record<string, unknown>, {
      _config: { type: 'custom:lucarne-chores-card', kids: [{ name: 'Alice' }], title: 'Chores' },
    });

    const events: CustomEvent[] = [];
    el.addEventListener('config-changed', (e) => events.push(e as CustomEvent));

    // Trigger a config change (e.g. title change) via internal _fire
    (el as unknown as { _fire: (c: unknown) => void })._fire({
      type: 'custom:lucarne-chores-card',
      kids: [{ name: 'Alice' }],
      title: 'New Title',
    });

    assert.equal(events.length, 1);
    const emitted = events[0].detail.config;
    assert.ok(Array.isArray(emitted.members), 'members array always present');
    assert.ok(!('kids' in emitted), 'kids stripped from emitted config');
    assert.equal(emitted.title, 'New Title');
  });
});
