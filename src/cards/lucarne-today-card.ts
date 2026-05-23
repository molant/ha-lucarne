import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { fetchCalendarEvents, subscribeTodoItems } from '../shared/ha-subscriptions.js';
import { installPreviewColumnOverride, type PreviewOverrideHandle } from '../shared/grid-preview-override.js';
import { STRINGS } from '../shared/strings.js';
import type { HomeAssistant, CalendarConfig, CalendarEvent, TodoItem } from '../shared/types.js';

import '../components/agenda-strip.js';
import '../components/weather-block.js';
import '../components/tasks-summary.js';
import '../components/presence-pills.js';

export interface LucarneTodayCardConfig {
  type: 'custom:lucarne-today-card';
  title?: string;
  calendars: CalendarConfig[];
  weather?: string;
  tasks?: string;
  presence?: { entity: string; name: string }[];
  agenda_limit?: number;
}

(window as Window & typeof globalThis & { customCards?: object[] }).customCards =
  (window as Window & typeof globalThis & { customCards?: object[] }).customCards || [];
(window as Window & typeof globalThis & { customCards?: object[] }).customCards!.push({
  type: 'lucarne-today-card',
  name: 'Lucarne Today',
  description: 'Family agenda + weather + tasks + presence',
  preview: true,
});

@customElement('lucarne-today-card')
export class LucarneTodayCard extends LitElement {
  static styles = [
    lucarneStyles,
    css`
      :host {
        display: block;
        width: 100%;
        font-family: var(--primary-font-family, sans-serif);
        container-type: inline-size;
      }
      ha-card {
        width: 100%;
        padding: 0;
        overflow: hidden;
      }
      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--lucarne-spacing-lg) var(--lucarne-spacing-xl) var(--lucarne-spacing-md);
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      }
      .card-title {
        font-size: var(--lucarne-fs-lg);
        font-weight: 700;
        color: var(--lucarne-on-surface);
        margin: 0;
      }
      .card-body {
        display: grid;
        grid-template-columns: 2fr 1fr;
        min-height: 260px;
      }
      .left-col {
        border-right: 1px solid rgba(0, 0, 0, 0.07);
        overflow: auto;
      }
      .right-col {
        display: flex;
        flex-direction: column;
      }
      .weather-section {
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        flex: 0 0 auto;
      }
      .tasks-section {
        flex: 1;
        overflow: auto;
      }
      @container (max-width: 500px) {
        .card-body {
          grid-template-columns: 1fr;
        }
        .left-col {
          border-right: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        }
        .right-col {
          flex-direction: column;
        }
      }
    `,
  ];

  @property({ attribute: false }) hass!: HomeAssistant;

  @state() private _config?: LucarneTodayCardConfig;
  @state() private _calendarEvents: Map<string, CalendarEvent[]> = new Map();
  @state() private _forecast: { temperature: number; templow?: number; condition: string; datetime: string; precipitation_probability?: number }[] = [];
  @state() private _todoItems: TodoItem[] = [];

  private _calendarIntervalId?: ReturnType<typeof setInterval>;
  private _todoUnsub?: () => void;
  private _fetchingForecast = false;
  private _lastWeatherState = '';
  private _previewOverride?: PreviewOverrideHandle | null;

  setConfig(config: LucarneTodayCardConfig) {
    if (!config.calendars || !Array.isArray(config.calendars) || config.calendars.length === 0) {
      throw new Error('lucarne-today-card: "calendars" must be a non-empty array');
    }
    for (const cal of config.calendars) {
      if (!cal.entity || !cal.color) {
        throw new Error('lucarne-today-card: each calendar entry requires "entity" and "color"');
      }
    }
    this._config = config;
    // If already connected (Lovelace reuses the element across editor saves), refresh subscriptions.
    if (this.isConnected) {
      this._teardownSubscriptions();
      this._setupSubscriptions();
    }
  }

  static getConfigElement() {
    return document.createElement('lucarne-today-card-editor');
  }

  static getStubConfig(hass: HomeAssistant): LucarneTodayCardConfig {
    const calendarIds = Object.keys(hass.states)
      .filter((id) => id.startsWith('calendar.'))
      .slice(0, 3);

    const palettes = ['#a8d8b9', '#a8c5e8', '#c8b4e0'];
    const calendars: CalendarConfig[] = calendarIds.map((id, i) => ({
      entity: id,
      color: palettes[i] ?? '#a8d8b9',
    }));

    const hasWeather = 'weather.forecast_home' in hass.states;

    return {
      type: 'custom:lucarne-today-card',
      title: STRINGS.today,
      calendars: calendars.length ? calendars : [{ entity: 'calendar.example', color: '#a8d8b9' }],
      weather: hasWeather ? 'weather.forecast_home' : undefined,
    };
  }

  getCardSize() {
    return 4;
  }

