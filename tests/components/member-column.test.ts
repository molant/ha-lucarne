import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { LucarneMemberColumn } from '../../src/components/member-column.js';
import type { MemberSummary, RenderableTask } from '../../src/shared/types.js';

await import('../../src/components/member-column.js');

const MEMBER: MemberSummary = {
  slug: 'anna',
  name: 'Anna',
  color: '#f5c89c',
  avatar: null,
  todo_entity_id: 'todo.anna',
  streak_counter_id: 'counter.anna_streak',
};

function makeTask(overrides: Partial<RenderableTask> = {}): RenderableTask {
  return {
    uid: 'uid-1',
    summary: 'Brush teeth',
    status: 'needs_action',
    due: null,
    description: '',
    metadata: {
      item_uid: 'uid-1',
      member_slug: 'anna',
      assignee_slug: '',
      type: 'routine',
      recurrence: 'FREQ=DAILY',
      icon: '🪥',
      source: 'template',
    },
    ...overrides,
  };
}

function makeEl(
  tasks: RenderableTask[] = [],
  opts: { showRoutines?: boolean; showTasks?: boolean; showStreak?: boolean } = {},
): LucarneMemberColumn {
  const el = document.createElement('lucarne-member-column') as LucarneMemberColumn;
  el.member = MEMBER;
  el.tasks = tasks;
  el.streak = 3;
  el.showRoutines = opts.showRoutines !== undefined ? opts.showRoutines : true;
  el.showTasks = opts.showTasks !== undefined ? opts.showTasks : true;
  el.showStreak = opts.showStreak !== undefined ? opts.showStreak : true;
  document.body.appendChild(el);
  return el;
}

function shadow(el: LucarneMemberColumn, sel: string) {
  return el.shadowRoot?.querySelector(sel) ?? null;
}

function shadowAll(el: LucarneMemberColumn, sel: string) {
  return Array.from(el.shadowRoot?.querySelectorAll(sel) ?? []);
}

afterEach(() => {
  document.querySelectorAll('lucarne-member-column').forEach((el) => el.remove());
});

describe('lucarne-member-column', () => {
  it('renders member name', async () => {
    const el = makeEl();
    await el.updateComplete;

    const nameEl = shadow(el, '.member-name');
    assert.ok(nameEl, '.member-name rendered');
    assert.equal(nameEl!.textContent, 'Anna');
  });

  it('renders routine tasks in Routines section', async () => {
    const routine = makeTask({ uid: 'r1', summary: 'Brush teeth', metadata: { ...makeTask().metadata, type: 'routine' } });
    const el = makeEl([routine]);
    await el.updateComplete;

    const headers = shadowAll(el, '.section-header');
    const headerTexts = headers.map((h) => h.textContent?.trim());
    assert.ok(headerTexts.includes('Routines'), 'Routines section header present');

    const rows = shadowAll(el, 'lucarne-task-row');
    assert.equal(rows.length, 1);
  });

  it('renders chore tasks in Tasks section', async () => {
    const chore = makeTask({
      uid: 'c1',
      summary: 'Take out trash',
      metadata: { ...makeTask().metadata, type: 'chore' },
    });
    const el = makeEl([chore]);
    await el.updateComplete;

    const headers = shadowAll(el, '.section-header');
    const headerTexts = headers.map((h) => h.textContent?.trim());
    assert.ok(headerTexts.includes('Tasks'), 'Tasks section header present');
  });

  it('hides Routines section when showRoutines=false', async () => {
    const routine = makeTask({ uid: 'r1', metadata: { ...makeTask().metadata, type: 'routine' } });
    const el = makeEl([routine], { showRoutines: false });
    await el.updateComplete;

    const headers = shadowAll(el, '.section-header');
    const headerTexts = headers.map((h) => h.textContent?.trim());
    assert.ok(!headerTexts.includes('Routines'), 'Routines section hidden');
  });

  it('hides Tasks section when showTasks=false', async () => {
    const chore = makeTask({ uid: 'c1', metadata: { ...makeTask().metadata, type: 'chore' } });
    const el = makeEl([chore], { showTasks: false });
    await el.updateComplete;

    const headers = shadowAll(el, '.section-header');
    const headerTexts = headers.map((h) => h.textContent?.trim());
    assert.ok(!headerTexts.includes('Tasks'), 'Tasks section hidden');
  });

  it('hides streak when showStreak=false', async () => {
    const el = makeEl([], { showStreak: false });
    await el.updateComplete;

    const streakArea = shadow(el, '.streak-area');
    assert.equal(streakArea, null, 'streak-area absent when showStreak=false');
  });

  it('shows streak when showStreak=true', async () => {
    const el = makeEl([], { showStreak: true });
    await el.updateComplete;

    const streakArea = shadow(el, '.streak-area');
    assert.ok(streakArea, 'streak-area present when showStreak=true');
  });

  it('fires add-task-clicked when + Add task button is clicked', async () => {
    const el = makeEl();
    await el.updateComplete;

    const events: CustomEvent[] = [];
    el.addEventListener('add-task-clicked', (e) => events.push(e as CustomEvent));

    const btn = shadow(el, '.add-task-btn') as HTMLButtonElement;
    assert.ok(btn, '+ Add task button present');
    btn.click();

    assert.equal(events.length, 1);
    assert.equal(events[0].detail.memberSlug, 'anna');
  });

  it('renders separate routines and chores sections for mixed task lists', async () => {
    const routine = makeTask({ uid: 'r1', summary: 'Brush teeth', metadata: { ...makeTask().metadata, type: 'routine' } });
    const chore = makeTask({ uid: 'c1', summary: 'Take out trash', metadata: { ...makeTask().metadata, type: 'chore' } });
    const el = makeEl([routine, chore]);
    await el.updateComplete;

    const headers = shadowAll(el, '.section-header');
    const headerTexts = headers.map((h) => h.textContent?.trim());
    assert.ok(headerTexts.includes('Routines'), 'Routines section present');
    assert.ok(headerTexts.includes('Tasks'), 'Tasks section present');

    const rows = shadowAll(el, 'lucarne-task-row');
    assert.equal(rows.length, 2, 'two task rows rendered');
  });

  it('does not show section header when section has no tasks', async () => {
    // Only routines, no chores
    const routine = makeTask({ uid: 'r1', metadata: { ...makeTask().metadata, type: 'routine' } });
    const el = makeEl([routine]);
    await el.updateComplete;

    const headers = shadowAll(el, '.section-header');
    const headerTexts = headers.map((h) => h.textContent?.trim());
    assert.ok(!headerTexts.includes('Tasks'), 'Tasks section header absent when no chores');
  });
});
