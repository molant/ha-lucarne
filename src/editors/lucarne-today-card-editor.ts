import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../shared/types.js';
import type { LucarneTodayCardConfig, TodaySectionId } from '../cards/lucarne-today-card.js';
import { normalizeSectionOrder } from '../cards/lucarne-today-card.js';
import { SYNTHETIC_HOUSEHOLD } from '../shared/family-subscription.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { editorBaseStyles } from '../shared/editor-styles.js';
import { ensureHaFormElements } from '../shared/ha-elements.js';
import { fireEvent } from 'custom-card-helpers';

const SECTION_LABELS: Record<TodaySectionId, string> = {
  calendar: 'Calendar',
  weather: 'Weather',
  tasks: 'Tasks',
};

const sectionOrderStyles = css`
  .section-order-list {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    border-radius: var(--lucarne-radius-md);
    overflow: hidden;
  }
  .section-order-row {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
    gap: var(--lucarne-spacing-sm);
    padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-md);
    background: var(--ha-card-background, var(--card-background-color, #fff));
  }
  .section-order-row + .section-order-row {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
  }
  .section-order-row.dragging {
    opacity: 0.5;
  }
  .section-order-row.drag-over {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
  }
  .grab-handle {
    cursor: grab;
    color: var(--lucarne-on-surface-muted);
    font-size: 1.2em;
    line-height: 1;
    user-select: none;
    padding: 0 var(--lucarne-spacing-xs);
  }
  .grab-handle:active {
    cursor: grabbing;
  }
  .section-label-cell {
    font-size: var(--lucarne-fs-md);
    color: var(--lucarne-on-surface);
  }
  .move-btn {
    background: none;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.15));
    border-radius: var(--lucarne-radius-sm);
    padding: 2px 8px;
    font-size: 0.9em;
    color: var(--lucarne-on-surface-muted);
    cursor: pointer;
    min-width: 28px;
  }
  .move-btn:hover:not(:disabled) {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
  }
  .move-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

@customElement('lucarne-today-card-editor')
export class LucarneTodayCardEditor extends LitElement {
  static styles = [lucarneStyles, editorBaseStyles, sectionOrderStyles];

  @state() private _dragIndex: number | null = null;
  @state() private _dragOverIndex: number | null = null;

  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config?: LucarneTodayCardConfig;
  @state() private _haReady = false;

  connectedCallback() {
    super.connectedCallback();
    ensureHaFormElements()
      .catch((err) => console.warn('[lucarne] HA editor elements load failed; rendering anyway', err))
      .then(() => {
        this._haReady = true;
      });
  }

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

  private _integrationTasksChanged(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    this._fire({ ...this._config!, household_tasks_from_integration: checked || undefined });
  }

  private _familyPillChanged(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    this._fire({ ...this._config!, show_family_ready_pill: checked || undefined });
  }

  private _isIntegrationAvailable(): boolean {
    // Heuristic: household entity exists when integration is set up. This may briefly
    // return false during first setup before async_ensure_household_entity runs; that
    // is acceptable — the toggles become enabled on the next hass update.
    return !!(this.hass?.states?.[SYNTHETIC_HOUSEHOLD.todo_entity_id]);
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

  private _removeCalendar(index: number) {
    const cals = [...(this._config?.calendars ?? [])];
    if (cals.length <= 1) return; // keep at least one calendar
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

  private _commitSectionOrder(order: TodaySectionId[]) {
    this._fire({ ...this._config!, section_order: order });
  }

  private _moveSection(index: number, delta: number) {
    const order = normalizeSectionOrder(this._config?.section_order);
    const target = index + delta;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    this._commitSectionOrder(next);
  }

  private _onDragStart(index: number, e: DragEvent) {
    this._dragIndex = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      // Some browsers require data to start a drag.
      e.dataTransfer.setData('text/plain', String(index));
    }
  }

  private _onDragOver(index: number, e: DragEvent) {
    if (this._dragIndex === null || this._dragIndex === index) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    if (this._dragOverIndex !== index) this._dragOverIndex = index;
  }

  private _onDrop(index: number, e: DragEvent) {
    e.preventDefault();
    const from = this._dragIndex;
    this._dragIndex = null;
    this._dragOverIndex = null;
    if (from === null || from === index) return;
    const order = normalizeSectionOrder(this._config?.section_order);
    const next = [...order];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    this._commitSectionOrder(next);
  }

  private _onDragEnd() {
    this._dragIndex = null;
    this._dragOverIndex = null;
  }

  private _renderSectionOrder() {
    const order = normalizeSectionOrder(this._config?.section_order);
    return html`
      <div class="section-label">Section order</div>
      <div class="section-order-list" role="list" aria-label="Card sections (drag to reorder)">
        ${order.map(
          (id, i) => html`
            <div
              class="section-order-row ${this._dragIndex === i ? 'dragging' : ''} ${this._dragOverIndex === i ? 'drag-over' : ''}"
              role="listitem"
              draggable="true"
              data-section=${id}
              data-index=${i}
              @dragstart=${(e: DragEvent) => this._onDragStart(i, e)}
              @dragover=${(e: DragEvent) => this._onDragOver(i, e)}
              @drop=${(e: DragEvent) => this._onDrop(i, e)}
              @dragend=${this._onDragEnd}
            >
              <span class="grab-handle" aria-hidden="true">≡</span>
              <span class="section-label-cell">${SECTION_LABELS[id]}</span>
              <button
                type="button"
                class="move-btn"
                aria-label="Move ${SECTION_LABELS[id]} up"
                ?disabled=${i === 0}
                @click=${() => this._moveSection(i, -1)}
              >↑</button>
              <button
                type="button"
                class="move-btn"
                aria-label="Move ${SECTION_LABELS[id]} down"
                ?disabled=${i === order.length - 1}
                @click=${() => this._moveSection(i, 1)}
              >↓</button>
            </div>
          `,
        )}
      </div>
    `;
  }

  render() {
    if (!this._config) return html``;
    if (!this._haReady) return html`<div class="loading">Loading editor…</div>`;

    const calendars = this._config.calendars ?? [];
    const presence = this._config.presence ?? [];

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
      <label class="field">
        <span class="field-label">Agenda limit (1–10)</span>
        <input
          class="text-input"
          type="number"
          min="1"
          max="10"
          .value=${String(this._config.agenda_limit ?? 5)}
          @change=${this._agendaLimitChanged}
        />
      </label>

      ${this._renderSectionOrder()}

      <ha-entity-picker
        label="Weather entity"
        .hass=${this.hass}
        .value=${this._config.weather ?? ''}
        .includeDomains=${['weather']}
        allow-custom-entity
        @value-changed=${this._weatherChanged}
      ></ha-entity-picker>

      <ha-entity-picker
        label="Todo entity"
        .hass=${this.hass}
        .value=${this._config.tasks ?? ''}
        .includeDomains=${['todo']}
        allow-custom-entity
        @value-changed=${this._tasksChanged}
      ></ha-entity-picker>

      <div class="section-label">Lucarne Family integration</div>
      <label class="field field-inline" style="${this._isIntegrationAvailable() ? '' : 'opacity:0.5;pointer-events:none'}">
        <span class="field-label">Household tasks from integration</span>
        <input
          type="checkbox"
          .checked=${this._config.household_tasks_from_integration ?? false}
          @change=${this._integrationTasksChanged}
          ?disabled=${!this._isIntegrationAvailable()}
        />
        ${this._isIntegrationAvailable() ? '' : html`<small> — install Lucarne Family integration first</small>`}
      </label>
      <label class="field field-inline" style="${this._isIntegrationAvailable() ? '' : 'opacity:0.5;pointer-events:none'}">
        <span class="field-label">Show family ready pill</span>
        <input
          type="checkbox"
          .checked=${this._config.show_family_ready_pill ?? false}
          @change=${this._familyPillChanged}
          ?disabled=${!this._isIntegrationAvailable()}
        />
        ${this._isIntegrationAvailable() ? '' : html`<small> — install Lucarne Family integration first</small>`}
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

      <div class="section-label">Presence</div>
      ${presence.map(
        (entry, i) => html`
          <div class="presence-row">
            <div class="row-stack">
              <ha-entity-picker
                label="Entity"
                .hass=${this.hass}
                .value=${entry.entity}
                .includeDomains=${['input_boolean']}
                allow-custom-entity
                @value-changed=${(e: CustomEvent) => this._presenceEntityChanged(i, e)}
              ></ha-entity-picker>
              <input
                class="text-input"
                type="text"
                placeholder="Display name"
                .value=${entry.name}
                @change=${(e: Event) => this._presenceNameChanged(i, e)}
              />
            </div>
            <button type="button" class="remove" @click=${() => this._removePresence(i)} title="Remove">✕</button>
          </div>
        `,
      )}
      <button type="button" class="add" @click=${this._addPresence}>+ Add person</button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-today-card-editor': LucarneTodayCardEditor;
  }
}
