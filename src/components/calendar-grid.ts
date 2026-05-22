import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import type { CalendarConfig, CalendarEvent } from '../shared/types.js';
import type { CalendarLayoutResult } from '../shared/calendar-layout.js';
import { hoursInBand } from '../shared/date-helpers.js';
import './calendar-event-block.js';
import './out-of-band-stub.js';

function isoDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

@customElement('lucarne-calendar-grid')
export class LucarneCalendarGrid extends LitElement {
  static styles = [
    lucarneStyles,
    css`
      :host {
        display: block;
        position: relative;
      }
      .grid-wrapper {
        display: grid;
        grid-template-columns: 40px repeat(7, minmax(0, 1fr));
        grid-template-rows: auto auto 1fr;
        min-width: 480px;
      }
      /* Header row: day names */
      .header-spacer {
        grid-column: 1;
        grid-row: 1;
        position: sticky;
        top: 0;
        left: 0;
        z-index: 4;
        background: var(--lucarne-surface);
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        border-right: 1px solid rgba(0, 0, 0, 0.07);
      }
      .day-header {
        grid-row: 1;
        text-align: center;
        padding: var(--lucarne-spacing-sm) 2px;
        font-size: var(--lucarne-fs-sm);
        font-weight: 700;
        color: var(--lucarne-on-surface-muted);
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        user-select: none;
        position: sticky;
        top: 0;
        z-index: 3;
        background: var(--lucarne-surface);
      }
      .day-header .day-num {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        font-size: var(--lucarne-fs-md);
        font-weight: 700;
        margin-top: 2px;
      }
      .day-header.today .day-num {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }
      /* All-day row */
      .allday-spacer {
        grid-column: 1;
        grid-row: 2;
        border-right: 1px solid rgba(0, 0, 0, 0.07);
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        font-size: 0.65rem;
        color: var(--lucarne-on-surface-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px;
        min-height: 24px;
        position: sticky;
        left: 0;
        z-index: 2;
        background: var(--lucarne-surface);
      }
      .allday-cell {
        grid-row: 2;
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        border-right: 1px solid rgba(0, 0, 0, 0.05);
        padding: 2px 1px;
        min-height: 24px;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }
      .allday-event {
        font-size: 0.7rem;
        font-weight: 600;
        padding: 1px 4px;
        border-radius: 3px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: rgba(0, 0, 0, 0.8);
      }
      /* Time grid */
      .time-col {
        grid-column: 1;
        grid-row: 3;
        border-right: 1px solid rgba(0, 0, 0, 0.07);
        position: sticky;
        left: 0;
        z-index: 2;
        background: var(--lucarne-surface);
      }
      .hour-label {
        position: absolute;
        right: 6px;
        font-size: 0.68rem;
        color: var(--lucarne-on-surface-muted);
        transform: translateY(-50%);
        white-space: nowrap;
        user-select: none;
      }
      .day-col {
        grid-row: 3;
        position: relative;
        isolation: isolate;
        border-right: 1px solid rgba(0, 0, 0, 0.05);
        overflow: visible;
        touch-action: manipulation;
      }
      .hour-line {
        position: absolute;
        left: 0;
        right: 0;
        height: 1px;
        background: rgba(0, 0, 0, 0.06);
        pointer-events: none;
      }
      .now-line {
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        background: #e53935;
        z-index: 5;
        pointer-events: none;
      }
      .now-line::before {
        content: '';
        position: absolute;
        left: -4px;
        top: -4px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #e53935;
      }
      .day-col-wrapper {
        display: flex;
        flex-direction: column;
      }
      .stub-area-top {
        padding: 2px 2px 0;
        flex-shrink: 0;
      }
      .stub-area-bottom {
        padding: 0 2px 2px;
        flex-shrink: 0;
      }
    `,
  ];

  @property({ type: Object }) layout: CalendarLayoutResult | null = null;
  @property({ type: String }) bandStart = '07:00';
  @property({ type: String }) bandEnd = '21:00';
  @property({ type: Array }) calendars: CalendarConfig[] = [];
  @property({ type: Number }) hourHeightPx = 60;
  @property({ type: Boolean }) showCreateButton = false;

  private get _colorMap(): Map<string, string> {
    const m = new Map<string, string>();
    for (const cal of this.calendars) m.set(cal.entity, cal.color);
    return m;
  }

  private _eventColor(event: CalendarEvent): string {
    const colorMap = this._colorMap;
    if (event.uid?.includes('::')) {
      const entityId = event.uid.split('::')[0];
      return colorMap.get(entityId) ?? '#a8d8b9';
    }
    return '#a8d8b9';
  }

