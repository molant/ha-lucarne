import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../shared/types.js';
import { lucarneStyles } from '../shared/design-tokens.js';
import { setMemberAvatar, uploadAvatar } from '../shared/integration-services.js';

const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp']);

// Common emoji used for avatars
const COMMON_EMOJI = [
  '👶','🧒','👧','🧑','👦','👩','👨','🧓','👴','👵',
  '🐶','🐱','🐻','🐼','🐨','🦊','🦁','🐯','🐸','🦄',
  '🌟','⭐','🌈','🌸','🌺','🌻','🍀','🎈','🎨','🎯',
  '🏃','⚽','🎸','🎤','📚','🎮','🏆','❤️','💙','💚',
];

type Mode = 'emoji' | 'upload';

@customElement('lucarne-avatar-upload-modal')
export class LucarneAvatarUploadModal extends LitElement {
  static styles = [
    lucarneStyles,
    css`
      :host {
        display: block;
      }
      .backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal {
        background: var(--card-background-color, #fff);
        border-radius: var(--lucarne-radius-lg);
        padding: var(--lucarne-spacing-lg);
        width: min(400px, 90vw);
        max-height: 80vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: var(--lucarne-spacing-md);
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      }
      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .modal-title {
        font-size: var(--lucarne-fs-lg);
        font-weight: 600;
        color: var(--lucarne-on-surface);
      }
      .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        color: var(--lucarne-on-surface-muted);
        padding: 4px;
      }
      .mode-tabs {
        display: flex;
        border-bottom: 1px solid rgba(0,0,0,0.1);
      }
      .mode-tab {
        flex: 1;
        padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-md);
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        font-size: var(--lucarne-fs-sm);
        color: var(--lucarne-on-surface-muted);
        transition: all 0.15s;
      }
      .mode-tab.active {
        border-bottom-color: var(--primary-color);
        color: var(--primary-color);
        font-weight: 600;
      }
      .emoji-grid {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 4px;
      }
      .emoji-btn {
        background: none;
        border: 1px solid transparent;
        border-radius: var(--lucarne-radius-sm);
        font-size: 1.4rem;
        cursor: pointer;
        padding: 4px;
        text-align: center;
        transition: background 0.1s;
      }
      .emoji-btn:hover {
        background: rgba(0,0,0,0.05);
      }
      .emoji-btn.selected {
        border-color: var(--primary-color);
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
      }
      .upload-area {
        display: flex;
        flex-direction: column;
        gap: var(--lucarne-spacing-sm);
      }
      .file-input-label {
        display: block;
        padding: var(--lucarne-spacing-md);
        border: 2px dashed rgba(0,0,0,0.2);
        border-radius: var(--lucarne-radius-md);
        text-align: center;
        cursor: pointer;
        color: var(--lucarne-on-surface-muted);
        font-size: var(--lucarne-fs-sm);
        transition: border-color 0.15s;
      }
      .file-input-label:hover {
        border-color: var(--primary-color);
      }
      input[type='file'] {
        display: none;
      }
      .preview {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 50%;
        border: 2px solid var(--primary-color);
        align-self: center;
      }
      .error-msg {
        color: var(--error-color, #b00020);
        font-size: var(--lucarne-fs-sm);
        padding: var(--lucarne-spacing-xs) 0;
      }
      .actions {
        display: flex;
        gap: var(--lucarne-spacing-sm);
        justify-content: flex-end;
        margin-top: var(--lucarne-spacing-xs);
      }
      .btn {
        padding: var(--lucarne-spacing-sm) var(--lucarne-spacing-lg);
        border-radius: var(--lucarne-radius-sm);
        border: none;
        cursor: pointer;
        font-size: var(--lucarne-fs-sm);
        font-weight: 500;
        transition: opacity 0.15s;
      }
      .btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .btn-primary {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
      .btn-secondary {
        background: transparent;
        border: 1px solid rgba(0,0,0,0.2);
        color: var(--lucarne-on-surface);
      }
    `,
  ];

  @property({ attribute: false }) hass!: HomeAssistant;
  @property() memberSlug!: string;
  @property() memberName!: string;

