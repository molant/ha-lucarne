import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { iconCheck } from '../shared/icons.js';
import { STRINGS } from '../shared/strings.js';
import type { MemberSummary, TodoItem, RenderableTask } from '../shared/types.js';

import './task-row.js';

const HOUSEHOLD_SLUG = 'household';

/** Build a synthetic RenderableTask from a raw todo entity item. */
function toRenderable(item: TodoItem): RenderableTask {
  return {
    uid: item.uid,
    summary: item.summary,
    status: item.status,
    due: item.due ?? null,
    description: item.description ?? '',
    metadata: {
      item_uid: item.uid,
      member_slug: HOUSEHOLD_SLUG,
      assignee_slug: '',
      type: 'chore',
      recurrence: '',
      icon: '',
      source: 'manual',
    },
  };
}

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
      .task-line {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
      }
      .task-line + .task-line {
        border-top: 1px solid rgba(0, 0, 0, 0.05);
      }
      .task-line lucarne-task-row {
        flex: 1;
        min-width: 0;
      }
      .owner-avatar {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        font-size: 14px;
        line-height: 1;
        color: rgba(0, 0, 0, 0.75);
      }
      .owner-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .owner-avatar .initial {
        font-weight: 700;
        text-transform: uppercase;
        font-family: var(--primary-font-family, sans-serif);
        font-size: 12px;
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
  /** When true, renders integration household tasks from renderableTasks instead of raw items */
  @property({ type: Boolean }) integrationMode = false;
  @property({ attribute: false }) renderableTasks: RenderableTask[] = [];
  /** Members from the family subscription — used to resolve owner avatars in integration mode. */
  @property({ attribute: false }) members: MemberSummary[] = [];

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
    const source = this.integrationMode ? this.renderableTasks : this.items.map(toRenderable);
    const active = source.filter((t) => t.status === 'needs_action');
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
      ${visible.map((task) => this._renderTaskLine(task))}
      ${extra > 0
        ? html`<div class="more-row" @click=${this._handleMoreClick}>
            ${STRINGS.moreItems(extra)}
          </div>`
        : ''}
    `;
  }

  private _renderTaskLine(task: RenderableTask) {
    const owner = this._ownerFor(task);
    return html`
      <div class="task-line">
        ${owner ? this._renderOwnerAvatar(owner) : ''}
        <lucarne-task-row
          .task=${task}
          .memberColor=${owner?.color ?? 'var(--primary-color)'}
        ></lucarne-task-row>
      </div>
    `;
  }

  private _renderOwnerAvatar(member: MemberSummary) {
    const av = member.avatar;
    if (av && av.startsWith('/local/')) {
      return html`
        <div class="owner-avatar" style="background:${member.color}" title="${member.name}">
          <img src="${av}" alt="${member.name}" />
        </div>
      `;
    }
    if (av) {
      return html`
        <div class="owner-avatar" style="background:${member.color}" title="${member.name}">
          <span>${av}</span>
        </div>
      `;
    }
    const initial = member.name.trim().charAt(0) || '?';
    return html`
      <div class="owner-avatar" style="background:${member.color}" title="${member.name}">
        <span class="initial">${initial}</span>
      </div>
    `;
  }

  private _ownerFor(task: RenderableTask): MemberSummary | null {
    if (!this.integrationMode) return null;
    const slug = task.metadata.member_slug;
    if (!slug || slug === HOUSEHOLD_SLUG) return null;
    return this.members.find((m) => m.slug === slug) ?? null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-tasks-summary': LucarneTasksSummary;
  }
}
