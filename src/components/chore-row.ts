import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../shared/types.js';

@customElement('lucarne-chore-row')
export class LucarneChoreRow extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 60px;
      padding: 8px 4px;
      cursor: pointer;
      border-radius: 8px;
      transition: background 0.1s;
      -webkit-tap-highlight-color: transparent;
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
      background: var(--chore-color, #a8d8b9);
      border-color: var(--chore-color, #a8d8b9);
    }
    .check svg {
      opacity: 0;
      transition: opacity 0.15s;
    }
    .check.done svg {
      opacity: 1;
    }
    .label {
      font-size: clamp(0.875rem, 1.2vw, 1rem);
      color: var(--primary-text-color, #212121);
      font-family: var(--primary-font-family, sans-serif);
      transition: text-decoration 0.15s, color 0.15s;
    }
    .label.done {
      text-decoration: line-through;
      color: var(--secondary-text-color, #727272);
    }
  `;

  @property({ attribute: false }) hass!: HomeAssistant;
  @property() name = '';
  @property({ attribute: 'entity-id' }) entityId = '';
  @property({ type: Boolean, attribute: 'is-done' }) isDone = false;

  private _toggle() {
    if (!this.hass || !this.entityId) return;
    this.hass.callService('input_boolean', 'toggle', { entity_id: this.entityId });
  }

  render() {
    return html`
      <div class="row" @click=${this._toggle} role="checkbox" aria-checked=${this.isDone} tabindex="0"
           @keydown=${(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!e.repeat) this._toggle();
            }
          }}>
        <div class="check ${this.isDone ? 'done' : ''}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 5" stroke="rgba(0,0,0,0.7)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="label ${this.isDone ? 'done' : ''}">${this.name}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-chore-row': LucarneChoreRow;
  }
}
