import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { LucarneReorderList, ReorderItem } from '../../src/components/reorder-list.js';

await import('../../src/components/reorder-list.js');

async function makeList(keys: string[]): Promise<LucarneReorderList> {
  const el = document.createElement('lucarne-reorder-list') as LucarneReorderList;
  el.items = keys.map((k): ReorderItem => ({ key: k, label: k }));
  // Content is provided as per-key slotted light DOM (as the editors do).
  for (const k of keys) {
    const span = document.createElement('span');
    span.setAttribute('slot', k);
    span.className = 'label';
    span.textContent = k;
    el.appendChild(span);
  }
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function rows(el: LucarneReorderList): HTMLElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>('.reorder-row'));
}

afterEach(() => {
  document.querySelectorAll('lucarne-reorder-list').forEach((el) => el.remove());
});

describe('lucarne-reorder-list', () => {
  it('renders one row per item with a grab handle and a per-key content slot', async () => {
    const el = await makeList(['a', 'b', 'c']);
    const r = rows(el);
    assert.equal(r.length, 3);
    assert.deepEqual(r.map((x) => x.dataset.key), ['a', 'b', 'c']);
    r.forEach((x) => {
      assert.equal(x.getAttribute('draggable'), 'true');
      assert.ok(x.querySelector('.grab-handle'), 'has grab handle');
    });
    // Content cell exposes a named slot per key; the label lives in light DOM.
    const slotNames = Array.from(el.shadowRoot!.querySelectorAll('.reorder-content slot')).map(
      (s) => s.getAttribute('name'),
    );
    assert.deepEqual(slotNames, ['a', 'b', 'c']);
    assert.equal(el.querySelector('span[slot="a"]')?.textContent, 'a');
  });

  it('disables ↑ on the first row and ↓ on the last', async () => {
    const el = await makeList(['a', 'b', 'c']);
    const r = rows(el);
    assert.equal((r[0].querySelector('.move-up-btn') as HTMLButtonElement).disabled, true);
    assert.equal((r[0].querySelector('.move-down-btn') as HTMLButtonElement).disabled, false);
    assert.equal((r[2].querySelector('.move-up-btn') as HTMLButtonElement).disabled, false);
    assert.equal((r[2].querySelector('.move-down-btn') as HTMLButtonElement).disabled, true);
  });

  it('emits reorder with the new key order when ↓ is clicked', async () => {
    const el = await makeList(['a', 'b', 'c']);
    const events: CustomEvent[] = [];
    el.addEventListener('reorder', (e) => events.push(e as CustomEvent));

    (rows(el)[0].querySelector('.move-down-btn') as HTMLButtonElement).click();

    assert.equal(events.length, 1);
    assert.deepEqual(events[0].detail.order, ['b', 'a', 'c']);
    assert.equal(events[0].detail.from, 0);
    assert.equal(events[0].detail.to, 1);
  });

  it('emits reorder with the new key order when ↑ is clicked', async () => {
    const el = await makeList(['a', 'b', 'c']);
    const events: CustomEvent[] = [];
    el.addEventListener('reorder', (e) => events.push(e as CustomEvent));

    (rows(el)[2].querySelector('.move-up-btn') as HTMLButtonElement).click();

    assert.equal(events.length, 1);
    assert.deepEqual(events[0].detail.order, ['a', 'c', 'b']);
  });

  it('emits reorder on drag-and-drop (drop last onto first)', async () => {
    const el = await makeList(['a', 'b', 'c']);
    const events: CustomEvent[] = [];
    el.addEventListener('reorder', (e) => events.push(e as CustomEvent));

    const dt = { effectAllowed: '', dropEffect: '', setData: () => {}, getData: () => '2' };
    const r = rows(el);
    r[2].dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: dt as unknown as DataTransfer }));
    r[0].dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt as unknown as DataTransfer }));
    r[0].dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt as unknown as DataTransfer }));

    assert.equal(events.length, 1);
    assert.deepEqual(events[0].detail.order, ['c', 'a', 'b']);
  });

  it('does not emit when dropping a row onto itself', async () => {
    const el = await makeList(['a', 'b', 'c']);
    const events: CustomEvent[] = [];
    el.addEventListener('reorder', (e) => events.push(e as CustomEvent));

    const dt = { effectAllowed: '', dropEffect: '', setData: () => {}, getData: () => '1' };
    const r = rows(el);
    r[1].dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: dt as unknown as DataTransfer }));
    r[1].dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt as unknown as DataTransfer }));

    assert.equal(events.length, 0, 'no reorder for a no-op drop');
  });
});
