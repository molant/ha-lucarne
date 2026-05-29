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
      .member-row.selected {
        cursor: grab;
      }
      .member-row.dragging {
        opacity: 0.5;
      }
      .member-row.drag-over {
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
        border-radius: var(--lucarne-radius-sm);
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
      .unselected-hint {
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        font-style: italic;
        margin: var(--lucarne-spacing-xs) 0;
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
        border: none;
        padding: 2px 6px;
        font-size: 1rem;
        line-height: 1;
        cursor: pointer;
        color: var(--lucarne-on-surface-muted);
        flex-shrink: 0;
        border-radius: var(--lucarne-radius-sm);
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

  private _moveMember(slug: string, direction: -1 | 1) {
    const current = [...(this._config?.members ?? [])];
    const idx = current.indexOf(slug);
    if (idx < 0) return;
    const target = idx + direction;
    if (target < 0 || target >= current.length) return;
    [current[idx], current[target]] = [current[target], current[idx]];
    this._fire({ ...this._config!, members: current });
  }

  // Drag-to-reorder for the selected members list, mirroring the Today card
  // editor's section-order control. The rendered selected rows map 1:1 (in
  // order) to _config.members, so indices reorder the slug array directly.
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
    const current = [...(this._config?.members ?? [])];
    if (from < 0 || from >= current.length || index < 0 || index >= current.length) return;
    const [moved] = current.splice(from, 1);
    current.splice(index, 0, moved);
    this._fire({ ...this._config!, members: current });
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

    const allMembers = [...this._familyState.members, SYNTHETIC_HOUSEHOLD];
    const selectedSlugs = this._config.members ?? [];
    const slugToMember = new Map(allMembers.map((m) => [m.slug, m]));
    const selectedMembers = selectedSlugs
      .map((slug) => slugToMember.get(slug))
      .filter((m): m is MemberSummary => Boolean(m));
    const unselectedMembers = allMembers.filter((m) => !selectedSlugs.includes(m.slug));

    const renderRow = (
      m: MemberSummary,
      opts: { selected: boolean; isFirst?: boolean; isLast?: boolean; index?: number },
    ) => {
      const i = opts.index ?? -1;
      const dragClasses = opts.selected
        ? `${this._dragIndex === i ? 'dragging' : ''} ${this._dragOverIndex === i ? 'drag-over' : ''}`
        : '';
      return html`
      <div
        class="member-row ${opts.selected ? 'selected' : 'unselected'} ${dragClasses}"
        draggable=${opts.selected ? 'true' : 'false'}
        @dragstart=${opts.selected ? (e: DragEvent) => this._onDragStart(i, e) : null}
        @dragover=${opts.selected ? (e: DragEvent) => this._onDragOver(i, e) : null}
        @drop=${opts.selected ? (e: DragEvent) => this._onDrop(i, e) : null}
        @dragend=${opts.selected ? this._onDragEnd : null}
      >
        ${opts.selected
          ? html`<span class="grab-handle" aria-hidden="true" title="Drag to reorder">≡</span>`
          : ''}
        <input
          type="checkbox"
          id="member-${m.slug}"
          .checked=${opts.selected}
          @change=${(e: Event) =>
            this._memberToggled(m.slug, (e.target as HTMLInputElement).checked)}
        />
        ${opts.selected
          ? html`
              <div class="move-btns">
                <button
                  class="move-up-btn"
                  type="button"
                  title="Move up"
                  aria-label="Move ${m.name} up"
                  ?disabled=${opts.isFirst}
                  @click=${() => this._moveMember(m.slug, -1)}
                >▲</button>
                <button
                  class="move-down-btn"
                  type="button"
                  title="Move down"
                  aria-label="Move ${m.name} down"
                  ?disabled=${opts.isLast}
                  @click=${() => this._moveMember(m.slug, 1)}
                >▼</button>
              </div>
            `
          : ''}
        <div class="member-avatar">
          ${m.avatar && m.avatar.startsWith('/local/')
            ? html`<img src=${m.avatar} alt=${m.name} style="width:100%;height:100%;object-fit:cover;" />`
            : html`${m.avatar ?? m.name[0]}`}
        </div>
        <label for="member-${m.slug}">${m.name}</label>
        ${m.slug !== 'household'
          ? html`<button
              class="change-avatar-btn"
              title="Edit avatar"
              aria-label="Edit avatar for ${m.name}"
              @click=${() => { this._avatarModalMember = m; }}
            >✏️</button>`
          : ''}
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
      ${selectedMembers.map((m, idx) =>
        renderRow(m, {
          selected: true,
          isFirst: idx === 0,
          isLast: idx === selectedMembers.length - 1,
          index: idx,
        }),
      )}
      ${unselectedMembers.length > 0 && selectedMembers.length > 0
        ? html`<div class="unselected-hint">Available members</div>`
        : ''}
      ${unselectedMembers.map((m) => renderRow(m, { selected: false }))}

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
