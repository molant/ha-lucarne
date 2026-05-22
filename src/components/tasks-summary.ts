import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { iconCheck } from '../shared/icons.js';
import { STRINGS } from '../shared/strings.js';
import type { TodoItem } from '../shared/types.js';

@customElement('lucarne-tasks-summary')
export class LucarneTasksSummary extends LitElement {
  static styles = [
    lucarneStyles,
    css`
      :host {
        display: block;
        padding: var(--lucarne-spacing-md) var(--lucarne-spacing-lg);
      }
      .header {
        display: flex;
        align-items: baseline;
        gap: var(--lucarne-spacing-sm);
        margin-bottom: var(--lucarne-spacing-sm);
        font-size: var(--lucarne-fs-sm);
        font-weight: 600;
        color: var(--lucarne-on-surface-muted);
        letter-spacing: 0.03em;
        text-transform: uppercase;
      }
      .count-badge {
        background: var(--lucarne-color-ingrid);
        color: #5b3f7e;
        padding: 1px 7px;
        border-radius: var(--lucarne-radius-lg);
        font-size: 0.8em;
        font-weight: 700;
      }
      .task-row {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
        padding: var(--lucarne-spacing-xs) 0;
        font-size: var(--lucarne-fs-md);
        color: var(--lucarne-on-surface);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
      .task-row:last-of-type {
        border-bottom: none;
      }
      .due-chip {
        font-size: 0.75em;
        color: var(--lucarne-on-surface-muted);
        background: rgba(0, 0, 0, 0.06);
        padding: 1px 6px;
        border-radius: var(--lucarne-radius-sm);
        margin-left: auto;
        white-space: nowrap;
      }
      .more-row {
        padding: var(--lucarne-spacing-xs) 0 0;
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        cursor: pointer;
        text-decoration: underline dotted;
      }
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--lucarne-spacing-sm);
        padding: var(--lucarne-spacing-lg) 0;
        color: #4caf50;
        font-size: var(--lucarne-fs-md);
      }
      .empty-icon {
        width: 28px;
        height: 28px;
        color: #4caf50;
      }
    `,
  ];

  @property({ type: Array }) items: TodoItem[] = [];
  @property({ type: String }) todoEntityId?: string;

  private _handleMoreClick() {
    if (this.todoEntityId) {
      this.dispatchEvent(
        new CustomEvent('hass-more-info', {
          detail: { entityId: this.todoEntityId },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  render() {
    const active = this.items.filter((i) => i.status === 'needs_action');
    const count = active.length;
    const visible = active.slice(0, 3);
    const extra = count - visible.length;

    if (count === 0) {
      return html`
        <div class="empty-state">
          <span class="empty-icon">${iconCheck}</span>
          ${STRINGS.allDone}
        </div>
      `;
    }

    return html`
      <div class="header">
        ${STRINGS.tasksTitle}
        <span class="count-badge">${count}</span>
      </div>
      ${visible.map(
        (item) => html`
          <div class="task-row">
            <span class="summary">${item.summary}</span>
            ${item.due ? html`<span class="due-chip">${this._formatDue(item.due)}</span>` : ''}
          </div>
        `,
      )}
      ${extra > 0
        ? html`<div class="more-row" @click=${this._handleMoreClick}>
            ${STRINGS.moreItems(extra)}
          </div>`
        : ''}
    `;
  }

  private _formatDue(due: string): string {
    // Date-only strings (YYYY-MM-DD) must be parsed as local time, not UTC.
    const d = due.length === 10 ? new Date(due + 'T00:00:00') : new Date(due);
    if (isNaN(d.getTime())) return due;
    return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-tasks-summary': LucarneTasksSummary;
  }
}