  @state() private _mode: Mode = 'emoji';
  @state() private _selectedEmoji: string | null = null;
  @state() private _selectedFile: File | null = null;
  @state() private _previewUrl: string | null = null;
  @state() private _error: string | null = null;
  @state() private _submitting = false;

  private _close() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  private _selectEmoji(emoji: string) {
    this._selectedEmoji = emoji;
    this._error = null;
  }

  private _onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (this._previewUrl) {
      URL.revokeObjectURL(this._previewUrl);
    }
    this._selectedFile = null;
    this._previewUrl = null;
    this._error = null;

    if (!file) return;

    if (!ALLOWED_MIME.has(file.type)) {
      this._error = 'Only PNG, JPEG, and WebP images are accepted.';
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      this._error = 'Image must be 2 MB or smaller.';
      return;
    }

    this._selectedFile = file;
    this._previewUrl = URL.createObjectURL(file);
  }

  private async _submit() {
    if (this._submitting) return;
    this._error = null;

    if (this._mode === 'emoji') {
      if (!this._selectedEmoji) {
        this._error = 'Pick an emoji first.';
        return;
      }
      this._submitting = true;
      try {
        await setMemberAvatar(this.hass, this.memberSlug, this._selectedEmoji);
        this.dispatchEvent(new CustomEvent('avatar-changed', { detail: { avatar: this._selectedEmoji } }));
        this._close();
      } catch (err) {
        this._error = err instanceof Error ? err.message : String(err);
      } finally {
        this._submitting = false;
      }
      return;
    }

    if (!this._selectedFile) {
      this._error = 'Select an image file first.';
      return;
    }
    this._submitting = true;
    try {
      await uploadAvatar(this.hass, this.memberSlug, this._selectedFile);
      this.dispatchEvent(new CustomEvent('avatar-changed'));
      this._close();
    } catch (err) {
      this._error = err instanceof Error ? err.message : String(err);
    } finally {
      this._submitting = false;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._previewUrl) {
      URL.revokeObjectURL(this._previewUrl);
    }
  }

  render() {
    return html`
      <div class="backdrop" @click=${(e: Event) => { if (e.target === e.currentTarget) this._close(); }}>
        <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="modal-header">
            <span class="modal-title">Change avatar — ${this.memberName}</span>
            <button class="close-btn" @click=${this._close}>✕</button>
          </div>

          <div class="mode-tabs">
            <button
              class="mode-tab ${this._mode === 'emoji' ? 'active' : ''}"
              @click=${() => { this._mode = 'emoji'; this._error = null; }}
            >Emoji</button>
            <button
              class="mode-tab ${this._mode === 'upload' ? 'active' : ''}"
              @click=${() => { this._mode = 'upload'; this._error = null; }}
            >Upload photo</button>
          </div>

          ${this._mode === 'emoji' ? this._renderEmojiMode() : this._renderUploadMode()}

          ${this._error ? html`<div class="error-msg">${this._error}</div>` : ''}

          <div class="actions">
            <button class="btn btn-secondary" @click=${this._close}>Cancel</button>
            <button
              class="btn btn-primary"
              ?disabled=${this._submitting}
              @click=${this._submit}
            >${this._submitting ? 'Saving…' : 'Save'}</button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderEmojiMode() {
    return html`
      <div class="emoji-grid">
        ${COMMON_EMOJI.map(
          (emoji) => html`
            <button
              class="emoji-btn ${this._selectedEmoji === emoji ? 'selected' : ''}"
              @click=${() => this._selectEmoji(emoji)}
              title=${emoji}
            >${emoji}</button>
          `,
        )}
      </div>
    `;
  }

  private _renderUploadMode() {
    return html`
      <div class="upload-area">
        ${this._previewUrl
          ? html`<img class="preview" src=${this._previewUrl} alt="Preview" />`
          : ''}
        <label class="file-input-label" for="avatar-file-input">
          ${this._selectedFile ? this._selectedFile.name : 'Click to choose a PNG, JPEG, or WebP (max 2 MB)'}
        </label>
        <input
          type="file"
          id="avatar-file-input"
          accept="image/png,image/jpeg,image/webp"
          @change=${this._onFileChange}
        />
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-avatar-upload-modal': LucarneAvatarUploadModal;
  }
}
