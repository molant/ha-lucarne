import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { LucarneTodayCardEditor } from '../../src/editors/lucarne-today-card-editor.js';
import type { LucarneTodayCardConfig } from '../../src/cards/lucarne-today-card.js';
import type { HomeAssistant } from '../../src/shared/types.js';
import { makeFakeHass } from '../setup/ha-mock.mjs';

// The editor lazy-loads HA form elements; pre-register no-op stubs so
// `ensureHaFormElements()` resolves immediately instead of waiting for
// HA's runtime registration (which never happens in this test env).
for (const tag of ['ha-entity-picker', 'ha-textfield']) {
  if (!customElements.get(tag)) {
    customElements.define(tag, class extends HTMLElement {});
  }
}

await import('../../src/editors/lucarne-today-card-editor.js');

const BASE_CONFIG: LucarneTodayCardConfig = {
  type: 'custom:lucarne-today-card',
  calendars: [{ entity: 'calendar.family', color: '#a8d8b9' }],
};

async function makeEditor(
  configOverrides: Partial<LucarneTodayCardConfig> = {},
): Promise<LucarneTodayCardEditor> {
  const el = document.createElement('lucarne-today-card-editor') as LucarneTodayCardEditor;
  el.setConfig({ ...BASE_CONFIG, ...configOverrides });
  el.hass = makeFakeHass() as unknown as HomeAssistant;
  document.body.appendChild(el);
  await el.updateComplete;
  // Editor lazy-loads HA elements; wait for the resulting render.
  await new Promise((r) => setTimeout(r, 30));
  await el.updateComplete;
  return el;
}

function getSectionOrder(el: LucarneTodayCardEditor): string[] {
  return Array.from(
    el.shadowRoot!.querySelectorAll<HTMLElement>('.section-order-row'),
  ).map((row) => row.dataset.section ?? '');
}

afterEach(() => {
  document.querySelectorAll('lucarne-today-card-editor').forEach((el) => el.remove());
});

describe('lucarne-today-card-editor — section order', () => {
  it('renders three section rows in default order', async () => {
    const el = await makeEditor();
    assert.deepEqual(getSectionOrder(el), ['calendar', 'weather', 'tasks']);
  });

  it('renders rows in the user-configured order', async () => {
    const el = await makeEditor({ section_order: ['tasks', 'weather', 'calendar'] });
    assert.deepEqual(getSectionOrder(el), ['tasks', 'weather', 'calendar']);
  });

  it('clicking ↓ on the first row swaps the first two sections', async () => {
    const el = await makeEditor();

    const events: CustomEvent[] = [];
    el.addEventListener('config-changed', (e) => events.push(e as CustomEvent));

    const firstRow = el.shadowRoot!.querySelector<HTMLElement>('.section-order-row');
    assert.ok(firstRow, 'first row rendered');
    const downBtn = firstRow!.querySelector<HTMLButtonElement>(
      'button.move-btn[aria-label$="down"]',
    );
    assert.ok(downBtn, '↓ button rendered');
    downBtn!.click();

    assert.equal(events.length, 1, 'config-changed fired once');
    assert.deepEqual(events[0].detail.config.section_order, ['weather', 'calendar', 'tasks']);
  });

  it('clicking ↑ on the last row swaps the last two sections', async () => {
    const el = await makeEditor();

    const events: CustomEvent[] = [];
    el.addEventListener('config-changed', (e) => events.push(e as CustomEvent));

    const rows = el.shadowRoot!.querySelectorAll<HTMLElement>('.section-order-row');
    const lastRow = rows[rows.length - 1];
    const upBtn = lastRow.querySelector<HTMLButtonElement>(
      'button.move-btn[aria-label$="up"]',
    );
    upBtn!.click();

    assert.equal(events.length, 1);
    assert.deepEqual(events[0].detail.config.section_order, ['calendar', 'tasks', 'weather']);
  });

  it('↑ on the first row is disabled', async () => {
    const el = await makeEditor();
    const firstRow = el.shadowRoot!.querySelector<HTMLElement>('.section-order-row');
    const upBtn = firstRow!.querySelector<HTMLButtonElement>(
      'button.move-btn[aria-label$="up"]',
    );
    assert.equal(upBtn!.disabled, true);
  });

  it('↓ on the last row is disabled', async () => {
    const el = await makeEditor();
    const rows = el.shadowRoot!.querySelectorAll<HTMLElement>('.section-order-row');
    const downBtn = rows[rows.length - 1].querySelector<HTMLButtonElement>(
      'button.move-btn[aria-label$="down"]',
    );
    assert.equal(downBtn!.disabled, true);
  });

  it('drag-and-drop reorders sections (drop tasks onto calendar slot)', async () => {
    const el = await makeEditor();

    const events: CustomEvent[] = [];
    el.addEventListener('config-changed', (e) => events.push(e as CustomEvent));

    const rows = el.shadowRoot!.querySelectorAll<HTMLElement>('.section-order-row');
    const tasksRow = rows[2]; // tasks
    const calendarRow = rows[0]; // calendar

    const dataTransfer = {
      effectAllowed: '',
      dropEffect: '',
      setData: () => {},
      getData: () => '2',
    };

    tasksRow.dispatchEvent(
      new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: dataTransfer as unknown as DataTransfer }),
    );
    calendarRow.dispatchEvent(
      new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dataTransfer as unknown as DataTransfer }),
    );
    calendarRow.dispatchEvent(
      new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dataTransfer as unknown as DataTransfer }),
    );

    assert.equal(events.length, 1, 'config-changed fired after drop');
    assert.deepEqual(
      events[0].detail.config.section_order,
      ['tasks', 'calendar', 'weather'],
      'tasks moved into position 0',
    );
  });
});
