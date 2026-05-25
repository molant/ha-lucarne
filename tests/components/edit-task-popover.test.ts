import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { LucarneEditTaskPopover } from '../../src/components/edit-task-popover.js';
import type { MemberSummary, RenderableTask, HomeAssistant } from '../../src/shared/types.js';
import { makeFakeHass } from '../setup/ha-mock.mjs';

await import('../../src/components/edit-task-popover.js');

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

function makeTask(overrides: Partial<RenderableTask> = {}): RenderableTask {
  return {
    uid: 'task-uid-1',
    summary: 'Brush teeth',
    status: 'needs_action',
    due: null,
    description: '',
    metadata: {
      item_uid: 'task-uid-1',
      member_slug: 'anna',
      assignee_slug: '',
      type: 'routine',
      recurrence: 'FREQ=DAILY',
      icon: '🪥',
      source: 'manual',
    },
    ...overrides,
  };
}

async function makeEl(
  task = makeTask(),
  members = [MEMBER_ANNA, MEMBER_BOB, HOUSEHOLD],
): Promise<LucarneEditTaskPopover> {
  const el = document.createElement('lucarne-edit-task-popover') as LucarneEditTaskPopover;
  el.hass = makeFakeHass() as unknown as HomeAssistant;
  el.task = task;
  el.members = members;
  document.body.appendChild(el);
  // Wait for first render + updated() → _prefill(), then second render from _prefill() state changes
  await el.updateComplete;
  await el.updateComplete;
  return el;
}

function shadow(el: LucarneEditTaskPopover, sel: string) {
  return el.shadowRoot?.querySelector(sel) ?? null;
}

afterEach(() => {
  document.querySelectorAll('lucarne-edit-task-popover').forEach((el) => el.remove());
});

