import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { RenderableTask } from '../shared/types.js';

const LONG_PRESS_MS = 500;

@customElement('lucarne-task-row')
export class LucarneTaskRow extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 44px;
      padding: 8px 4px;
      cursor: pointer;
      border-radius: 8px;
      transition: background 0.1s;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }
    .row:hover,
    .row:active {
      background: rgba(0, 0, 0, 0.04);
    }
    .check {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2.5px solid rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, border-color 0.15s;
    }
    .check.done {
      background: var(--member-color, #a8d8b9);
      border-color: var(--member-color, #a8d8b9);
    }
    .check svg {
      opacity: 0;
      transition: opacity 0.15s;
    }
    .check.done svg {
      opacity: 1;
    }
    .icon {
      font-size: 1.1rem;
      line-height: 1;
      flex-shrink: 0;
    }
    .middle {
      flex: 1;
      min-width: 0;
    }
    .label {
      font-size: clamp(0.875rem, 1.2vw, 1rem);
      color: var(--primary-text-color, #212121);
      font-family: var(--primary-font-family, sans-serif);
      transition: text-decoration 0.15s, color 0.15s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .label.done {
      text-decoration: line-through;
      color: var(--secondary-text-color, #727272);
      opacity: 0.6;
    }
    .due {
      font-size: 0.75rem;
      color: var(--secondary-text-color, #727272);
      flex-shrink: 0;
    }
  `;

  @property({ attribute: false }) task!: RenderableTask;
  @property() memberColor = '#a8d8b9';

  private _pressTimer: ReturnType<typeof setTimeout> | null = null;
  private _longPressed = false;

  private _onPointerDown(e: PointerEvent) {
    this._longPressed = false;
    this._pressTimer = setTimeout(() => {
      this._longPressed = true;
      this.dispatchEvent(
        new CustomEvent('task-long-press', {
          detail: { task: this.task },
          bubbles: true,
          composed: true,
        }),
      );
    }, LONG_PRESS_MS);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  private _onPointerUp() {
    if (this._pressTimer !== null) {
      clearTimeout(this._pressTimer);
      this._pressTimer = null;
    }
  }

  private _onPointerCancel() {
    if (this._pressTimer !== null) {
      clearTimeout(this._pressTimer);
      this._pressTimer = null;
    }
  }

  private _onClick() {
    if (this._longPressed) return;
    this.dispatchEvent(
      new CustomEvent('task-toggle', {
        detail: { task: this.task },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    if (!this.task) return html``;
    const done = this.task.status === 'completed';
    const icon = this.task.metadata.icon;
    const due = this.task.due;

    return html`
      <div
        class="row"
        style="--member-color:${this.memberColor}"
        role="checkbox"
        aria-checked=${done}
        tabindex="0"
        @click=${this._onClick}
        @keydown=${(e: KeyboardEvent) => {
          if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
            e.preventDefault();
            this._onClick();
          }
        }}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
      >
        <div class="check ${done ? 'done' : ''}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 5" stroke="rgba(0,0,0,0.7)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        ${icon ? html`<span class="icon">${icon}</span>` : ''}
        <div class="middle">
          <span class="label ${done ? 'done' : ''}">${this.task.summary}</span>
        </div>
        ${due ? html`<span class="due">${this._formatDue(due)}</span>` : ''}
      </div>
    `;
  }

  private _formatDue(due: string): string {
    // Show time if ISO datetime, otherwise show date
    if (due.includes('T')) {
      const d = new Date(due);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    return due;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-task-row': LucarneTaskRow;
  }
}