  private _onBandClick(e: MouseEvent, day: Date) {
    if (!this.showCreateButton) return;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const [bandStartH] = this.bandStart.split(':').map(Number);
    const [bandEndH] = this.bandEnd.split(':').map(Number);
    const bandH = bandEndH - bandStartH;
    const yRatio = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const rawHour = bandStartH + yRatio * bandH;
    // Round to nearest 0.5h; clamp so default 1h event fits within band
    const startHour = Math.min(bandEndH - 1, Math.round(rawHour * 2) / 2);
    this.dispatchEvent(
      new CustomEvent('lucarne-create-event-tap', {
        detail: { day, startHour },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _buildEventColorMap(events: CalendarEvent[]): Map<string, string> {
    const m = new Map<string, string>();
    for (const e of events) {
      m.set(e.uid ?? '', this._eventColor(e));
    }
    return m;
  }

  private _renderDayColumn(day: Date, now: Date) {
    if (!this.layout) return html``;
    const dayKey = isoDateKey(day);
    const dayLayout = this.layout.perDay.get(dayKey);
    if (!dayLayout) return html``;

    const hours = hoursInBand(this.bandStart, this.bandEnd);
    const bandH = hours.length - 1; // number of hour intervals
    const totalHeight = bandH * this.hourHeightPx;

    const isToday = isSameDay(day, now);
    const [bandStartH] = this.bandStart.split(':').map(Number);
    const [bandEndH] = this.bandEnd.split(':').map(Number);
    const bandDurationMs = (bandEndH - bandStartH) * 3600000;

    let nowLinePercent: number | null = null;
    if (isToday) {
      const dayStart = new Date(day);
      dayStart.setHours(bandStartH, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(bandEndH, 0, 0, 0);
      if (now >= dayStart && now <= dayEnd) {
        nowLinePercent = ((now.getTime() - dayStart.getTime()) / bandDurationMs) * 100;
      }
    }

    const eventColorMap = this._buildEventColorMap([...dayLayout.inBand.map((b) => b.event), ...dayLayout.earlier, ...dayLayout.later]);

    return html`
      <div class="day-col-wrapper">
        ${dayLayout.earlier.length > 0
          ? html`
              <div class="stub-area-top">
                <lucarne-out-of-band-stub
                  .events=${dayLayout.earlier}
                  label="earlier"
                  .eventColors=${eventColorMap}
                ></lucarne-out-of-band-stub>
              </div>
            `
          : ''}

        <div
          class="day-col"
          style="height:${totalHeight}px${this.showCreateButton ? '; cursor: crosshair' : ''}"
          @click=${(e: MouseEvent) => this._onBandClick(e, day)}
        >
          ${hours.slice(0, -1).map(
            (_, i) => html`
              <div
                class="hour-line"
                style="top: ${((i + 1) / (hours.length - 1)) * 100}%"
              ></div>
            `,
          )}

          ${nowLinePercent !== null
            ? html`<div class="now-line" style="top:${nowLinePercent}%"></div>`
            : ''}

          ${dayLayout.inBand.map((block) => {
            const width = 100 / block.laneCount;
            const left = (block.lane / block.laneCount) * 100;
            const color = this._eventColor(block.event);
            return html`
              <lucarne-calendar-event-block
                style="
                  position: absolute;
                  top: ${block.topPercent}%;
                  left: calc(${left}% + 1px);
                  width: calc(${width}% - 2px);
                  height: ${block.heightPercent}%;
                  z-index: ${block.lane + 1};
                  background: ${color}cc;
                  border-left-color: ${color};
                "
                .event=${block.event}
                .color=${color}
                .lane=${block.lane}
                .laneCount=${block.laneCount}
                .topPercent=${block.topPercent}
                .heightPercent=${block.heightPercent}
              ></lucarne-calendar-event-block>
            `;
          })}
        </div>

        ${dayLayout.later.length > 0
          ? html`
              <div class="stub-area-bottom">
                <lucarne-out-of-band-stub
                  .events=${dayLayout.later}
                  label="tonight"
                  .eventColors=${eventColorMap}
                ></lucarne-out-of-band-stub>
              </div>
            `
          : ''}
      </div>
    `;
  }

  render() {
    if (!this.layout) return html`<div>Loading…</div>`;

    const now = new Date();
    const hours = hoursInBand(this.bandStart, this.bandEnd);
    const bandH = hours.length - 1;
    const totalHeight = bandH * this.hourHeightPx;

    const weekdayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

    return html`
      <div class="grid-wrapper">
        <!-- Header row -->
        <div class="header-spacer"></div>
        ${this.layout.weekDays.map(
          (day, idx) => html`
            <div
              class="day-header ${isSameDay(day, now) ? 'today' : ''}"
              style="grid-column: ${idx + 2}"
            >
              <div>${weekdayFmt.format(day)}</div>
              <div class="day-num">${day.getDate()}</div>
            </div>
          `,
        )}

        <!-- All-day row -->
        <div class="allday-spacer">all-day</div>
        ${this.layout.weekDays.map((day, idx) => {
          const dayKey = isoDateKey(day);
          const dayLayout = this.layout!.perDay.get(dayKey);
          return html`
            <div class="allday-cell" style="grid-column: ${idx + 2}">
              ${(dayLayout?.allDay ?? []).map(
                (event) => html`
                  <div
                    class="allday-event"
                    style="background: ${this._eventColor(event)}cc"
                    @click=${(e: MouseEvent) => {
                      e.stopPropagation();
                      this.dispatchEvent(
                        new CustomEvent('lucarne-event-tap', {
                          detail: { event, color: this._eventColor(event) },
                          bubbles: true,
                          composed: true,
                        }),
                      );
                    }}
                  >
                    ${event.summary}
                  </div>
                `,
              )}
            </div>
          `;
        })}

        <!-- Time column -->
        <div class="time-col" style="height:${totalHeight}px; grid-row:3; grid-column:1">
          ${hours.map(
            (h, i) => html`
              <div
                class="hour-label"
                style="top: ${(i / (hours.length - 1)) * 100}%"
              >
                ${h === 0 || h === 24 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
              </div>
            `,
          )}
        </div>

        <!-- Day columns -->
        ${this.layout.weekDays.map((day, idx) => html`
          <div style="grid-row:3; grid-column:${idx + 2}; position:relative; overflow:visible; display:flex; flex-direction:column;">
            ${this._renderDayColumn(day, now)}
          </div>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-calendar-grid': LucarneCalendarGrid;
  }
}