  getGridOptions() {
    return { columns: 6, rows: 'auto', min_columns: 3, max_columns: 6 };
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupSubscriptions();
    requestAnimationFrame(() => {
      this._previewOverride = installPreviewColumnOverride(this);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._teardownSubscriptions();
    this._previewOverride?.uninstall();
    this._previewOverride = undefined;
  }

  private _setupSubscriptions() {
    if (!this._config || !this.hass) return;
    this._fetchCalendarEvents();
    if (this._config.weather) this._fetchForecast();
    // Refresh both calendars and forecast on the same periodic timer — forecast attributes
    // can update (high/low/precip) without the entity state string changing.
    this._calendarIntervalId = setInterval(() => {
      this._fetchCalendarEvents();
      if (this._config?.weather) this._fetchForecast();
    }, 5 * 60 * 1000);
    if (this._config.tasks) {
      this._todoUnsub = subscribeTodoItems(this.hass, this._config.tasks, (items) => {
        this._todoItems = items;
      });
    }
  }

  private _teardownSubscriptions() {
    clearInterval(this._calendarIntervalId);
    this._todoUnsub?.();
    this._todoUnsub = undefined;
    this._calendarIntervalId = undefined;
  }

  updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);
    if (!changedProps.has('hass') || !this._config) return;

    // Bootstrap subscriptions the first time hass becomes available (Lovelace may
    // connect the element before setting hass, so connectedCallback can run too early).
    const prevHass = changedProps.get('hass');
    if (!prevHass && this.hass && !this._calendarIntervalId) {
      this._setupSubscriptions();
      return;
    }

    const weatherEntityId = this._config.weather;
    if (weatherEntityId) {
      const weatherState = this.hass.states[weatherEntityId]?.state;
      if (weatherState && weatherState !== this._lastWeatherState) {
        this._lastWeatherState = weatherState;
        this._fetchForecast();
      }
    }
  }

  private async _fetchCalendarEvents() {
    if (!this._config || !this.hass) return;
    const entityIds = this._config.calendars.map((c) => c.entity);
    const start = new Date();
    const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const { events: map } = await fetchCalendarEvents(this.hass, entityIds, start, end);

    // Tag events with entity_id prefix in uid for color lookup
    const tagged = new Map<string, CalendarEvent[]>();
    for (const [entityId, events] of map.entries()) {
      tagged.set(
        entityId,
        events.map((e) => ({ ...e, uid: `${entityId}::${e.uid ?? e.summary}` })),
      );
    }
    this._calendarEvents = tagged;
  }

  private async _fetchForecast() {
    if (this._fetchingForecast || !this._config?.weather || !this.hass) return;
    this._fetchingForecast = true;
    try {
      const result = await this.hass.connection.sendMessagePromise<{
        response: Record<string, { forecast: { temperature: number; templow?: number; condition: string; datetime: string; precipitation_probability?: number }[] }>;
      }>({
        type: 'call_service',
        domain: 'weather',
        service: 'get_forecasts',
        service_data: { type: 'daily' },
        target: { entity_id: this._config.weather },
        return_response: true,
      });
      this._forecast = result?.response?.[this._config.weather]?.forecast ?? [];
    } catch (err) {
      console.warn(`[lucarne] weather.get_forecasts failed for ${this._config.weather}:`, err);
      this._forecast = [];
    } finally {
      this._fetchingForecast = false;
    }
  }

  private get _mergedEvents(): CalendarEvent[] {
    const all: CalendarEvent[] = [];
    for (const events of this._calendarEvents.values()) {
      all.push(...events);
    }
    return all;
  }

  private get _calendarColorMap(): Map<string, string> {
    const m = new Map<string, string>();
    for (const cal of this._config?.calendars ?? []) {
      m.set(cal.entity, cal.color);
    }
    return m;
  }

  render() {
    if (!this._config) return html``;

    const weatherEntity = this._config.weather ? this.hass?.states[this._config.weather] : undefined;
    const presenceEntries = (this._config.presence ?? []).map((p) => ({
      name: p.name,
      isHome: this.hass?.states[p.entity]?.state === 'on',
    }));

    return html`
      <ha-card>
        <div class="card-header">
          <h2 class="card-title">${this._config.title ?? STRINGS.today}</h2>
          ${presenceEntries.length > 0
            ? html`<lucarne-presence-pills .entries=${presenceEntries}></lucarne-presence-pills>`
            : ''}
        </div>
        <div class="card-body">
          <div class="left-col">
            <lucarne-agenda-strip
              .events=${this._mergedEvents}
              .calendarColors=${this._calendarColorMap}
              .limit=${this._config.agenda_limit ?? 5}
            ></lucarne-agenda-strip>
          </div>
          <div class="right-col">
            <div class="weather-section">
              <lucarne-weather-block
                .weatherEntity=${weatherEntity}
                .forecast=${this._forecast}
              ></lucarne-weather-block>
            </div>
            ${this._config.tasks
              ? html`
                  <div class="tasks-section">
                    <lucarne-tasks-summary
                      .items=${this._todoItems}
                      .todoEntityId=${this._config.tasks}
                    ></lucarne-tasks-summary>
                  </div>
                `
              : ''}
          </div>
        </div>
      </ha-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-today-card': LucarneTodayCard;
  }
}
