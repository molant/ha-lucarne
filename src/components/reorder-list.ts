import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface ReorderItem {
  /** Stable identity for the row, emitted in the reorder `order` array. */
  key: string;
  /** Human label used in the ↑/↓ button aria-labels (e.g. "Move Anna up"). */
  label?: string;
}

/**
 * Shared drag-to-reorder list used by the Today and Chores card editors.
 *
 * Renders a bordered list where each row has a grab handle (left), the caller's
 * content (middle, projected via a per-key named `<slot>`), and ↑/↓ buttons
 * (right). Slotting (rather than rendering caller markup inside this shadow root)
 * keeps the row content styled by the *host* editor's stylesheet. Reordering by
 * drag or arrows emits a single `reorder` event with the new key order; the host
 * owns the data.
 */
@customElement('lucarne-reorder-list')
export class LucarneReorderList extends LitElement {
  static styles = css`
    .reorder-list {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: var(--lucarne-radius-md, 12px);
      overflow: hidden;
    }
    .reorder-row {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      align-items: center;
      gap: var(--lucarne-spacing-sm, 8px);
      padding: var(--lucarne-spacing-sm, 8px) var(--lucarne-spacing-md, 12px);
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }
    .reorder-row + .reorder-row {
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }
    .reorder-row.dragging {
      opacity: 0.5;
    }
    .reorder-row.drag-over {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .grab-handle {
      cursor: grab;
      color: var(--lucarne-on-surface-muted, #727272);
      font-size: 1.2em;
      line-height: 1;
      user-select: none;
      padding: 0 var(--lucarne-spacing-xs, 4px);
    }
    .grab-handle:active {
      cursor: grabbing;
    }
    .reorder-content {
      min-width: 0;
    }
    .move-btn {
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.15));
      border-radius: var(--lucarne-radius-sm, 8px);
      padding: 2px 8px;
      font-size: 0.9em;
      color: var(--lucarne-on-surface-muted, #727272);
      cursor: pointer;
      min-width: 28px;
    }
    .move-btn:hover:not(:disabled) {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .move-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  `;

  @property({ attribute: false }) items: ReorderItem[] = [];
  /** Accessible label for the list. */
  @property() label = 'Reorderable list';

  @state() private _dragIndex: number | null = null;
  @state() private _dragOverIndex: number | null = null;

  private _emitReorder(from: number, to: number) {
    const n = this.items.length;
    if (from === to || from < 0 || to < 0 || from >= n || to >= n) return;
    const order = this.items.map((i) => i.key);
    const [moved] = order.splice(from, 1);
    order.splice(to, 0, moved);
    this.dispatchEvent(
      new CustomEvent('reorder', {
        detail: { from, to, order },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onDragStart(index: number, e: DragEvent) {
    this._dragIndex = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      // Some browsers require data to be set for a drag to begin.
      e.dataTransfer.setData('text/plain', String(index));
    }
  }

  private _onDragOver(index: number, e: DragEvent) {
    if (this._dragIndex === null || this._dragIndex === index) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    if (this._dragOverIndex !== index) this._dragOverIndex = index;
  }

  private _onDrop(index: number, e: DragEvent) {
    e.preventDefault();
    const from = this._dragIndex;
    this._dragIndex = null;
    this._dragOverIndex = null;
    if (from === null) return;
    this._emitReorder(from, index);
  }

  private _onDragEnd() {
    this._dragIndex = null;
    this._dragOverIndex = null;
  }

  render() {
    return html`
      <div class="reorder-list" role="list" aria-label=${this.label}>
        ${this.items.map((item, i) => html`
          <div
            class="reorder-row ${this._dragIndex === i ? 'dragging' : ''} ${this._dragOverIndex === i ? 'drag-over' : ''}"
            role="listitem"
            data-key=${item.key}
            draggable="true"
            @dragstart=${(e: DragEvent) => this._onDragStart(i, e)}
            @dragover=${(e: DragEvent) => this._onDragOver(i, e)}
            @drop=${(e: DragEvent) => this._onDrop(i, e)}
            @dragend=${this._onDragEnd}
          >
            <span class="grab-handle" aria-hidden="true" title="Drag to reorder">≡</span>
            <div class="reorder-content"><slot name=${item.key}></slot></div>
            <button
              class="move-btn move-up-btn"
              type="button"
              aria-label="Move ${item.label ?? 'item'} up"
              ?disabled=${i === 0}
              @click=${() => this._emitReorder(i, i - 1)}
            >↑</button>
            <button
              class="move-btn move-down-btn"
              type="button"
              aria-label="Move ${item.label ?? 'item'} down"
              ?disabled=${i === this.items.length - 1}
              @click=${() => this._emitReorder(i, i + 1)}
            >↓</button>
          </div>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-reorder-list': LucarneReorderList;
  }
}
