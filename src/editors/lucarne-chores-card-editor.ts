import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, MemberSummary } from '../shared/types.js';
import type { LucarneChoresCardConfig } from '../cards/lucarne-chores-card.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { subscribeFamilyState, SYNTHETIC_HOUSEHOLD } from '../shared/family-subscription.js';
import type { FamilyState } from '../shared/family-subscription.js';
import { fireEvent } from 'custom-card-helpers';
import '../components/avatar-upload-modal.js';

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
      .member-row,
      .toggle-row {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
        padding: var(--lucarne-spacing-xs) 0;
      }
      .member-row label,
      .toggle-row label {
        font-size: var(--lucarne-fs-md);
        color: var(--lucarne-on-surface);
        cursor: pointer;
        flex: 1;
      }
      .member-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid rgba(0,0,0,0.1);
        flex-shrink: 0;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.05);
        overflow: hidden;
      }
      .change-avatar-btn {
        background: none;
        border: 1px solid rgba(0,0,0,0.15);
        border-radius: var(--lucarne-radius-sm);
        padding: 2px 8px;
        font-size: var(--lucarne-fs-xs, 0.75rem);
        cursor: pointer;
        color: var(--lucarne-on-surface-muted);
        flex-shrink: 0;
      }
      .change-avatar-btn:hover {
        background: rgba(0,0,0,0.05);
      }
      input[type='checkbox'] {
        width: 18px;
        height: 18px;
        cursor: pointer;
        flex-shrink: 0;
      }
      input[type='text'] {
        width: 100%;
        padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-md);
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: var(--lucarne-radius-sm);
        font-size: var(--lucarne-fs-md);
        box-sizing: border-box;
      }
      .loading {
        color: var(--lucarne-on-surface-muted);
        font-size: var(--lucarne-fs-sm);
        text-align: center;
        padding: var(--lucarne-spacing-lg);
      }
      .error-block {
        padding: var(--lucarne-spacing-md);
        color: var(--lucarne-on-surface);
        font-size: var(--lucarne-fs-sm);
        display: flex;
        flex-direction: column;
        gap: var(--lucarne-spacing-xs);
      }
      .error-block a {
        color: var(--primary-color);
      }
    `,
  ];

  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config?: LucarneChoresCardConfig;
  @state() private _familyState: FamilyState | null = null;
  @state() private _avatarModalMember: MemberSummary | null = null;

  private _unsubFamily?: () => void;

  setConfig(config: LucarneChoresCardConfig) {
    this._config = config;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.hass && !this._unsubFamily) {
      this._unsubFamily = subscribeFamilyState(this.hass, (s) => {
        this._familyState = s;
      });
    }
  }

  updated(changedProps: PropertyValues) {
    super.updated(changedProps);
    if (changedProps.has('hass') && this.hass && !this._unsubFamily) {
      this._unsubFamily = subscribeFamilyState(this.hass, (s) => {
        this._familyState = s;
      });
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubFamily?.();
    this._unsubFamily = undefined;
  }

  private _fire(config: LucarneChoresCardConfig) {
    // Strip legacy 'kids' property and ensure members array exists (normalizes legacy configs)
    const out = { ...config } as Record<string, unknown>;
    delete out['kids'];
    if (!Array.isArray(out['members'])) out['members'] = [];
    fireEvent(this, 'config-changed', { config: out as unknown as LucarneChoresCardConfig });
  }

  private _titleChanged(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this._fire({ ...this._config!, title: v || undefined });
  }

  private _memberToggled(slug: string, checked: boolean) {
    const current = [...(this._config?.members ?? [])];
    if (checked) {
      if (!current.includes(slug)) current.push(slug);
    } else {
      const idx = current.indexOf(slug);
      if (idx >= 0) current.splice(idx, 1);
    }
    this._fire({ ...this._config!, members: current });
  }

  private _toggleChanged(
    field: 'show_routines' | 'show_tasks' | 'show_streak',
    e: Event,
  ) {
    const v = (e.target as HTMLInputElement).checked;
    this._fire({ ...this._config!, [field]: v });
  }

  render() {
    if (!this._config) return html``;

    if (this._familyState !== null && this._familyState.integrationError !== null) {
      return html`
        <div class="error-block">
          Install the Lucarne Family integration first.
          <a href="/config/integrations/dashboard#search=lucarne" target="_blank"
            >Open Integrations</a
          >
        </div>
      `;
    }

    if (this._familyState === null) {
      return html`<div class="loading">Loading members…</div>`;
    }

    const allMembers = [...this._familyState.members, SYNTHETIC_HOUSEHOLD];
    const selectedSlugs = this._config.members ?? [];

    return html`
      <div class="section-label">General</div>
      <input
        id="ed-title"
        type="text"
        placeholder="Card title (default: Chores)"
        .value=${this._config.title ?? ''}
        @change=${this._titleChanged}
      />

      <div class="section-label">Members</div>
      ${allMembers.map(
        (m) => html`
          <div class="member-row">
            <input
              type="checkbox"
              id="member-${m.slug}"
              .checked=${selectedSlugs.includes(m.slug)}
              @change=${(e: Event) =>
                this._memberToggled(m.slug, (e.target as HTMLInputElement).checked)}
            />
            <div class="member-avatar">
              ${m.avatar && m.avatar.startsWith('/local/')
                ? html`<img src=${m.avatar} alt=${m.name} style="width:100%;height:100%;object-fit:cover;" />`
                : html`${m.avatar ?? m.name[0]}`}
            </div>
            <label for="member-${m.slug}">${m.name}</label>
            ${m.slug !== 'household'
              ? html`<button
                  class="change-avatar-btn"
                  @click=${() => { this._avatarModalMember = m; }}
                >Change</button>`
              : ''}
          </div>
        `,
      )}

      ${this._avatarModalMember
        ? html`<lucarne-avatar-upload-modal
            .hass=${this.hass}
            .memberSlug=${this._avatarModalMember.slug}
            .memberName=${this._avatarModalMember.name}
            @close=${() => { this._avatarModalMember = null; }}
            @avatar-changed=${() => { this._avatarModalMember = null; }}
          ></lucarne-avatar-upload-modal>`
        : ''}

      <div class="section-label">Display</div>
      ${(
        [
          ['show_routines', 'Show routines'],
          ['show_tasks', 'Show tasks'],
          ['show_streak', 'Show streak'],
        ] as const
      ).map(
        ([field, label]) => html`
          <div class="toggle-row">
            <input
              type="checkbox"
              id="ed-${field}"
              .checked=${this._config![field] ?? true}
              @change=${(e: Event) => this._toggleChanged(field, e)}
            />
            <label for="ed-${field}">${label}</label>
          </div>
        `,
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-chores-card-editor': LucarneChoresCardEditor;
  }
}
