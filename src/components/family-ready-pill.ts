import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { STRINGS } from '../shared/strings.js';
import { parseRRule, isRoutineDueToday } from '../shared/recurrence.js';
import type { MemberSummary, RenderableTask } from '../shared/types.js';

@customElement('lucarne-family-ready-pill')
export class LucarneFamilyReadyPill extends LitElement {
  static styles = [
    lucarneStyles,
    css`
      :host {
        display: inline-block;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 10px;
        border-radius: var(--lucarne-radius-lg);
        background: rgba(0, 0, 0, 0.07);
        font-size: var(--lucarne-fs-sm);
        font-weight: 600;
        color: var(--lucarne-on-surface-muted);
        cursor: pointer;
        user-select: none;
        transition: background 0.15s;
      }
      .pill:hover {
        background: rgba(0, 0, 0, 0.12);
      }
      .pill.all-done {
        background: var(--lucarne-success-bg);
        color: var(--lucarne-success-fg);
      }
      .pill.none {
        opacity: 0.5;
      }
      .icon {
        font-size: 1.1em;
      }
    `,
  ];

  @property({ attribute: false }) members: MemberSummary[] = [];
  @property({ attribute: false }) tasksByMember: Map<string, RenderableTask[]> = new Map();

  private _handleClick() {
    this.dispatchEvent(new CustomEvent('family-ready-clicked', { bubbles: true, composed: true }));
  }

  private _computeReadiness(): { readyCount: number; totalWithRoutines: number } {
    let totalWithRoutines = 0;
    let readyCount = 0;
    const today = new Date();

    for (const member of this.members) {
      const tasks = this.tasksByMember.get(member.slug) ?? [];
      // Only count routines whose RRULE fires today — e.g. a Monday-only routine
      // does not block readiness on other days of the week.
      const dueToday = tasks.filter(
        (t) => t.metadata.type === 'routine' && isRoutineDueToday(parseRRule(t.metadata.recurrence), today),
      );
      if (dueToday.length === 0) continue;
      totalWithRoutines++;
      if (dueToday.every((t) => t.status === 'completed')) {
        readyCount++;
      }
    }

    return { readyCount, totalWithRoutines };
  }

  render() {
    const { readyCount, totalWithRoutines } = this._computeReadiness();

    if (totalWithRoutines === 0) {
      return html`
        <div class="pill none" @click=${this._handleClick}>
          <span class="icon">✓</span>
          ${STRINGS.noRoutinesToday}
        </div>
      `;
    }

    const allDone = readyCount === totalWithRoutines;
    return html`
      <div class="pill ${allDone ? 'all-done' : ''}" @click=${this._handleClick}>
        <span class="icon">${allDone ? '🎉' : '⏳'}</span>
        ${STRINGS.familyReady(readyCount, totalWithRoutines)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-family-ready-pill': LucarneFamilyReadyPill;
  }
}
