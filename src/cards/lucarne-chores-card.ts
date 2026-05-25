import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { isAllDone } from '../shared/chore-helpers.js';
import type { HomeAssistant } from '../shared/types.js';

import '../components/kid-column.js';

interface KidConfig {
  name: string;
  color: string;
  avatar?: string;
  streak: string;
  chores: { name: string; entity: string }[];
}

export interface LucarneChoresCardConfig {
  type: 'custom:lucarne-chores-card';
  title?: string;
  kids: KidConfig[];
}

(window as Window & typeof globalThis & { customCards?: object[] }).customCards =
  (window as Window & typeof globalThis & { customCards?: object[] }).customCards || [];
(window as Window & typeof globalThis & { customCards?: object[] }).customCards!.push({
  type: 'lucarne-chores-card',
  name: 'Lucarne Chores',
  description: 'Kid chore grid with streaks and celebration',
  preview: true,
});

@customElement('lucarne-chores-card')
export class LucarneChoresCard extends LitElement {
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
        padding: var(--lucarne-spacing-lg) var(--lucarne-spacing-xl) var(--lucarne-spacing-md);
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      }
      .card-title {
        font-size: var(--lucarne-fs-lg);
        font-weight: 700;
        color: var(--lucarne-on-surface);
        margin: 0;
      }
      .kids-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }
      .kid-cell {
        border-right: 1px solid rgba(0, 0, 0, 0.07);
        position: relative;
      }
      .kid-cell:last-child {
        border-right: none;
      }
      @media (max-width: 600px) {
        .kids-grid {
          grid-template-columns: 1fr;
        }
        .kid-cell {
          border-right: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        }
        .kid-cell:last-child {
          border-bottom: none;
        }
      }
    `,
  ];

  @property({ attribute: false }) hass!: HomeAssistant;

  @state() private _config?: LucarneChoresCardConfig;

  private _lastAllDoneByKid: Map<string, boolean> = new Map();
  private _celebratingKids: Set<string> = new Set();
  private _celebrationTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  setConfig(config: LucarneChoresCardConfig) {
    if (!config.kids || config.kids.length === 0) {
      throw new Error('lucarne-chores-card: kids must be a non-empty array');
    }
    for (const kid of config.kids) {
      if (!kid.chores || kid.chores.length === 0) {
        throw new Error(`lucarne-chores-card: kid "${kid.name}" must have at least 1 chore`);
      }
    }
    const slugs = config.kids.map((k) => k.name.toLowerCase().replace(/\s+/g, '_'));
    const uniqueSlugs = new Set(slugs);
    if (uniqueSlugs.size !== slugs.length) {
      throw new Error('lucarne-chores-card: kid names must be unique (two names produce the same slug)');
    }
    this._config = config;
  }

  static getConfigElement() {
    return document.createElement('lucarne-chores-card-editor');
  }

  getCardSize() {
    return 5;
  }

  getGridOptions() {
    return { columns: 12, rows: 'auto', min_columns: 6, max_columns: 12 };
  }

  static getStubConfig() {
    return {
      type: 'custom:lucarne-chores-card',
      title: 'Chores',
      kids: [
        {
          name: 'Kid 1',
          color: '#f5c89c',
          streak: 'counter.kid_1_streak',
          chores: [
            { name: 'Brush teeth', entity: 'input_boolean.kid_1_brush_teeth' },
            { name: 'Make bed', entity: 'input_boolean.kid_1_make_bed' },
            { name: 'Put away toys', entity: 'input_boolean.kid_1_put_away_toys' },
            { name: 'School bag ready', entity: 'input_boolean.kid_1_school_bag_ready' },
            { name: 'Kindness act', entity: 'input_boolean.kid_1_kindness_act' },
          ],
        },
        {
          name: 'Kid 2',
          color: '#b8e0d2',
          streak: 'counter.kid_2_streak',
          chores: [
            { name: 'Brush teeth', entity: 'input_boolean.kid_2_brush_teeth' },
            { name: 'Make bed', entity: 'input_boolean.kid_2_make_bed' },
            { name: 'Put away toys', entity: 'input_boolean.kid_2_put_away_toys' },
            { name: 'School bag ready', entity: 'input_boolean.kid_2_school_bag_ready' },
            { name: 'Kindness act', entity: 'input_boolean.kid_2_kindness_act' },
          ],
        },
        {
          name: 'Kid 3',
          color: '#f0b8c8',
          streak: 'counter.kid_3_streak',
          chores: [
            { name: 'Brush teeth', entity: 'input_boolean.kid_3_brush_teeth' },
            { name: 'Make bed', entity: 'input_boolean.kid_3_make_bed' },
            { name: 'Put away toys', entity: 'input_boolean.kid_3_put_away_toys' },
            { name: 'School bag ready', entity: 'input_boolean.kid_3_school_bag_ready' },
            { name: 'Kindness act', entity: 'input_boolean.kid_3_kindness_act' },
          ],
        },
      ],
    };
  }

  updated(changedProps: PropertyValues) {
    super.updated(changedProps);
    if (!changedProps.has('hass') || !this._config || !this.hass) return;

    for (const kid of this._config.kids) {
      const kidSlug = kid.name.toLowerCase().replace(/\s+/g, '_');
      const choreStates = kid.chores.map((c) => ({
        state: this.hass.states[c.entity]?.state ?? 'unavailable',
      }));
      const current = isAllDone(choreStates);
      const previous = this._lastAllDoneByKid.get(kidSlug) ?? null;

      if (previous === null) {
        this._lastAllDoneByKid.set(kidSlug, current);
        continue;
      }

      if (previous === false && current === true) {
        this._lastAllDoneByKid.set(kidSlug, true);
        this._triggerCelebration(kidSlug, kid);
      } else if (previous === true && current === false) {
        this._lastAllDoneByKid.set(kidSlug, false);
      }
    }
  }

  private _triggerCelebration(kidSlug: string, kid: KidConfig) {
    this._celebratingKids = new Set(this._celebratingKids).add(kidSlug);
    this.requestUpdate();

    const existing = this._celebrationTimers.get(kidSlug);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      this._celebratingKids = new Set(
        [...this._celebratingKids].filter((k) => k !== kidSlug),
      );
      this._celebrationTimers.delete(kidSlug);
      this.requestUpdate();
    }, 2200);
    this._celebrationTimers.set(kidSlug, timer);

    const streakState = this.hass?.states[kid.streak];
    const streak = streakState ? parseInt(streakState.state, 10) : 0;
    const _d = new Date();
    const today = `${_d.getFullYear()}-${String(_d.getMonth() + 1).padStart(2, '0')}-${String(_d.getDate()).padStart(2, '0')}`;

    this.hass.connection.sendMessagePromise({
      type: 'fire_event',
      event_type: 'ha_lucarne_chores_all_done',
      event_data: {
        kid_slug: kidSlug,
        kid_name: kid.name,
        date: today,
        chores_completed: kid.chores.length,
        streak: isNaN(streak) ? 0 : streak,
      },
    });
  }

  render() {
    if (!this._config) return html``;
    const title = this._config.title ?? 'Chores';
    const kids = this._config.kids ?? [];

    return html`
      <ha-card>
        <div class="card-header">
          <h2 class="card-title">${title}</h2>
        </div>
        <div class="kids-grid">
          ${kids.map((kid) => {
            const kidSlug = kid.name.toLowerCase().replace(/\s+/g, '_');
            const streakState = this.hass?.states[kid.streak];
            const streak = streakState ? parseInt(streakState.state, 10) : 0;
            const choreStates = kid.chores.map((c) => ({
              state: this.hass?.states[c.entity]?.state ?? 'unavailable',
            }));
            const allDone = isAllDone(choreStates);
            return html`
              <div class="kid-cell">
                <lucarne-kid-column
                  .hass=${this.hass}
                  .kid=${kid}
                  .streak=${isNaN(streak) ? 0 : streak}
                  ?celebrating=${this._celebratingKids.has(kidSlug)}
                  ?all-done=${allDone}
                ></lucarne-kid-column>
              </div>
            `;
          })}
        </div>
      </ha-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-chores-card': LucarneChoresCard;
  }
}