describe('lucarne-edit-task-popover', () => {
  it('renders the Edit Task popover', async () => {
    const el = await makeEl();

    const title = shadow(el, '.popover-title');
    assert.ok(title, 'popover-title rendered');
    assert.equal(title!.textContent, 'Edit Task');
  });

  it('prefills summary from task', async () => {
    const el = await makeEl();

    const summaryInput = shadow(el, '#et-summary') as HTMLInputElement;
    assert.equal(summaryInput.value, 'Brush teeth');
  });

  it('prefills type button from task', async () => {
    const task = makeTask({
      metadata: {
        item_uid: 'task-uid-1',
        member_slug: 'anna',
        assignee_slug: '',
        type: 'chore',
        recurrence: '',
        icon: '',
        source: 'manual',
      },
    });
    const el = await makeEl(task);

    const choreBtn = Array.from(el.shadowRoot!.querySelectorAll('.type-btn')).find(
      (b) => b.textContent?.trim() === 'Chore',
    ) as HTMLButtonElement;
    assert.ok(choreBtn?.classList.contains('active'), 'Chore type button is active');
  });

  it('calls todo.update_item on save when summary changes', async () => {
    const el = await makeEl();
    const fakeHass = el.hass as unknown as ReturnType<typeof makeFakeHass>;

    const summaryInput = shadow(el, '#et-summary') as HTMLInputElement;
    summaryInput.value = 'Brush teeth thoroughly';
    summaryInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
    await el.updateComplete;

    const saveBtn = shadow(el, '.btn-save') as HTMLButtonElement;
    saveBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    const todoCall = (fakeHass.calls.callService as any[]).find((c: any) => c.domain === 'todo');
    assert.ok(todoCall, 'todo.update_item was called');
    assert.equal(todoCall.service, 'update_item');
    assert.equal(todoCall.payload.item, 'task-uid-1');
    assert.equal(todoCall.payload.rename, 'Brush teeth thoroughly', 'rename always included');
  });

  it('calls updateTaskMetadata when type changes', async () => {
    const el = await makeEl();
    const fakeHass = el.hass as unknown as ReturnType<typeof makeFakeHass>;

    const choreBtn = Array.from(el.shadowRoot!.querySelectorAll('.type-btn')).find(
      (b) => b.textContent?.trim() === 'Chore',
    ) as HTMLButtonElement;
    choreBtn?.click();
    await el.updateComplete;

    const saveBtn = shadow(el, '.btn-save') as HTMLButtonElement;
    saveBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    const metaCall = (fakeHass.calls.callService as any[]).find(
      (c: any) => c.service === 'update_task_metadata',
    );
    assert.ok(metaCall, 'update_task_metadata was called');
    assert.equal(metaCall.payload.uid, 'task-uid-1');
    assert.equal(metaCall.payload.type, 'chore');

    // todo.update_item should NOT be called (summary and due unchanged)
    const todoCall = (fakeHass.calls.callService as any[]).find((c: any) => c.domain === 'todo');
    assert.equal(todoCall, undefined, 'todo.update_item not called when only metadata changes');
  });

  it('calls updateTaskMetadata for household assignee edit', async () => {
    const task = makeTask({
      summary: 'Clean kitchen',
      metadata: {
        item_uid: 'task-uid-1',
        member_slug: 'household',
        assignee_slug: '',
        type: 'chore',
        recurrence: '',
        icon: '',
        source: 'manual',
      },
    });
    const el = await makeEl(task);
    const fakeHass = el.hass as unknown as ReturnType<typeof makeFakeHass>;

    const assigneeSelect = shadow(el, '#et-assignee') as HTMLSelectElement;
    assert.ok(assigneeSelect, 'assignee select shown for household task');
    assigneeSelect.value = 'anna';
    assigneeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    const saveBtn = shadow(el, '.btn-save') as HTMLButtonElement;
    saveBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    const metaCall = (fakeHass.calls.callService as any[]).find(
      (c: any) => c.service === 'update_task_metadata',
    );
    assert.ok(metaCall, 'update_task_metadata was called');
    assert.equal(metaCall.payload.uid, 'task-uid-1');
    assert.equal(metaCall.payload.assignee, 'anna');
  });

  it('does not show assignee select for non-household member', async () => {
    const el = await makeEl();

    const assigneeSelect = shadow(el, '#et-assignee');
    assert.equal(assigneeSelect, null, 'no assignee select for non-household task');
  });

  it('shows error when summary is empty', async () => {
    const el = await makeEl();

    const summaryInput = shadow(el, '#et-summary') as HTMLInputElement;
    summaryInput.value = '';
    summaryInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
    await el.updateComplete;

    const saveBtn = shadow(el, '.btn-save') as HTMLButtonElement;
    saveBtn.click();
    await el.updateComplete;

    const errorMsg = shadow(el, '.error-msg');
    assert.ok(errorMsg, 'error message shown');
    assert.ok(errorMsg!.textContent!.toLowerCase().includes('required'));
  });

  it('delete confirmation flow — shows confirm UI then calls delete_task', async () => {
    const el = await makeEl();
    const fakeHass = el.hass as unknown as ReturnType<typeof makeFakeHass>;

    // Initially no confirmation UI
    let confirmZone = shadow(el, '.confirm-delete');
    assert.equal(confirmZone, null, 'confirm-delete hidden initially');

    // Click Delete Task to enter confirmation state
    const deleteBtn = shadow(el, '.btn-delete') as HTMLButtonElement;
    deleteBtn.click();
    await el.updateComplete;

    // Confirmation should now appear
    confirmZone = shadow(el, '.confirm-delete');
    assert.ok(confirmZone, 'confirm-delete shown after delete click');

    // Click the confirm button (has background:f44336)
    const confirmBtn = Array.from(confirmZone!.querySelectorAll('button')).find((b) =>
      b.style.background.includes('f44336') || b.textContent?.includes('Yes'),
    ) as HTMLButtonElement;
    assert.ok(confirmBtn, 'confirmation button found');
    confirmBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    const deleteCall = (fakeHass.calls.callService as any[]).find(
      (c: any) => c.service === 'delete_task',
    );
    assert.ok(deleteCall, 'delete_task was called');
    assert.equal(deleteCall.payload.uid, 'task-uid-1');
  });

  it('fires popover-close on Cancel click', async () => {
    const el = await makeEl();

    const events: Event[] = [];
    el.addEventListener('popover-close', (e) => events.push(e));

    const cancelBtn = shadow(el, '.btn-cancel') as HTMLButtonElement;
    cancelBtn.click();

    assert.equal(events.length, 1);
  });

  it('fires popover-close on backdrop click', async () => {
    const el = await makeEl();

    const events: Event[] = [];
    el.addEventListener('popover-close', (e) => events.push(e));

    const backdrop = shadow(el, '.backdrop') as HTMLElement;
    backdrop.click();

    assert.equal(events.length, 1);
  });

  it('shows error when user tries to clear an existing due date (HA cannot clear via API)', async () => {
    const task = makeTask({
      due: '2026-05-25T09:00',
      metadata: {
        item_uid: 'task-uid-1',
        member_slug: 'anna',
        assignee_slug: '',
        type: 'routine',
        recurrence: 'FREQ=DAILY',
        icon: '',
        source: 'manual',
      },
    });
    const el = await makeEl(task);
    const fakeHass = el.hass as unknown as ReturnType<typeof makeFakeHass>;

    // Clear the due date field
    const dueInput = shadow(el, '#et-due') as HTMLInputElement;
    dueInput.value = '';
    dueInput.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    const saveBtn = shadow(el, '.btn-save') as HTMLButtonElement;
    saveBtn.click();
    await el.updateComplete;

    // Should show an error and NOT close/save
    const errorMsg = shadow(el, '.error-msg');
    assert.ok(errorMsg, 'error message shown');
    assert.ok(errorMsg!.textContent!.toLowerCase().includes('cannot be cleared') ||
              errorMsg!.textContent!.toLowerCase().includes('delete'), 'error explains the limitation');
    const todoCall = (fakeHass.calls.callService as any[]).find((c: any) => c.domain === 'todo');
    assert.equal(todoCall, undefined, 'no service call made');
  });

  it('calls todo.update_item with due_datetime when setting a new due date', async () => {
    const task = makeTask({ due: null });
    const el = await makeEl(task);
    const fakeHass = el.hass as unknown as ReturnType<typeof makeFakeHass>;

    const dueInput = shadow(el, '#et-due') as HTMLInputElement;
    dueInput.value = '2026-06-01T10:00';
    dueInput.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    const saveBtn = shadow(el, '.btn-save') as HTMLButtonElement;
    saveBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    const todoCall = (fakeHass.calls.callService as any[]).find((c: any) => c.domain === 'todo');
    assert.ok(todoCall, 'todo.update_item called when setting new due');
    assert.equal(todoCall.payload.due_datetime, '2026-06-01T10:00');
    assert.ok('rename' in todoCall.payload, 'rename always included to satisfy HA schema');
  });

  it('shows error when weekly recurrence has no days selected', async () => {
    const el = await makeEl();

    // Switch recurrence to weekly
    const recurrenceSelect = shadow(el, '#et-recurrence') as HTMLSelectElement;
    recurrenceSelect.value = 'weekly';
    recurrenceSelect.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    // Save without selecting any days
    const saveBtn = shadow(el, '.btn-save') as HTMLButtonElement;
    saveBtn.click();
    await el.updateComplete;

    const errorMsg = shadow(el, '.error-msg');
    assert.ok(errorMsg, 'error shown');
    assert.ok(errorMsg!.textContent!.toLowerCase().includes('day'), 'error mentions day selection');

    // update_task_metadata should NOT have been called
    const fakeHass = el.hass as unknown as ReturnType<typeof makeFakeHass>;
    const metaCall = (fakeHass.calls.callService as any[]).find((c: any) => c.service === 'update_task_metadata');
    assert.equal(metaCall, undefined, 'update_task_metadata not called');
  });

  it('reusing same element for different task does not carry over stale recurrence state', async () => {
    const taskA = makeTask({
      metadata: {
        item_uid: 'task-uid-1',
        member_slug: 'anna',
        assignee_slug: '',
        type: 'routine',
        recurrence: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;INTERVAL=2',
        icon: '',
        source: 'manual',
      },
    });
    const el = await makeEl(taskA);

    // Reassign to a task with no recurrence
    const taskB: typeof taskA = {
      ...taskA,
      uid: 'task-uid-2',
      summary: 'Different task',
      metadata: { ...taskA.metadata, item_uid: 'task-uid-2', recurrence: '' },
    };
    el.task = taskB;
    await el.updateComplete;
    await el.updateComplete;

    const fakeHass = el.hass as unknown as ReturnType<typeof makeFakeHass>;

    // Save without changes — should not emit weekly BYDAY or INTERVAL from task A
    const saveBtn = shadow(el, '.btn-save') as HTMLButtonElement;
    saveBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    // No metadata change because recurrence matches (both are none/empty)
    const metaCall = (fakeHass.calls.callService as any[]).find(
      (c: any) => c.service === 'update_task_metadata',
    );
    if (metaCall) {
      // If called, recurrence should not be the stale weekly value
      assert.notEqual(metaCall.payload.recurrence, 'FREQ=WEEKLY;BYDAY=MO,WE,FR;INTERVAL=2');
    }
  });

  it('shows custom recurrence as read-only note', async () => {
    const task = makeTask({
      metadata: {
        item_uid: 'task-uid-1',
        member_slug: 'anna',
        assignee_slug: '',
        type: 'routine',
        recurrence: 'FREQ=DAILY;COUNT=5',
        icon: '',
        source: 'manual',
      },
    });
    const el = await makeEl(task);

    const customNote = shadow(el, '.custom-recurrence-note');
    assert.ok(customNote, 'custom recurrence note shown');
    assert.ok(customNote!.textContent!.includes('Custom recurrence'), 'note says Custom recurrence');

    // Recurrence select should NOT be rendered
    const recurrenceSelect = shadow(el, '#et-recurrence');
    assert.equal(recurrenceSelect, null, 'recurrence select hidden for custom recurrence');
  });
});
