import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../shared/types.js';
import type { LucarneCalendarCardConfig } from '../cards/lucarne-calendar-card.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { fireEvent } from 'custom-card-helpers';

@customElement('lucarne-calendar-card-editor')
export class LucarneCalendarCardEditor extends LitElement {
  static styles = [
    lucarneStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--lucarne-spacing-md);
        padding: var(--lucarne-spacing-lg);
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
      .cal-color {
        width: 32px;
        height: 32px;
        border-radius: var(--lucarne-radius-sm);
        border: 1px solid rgba(0, 0, 0, 0.2);
        cursor: pointer;
        flex-shrink: 0;
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
      .toggle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--lucarne-spacing-xs) 0;
      }
      .toggle-label {
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface);
      }
    `,
  ];

  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config?: LucarneCalendarCardConfig;

  setConfig(config: LucarneCalendarCardConfig) {
    this._config = config;
  }

  private _fire(config: LucarneCalendarCardConfig) {
    fireEvent(this, 'config-changed', { config });
  }

  private _titleChanged(e: Event) {
    const input = e.target as HTMLInputElement;
    this._fire({ ...this._config!, title: input.value || undefined });
  }

  private _weekStartsOnChanged(e: Event) {
    const value = (e.target as HTMLSelectElement).value as 'monday' | 'sunday';
    if (!value) return;
    this._fire({ ...this._config!, week_starts_on: value });
  }

  private _bandStartChanged(e: Event) {
    const input = e.target as HTMLInputElement;
    this._fire({
      ...this._config!,
      visible_hours: { ...this._config!.visible_hours ?? { start: '07:00', end: '21:00' }, start: input.value },
    });
  }

  private _bandEndChanged(e: Event) {
    const input = e.target as HTMLInputElement;
    this._fire({
      ...this._config!,
      visible_hours: { ...this._config!.visible_hours ?? { start: '07:00', end: '21:00' }, end: input.value },
    });
  }

  private _showCreateChanged(e: Event) {
    const checked = (e.target as HTMLInputElement & { checked: boolean }).checked;
    this._fire({ ...this._config!, show_create_button: checked });
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
    if (cals.length <= 1) return;
    cals.splice(index, 1);
    this._fire({ ...this._config!, calendars: cals });
  }

  private _addCalendar() {
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

  render() {
    if (!this._config) return html``;

    const calendars = this._config.calendars ?? [];
    const bandStart = this._config.visible_hours?.start ?? '07:00';
    const bandEnd = this._config.visible_hours?.end ?? '21:00';
    const weekStartsOn = this._config.week_starts_on ?? 'monday';
    const showCreate = this._config.show_create_button ?? true;

    return html`
      <div class="section-label">General</div>
      <ha-textfield
        label="Card title"
        .value=${this._config.title ?? ''}
        @change=${this._titleChanged}
      ></ha-textfield>

      <div class="section-label">Visible Hours</div>
      <div class="row">
        <ha-textfield
          label="Band start (HH:MM)"
          .value=${bandStart}
          @change=${this._bandStartChanged}
        ></ha-textfield>
        <ha-textfield
          label="Band end (HH:MM)"
          .value=${bandEnd}
          @change=${this._bandEndChanged}
        ></ha-textfield>
      </div>

      <div class="section-label">Week Settings</div>
      <ha-select
        label="Week starts on"
        .value=${weekStartsOn}
        @selected=${this._weekStartsOnChanged}
        @closed=${(e: Event) => e.stopPropagation()}
      >
        <ha-list-item value="monday">Monday</ha-list-item>
        <ha-list-item value="sunday">Sunday</ha-list-item>
      </ha-select>

      <div class="toggle-row">
        <span class="toggle-label">Show create-event button</span>
        <ha-switch
          .checked=${showCreate}
          @change=${this._showCreateChanged}
        ></ha-switch>
      </div>

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
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-calendar-card-editor': LucarneCalendarCardEditor;
  }
}
