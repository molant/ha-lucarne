import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { LucarneTasksSummary } from '../../src/components/tasks-summary.js';
import type { MemberSummary, RenderableTask, TodoItem } from '../../src/shared/types.js';

await import('../../src/components/tasks-summary.js');

const HOUSEHOLD_MEMBER: MemberSummary = {
  slug: 'household',
  name: 'Household',
  color: '#cccccc',
  avatar: null,
  todo_entity_id: 'todo.lucarne_household',
  streak_counter_id: '',
};

const ANNA: MemberSummary = {
  slug: 'anna',
  name: 'Anna',
  color: '#f5c89c',
  avatar: '🦊',
  todo_entity_id: 'todo.anna',
  streak_counter_id: 'counter.anna_streak',
};

function makeRenderable(overrides: Partial<RenderableTask> = {}): RenderableTask {
  return {
    uid: 'uid-1',
    summary: 'Take out trash',
    status: 'needs_action',
    due: null,
    description: '',
    metadata: {
      item_uid: 'uid-1',
      member_slug: 'household',
      assignee_slug: '',
      type: 'chore',
      recurrence: '',
      icon: '🧹',
      source: 'manual',
    },
    ...overrides,
  };
}

function makeTodoItem(overrides: Partial<TodoItem> = {}): TodoItem {
  return {
    uid: 'uid-1',
    summary: 'Buy milk',
    status: 'needs_action',
    ...overrides,
  };
}

async function makeEl(props: Partial<LucarneTasksSummary> = {}): Promise<LucarneTasksSummary> {
  const el = document.createElement('lucarne-tasks-summary') as LucarneTasksSummary;
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

afterEach(() => {
  document.querySelectorAll('lucarne-tasks-summary').forEach((el) => el.remove());
});

describe('lucarne-tasks-summary', () => {
  it('renders empty state when there are no active tasks (integration mode)', async () => {
    const el = await makeEl({ integrationMode: true, renderableTasks: [] });
    const empty = el.shadowRoot!.querySelector('.empty-state');
    assert.ok(empty, 'empty state shown when no tasks');
  });

  it('renders empty state when raw items list is empty', async () => {
    const el = await makeEl({ items: [] });
    const empty = el.shadowRoot!.querySelector('.empty-state');
    assert.ok(empty, 'empty state shown when raw items empty');
  });

  it('integration mode renders one task-row per active task with icon', async () => {
    const tasks = [
      makeRenderable({ uid: 'a', summary: 'A' }),
      makeRenderable({ uid: 'b', summary: 'B' }),
    ];
    const el = await makeEl({ integrationMode: true, renderableTasks: tasks });
    const rows = el.shadowRoot!.querySelectorAll('lucarne-task-row');
    assert.equal(rows.length, 2, 'two task rows rendered');
  });

  it('integration mode shows no owner avatar for household tasks', async () => {
    const tasks = [makeRenderable({ metadata: { ...makeRenderable().metadata, member_slug: 'household' } })];
    const el = await makeEl({
      integrationMode: true,
      renderableTasks: tasks,
      members: [ANNA, HOUSEHOLD_MEMBER],
    });
    const avatar = el.shadowRoot!.querySelector('.owner-avatar');
    assert.equal(avatar, null, 'no avatar for household-owned task');
  });

  it('integration mode renders owner avatar for member-owned tasks', async () => {
    const tasks = [
      makeRenderable({
        uid: 'anna-task',
        summary: 'Brush teeth',
        metadata: { ...makeRenderable().metadata, member_slug: 'anna' },
      }),
    ];
    const el = await makeEl({
      integrationMode: true,
      renderableTasks: tasks,
      members: [ANNA],
    });
    const avatar = el.shadowRoot!.querySelector('.owner-avatar') as HTMLElement | null;
    assert.ok(avatar, 'owner avatar rendered for member-owned task');
    assert.equal(avatar!.getAttribute('title'), 'Anna');
    // Emoji avatar string is rendered inside.
    assert.ok((avatar!.textContent ?? '').includes('🦊'), 'avatar emoji rendered');
  });

  it('integration mode skips completed tasks when counting and rendering', async () => {
    const tasks = [
      makeRenderable({ uid: 'a', status: 'needs_action' }),
      makeRenderable({ uid: 'b', status: 'completed' }),
    ];
    const el = await makeEl({ integrationMode: true, renderableTasks: tasks });
    const rows = el.shadowRoot!.querySelectorAll('lucarne-task-row');
    assert.equal(rows.length, 1, 'completed task hidden');
    const badge = el.shadowRoot!.querySelector('.count-badge');
    assert.equal(badge!.textContent, '1');
  });

  it('raw mode wraps todo items into task rows', async () => {
    const items = [makeTodoItem({ uid: 'r1', summary: 'Buy milk' })];
    const el = await makeEl({ items });
    const rows = el.shadowRoot!.querySelectorAll('lucarne-task-row');
    assert.equal(rows.length, 1, 'one task row for the raw item');
  });

  it('clicking a row in integration mode bubbles a task-toggle event with the task payload', async () => {
    const tasks = [makeRenderable({ uid: 'click-me' })];
    const el = await makeEl({ integrationMode: true, renderableTasks: tasks });

    const events: CustomEvent[] = [];
    el.addEventListener('task-toggle', (e) => events.push(e as CustomEvent));

    const row = el.shadowRoot!.querySelector('lucarne-task-row')?.shadowRoot?.querySelector('.row') as HTMLElement | null;
    assert.ok(row, 'task row .row rendered');
    row!.click();

    assert.equal(events.length, 1, 'task-toggle bubbled');
    assert.equal(events[0].detail.task.uid, 'click-me');
  });

  it('shows "+N more" when there are more than 3 active tasks', async () => {
    const tasks = Array.from({ length: 5 }, (_, i) =>
      makeRenderable({ uid: `t${i}`, summary: `Task ${i}` }),
    );
    const el = await makeEl({ integrationMode: true, renderableTasks: tasks });
    const more = el.shadowRoot!.querySelector('.more-row');
    assert.ok(more, '"+N more" row shown');
    assert.match(more!.textContent ?? '', /2/, 'count 2 shown (5 active - 3 visible)');
  });
});
