import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import type { CalendarEvent } from '../shared/types.js';

@customElement('lucarne-out-of-band-stub')
export class LucarneOutOfBandStub extends LitElement {
  static styles = [
    lucarneStyles,
    css`
      :host {
        display: block;
      }
      .stub-chip {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-size: 0.7rem;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 8px;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.07);
        color: var(--lucarne-on-surface-muted);
        min-height: 44px;
        box-sizing: border-box;
        border: none;
        width: 100%;
        justify-content: center;
      }
      .stub-chip:hover {
        background: rgba(0, 0, 0, 0.12);
      }
      .backdrop {
        position: fixed;
        inset: 0;
        z-index: 100;
      }
      .mini-popover {
        position: fixed;
        z-index: 101;
        background: var(--lucarne-surface);
        border-radius: var(--lucarne-radius-md);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
        padding: var(--lucarne-spacing-md);
        min-width: 220px;
        max-width: 320px;
        max-height: 60vh;
        overflow-y: auto;
      }
      .mini-title {
        font-size: var(--lucarne-fs-sm);
        font-weight: 700;
        color: var(--lucarne-on-surface-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--lucarne-spacing-sm);
      }
      .mini-event {
        display: flex;
        flex-direction: column;
        padding: var(--lucarne-spacing-sm) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        cursor: pointer;
        min-height: 44px;
        justify-content: center;
      }
      .mini-event:last-child {
        border-bottom: none;
      }
      .mini-event:hover {
        background: rgba(0, 0, 0, 0.04);
        border-radius: var(--lucarne-radius-sm);
      }
      .mini-event-summary {
        font-size: var(--lucarne-fs-sm);
        font-weight: 600;
        color: var(--lucarne-on-surface);
      }
      .mini-event-time {
        font-size: 0.7rem;
        color: var(--lucarne-on-surface-muted);
      }
    `,
  ];

  @property({ type: Array }) events: CalendarEvent[] = [];
  @property({ type: String }) label = 'earlier';
  @property({ type: Object }) eventColors: Map<string, string> = new Map();

  @state() private _open = false;
  private _chipEl?: Element;

  private _formatTime(value: string): string {
    const d = new Date(value);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  private _openPopover(e: MouseEvent) {
    e.stopPropagation();
    this._chipEl = e.currentTarget as Element;
    this._open = true;
  }

  private _close() {
    this._open = false;
  }

  private _tapEvent(e: MouseEvent, event: CalendarEvent) {
    e.stopPropagation();
    this._close();
    this.dispatchEvent(
      new CustomEvent('lucarne-event-tap', {
        detail: { event, color: this.eventColors.get(event.uid ?? '') ?? '#a8d8b9' },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    if (this.events.length === 0) return html``;

    const chipEl = this._chipEl;
    let top = 0;
    let left = 0;
    if (chipEl) {
      const rect = chipEl.getBoundingClientRect();
      top = rect.bottom + 4;
      left = rect.left;
    }

    return html`
      <button class="stub-chip" @click=${this._openPopover}>
        +${this.events.length} ${this.label}
      </button>

      ${this._open
        ? html`
            <div class="backdrop" @click=${this._close}></div>
            <div class="mini-popover" style="top:${top}px;left:${left}px;">
              <div class="mini-title">${this.label}</div>
              ${this.events.map(
                (event) => html`
                  <div class="mini-event" @click=${(e: MouseEvent) => this._tapEvent(e, event)}>
                    <span class="mini-event-summary">${event.summary}</span>
                    <span class="mini-event-time">${this._formatTime(event.start)}</span>
                  </div>
                `,
              )}
            </div>
          `
        : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-out-of-band-stub': LucarneOutOfBandStub;
  }
}
