import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { weatherConditionIcon, weatherConditionColor } from '../shared/icons.js';
import { STRINGS } from '../shared/strings.js';
import { dressingTip } from './dressing-tip.js';
import type { HassEntity, WeatherForecast } from '../shared/types.js';

@customElement('lucarne-weather-block')
export class LucarneWeatherBlock extends LitElement {
  static styles = [
    lucarneStyles,
    css`
      :host {
        display: block;
        padding: var(--lucarne-spacing-md) var(--lucarne-spacing-lg);
      }
      .empty-state {
        color: var(--lucarne-on-surface-muted);
        font-size: var(--lucarne-fs-sm);
        padding: var(--lucarne-spacing-lg) 0;
        text-align: center;
      }
      .current {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-md);
        margin-bottom: var(--lucarne-spacing-md);
      }
      .condition-icon {
        width: 48px;
        height: 48px;
        flex-shrink: 0;
      }
      .temp-group {
        flex: 1;
      }
      .current-temp {
        font-size: var(--lucarne-fs-xl);
        font-weight: 700;
        color: var(--lucarne-on-surface);
        line-height: 1;
      }
      .high-low {
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        margin-top: 4px;
      }
      .tomorrow-row {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        margin-bottom: var(--lucarne-spacing-md);
        padding-bottom: var(--lucarne-spacing-md);
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      }
      .tomorrow-icon {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
      }
      .dressing-tip {
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        font-style: italic;
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-xs);
      }
      .dressing-label {
        font-weight: 600;
        font-style: normal;
        color: var(--lucarne-on-surface-muted);
      }
    `,
  ];

  @property({ attribute: false }) weatherEntity?: HassEntity;
  @property({ type: Array }) forecast: WeatherForecast[] = [];

  render() {
    if (!this.weatherEntity) {
      return html`<div class="empty-state">${STRINGS.addWeatherEntity}</div>`;
    }

    const attr = this.weatherEntity.attributes as Record<string, unknown>;
    const currentTemp = attr.temperature as number | undefined;
    const unit = (attr.temperature_unit as string) ?? '°C';
    const condition = this.weatherEntity.state;

    const today = this.forecast[0];
    const tomorrow = this.forecast[1];
    const tip = dressingTip(this.forecast);

    return html`
      <div class="current">
        <span class="condition-icon" style="color: ${weatherConditionColor(condition)}">${weatherConditionIcon(condition)}</span>
        <div class="temp-group">
          <div class="current-temp">${currentTemp !== undefined ? `${Math.round(currentTemp)}${unit}` : STRINGS.errorUnavailable}</div>
          ${today
            ? html`<div class="high-low">
                ↑${Math.round(today.temperature)}${unit}
                ${today.templow !== undefined ? ` ↓${Math.round(today.templow)}${unit}` : ''}
              </div>`
            : ''}
        </div>
      </div>
      ${tomorrow
        ? html`
            <div class="tomorrow-row">
              <span class="tomorrow-icon" style="color: ${weatherConditionColor(tomorrow.condition)}">${weatherConditionIcon(tomorrow.condition)}</span>
              <span>Tomorrow ↑${Math.round(tomorrow.temperature)}${unit}${tomorrow.templow !== undefined ? ` ↓${Math.round(tomorrow.templow)}${unit}` : ''}</span>
            </div>
          `
        : ''}
      <div class="dressing-tip">
        <span class="dressing-label">Wear:</span>
        ${tip}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-weather-block': LucarneWeatherBlock;
  }
}
