import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../shared/types.js';

interface KidConfig {
  name: string;
  color: string;
  avatar?: string;
  streak: string;
  chores: { name: string; entity: string }[];
}
import type { LucarneChoresCardConfig } from '../cards/lucarne-chores-card.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { ensureHaFormElements } from '../shared/ha-elements.js';
import { fireEvent } from 'custom-card-helpers';

@customElement('lucarne-chores-card-editor')
export class LucarneChoresCardEditor extends LitElement {
  static styles = [
    lucarneStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--lucarne-spacing-md);
        padding: var(--lucarne-spacing-lg);
        box-sizing: border-box;
        width: 100%;
      }
      .section-label {
        font-size: var(--lucarne-fs-sm);
        font-weight: 600;
        color: var(--lucarne-on-surface-muted);
        letter-spacing: 0.05em;
        text-transform: uppercase;
        margin: var(--lucarne-spacing-md) 0 var(--lucarne-spacing-xs);
      }
      .section-label:first-of-type {
        margin-top: 0;
      }
      .kid-block {
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: var(--lucarne-radius-md);
        padding: var(--lucarne-spacing-md);
        display: flex;
        flex-direction: column;
        gap: var(--lucarne-spacing-sm);
        margin-bottom: var(--lucarne-spacing-sm);
      }
      .kid-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--lucarne-spacing-sm);
      }
      .kid-header-fields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--lucarne-spacing-sm);
        flex: 1;
      }
      .color-row {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
      }
      .color-swatch {
        width: 32px;
        height: 32px;
        border-radius: var(--lucarne-radius-sm);
        border: 1px solid rgba(0, 0, 0, 0.2);
        cursor: pointer;
        flex-shrink: 0;
      }
      .chore-row {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: var(--lucarne-spacing-sm);
        align-items: center;
        padding: var(--lucarne-spacing-xs) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }
      .chore-row ha-entity-picker,
      .chore-row ha-textfield,
      .kid-header-fields ha-entity-picker,
      .kid-header-fields ha-textfield {
        width: 100%;
        min-width: 0;
      }
      .chore-row:last-of-type {
        border-bottom: none;
      }
      .chore-label {
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin-top: var(--lucarne-spacing-xs);
      }
      button.remove {
        background: none;
        border: none;
        color: var(--error-color, #f44336);
        cursor: pointer;
        font-size: 1.1em;
        padding: 4px 8px;
        border-radius: var(--lucarne-radius-sm);
        flex-shrink: 0;
      }
      button.add {
        background: none;
        border: 1px dashed rgba(0, 0, 0, 0.2);
        border-radius: var(--lucarne-radius-md);
        padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-md);
        cursor: pointer;
        color: var(--lucarne-on-surface-muted);
        font-size: var(--lucarne-fs-sm);
        width: 100%;
        text-align: center;
        margin-top: var(--lucarne-spacing-xs);
      }
      button.add:hover {
        background: rgba(0, 0, 0, 0.04);
      }
      .loading {
        color: var(--lucarne-on-surface-muted);
        font-size: var(--lucarne-fs-sm);
        text-align: center;
        padding: var(--lucarne-spacing-lg);
      }
    `,
  ];

  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config?: LucarneChoresCardConfig;
  @state() private _haReady = false;

  connectedCallback() {
    super.connectedCallback();
    ensureHaFormElements()
      .catch((err) => console.warn('[lucarne] HA editor elements load failed; rendering anyway', err))
      .then(() => {
        this._haReady = true;
      });
  }

  setConfig(config: LucarneChoresCardConfig) {
    this._config = config;
  }

  private _fire(config: LucarneChoresCardConfig) {
    fireEvent(this, 'config-changed', { config });
  }

  private _titleChanged(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this._fire({ ...this._config!, title: v || undefined });
  }

  private _kidFieldChanged(kidIdx: number, field: keyof KidConfig, e: Event) {
    const kids = [...(this._config?.kids ?? [])];
    kids[kidIdx] = { ...kids[kidIdx], [field]: (e.target as HTMLInputElement).value };
    this._fire({ ...this._config!, kids });
  }

  private _kidColorChanged(kidIdx: number, e: Event) {
    const kids = [...(this._config?.kids ?? [])];
    kids[kidIdx] = { ...kids[kidIdx], color: (e.target as HTMLInputElement).value };
    this._fire({ ...this._config!, kids });
  }

  private _kidStreakChanged(kidIdx: number, e: CustomEvent) {
    const kids = [...(this._config?.kids ?? [])];
    kids[kidIdx] = { ...kids[kidIdx], streak: e.detail?.value ?? '' };
    this._fire({ ...this._config!, kids });
  }

  private _choreNameChanged(kidIdx: number, choreIdx: number, e: Event) {
    const kids = [...(this._config?.kids ?? [])];
    const chores = [...kids[kidIdx].chores];
    chores[choreIdx] = { ...chores[choreIdx], name: (e.target as HTMLInputElement).value };
    kids[kidIdx] = { ...kids[kidIdx], chores };
    this._fire({ ...this._config!, kids });
  }

  private _choreEntityChanged(kidIdx: number, choreIdx: number, e: CustomEvent) {
    const kids = [...(this._config?.kids ?? [])];
    const chores = [...kids[kidIdx].chores];
    chores[choreIdx] = { ...chores[choreIdx], entity: e.detail?.value ?? '' };
    kids[kidIdx] = { ...kids[kidIdx], chores };
    this._fire({ ...this._config!, kids });
  }

  private _removeChore(kidIdx: number, choreIdx: number) {
    const kids = [...(this._config?.kids ?? [])];
    const chores = [...kids[kidIdx].chores];
    if (chores.length <= 1) return;
    chores.splice(choreIdx, 1);
    kids[kidIdx] = { ...kids[kidIdx], chores };
    this._fire({ ...this._config!, kids });
  }

  private _addChore(kidIdx: number) {
    const kids = [...(this._config?.kids ?? [])];
    const chores = [...kids[kidIdx].chores, { name: 'New chore', entity: '' }];
    kids[kidIdx] = { ...kids[kidIdx], chores };
    this._fire({ ...this._config!, kids });
  }

  private _removeKid(kidIdx: number) {
    const kids = [...(this._config?.kids ?? [])];
    if (kids.length <= 1) return;
    kids.splice(kidIdx, 1);
    this._fire({ ...this._config!, kids });
  }

  private _addKid() {
    const existingKids = this._config?.kids ?? [];
    const existingSlugs = new Set(
      existingKids.map((k) => k.name.toLowerCase().replace(/\s+/g, '_')),
    );
    const colors = ['#f5c89c', '#b8e0d2', '#f0b8c8', '#a8d8b9', '#c8b4e0'];
    let n = existingKids.length + 1;
    while (existingSlugs.has(`kid_${n}`)) n++;
    const kids = [
      ...existingKids,
      {
        name: `Kid ${n}`,
        color: colors[(n - 1) % colors.length],
        streak: `counter.kid_${n}_streak`,
        chores: [{ name: 'Chore 1', entity: '' }],
      },
    ];
    this._fire({ ...this._config!, kids });
  }

  render() {
    if (!this._config) return html``;
    if (!this._haReady) return html`<div class="loading">Loading editor…</div>`;
    const kids = this._config.kids ?? [];

    return html`
      <div class="section-label">General</div>
      <ha-textfield
        label="Card title"
        .value=${this._config.title ?? ''}
        @change=${this._titleChanged}
      ></ha-textfield>

      <div class="section-label">Kids</div>
      ${kids.map(
        (kid, kidIdx) => html`
          <div class="kid-block">
            <div class="kid-header">
              <div class="kid-header-fields">
                <ha-textfield
                  label="Name"
                  .value=${kid.name}
                  @change=${(e: Event) => this._kidFieldChanged(kidIdx, 'name', e)}
                ></ha-textfield>
                <ha-textfield
                  label="Avatar URL (optional)"
                  .value=${kid.avatar ?? ''}
                  @change=${(e: Event) => this._kidFieldChanged(kidIdx, 'avatar', e)}
                ></ha-textfield>
              </div>
              <button type="button" class="remove" @click=${() => this._removeKid(kidIdx)} title="Remove kid">✕</button>
            </div>

            <div class="color-row">
              <input
                type="color"
                class="color-swatch"
                .value=${kid.color}
                @input=${(e: Event) => this._kidColorChanged(kidIdx, e)}
                title="Kid color"
              />
              <ha-entity-picker
                label="Streak counter"
                .hass=${this.hass}
                .value=${kid.streak}
                .includeDomains=${['counter']}
                allow-custom-entity
                @value-changed=${(e: CustomEvent) => this._kidStreakChanged(kidIdx, e)}
              ></ha-entity-picker>
            </div>

            <div class="chore-label">Chores</div>
            ${kid.chores.map(
              (chore, choreIdx) => html`
                <div class="chore-row">
                  <ha-textfield
                    label="Chore name"
                    .value=${chore.name}
                    @change=${(e: Event) => this._choreNameChanged(kidIdx, choreIdx, e)}
                  ></ha-textfield>
                  <ha-entity-picker
                    label="Entity"
                    .hass=${this.hass}
                    .value=${chore.entity}
                    .includeDomains=${['input_boolean']}
                    allow-custom-entity
                    @value-changed=${(e: CustomEvent) => this._choreEntityChanged(kidIdx, choreIdx, e)}
                  ></ha-entity-picker>
                  <button type="button" class="remove" @click=${() => this._removeChore(kidIdx, choreIdx)} title="Remove">✕</button>
                </div>
              `,
            )}
            <button type="button" class="add" @click=${() => this._addChore(kidIdx)}>+ Add chore</button>
          </div>
        `,
      )}
      <button type="button" class="add" @click=${this._addKid}>+ Add kid</button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-chores-card-editor': LucarneChoresCardEditor;
  }
}
