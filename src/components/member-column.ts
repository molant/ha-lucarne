import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { MemberSummary, RenderableTask } from '../shared/types.js';

import './member-avatar.js';
import './task-row.js';
import './streak-display.js';
import './celebration-overlay.js';

function sortRoutines(tasks: RenderableTask[]): RenderableTask[] {
  return [...tasks].sort((a, b) => a.summary.localeCompare(b.summary));
}

function sortChores(tasks: RenderableTask[]): RenderableTask[] {
  return [...tasks].sort((a, b) => {
    if (a.due && b.due) return a.due.localeCompare(b.due);
    if (a.due) return -1;
    if (b.due) return 1;
    return a.summary.localeCompare(b.summary);
  });
}

@customElement('lucarne-member-column')
export class LucarneMemberColumn extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
    }
    .column {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 16px 12px;
      position: relative;
    }
    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      margin-bottom: 8px;
    }
    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 8px;
    }
    .member-name {
      font-size: clamp(1rem, 1.5vw, 1.25rem);
      font-weight: 700;
      color: var(--primary-text-color, #212121);
      font-family: var(--primary-font-family, sans-serif);
      text-align: center;
      flex: 1;
    }
    .add-task-btn {
      background: none;
      border: 1px dashed rgba(0, 0, 0, 0.25);
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 0.8rem;
      color: var(--secondary-text-color, #727272);
      cursor: pointer;
      white-space: nowrap;
      min-height: 32px;
      flex-shrink: 0;
    }
    .add-task-btn:hover {
      background: rgba(0, 0, 0, 0.04);
    }
    .section {
      display: flex;
      flex-direction: column;
    }
    .section-header {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--secondary-text-color, #727272);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 6px 4px 2px;
    }
    .streak-area {
      padding-top: 12px;
      border-top: 1px solid rgba(0, 0, 0, 0.07);
      margin-top: 8px;
    }
  `;

  @property({ attribute: false }) member!: MemberSummary;
  @property({ attribute: false }) tasks: RenderableTask[] = [];
  @property({ type: Number }) streak = 0;
  @property({ type: Boolean, attribute: 'show-routines' }) showRoutines = true;
  @property({ type: Boolean, attribute: 'show-tasks' }) showTasks = true;
  @property({ type: Boolean, attribute: 'show-streak' }) showStreak = true;

  @state() private _celebrating = false;
  private _celebrationTimer: ReturnType<typeof setTimeout> | null = null;
  private _lastAllRoutinesDone: boolean | null = null;

  updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (!changed.has('tasks')) return;
    const routines = this.tasks.filter((t) => t.metadata.type === 'routine');
    if (routines.length === 0) return;
    const allDone = routines.every((t) => t.status === 'completed');
    if (this._lastAllRoutinesDone === null) {
      // First observation — record baseline without triggering celebration
      this._lastAllRoutinesDone = allDone;
      return;
    }
    if (!this._lastAllRoutinesDone && allDone) {
      this._triggerCelebration();
    }
    this._lastAllRoutinesDone = allDone;
  }

  private _triggerCelebration() {
    this._celebrating = true;
    if (this._celebrationTimer) clearTimeout(this._celebrationTimer);
    this._celebrationTimer = setTimeout(() => {
      this._celebrating = false;
      this._celebrationTimer = null;
      this.requestUpdate();
    }, 2200);
    this.requestUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._celebrationTimer) clearTimeout(this._celebrationTimer);
  }

  render() {
    if (!this.member) return html``;

    const routines = sortRoutines(this.tasks.filter((t) => t.metadata.type === 'routine'));
    const chores = sortChores(this.tasks.filter((t) => t.metadata.type === 'chore'));

    return html`
      <div class="column" style="--member-color:${this.member.color}">
        <lucarne-celebration-overlay
          kid-slug=${this.member.slug}
          ?active=${this._celebrating}
        ></lucarne-celebration-overlay>

        <div class="header">
          <lucarne-member-avatar
            name=${this.member.name}
            color=${this.member.color}
            .avatar=${this.member.avatar}
          ></lucarne-member-avatar>
          <div class="header-row">
            <div class="member-name">${this.member.name}</div>
            <button
              class="add-task-btn"
              @click=${this._onAddTask}
              aria-label="Add task for ${this.member.name}"
            >+ Add task</button>
          </div>
        </div>

        ${this.showRoutines && routines.length > 0
          ? html`
              <div class="section">
                <div class="section-header">Routines</div>
                ${routines.map((t) => html`
                  <lucarne-task-row
                    .task=${t}
                    .memberColor=${this.member.color}
                  ></lucarne-task-row>
                `)}
              </div>
            `
          : ''}

        ${this.showTasks && chores.length > 0
          ? html`
              <div class="section">
                <div class="section-header">Tasks</div>
                ${chores.map((t) => html`
                  <lucarne-task-row
                    .task=${t}
                    .memberColor=${this.member.color}
                  ></lucarne-task-row>
                `)}
              </div>
            `
          : ''}

        ${this.showStreak
          ? html`
              <div class="streak-area">
                <lucarne-streak-display .streak=${this.streak}></lucarne-streak-display>
              </div>
            `
          : ''}
      </div>
    `;
  }

  private _onAddTask() {
    this.dispatchEvent(
      new CustomEvent('add-task-clicked', {
        detail: { memberSlug: this.member.slug },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-member-column': LucarneMemberColumn;
  }
}
