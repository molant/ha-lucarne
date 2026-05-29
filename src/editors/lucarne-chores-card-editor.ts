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
      /* Single bordered list of all members, matching the Today card editor's
         section-order control. */
      .members-list {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: var(--lucarne-radius-md);
        overflow: hidden;
      }
      .member-row {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
        padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-md);
        background: var(--ha-card-background, var(--card-background-color, #fff));
      }
      .member-row + .member-row {
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
      }
      .member-row.dragging {
        opacity: 0.5;
      }
      .member-row.drag-over {
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      }
      /* Dim hidden members so the eye state reads at a glance. */
      .member-row.hidden-member .member-avatar,
      .member-row.hidden-member .member-name {
        opacity: 0.45;
      }
      .grab-handle {
        cursor: grab;
        color: var(--lucarne-on-surface-muted);
        font-size: 1.2em;
        line-height: 1;
        user-select: none;
        flex-shrink: 0;
        padding: 0 2px;
      }
      .grab-handle:active {
        cursor: grabbing;
      }
      .member-name {
        flex: 1;
        min-width: 0;
        font-size: var(--lucarne-fs-md);
        color: var(--lucarne-on-surface);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .move-btns {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex-shrink: 0;
      }
      .move-up-btn,
      .move-down-btn {
        background: none;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: var(--lucarne-radius-sm);
        cursor: pointer;
        padding: 0;
        width: 22px;
        height: 16px;
        line-height: 1;
        font-size: 0.7rem;
        color: var(--lucarne-on-surface);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .move-up-btn:hover:not(:disabled),
      .move-down-btn:hover:not(:disabled) {
        background: rgba(0, 0, 0, 0.05);
      }
      .move-up-btn:disabled,
      .move-down-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .row-actions {
        display: flex;
        align-items: center;
        gap: 2px;
        flex-shrink: 0;
      }
      .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: var(--lucarne-on-surface-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--lucarne-radius-sm);
      }
      .icon-btn:hover {
        background: rgba(0, 0, 0, 0.05);
        color: var(--lucarne-on-surface);
      }
      .icon-btn ha-icon {
        --mdc-icon-size: 20px;
        width: 20px;
        height: 20px;
      }
      .member-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }
      .toggle-row {
        display: flex;
        align-items: center;
        gap: var(--lucarne-spacing-sm);
        padding: var(--lucarne-spacing-xs) 0;
      }
      .toggle-row label {
        font-size: var(--lucarne-fs-md);
        color: var(--lucarne-on-surface);
        cursor: pointer;
        flex: 1;
      }
      input[type='checkbox'] {
        width: 18px;
        height: 18px;
        cursor: pointer;
        flex-shrink: 0;
        accent-color: var(--primary-color, #03a9f4);
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
  @state() private _dragIndex: number | null = null;
  @state() private _dragOverIndex: number | null = null;

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

  /**
   * Resolve the editor's unified members list from config + family state.
   *
   * `members` is the full display order (visible AND hidden); a member not yet
   * placed is appended (in family order) and treated as hidden-by-default. The
   * card renders `members` minus `hidden`, so a hidden member keeps its slot.
   */
  private _membersModel(): { ordered: MemberSummary[]; hidden: Set<string> } {
    const family = [...(this._familyState?.members ?? []), SYNTHETIC_HOUSEHOLD];
    const slugToMember = new Map(family.map((m) => [m.slug, m]));
    const placed = this._config?.members ?? [];
    const inPlaced = new Set(placed);
    const orderedSlugs = [
      ...placed.filter((s) => slugToMember.has(s)),
      ...family.filter((m) => !inPlaced.has(m.slug)).map((m) => m.slug),
    ];
    const explicitHidden = new Set(this._config?.hidden_members ?? []);
    const hidden = new Set<string>();
    for (const s of orderedSlugs) {
      if (explicitHidden.has(s) || !inPlaced.has(s)) hidden.add(s);
    }
    return { ordered: orderedSlugs.map((s) => slugToMember.get(s)!), hidden };
  }

  /** Persist the full order + hidden set (omitting hidden_members when empty). */
  private _commitMembers(orderedSlugs: string[], hidden: Set<string>) {
    const out = { ...this._config! } as Record<string, unknown>;
    out['members'] = orderedSlugs;
    if (hidden.size) out['hidden_members'] = [...hidden];
    else delete out['hidden_members'];
    this._fire(out as unknown as LucarneChoresCardConfig);
  }

  private _titleChanged(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this._fire({ ...this._config!, title: v || undefined });
  }

  private _toggleVisibility(slug: string) {
    const { ordered, hidden } = this._membersModel();
    const next = new Set(hidden);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    this._commitMembers(ordered.map((m) => m.slug), next);
  }

  private _moveMember(slug: string, direction: -1 | 1) {
    const { ordered, hidden } = this._membersModel();
    const slugs = ordered.map((m) => m.slug);
    const idx = slugs.indexOf(slug);
    if (idx < 0) return;
    const target = idx + direction;
    if (target < 0 || target >= slugs.length) return;
    [slugs[idx], slugs[target]] = [slugs[target], slugs[idx]];
    this._commitMembers(slugs, hidden);
  }

  // Drag-to-reorder the unified members list, mirroring the Today card editor.
  // Reordering never changes a member's hidden state, so a hidden member can be
  // dragged into any slot and still stay off the card.
  private _onDragStart(index: number, e: DragEvent) {
    this._dragIndex = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      // Some browsers require data to be set for a drag to begin.
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
    const { ordered, hidden } = this._membersModel();
    const slugs = ordered.map((m) => m.slug);
    if (from < 0 || from >= slugs.length || index < 0 || index >= slugs.length) return;
    const [moved] = slugs.splice(from, 1);
    slugs.splice(index, 0, moved);
    this._commitMembers(slugs, hidden);
  }

  private _onDragEnd() {
    this._dragIndex = null;
    this._dragOverIndex = null;
  }

  private _toggleChanged(
    field: 'show_routines' | 'show_tasks' | 'show_streak' | 'hide_names',
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

    const { ordered, hidden } = this._membersModel();

    const renderRow = (m: MemberSummary, index: number) => {
      const isHidden = hidden.has(m.slug);
      const dragging = this._dragIndex === index ? 'dragging' : '';
      const dragOver = this._dragOverIndex === index ? 'drag-over' : '';
      return html`
        <div
          class="member-row ${isHidden ? 'hidden-member' : ''} ${dragging} ${dragOver}"
          data-slug=${m.slug}
          draggable="true"
          @dragstart=${(e: DragEvent) => this._onDragStart(index, e)}
          @dragover=${(e: DragEvent) => this._onDragOver(index, e)}
          @drop=${(e: DragEvent) => this._onDrop(index, e)}
          @dragend=${this._onDragEnd}
        >
          <span class="grab-handle" aria-hidden="true" title="Drag to reorder">≡</span>
          <div class="move-btns">
            <button
              class="move-up-btn"
              type="button"
              title="Move up"
              aria-label="Move ${m.name} up"
              ?disabled=${index === 0}
              @click=${() => this._moveMember(m.slug, -1)}
            >▲</button>
            <button
              class="move-down-btn"
              type="button"
              title="Move down"
              aria-label="Move ${m.name} down"
              ?disabled=${index === ordered.length - 1}
              @click=${() => this._moveMember(m.slug, 1)}
            >▼</button>
          </div>
          <div class="member-avatar">
            ${m.avatar && m.avatar.startsWith('/local/')
              ? html`<img src=${m.avatar} alt=${m.name} style="width:100%;height:100%;object-fit:cover;" />`
              : html`${m.avatar ?? m.name[0]}`}
          </div>
          <span class="member-name">${m.name}</span>
          <div class="row-actions">
            <button
              class="icon-btn visibility-btn"
              type="button"
              aria-label="${isHidden ? 'Show' : 'Hide'} ${m.name} on the card"
              title="${isHidden ? 'Show on card' : 'Hide from card'}"
              @click=${() => this._toggleVisibility(m.slug)}
            >
              <ha-icon icon=${isHidden ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}></ha-icon>
            </button>
            ${m.slug !== 'household'
              ? html`<button
                  class="icon-btn change-avatar-btn"
                  type="button"
                  title="Edit avatar"
                  aria-label="Edit avatar for ${m.name}"
                  @click=${() => { this._avatarModalMember = m; }}
                >
                  <ha-icon icon="mdi:pencil-outline"></ha-icon>
                </button>`
              : ''}
          </div>
        </div>
      `;
    };

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
      <div class="members-list" role="list" aria-label="Members (drag to reorder, eye to show/hide)">
        ${ordered.map((m, idx) => renderRow(m, idx))}
      </div>

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
          ['hide_names', 'Hide names'],
        ] as const
      ).map(
        ([field, label]) => html`
          <div class="toggle-row">
            <input
              type="checkbox"
              id="ed-${field}"
              .checked=${this._config![field] ?? (field === 'hide_names' ? false : true)}
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
