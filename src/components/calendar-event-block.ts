import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import type { CalendarEvent } from '../shared/types.js';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

@customElement('lucarne-calendar-event-block')
export class LucarneCalendarEventBlock extends LitElement {
  static styles = [
    lucarneStyles,
    css`
      :host {
        /* Position/size is controlled by inline style from the parent day column.
         * display:block so the host fills its inline-style-determined box. */
        display: block;
        overflow: hidden;
        cursor: pointer;
        border-radius: var(--lucarne-radius-sm);
        border-left: 3px solid transparent;
        transition: filter 0.1s;
        box-sizing: border-box;
        padding: 2px 4px;
      }
      :host(:hover) {
        filter: brightness(0.92);
        z-index: 10;
      }
      .event-summary {
        font-size: var(--lucarne-fs-sm);
        font-weight: 600;
        color: rgba(0, 0, 0, 0.8);
        line-height: 1.2;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        white-space: normal;
        word-break: break-word;
      }
      .event-time {
        font-size: 0.7rem;
        color: rgba(0, 0, 0, 0.55);
        line-height: 1.1;
        margin-top: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
  ];

  @property({ type: Object }) event!: CalendarEvent;
  @property({ type: String }) color = '#a8d8b9';
  @property({ type: Number }) lane = 0;
  @property({ type: Number }) laneCount = 1;
  @property({ type: Number }) topPercent = 0;
  @property({ type: Number }) heightPercent = 10;

  private _handleClick(e: MouseEvent) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('lucarne-event-tap', {
        detail: { event: this.event, color: this.color },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const start = new Date(this.event.start);
    const end = new Date(this.event.end);
    const timeLabel = `${formatTime(start)}–${formatTime(end)}`;

    // Position, size, and colors are all set as inline styles on the host element
    // by the parent grid component. The shadow DOM just renders text content.
    const opacity = this.event.pending ? '0.5' : '1';
    return html`
      <div @click=${this._handleClick} style="height:100%;width:100%;overflow:hidden;opacity:${opacity}">
        <div class="event-summary">${this.event.summary}</div>
        <div class="event-time">${timeLabel}</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-calendar-event-block': LucarneCalendarEventBlock;
  }
}
