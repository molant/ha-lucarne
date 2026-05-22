import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../shared/types.js';
import type { LucarneCalendarCardConfig } from '../cards/lucarne-calendar-card.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { editorBaseStyles } from '../shared/editor-styles.js';
import { ensureHaFormElements } from '../shared/ha-elements.js';
import { fireEvent } from 'custom-card-helpers';

@customElement('lucarne-calendar-card-editor')
export class LucarneCalendarCardEditor extends LitElement {
  static styles = [lucarneStyles, editorBaseStyles];

  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config?: LucarneCalendarCardConfig;
  @state() private _haReady = false;

  connectedCallback() {
    super.connectedCallback();
    ensureHaFormElements()
      .catch((err) => console.warn('[lucarne] HA editor elements load failed; rendering anyway', err))
      .then(() => {
        this._haReady = true;
      });
  }

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
    const checked = (e.target as HTMLInputElement).checked;
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

  private _removeCalendar(index: number) {
    const cals = [...(this._config?.calendars ?? [])];
    if (cals.length <= 1) return;
    cals.splice(index, 1);
    this._fire({ ...this._config!, calendars: cals });
  }

  private _addCalendar() {
    const firstCalendar = Object.keys(this.hass?.states ?? {}).find((id) => id.startsWith('calendar.'));
    const defaultEntity = firstCalendar ?? 'calendar.example';
    const cals = [
      ...(this._config?.calendars ?? []),
      { entity: defaultEntity, color: '#a8d8b9' },
    ];
    this._fire({ ...this._config!, calendars: cals });
  }

  render() {
    if (!this._config) return html``;
    if (!this._haReady) return html`<div class="loading">Loading editor…</div>`;

    const calendars = this._config.calendars ?? [];
    const bandStart = this._config.visible_hours?.start ?? '07:00';
    const bandEnd = this._config.visible_hours?.end ?? '21:00';
    const weekStartsOn = this._config.week_starts_on ?? 'monday';
    const showCreate = this._config.show_create_button ?? true;

    return html`
      <label class="field">
        <span class="field-label">Card title</span>
        <input
          class="text-input"
          type="text"
          .value=${this._config.title ?? ''}
          @change=${this._titleChanged}
        />
      </label>

      <div class="row">
        <label class="field">
          <span class="field-label">Visible hours start (HH:MM)</span>
          <input
            class="text-input"
            type="text"
            .value=${bandStart}
            @change=${this._bandStartChanged}
          />
        </label>
        <label class="field">
          <span class="field-label">Visible hours end (HH:MM)</span>
          <input
            class="text-input"
            type="text"
            .value=${bandEnd}
            @change=${this._bandEndChanged}
          />
        </label>
      </div>

      <label class="field">
        <span class="field-label">Week starts on</span>
        <select
          class="select-input"
          .value=${weekStartsOn}
          @change=${this._weekStartsOnChanged}
        >
          <option value="monday" ?selected=${weekStartsOn === 'monday'}>Monday</option>
          <option value="sunday" ?selected=${weekStartsOn === 'sunday'}>Sunday</option>
        </select>
      </label>

      <label class="toggle-row">
        <span class="toggle-label">Show create-event button</span>
        <input
          type="checkbox"
          .checked=${showCreate}
          @change=${this._showCreateChanged}
        />
      </label>

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
            <input
              type="color"
              class="cal-color"
              .value=${cal.color}
              @input=${(e: Event) => this._calColorChanged(i, e)}
              title="Calendar color"
            />
            <button type="button" class="remove" @click=${() => this._removeCalendar(i)} title="Remove">✕</button>
          </div>
        `,
      )}
      <button type="button" class="add" @click=${this._addCalendar}>+ Add calendar</button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-calendar-card-editor': LucarneCalendarCardEditor;
  }
}
