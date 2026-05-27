import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { LucarneAddTaskPopover } from '../../src/components/add-task-popover.js';
import type { MemberSummary, HomeAssistant } from '../../src/shared/types.js';
import { makeFakeHass } from '../setup/ha-mock.mjs';

await import('../../src/components/add-task-popover.js');

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

const HOUSEHOLD: MemberSummary = {
  slug: 'household',
  name: 'Household',
  color: 'var(--primary-color)',
  avatar: null,
  todo_entity_id: 'todo.lucarne_household',
  streak_counter_id: '',
};

function makeEl(member = MEMBER_ANNA, members = [MEMBER_ANNA, MEMBER_BOB, HOUSEHOLD]): LucarneAddTaskPopover {
  const el = document.createElement('lucarne-add-task-popover') as LucarneAddTaskPopover;
  el.hass = makeFakeHass() as unknown as HomeAssistant;
  el.member = member;
  el.members = members;
  document.body.appendChild(el);
  return el;
}

function shadow(el: LucarneAddTaskPopover, sel: string) {
  return el.shadowRoot?.querySelector(sel) ?? null;
}

afterEach(() => {
  document.querySelectorAll('lucarne-add-task-popover').forEach((el) => el.remove());
});

describe('lucarne-add-task-popover', () => {
  it('renders the Add Task popover', async () => {
    const el = makeEl();
    await el.updateComplete;

    const title = shadow(el, '.popover-title');
    assert.ok(title, 'popover-title rendered');
    assert.equal(title!.textContent, 'Add Task');
  });

  it('calls lucarne_family.add_task on submit with correct payload', async () => {
    const el = makeEl();
    await el.updateComplete;

    const fakeHass = el.hass as unknown as ReturnType<typeof makeFakeHass>;

    const summaryInput = shadow(el, '#at-summary') as HTMLInputElement;
    summaryInput.value = 'Brush teeth';
    summaryInput.dispatchEvent(new InputEvent('input', { bubbles: true }));

    // Select Routine type via the Type <select>
    const typeSelect = shadow(el, '#at-type') as HTMLSelectElement;
    assert.ok(typeSelect, 'Type select renders');
    typeSelect.value = 'routine';
    typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    const submitBtn = shadow(el, '.btn-submit') as HTMLButtonElement;
    submitBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    assert.equal(fakeHass.calls.callService.length, 1);
    const call = fakeHass.calls.callService[0] as any;
    assert.equal(call.domain, 'lucarne_family');
    assert.equal(call.service, 'add_task');
    assert.equal(call.payload.member, 'anna');
    assert.equal(call.payload.summary, 'Brush teeth');
    assert.equal(call.payload.type, 'routine');
  });

  it('shows error when summary is empty', async () => {
    const el = makeEl();
    await el.updateComplete;

    const submitBtn = shadow(el, '.btn-submit') as HTMLButtonElement;
    submitBtn.click();
    await el.updateComplete;

    const errorMsg = shadow(el, '.error-msg');
    assert.ok(errorMsg, 'error message shown');
    assert.ok(errorMsg!.textContent!.toLowerCase().includes('required'));
  });

  it('fires popover-close on Cancel click', async () => {
    const el = makeEl();
    await el.updateComplete;

    const events: Event[] = [];
    el.addEventListener('popover-close', (e) => events.push(e));

    const cancelBtn = shadow(el, '.btn-cancel') as HTMLButtonElement;
    cancelBtn.click();

    assert.equal(events.length, 1);
  });

  it('fires popover-close on backdrop click', async () => {
    const el = makeEl();
    await el.updateComplete;

    const events: Event[] = [];
    el.addEventListener('popover-close', (e) => events.push(e));

    const backdrop = shadow(el, '.backdrop') as HTMLElement;
    backdrop.click();

    assert.equal(events.length, 1);
  });

  it('renders no Assignee field, even for household tasks', async () => {
    const el = makeEl(HOUSEHOLD);
    await el.updateComplete;

    assert.equal(shadow(el, '#at-assignee'), null, 'assignee select is gone');
    const labels = Array.from(el.shadowRoot!.querySelectorAll('label')).map(
      (l) => l.textContent?.trim() ?? '',
    );
    assert.ok(
      !labels.some((t) => t.toLowerCase().startsWith('assignee')),
      `no Assignee label (found: ${labels.join(', ')})`,
    );
  });

  it('omits assignee from add_task payload for household tasks', async () => {
    const el = makeEl(HOUSEHOLD);
    await el.updateComplete;

    const fakeHass = el.hass as unknown as ReturnType<typeof makeFakeHass>;

    const summaryInput = shadow(el, '#at-summary') as HTMLInputElement;
    summaryInput.value = 'Feed dog';
    summaryInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
    await el.updateComplete;

    const submitBtn = shadow(el, '.btn-submit') as HTMLButtonElement;
    submitBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    const call = fakeHass.calls.callService[0] as any;
    assert.equal(call.payload.member, 'household');
    assert.ok(!('assignee' in call.payload), 'assignee never sent from Add Task');
  });

  it('omits assignee from add_task payload for non-household tasks', async () => {
    const el = makeEl(MEMBER_ANNA);
    await el.updateComplete;

    const fakeHass = el.hass as unknown as ReturnType<typeof makeFakeHass>;

    const summaryInput = shadow(el, '#at-summary') as HTMLInputElement;
    summaryInput.value = 'Make bed';
    summaryInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
    await el.updateComplete;

    const submitBtn = shadow(el, '.btn-submit') as HTMLButtonElement;
    submitBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    const call = fakeHass.calls.callService[0] as any;
    assert.ok(!('assignee' in call.payload), 'assignee not sent for non-household member');
  });

  it('renders Type as a <select> with Routine and Chore options', async () => {
    const el = makeEl();
    await el.updateComplete;

    const typeSelect = shadow(el, '#at-type') as HTMLSelectElement;
    assert.ok(typeSelect, 'Type select exists');
    const values = Array.from(typeSelect.options).map((o) => o.value).sort();
    assert.deepEqual(values, ['chore', 'routine']);
    assert.equal(shadow(el, '.type-btn'), null, 'old type buttons removed');
  });

  it('hides Recurrence when type is chore (default)', async () => {
    const el = makeEl();
    await el.updateComplete;

    assert.equal(shadow(el, '#at-recurrence'), null, 'recurrence select hidden for chore');
  });

  it('shows Recurrence when type switched to routine', async () => {
    const el = makeEl();
    await el.updateComplete;

    const typeSelect = shadow(el, '#at-type') as HTMLSelectElement;
    typeSelect.value = 'routine';
    typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    assert.ok(shadow(el, '#at-recurrence'), 'recurrence select shown for routine');
  });

  it('allows chore submit after picking Routine+Weekly with no days, then switching to Chore', async () => {
    const el = makeEl();
    await el.updateComplete;
    const fakeHass = el.hass as unknown as ReturnType<typeof makeFakeHass>;

    // Routine + Weekly (no days picked) → would fail validation if guard isn't type-scoped.
    const typeSelect = shadow(el, '#at-type') as HTMLSelectElement;
    typeSelect.value = 'routine';
    typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    const recurSelect = shadow(el, '#at-recurrence') as HTMLSelectElement;
    recurSelect.value = 'weekly';
    recurSelect.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    // Switch back to Chore — recurrence picker is now hidden, but state lingers.
    typeSelect.value = 'chore';
    typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    const summaryInput = shadow(el, '#at-summary') as HTMLInputElement;
    summaryInput.value = 'Mow lawn';
    summaryInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
    await el.updateComplete;

    (shadow(el, '.btn-submit') as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 50));

    assert.equal(shadow(el, '.error-msg'), null, 'no validation error for chore');
    assert.equal(fakeHass.calls.callService.length, 1, 'add_task was called');
    const call = fakeHass.calls.callService[0] as any;
    assert.equal(call.payload.type, 'chore');
    assert.ok(!('recurrence' in call.payload), 'chore payload has no recurrence');
  });

  it('omits due from payload for routine even if a due date was picked as a chore', async () => {
    const el = makeEl();
    await el.updateComplete;
    const fakeHass = el.hass as unknown as ReturnType<typeof makeFakeHass>;

    // Default is chore — pick a due date (UI shows the datetime-local for chores).
    const dueInput = shadow(el, '#at-due') as HTMLInputElement;
    assert.ok(dueInput, 'Due input visible for chore');
    dueInput.value = '2099-01-15T08:30';
    dueInput.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    // Switch to routine — Due field becomes hidden but _due state lingers.
    const typeSelect = shadow(el, '#at-type') as HTMLSelectElement;
    typeSelect.value = 'routine';
    typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;
    assert.equal(shadow(el, '#at-due'), null, 'Due input hidden for routine');

    const summaryInput = shadow(el, '#at-summary') as HTMLInputElement;
    summaryInput.value = 'Brush teeth';
    summaryInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
    await el.updateComplete;

    (shadow(el, '.btn-submit') as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 50));

    const call = fakeHass.calls.callService[0] as any;
    assert.equal(call.payload.type, 'routine');
    assert.ok(!('due' in call.payload), `routine must not carry due (got ${JSON.stringify(call.payload)})`);
  });

  it('omits recurrence from payload for chore even if RRULE state lingers', async () => {
    const el = makeEl();
    await el.updateComplete;
    const fakeHass = el.hass as unknown as ReturnType<typeof makeFakeHass>;

    // Simulate the user picking Routine + Daily, then flipping back to Chore.
    const typeSelect = shadow(el, '#at-type') as HTMLSelectElement;
    typeSelect.value = 'routine';
    typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    const recurSelect = shadow(el, '#at-recurrence') as HTMLSelectElement;
    recurSelect.value = 'daily';
    recurSelect.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    typeSelect.value = 'chore';
    typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    const summaryInput = shadow(el, '#at-summary') as HTMLInputElement;
    summaryInput.value = 'Clean garage';
    summaryInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
    await el.updateComplete;

    (shadow(el, '.btn-submit') as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 50));

    const call = fakeHass.calls.callService[0] as any;
    assert.equal(call.payload.type, 'chore');
    assert.ok(!('recurrence' in call.payload), `chore must not carry recurrence (got ${JSON.stringify(call.payload)})`);
  });
});
