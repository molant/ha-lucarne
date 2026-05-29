import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { iconCheck } from '../shared/icons.js';
import { STRINGS } from '../shared/strings.js';
import type { MemberSummary, TodoItem, RenderableTask } from '../shared/types.js';
import { EMOJI_RE } from './member-avatar.js';

import './task-row.js';

const HOUSEHOLD_SLUG = 'household';

/**
 * Parse a todo `due` value to a Date. Date-only strings (YYYY-MM-DD) are parsed
 * in LOCAL time so "due today" lines up with the viewer's calendar day instead
 * of shifting across the UTC boundary.
 */
function parseDue(value: string): Date {
  return value.length === 10 ? new Date(value + 'T00:00:00') : new Date(value);
}

/**
 * Sort tasks by urgency for the Today card:
 *   overdue > due today > due within 3 days > no due date > due >3 days.
 * Within a dated bucket, earlier due dates come first; the no-date bucket
 * orders alphabetically. Pure + exported for unit testing.
 */
export function sortByPriority(tasks: RenderableTask[], now: Date): RenderableTask[] {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
  // Start of the 4th day from today — the exclusive end of the "within 3 days" window.
  const beyondThreeDays = new Date(startOfToday);
  beyondThreeDays.setDate(beyondThreeDays.getDate() + 4);

  const bucket = (t: RenderableTask): number => {
    if (!t.due) return 3; // no due date
    const d = parseDue(t.due);
    if (d < startOfToday) return 0; // overdue
    if (d < startOfTomorrow) return 1; // due today
    if (d < beyondThreeDays) return 2; // within the next 3 days
    return 4; // more than 3 days out
  };

  return [...tasks].sort((a, b) => {
    const ba = bucket(a);
    const bb = bucket(b);
    if (ba !== bb) return ba - bb;
    if (ba === 3) return a.summary.localeCompare(b.summary);
    const da = a.due ? parseDue(a.due).getTime() : 0;
    const db = b.due ? parseDue(b.due).getTime() : 0;
    if (da !== db) return da - db;
    return a.summary.localeCompare(b.summary);
  });
}

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
      .task-list {
        display: flex;
        flex-direction: column;
        /* Only up to "limit" rows are rendered (backlog beyond it is
           intentionally not shown). This is a safety cap: if the host card sets
           --lucarne-tasks-max-height and those rendered rows exceed it, they
           scroll rather than overflow. Uncapped (none) by default. */
        max-height: var(--lucarne-tasks-max-height, none);
        overflow-y: auto;
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
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        font-size: 13px;
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
        font-size: 11px;
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
  /** Max number of tasks to display; the rest scroll within the list. */
  @property({ type: Number }) limit = 5;
  /**
   * When true, completing a visible task pulls the next backlog task up to refill
   * the slot (rolling list). When false (default), a completed task disappears and
   * its slot stays empty — no backlog item is promoted to replace it.
   */
  @property({ type: Boolean }) refillOnComplete = false;

  /** Uids ever admitted to the visible window (no-refill mode session state). */
  private _admitted = new Set<string>();
  /**
   * Admitted uids that have left the active set (completed or removed) — i.e. the
   * slots they occupied are burned and must not be refilled. Tracked here rather
   * than re-derived from `source` each render so the burn survives even when the
   * todo provider drops completed items from the fetched list. A uid is un-burned
   * if it returns to the active set (e.g. a completion is undone).
   */
  private _burned = new Set<string>();
  /** Identity of the current window; changing entity/limit re-seeds _admitted. */
  private _windowKey = '';

  /**
   * Resolve which active tasks to show. In refill mode the window is just the
   * first `limit` by priority. In no-refill mode each completion permanently
   * burns a slot (never refilled); new tasks only fill slots that were never
   * occupied. Mutates _admitted/_burned, so call once per render.
   */
  private _resolveVisible(source: RenderableTask[]): {
    visible: RenderableTask[];
    totalActive: number;
  } {
    const now = new Date();
    const active = sortByPriority(
      source.filter((t) => t.status === 'needs_action'),
      now,
    );
    const totalActive = active.length;

    if (this.refillOnComplete) {
      this._admitted.clear();
      this._burned.clear();
      this._windowKey = '';
      return { visible: active.slice(0, this.limit), totalActive };
    }

    const key = `${this.todoEntityId ?? ''}#${this.limit}`;
    if (key !== this._windowKey) {
      this._windowKey = key;
      this._admitted = new Set();
      this._burned = new Set();
    }

    const activeUids = new Set(active.map((t) => t.uid));
    // An admitted task that is no longer active has had its slot burned — whether
    // it was completed, or completed-then-dropped by the provider. If it comes
    // back to the active set (completion undone), un-burn it so it shows again.
    for (const uid of this._admitted) {
      if (activeUids.has(uid)) this._burned.delete(uid);
      else this._burned.add(uid);
    }
    const target = Math.max(0, this.limit - this._burned.size);
    const activeAdmitted = active.filter((t) => this._admitted.has(t.uid));
    let openSlots = target - activeAdmitted.length;
    for (const t of active) {
      if (openSlots <= 0) break;
      if (!this._admitted.has(t.uid)) {
        this._admitted.add(t.uid);
        openSlots--;
      }
    }
    const visible = active.filter((t) => this._admitted.has(t.uid));
    return { visible, totalActive };
  }

  render() {
    const source = this.integrationMode ? this.renderableTasks : this.items.map(toRenderable);
    const { visible, totalActive } = this._resolveVisible(source);

    if (totalActive === 0) {
      return html`
        <div class="empty-state">
          <span class="empty-icon">${iconCheck}</span>
          ${STRINGS.allDone}
        </div>
      `;
    }

    if (visible.length === 0) {
      // No-refill mode: the session window is cleared but backlog remains. Reward
      // the cleared slate rather than shoving the backlog back into view.
      return html`
        <div class="empty-state">
          <span class="empty-icon">${iconCheck}</span>
          ${STRINGS.allDoneForNow}
        </div>
      `;
    }

    return html`
      <div class="header">
        ${STRINGS.tasksTitle}
        <span class="count-badge">${totalActive}</span>
      </div>
      <div class="task-list">${visible.map((task) => this._renderTaskLine(task))}</div>
    `;
  }

  private _renderTaskLine(task: RenderableTask) {
    const owner = this._ownerFor(task);
    return html`
      <div class="task-line">
        ${owner ? this._renderOwnerAvatar(owner) : ''}
        <lucarne-task-row
          compact
          .task=${task}
          .memberColor=${owner?.color ?? 'var(--primary-color)'}
        ></lucarne-task-row>
      </div>
    `;
  }

  private _renderOwnerAvatar(member: MemberSummary) {
    // Mirror lucarne-member-avatar's branching so non-emoji strings (URL,
    // plain text, accidentally-stored markup) don't end up rendered verbatim
    // in the tiny pill — fall back to the initial instead.
    const av = member.avatar;
    if (av && av.startsWith('/local/')) {
      return html`
        <div class="owner-avatar" style="background:${member.color}" title="${member.name}">
          <img src="${av}" alt="${member.name}" />
        </div>
      `;
    }
    if (av && EMOJI_RE.test(av)) {
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
