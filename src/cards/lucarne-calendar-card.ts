import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { fetchCalendarEvents } from '../shared/ha-subscriptions.js';
import { layoutEvents } from '../shared/calendar-layout.js';
import { startOfWeek, endOfWeek } from '../shared/date-helpers.js';
import type { HomeAssistant, CalendarConfig, CalendarEvent } from '../shared/types.js';
import type { CalendarLayoutResult } from '../shared/calendar-layout.js';

import '../components/visibility-pills.js';
import '../components/calendar-grid.js';
import '../components/calendar-event-popover.js';
import '../components/create-event-popover.js';

export interface LucarneCalendarCardConfig {
  type: 'custom:lucarne-calendar-card';
  title?: string;
  calendars: CalendarConfig[];
  visible_hours?: { start: string; end: string };
  week_starts_on?: 'monday' | 'sunday';
  show_create_button?: boolean;
}

(window as Window & typeof globalThis & { customCards?: object[] }).customCards =
  (window as Window & typeof globalThis & { customCards?: object[] }).customCards || [];
(window as Window & typeof globalThis & { customCards?: object[] }).customCards!.push({
  type: 'lucarne-calendar-card',
  name: 'Lucarne Calendar',
  description: 'Week view calendar with per-person color, visibility pills, and create-event flow',
  preview: true,
});

@customElement('lucarne-calendar-card')
export class LucarneCalendarCard extends LitElement {
  static styles = [
    lucarneStyles,
    css`
      :host {
        display: block;
        font-family: var(--primary-font-family, sans-serif);
      }
      ha-card {
        padding: 0;
        overflow: hidden;
      }
      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--lucarne-spacing-lg) var(--lucarne-spacing-xl) var(--lucarne-spacing-xs);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
      .card-title {
        font-size: var(--lucarne-fs-lg);
        font-weight: 700;
        color: var(--lucarne-on-surface);
        margin: 0;
      }
      .week-nav {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-xs);
      }
      .nav-btn {
        background: none;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: var(--lucarne-radius-sm);
        padding: 4px 10px;
        cursor: pointer;
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        min-height: 44px;
        min-width: 44px;
      }
      .nav-btn:hover {
        background: rgba(0, 0, 0, 0.04);
      }
      .week-label {
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        min-width: 80px;
        text-align: center;
      }
      .pills-row {
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
      .grid-area {
        overflow: auto;
      }
    `,
  ];

  @property({ attribute: false }) hass!: HomeAssistant;

  @state() private _config?: LucarneCalendarCardConfig;
  @state() private _layout: CalendarLayoutResult | null = null;
  @state() private _visibleIds: Set<string> = new Set();
  @state() private _weekOffset = 0;
  @state() private _openEvent: CalendarEvent | null = null;
  @state() private _openEventColor = '';
  @state() private _openEventCalLabel = '';
  @state() private _createDay: Date | null = null;
  @state() private _createStartHour = 9;
  // Cached stable array — only replaced when entity list or support changes
  @state() private _creatableCalendars: CalendarConfig[] = [];

  private _intervalId?: ReturnType<typeof setInterval>;
  private _fetchSeq = 0;
  private _rawEvents: Map<string, CalendarEvent[]> = new Map();
  private _pendingEvents: CalendarEvent[] = [];

  setConfig(config: LucarneCalendarCardConfig) {
    if (!config.calendars || !Array.isArray(config.calendars) || config.calendars.length === 0) {
      throw new Error('lucarne-calendar-card: "calendars" must be a non-empty array');
    }
    for (const cal of config.calendars) {
      if (!cal.entity || !cal.color || !cal.label) {
        throw new Error('lucarne-calendar-card: each calendar requires "entity", "color", and "label"');
      }
    }
    // Normalize visible_hours to whole-hour boundaries — band math only operates on integer hours
    let normalizedConfig = config;
    if (config.visible_hours) {
      const hhmmRe = /^\d{1,2}:\d{2}$/;
      if (!hhmmRe.test(config.visible_hours.start) || !hhmmRe.test(config.visible_hours.end)) {
        throw new Error('lucarne-calendar-card: "visible_hours" start and end must be in HH:MM format');
      }
      const startH = parseInt(config.visible_hours.start.split(':')[0], 10);
      const endH = parseInt(config.visible_hours.end.split(':')[0], 10);
      if (startH < 0 || endH > 24 || startH >= endH) {
        throw new Error('lucarne-calendar-card: "visible_hours" must satisfy 0 <= start < end <= 24');
      }
      normalizedConfig = {
        ...config,
        visible_hours: {
          start: `${String(startH).padStart(2, '0')}:00`,
          end: `${String(endH).padStart(2, '0')}:00`,
        },
      };
    }
    this._config = normalizedConfig;
    this._visibleIds = new Set(config.calendars.map((c) => c.entity));
    if (this.hass) this._updateCreatableCalendars();
    if (this.isConnected) {
      this._teardown();
      this._setup();
    }
  }

