import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant, KidConfig } from '../shared/types.js';

import './kid-avatar.js';
import './chore-row.js';
import './streak-display.js';
import './celebration-overlay.js';

@customElement('lucarne-kid-column')
export class LucarneKidColumn extends LitElement {
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
    .kid-name {
      font-size: clamp(1rem, 1.5vw, 1.25rem);
      font-weight: 700;
      color: var(--primary-text-color, #212121);
      font-family: var(--primary-font-family, sans-serif);
      text-align: center;
    }
    .chores {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .streak-area {
      padding-top: 12px;
      border-top: 1px solid rgba(0, 0, 0, 0.07);
      margin-top: 8px;
    }
    .all-done-banner {
      text-align: center;
      font-size: clamp(0.8rem, 1.2vw, 0.95rem);
      font-weight: 600;
      padding: 6px 0;
      color: rgba(0, 0, 0, 0.6);
    }
  `;

  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) kid!: KidConfig;
  @property({ type: Number }) streak = 0;
  @property({ type: Boolean }) celebrating = false;
  @property({ type: Boolean, attribute: 'all-done' }) allDone = false;

  render() {
    if (!this.kid) return html``;
    const chores = this.kid.chores ?? [];

    return html`
      <div class="column" style="--chore-color:${this.kid.color}">
        <lucarne-celebration-overlay
          kid-slug=${this.kid.name.toLowerCase().replace(/\s+/g, '_')}
          ?active=${this.celebrating}
        ></lucarne-celebration-overlay>

        <div class="header">
          <lucarne-kid-avatar
            name=${this.kid.name}
            color=${this.kid.color}
            avatar-url=${this.kid.avatar ?? ''}
          ></lucarne-kid-avatar>
          <div class="kid-name">${this.kid.name}</div>
        </div>

        <div class="chores">
          ${chores.map((chore) => {
            const state = this.hass?.states[chore.entity]?.state ?? 'unavailable';
            return html`
              <lucarne-chore-row
                .hass=${this.hass}
                name=${chore.name}
                entity-id=${chore.entity}
                ?is-done=${state === 'on'}
              ></lucarne-chore-row>
            `;
          })}
        </div>

        ${this.allDone
          ? html`<div class="all-done-banner">✨ All done!</div>`
          : ''}

        <div class="streak-area">
          <lucarne-streak-display .streak=${this.streak}></lucarne-streak-display>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-kid-column': LucarneKidColumn;
  }
}
