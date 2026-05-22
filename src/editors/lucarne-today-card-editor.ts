import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../shared/types.js';
import type { LucarneTodayCardConfig } from '../cards/lucarne-today-card.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { fireEvent } from 'custom-card-helpers';

@customElement('lucarne-today-card-editor')
export class LucarneTodayCardEditor extends LitElement {
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
      .row {
        display: flex;
        gap: var(--lucarne-spacing-sm);
        align-items: flex-start;
      }
      .row > * {
        flex: 1;
      }
      .cal-row {
        display: grid;
        grid-template-columns: 1fr 1fr auto auto;
        gap: var(--lucarne-spacing-sm);
        align-items: center;
        padding: var(--lucarne-spacing-xs) 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }
      .cal-row ha-entity-picker,
      .cal-row ha-textfield,
      .presence-row ha-entity-picker,
      .presence-row ha-textfield,
      .row ha-entity-picker,
      .row ha-textfield {
        width: 100%;
        min-width: 0;
      }
      .cal-color {
        width: 32px;
        height: 32px;
        border-radius: var(--lucarne-radius-sm);
        border: 1px solid rgba(0, 0, 0, 0.2);
        cursor: pointer;
        flex-shrink: 0;
      }
      .presence-row {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: var(--lucarne-spacing-sm);
        align-items: center;
        padding: var(--lucarne-spacing-xs) 0;
      }
      button.remove {
        background: none;
        border: none;
        color: var(--error-color, #f44336);
        cursor: pointer;
        font-size: 1.1em;
        padding: 4px 8px;
        border-radius: var(--lucarne-radius-sm);
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
    `,
  ];

  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config?: LucarneTodayCardConfig;

  setConfig(config: LucarneTodayCardConfig) {
    this._config = config;
  }

  private _fire(config: LucarneTodayCardConfig) {
    fireEvent(this, 'config-changed', { config });
  }

  private _titleChanged(e: Event) {
    const input = e.target as HTMLInputElement;
    this._fire({ ...this._config!, title: input.value || undefined });
  }

  private _weatherChanged(e: CustomEvent) {
    this._fire({ ...this._config!, weather: e.detail?.value ?? undefined });
  }

  private _tasksChanged(e: CustomEvent) {
    this._fire({ ...this._config!, tasks: e.detail?.value ?? undefined });
  }

  private _agendaLimitChanged(e: Event) {
    const input = e.target as HTMLInputElement;
    const v = parseInt(input.value, 10);
    this._fire({ ...this._config!, agenda_limit: isNaN(v) ? undefined : Math.min(10, Math.max(1, v)) });
  }

  private _calEntityChanged(index: number, e: CustomEvent) {
    const cals = [...(this._config?.calendars ?? [])];
    cals[index] = { ...cals[index], entity: e.detail?.value ?? '' };
    this._fire({ ...this._config!, calendars: cals });
  }

  private _calColorChanged(index: number, e: Event) {
    const cals = [...(this._config?.calendars ?? [])];
    cals[index] = { ...cals[index], color: (e.target as HTMLInputElement).value };
    this._fire({ ...this._config!, calendars: cals });
  }

  private _calLabelChanged(index: number, e: Event) {
    const cals = [...(this._config?.calendars ?? [])];
    cals[index] = { ...cals[index], label: (e.target as HTMLInputElement).value };
    this._fire({ ...this._config!, calendars: cals });
  }

  private _removeCalendar(index: number) {
    const cals = [...(this._config?.calendars ?? [])];
    if (cals.length <= 1) return; // keep at least one calendar
    cals.splice(index, 1);
    this._fire({ ...this._config!, calendars: cals });
  }

  private _addCalendar() {
    // Seed with a real calendar entity and a non-empty label so setConfig() validation passes.
    const firstCalendar = Object.keys(this.hass?.states ?? {}).find((id) => id.startsWith('calendar.'));
    const defaultEntity = firstCalendar ?? 'calendar.example';
    const defaultLabel = firstCalendar
      ? (this.hass.states[firstCalendar]?.attributes?.['friendly_name'] as string | undefined) ?? 'Calendar'
      : 'Calendar';
    const cals = [
      ...(this._config?.calendars ?? []),
      { entity: defaultEntity, color: '#a8d8b9', label: defaultLabel },
    ];
    this._fire({ ...this._config!, calendars: cals });
  }

  private _presenceEntityChanged(index: number, e: CustomEvent) {
    const entries = [...(this._config?.presence ?? [])];
    entries[index] = { ...entries[index], entity: e.detail?.value ?? '' };
    this._fire({ ...this._config!, presence: entries });
  }

  private _presenceNameChanged(index: number, e: Event) {
    const entries = [...(this._config?.presence ?? [])];
    entries[index] = { ...entries[index], name: (e.target as HTMLInputElement).value };
    this._fire({ ...this._config!, presence: entries });
  }

  private _removePresence(index: number) {
    const entries = [...(this._config?.presence ?? [])];
    entries.splice(index, 1);
    this._fire({ ...this._config!, presence: entries });
  }

  private _addPresence() {
    const entries = [...(this._config?.presence ?? []), { entity: '', name: '' }];
    this._fire({ ...this._config!, presence: entries });
  }

  render() {
    if (!this._config) return html``;

    const calendars = this._config.calendars ?? [];
    const presence = this._config.presence ?? [];

    return html`
      <div class="section-label">General</div>
      <ha-textfield
        label="Card title"
        .value=${this._config.title ?? ''}
        @change=${this._titleChanged}
      ></ha-textfield>
      <ha-textfield
        label="Agenda limit (1–10)"
        type="number"
        min="1"
        max="10"
        .value=${String(this._config.agenda_limit ?? 5)}
        @change=${this._agendaLimitChanged}
      ></ha-textfield>

      <div class="section-label">Weather</div>
      <ha-entity-picker
        label="Weather entity"
        .hass=${this.hass}
        .value=${this._config.weather ?? ''}
        .includeDomains=${['weather']}
        allow-custom-entity
        @value-changed=${this._weatherChanged}
      ></ha-entity-picker>

      <div class="section-label">Tasks</div>
      <ha-entity-picker
        label="Todo entity (Ingrid's tasks)"
        .hass=${this.hass}
        .value=${this._config.tasks ?? ''}
        .includeDomains=${['todo']}
        allow-custom-entity
        @value-changed=${this._tasksChanged}
      ></ha-entity-picker>

      <div class="section-label">Calendars</div>
      ${calendars.map(
        (cal, i) => html`
          <div class="cal-row">
            <ha-entity-picker
              label="Calendar entity"
              .hass=${this.hass}
              .value=${cal.entity}
              .includeDomains=${['calendar']}
              allow-custom-entity
              @value-changed=${(e: CustomEvent) => this._calEntityChanged(i, e)}
            ></ha-entity-picker>
            <ha-textfield
              label="Label"
              .value=${cal.label}
              @change=${(e: Event) => this._calLabelChanged(i, e)}
            ></ha-textfield>
            <input
              type="color"
              class="cal-color"
              .value=${cal.color}
              @input=${(e: Event) => this._calColorChanged(i, e)}
              title="Calendar color"
            />
            <button class="remove" @click=${() => this._removeCalendar(i)} title="Remove">✕</button>
          </div>
        `,
      )}
      <button class="add" @click=${this._addCalendar}>+ Add calendar</button>

      <div class="section-label">Presence</div>
      ${presence.map(
        (entry, i) => html`
          <div class="presence-row">
            <ha-entity-picker
              label="Entity"
              .hass=${this.hass}
              .value=${entry.entity}
              .includeDomains=${['input_boolean']}
              allow-custom-entity
              @value-changed=${(e: CustomEvent) => this._presenceEntityChanged(i, e)}
            ></ha-entity-picker>
            <ha-textfield
              label="Display name"
              .value=${entry.name}
              @change=${(e: Event) => this._presenceNameChanged(i, e)}
            ></ha-textfield>
            <button class="remove" @click=${() => this._removePresence(i)} title="Remove">✕</button>
          </div>
        `,
      )}
      <button class="add" @click=${this._addPresence}>+ Add person</button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-today-card-editor': LucarneTodayCardEditor;
  }
}