  static getStubConfig(hass: HomeAssistant): LucarneCalendarCardConfig {
    const calIds = Object.keys(hass.states)
      .filter((id) => id.startsWith('calendar.'))
      .slice(0, 3);
    const palettes = ['#a8d8b9', '#a8c5e8', '#c8b4e0'];
    const calendars: CalendarConfig[] = calIds.map((id, i) => ({
      entity: id,
      color: palettes[i] ?? '#a8d8b9',
      label: hass.states[id]?.attributes?.['friendly_name'] ?? id,
    }));
    return {
      type: 'custom:lucarne-calendar-card',
      title: 'Calendar',
      calendars: calendars.length ? calendars : [{ entity: 'calendar.example', color: '#a8d8b9', label: 'Calendar' }],
      visible_hours: { start: '07:00', end: '21:00' },
      week_starts_on: 'monday',
      show_create_button: true,
    };
  }

  getCardSize() {
    return 6;
  }

  static getConfigElement() {
    return document.createElement('lucarne-calendar-card-editor');
  }

  connectedCallback() {
    super.connectedCallback();
    this._setup();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._teardown();
  }

  updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);
    if (!changedProps.has('hass') || !this._config) return;
    const prevHass = changedProps.get('hass');
    if (!prevHass && this.hass && !this._intervalId) {
      this._setup();
    }
    this._updateCreatableCalendars();
  }

  private _setup() {
    if (!this._config || !this.hass) return;
    this._fetchEvents();
    this._intervalId = setInterval(() => this._fetchEvents(), 5 * 60 * 1000);
  }

  private _teardown() {
    clearInterval(this._intervalId);
    this._intervalId = undefined;
  }

  private get _weekStart(): Date {
    const now = new Date();
    const ws = startOfWeek(now, this._config?.week_starts_on ?? 'monday');
    ws.setDate(ws.getDate() + this._weekOffset * 7);
    ws.setHours(0, 0, 0, 0);
    return ws;
  }

  private get _weekEnd(): Date {
    return endOfWeek(this._weekStart, this._config?.week_starts_on ?? 'monday');
  }

  private async _fetchEvents() {
    if (!this._config || !this.hass) return;
    const seq = ++this._fetchSeq;
    const weekStart = this._weekStart;
    const weekEnd = this._weekEnd;
    const entityIds = this._config.calendars.map((c) => c.entity);
    const map = await fetchCalendarEvents(this.hass, entityIds, weekStart, weekEnd);
    if (seq !== this._fetchSeq) return; // discard stale response from a previous week

    // Tag events with entity_id in uid for color lookup
    const tagged = new Map<string, CalendarEvent[]>();
    for (const [entityId, events] of map.entries()) {
      tagged.set(
        entityId,
        events.map((e) => ({ ...e, uid: `${entityId}::${e.uid ?? ''}` })),
      );
    }
    this._rawEvents = tagged;
    this._pendingEvents = []; // real data arrived, discard optimistic events
    this._recompute();
  }

  private _recompute() {
    if (!this._config) return;
    const allEvents: CalendarEvent[] = [];
    for (const [entityId, events] of this._rawEvents.entries()) {
      if (this._visibleIds.has(entityId)) {
        allEvents.push(...events);
      }
    }
    allEvents.push(
      ...this._pendingEvents.filter((e) => {
        const entityId = e.uid?.split('::')[0];
        return entityId ? this._visibleIds.has(entityId) : true;
      }),
    );
    const bandStart = this._config.visible_hours?.start ?? '07:00';
    const bandEnd = this._config.visible_hours?.end ?? '21:00';
    this._layout = layoutEvents(allEvents, this._weekStart, bandStart, bandEnd, this._config.week_starts_on ?? 'monday');
  }

  private _supportsCreate(entityId: string): boolean {
    const supported = this.hass?.states[entityId]?.attributes?.['supported_features'] as number | undefined;
    return supported !== undefined && (supported & 1) !== 0;
  }

  private _updateCreatableCalendars() {
    if (!this._config || !this.hass) return;
    const next = this._config.calendars.filter((c) => this._supportsCreate(c.entity));
    const same =
      next.length === this._creatableCalendars.length &&
      next.every((c, i) => c.entity === this._creatableCalendars[i]?.entity);
    if (!same) this._creatableCalendars = next;
  }

  private _onVisibilityChange(e: CustomEvent<Set<string>>) {
    this._visibleIds = e.detail;
    this._recompute();
  }

  private _onEventTap(e: CustomEvent<{ event: CalendarEvent; color: string }>) {
    const { event, color } = e.detail;
    this._openEvent = event;
    this._openEventColor = color;
    // Find calendar label
    if (event.uid?.includes('::')) {
      const entityId = event.uid.split('::')[0];
      const cal = this._config?.calendars.find((c) => c.entity === entityId);
      this._openEventCalLabel = cal?.label ?? '';
    } else {
      this._openEventCalLabel = '';
    }
  }

  private _closePopover() {
    this._openEvent = null;
  }

  private _onCreateEventTap(e: CustomEvent<{ day: Date; startHour: number }>) {
    const { day, startHour } = e.detail;
    this._createDay = day;
    this._createStartHour = startHour;
  }

  private _closeCreatePopover() {
    this._createDay = null;
  }

  private _onEventCreated(e: CustomEvent<{ entityId: string; event: CalendarEvent }>) {
    const { event } = e.detail;
    this._pendingEvents = [...this._pendingEvents, event];
    this._recompute();
    this._closeCreatePopover();
  }

  private _navWeek(delta: number) {
    this._weekOffset += delta;
    this._fetchEvents();
  }

  private _weekLabel(): string {
    const start = this._weekStart;
    const end = this._weekEnd;
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (this._weekOffset === 0) return 'This week';
    if (this._weekOffset === -1) return 'Last week';
    if (this._weekOffset === 1) return 'Next week';
    return `${fmt(start)} – ${fmt(end)}`;
  }

  render() {
    if (!this._config) return html``;
    const bandStart = this._config.visible_hours?.start ?? '07:00';
    const bandEnd = this._config.visible_hours?.end ?? '21:00';

    return html`
      <ha-card>
        <div class="card-header">
          <h2 class="card-title">${this._config.title ?? 'Calendar'}</h2>
          <div class="week-nav">
            <button class="nav-btn" @click=${() => this._navWeek(-1)} aria-label="Previous week">←</button>
            <span class="week-label">${this._weekLabel()}</span>
            <button class="nav-btn" @click=${() => this._navWeek(1)} aria-label="Next week">→</button>
          </div>
        </div>

        <div class="pills-row">
          <lucarne-visibility-pills
            .calendars=${this._config.calendars}
            .visibleIds=${this._visibleIds}
            @visibility-change=${this._onVisibilityChange}
          ></lucarne-visibility-pills>
        </div>

        <div
          class="grid-area"
          @lucarne-event-tap=${this._onEventTap}
          @lucarne-create-event-tap=${this._onCreateEventTap}
        >
          <lucarne-calendar-grid
            .layout=${this._layout}
            .bandStart=${bandStart}
            .bandEnd=${bandEnd}
            .calendars=${this._config.calendars}
            .showCreateButton=${(this._config.show_create_button ?? true) && this._creatableCalendars.length > 0}
          ></lucarne-calendar-grid>
        </div>

        ${this._openEvent
          ? html`
              <lucarne-calendar-event-popover
                .event=${this._openEvent}
                .color=${this._openEventColor}
                .calendarLabel=${this._openEventCalLabel}
                @popover-close=${this._closePopover}
              ></lucarne-calendar-event-popover>
            `
          : ''}

        ${this._createDay !== null
          ? html`
              <lucarne-create-event-popover
                .hass=${this.hass}
                .day=${this._createDay}
                .startHour=${this._createStartHour}
                .calendars=${this._creatableCalendars}
                @popover-close=${this._closeCreatePopover}
                @lucarne-event-created=${this._onEventCreated}
              ></lucarne-create-event-popover>
            `
          : ''}
      </ha-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-calendar-card': LucarneCalendarCard;
  }
}
