import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { LucarneFamilyReadyPill } from '../../src/components/family-ready-pill.js';
import type { MemberSummary, RenderableTask } from '../../src/shared/types.js';

await import('../../src/components/family-ready-pill.js');

const MEMBER_ANNA: MemberSummary = {
  slug: 'anna',
  name: 'Anna',
  color: '#f5c89c',
  avatar: null,
  todo_entity_id: 'todo.anna',
  streak_counter_id: 'counter.anna_streak',
};
const MEMBER_BOB: MemberSummary = {
  slug: 'bob',
  name: 'Bob',
  color: '#b8e0d2',
  avatar: null,
  todo_entity_id: 'todo.bob',
  streak_counter_id: 'counter.bob_streak',
};
const MEMBER_CEE: MemberSummary = {
  slug: 'cee',
  name: 'Cee',
  color: '#c8b4e0',
  avatar: null,
  todo_entity_id: 'todo.cee',
  streak_counter_id: 'counter.cee_streak',
};

function makeRoutine(slug: string, status: 'needs_action' | 'completed'): RenderableTask {
  return {
    uid: `${slug}-routine-1`,
    summary: 'Brush teeth',
    status,
    due: null,
    description: '',
    metadata: {
      item_uid: `${slug}-routine-1`,
      member_slug: slug,
      assignee_slug: '',
      type: 'routine',
      recurrence: 'FREQ=DAILY',
      icon: '🪥',
      source: 'template',
    },
  };
}

function makePill(
  members: MemberSummary[],
  tasksByMember: Map<string, RenderableTask[]>,
): LucarneFamilyReadyPill {
  const el = document.createElement('lucarne-family-ready-pill') as LucarneFamilyReadyPill;
  el.members = members;
  el.tasksByMember = tasksByMember;
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.querySelectorAll('lucarne-family-ready-pill').forEach((el) => el.remove());
});

describe('lucarne-family-ready-pill', () => {
  it('renders 0/0 state (no routines today) when members have no routines', async () => {
    const el = makePill(
      [MEMBER_ANNA, MEMBER_BOB],
      new Map([
        ['anna', []],
        ['bob', []],
      ]),
    );
    await el.updateComplete;
    const text = el.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    assert.ok(text.includes('no routines today'), `expected "no routines today" in "${text}"`);
  });

  it('renders 0/3 ready when no member has completed routines', async () => {
    const members = [MEMBER_ANNA, MEMBER_BOB, MEMBER_CEE];
    const tasks = new Map([
      ['anna', [makeRoutine('anna', 'needs_action')]],
      ['bob', [makeRoutine('bob', 'needs_action')]],
      ['cee', [makeRoutine('cee', 'needs_action')]],
    ]);
    const el = makePill(members, tasks);
    await el.updateComplete;
    const text = el.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    assert.ok(text.includes('0/3 ready'), `expected "0/3 ready" in "${text}"`);
  });

  it('renders 2/3 ready when 2 members completed all routines', async () => {
    const members = [MEMBER_ANNA, MEMBER_BOB, MEMBER_CEE];
    const tasks = new Map([
      ['anna', [makeRoutine('anna', 'completed')]],
      ['bob', [makeRoutine('bob', 'completed')]],
      ['cee', [makeRoutine('cee', 'needs_action')]],
    ]);
    const el = makePill(members, tasks);
    await el.updateComplete;
    const text = el.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    assert.ok(text.includes('2/3 ready'), `expected "2/3 ready" in "${text}"`);
  });

  it('renders 3/3 ready (all done) when all members completed all routines', async () => {
    const members = [MEMBER_ANNA, MEMBER_BOB, MEMBER_CEE];
    const tasks = new Map([
      ['anna', [makeRoutine('anna', 'completed')]],
      ['bob', [makeRoutine('bob', 'completed')]],
      ['cee', [makeRoutine('cee', 'completed')]],
    ]);
    const el = makePill(members, tasks);
    await el.updateComplete;
    const text = el.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    assert.ok(text.includes('3/3 ready'), `expected "3/3 ready" in "${text}"`);
    // should also have all-done class
    const pill = el.shadowRoot!.querySelector('.pill');
    assert.ok(pill?.classList.contains('all-done'), 'pill has all-done class');
  });

  it('dispatches family-ready-clicked event on pill click', async () => {
    const members = [MEMBER_ANNA];
    const tasks = new Map([['anna', [makeRoutine('anna', 'needs_action')]]]);
    const el = makePill(members, tasks);
    await el.updateComplete;

    let fired = false;
    el.addEventListener('family-ready-clicked', () => { fired = true; });
    (el.shadowRoot!.querySelector('.pill') as HTMLElement).click();
    assert.ok(fired, 'family-ready-clicked event dispatched');
  });

  it('skips members with no routines when computing readiness', async () => {
    // anna has routines, bob has none — M should be 1 (only anna), N depends on anna
    const members = [MEMBER_ANNA, MEMBER_BOB];
    const tasks = new Map([
      ['anna', [makeRoutine('anna', 'completed')]],
      ['bob', []], // no routines
    ]);
    const el = makePill(members, tasks);
    await el.updateComplete;
    const text = el.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    assert.ok(text.includes('1/1 ready'), `expected "1/1 ready" in "${text}"`);
  });
});
