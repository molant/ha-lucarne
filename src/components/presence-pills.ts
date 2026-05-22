import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { lucarneStyles } from '../shared/design-tokens.js';

export interface PresenceEntry {
  name: string;
  isHome: boolean;
}

@customElement('lucarne-presence-pills')
export class LucarnePresencePills extends LitElement {
  static styles = [
    lucarneStyles,
    css`
      :host {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lucarne-spacing-xs);
      }
      .pill {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 3px 10px 3px 7px;
        border-radius: var(--lucarne-radius-lg);
        font-size: var(--lucarne-fs-sm);
        font-weight: 500;
        background: var(--lucarne-surface);
        border: 1.5px solid currentColor;
        transition: opacity 0.2s;
      }
      .pill.away {
        opacity: 0.45;
      }
      .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .pill.home .dot {
        background: #4caf50;
      }
      .pill.away .dot {
        background: #9e9e9e;
      }
      .pill.home {
        color: #2e7d32;
        border-color: #a5d6a7;
      }
      .pill.away {
        color: var(--lucarne-on-surface-muted);
        border-color: #e0e0e0;
      }
    `,
  ];

  @property({ type: Array }) entries: PresenceEntry[] = [];

  render() {
    return html`
      ${this.entries.map(
        (e) => html`
          <span class="pill ${e.isHome ? 'home' : 'away'}">
            <span class="dot"></span>
            ${e.name}
          </span>
        `,
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-presence-pills': LucarnePresencePills;
  }
}
