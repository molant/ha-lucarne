import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import type { CalendarConfig } from '../shared/types.js';

@customElement('lucarne-visibility-pills')
export class LucarneVisibilityPills extends LitElement {
  static styles = [
    lucarneStyles,
    css`
      :host {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lucarne-spacing-xs);
        padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-xl);
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 10px;
        border-radius: 12px;
        font-size: var(--lucarne-fs-sm);
        cursor: pointer;
        user-select: none;
        transition: opacity 0.15s, background 0.15s;
        border: 1.5px solid transparent;
        min-height: 44px;
        box-sizing: border-box;
      }
      .pill.visible {
        opacity: 1;
        border-color: transparent;
      }
      .pill.hidden {
        opacity: 0.45;
        text-decoration: line-through;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .label {
        white-space: nowrap;
        font-weight: 500;
        color: var(--lucarne-on-surface);
      }
    `,
  ];

  @property({ type: Array }) calendars: CalendarConfig[] = [];
  @property({ type: Object }) visibleIds: Set<string> = new Set();

  private _toggle(entityId: string) {
    const next = new Set(this.visibleIds);
    if (next.has(entityId)) {
      next.delete(entityId);
    } else {
      next.add(entityId);
    }
    this.dispatchEvent(new CustomEvent('visibility-change', { detail: next, bubbles: true, composed: true }));
  }

  render() {
    return html`
      ${this.calendars.map(
        (cal) => html`
          <button
            class="pill ${this.visibleIds.has(cal.entity) ? 'visible' : 'hidden'}"
            style="background: ${this.visibleIds.has(cal.entity) ? cal.color + '33' : 'transparent'}"
            @click=${() => this._toggle(cal.entity)}
            aria-pressed=${this.visibleIds.has(cal.entity)}
            aria-label="${cal.label}"
          >
            <span class="dot" style="background: ${cal.color}"></span>
            <span class="label">${cal.label}</span>
          </button>
        `,
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-visibility-pills': LucarneVisibilityPills;
  }
}
