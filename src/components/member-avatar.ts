import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Match a string composed entirely of emoji-related codepoints (with at
// least one pictographic glyph). Includes ZWJ (U+200D) and variation
// selector U+FE0F so multi-codepoint sequences — ZWJ families,
// skin-tone modifiers, and the `❤️` heart-with-VS16 — are recognised.
const EMOJI_RE =
  /^(?=.*[\p{Extended_Pictographic}\p{Regional_Indicator}])[\p{Extended_Pictographic}\p{Emoji_Component}\p{Emoji_Modifier}\p{Regional_Indicator}‍️]+$/u;

@customElement('lucarne-member-avatar')
export class LucarneMemberAvatar extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .avatar {
      width: clamp(48px, 6vw, 72px);
      height: clamp(48px, 6vw, 72px);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .initial {
      font-size: clamp(1.25rem, 2.5vw, 2rem);
      font-weight: 700;
      color: rgba(0, 0, 0, 0.7);
      line-height: 1;
      text-transform: uppercase;
      font-family: var(--primary-font-family, sans-serif);
    }
    .emoji {
      font-size: clamp(1.5rem, 3vw, 2.25rem);
      line-height: 1;
    }
  `;

  @property() name = '';
  @property() color = '#a8d8b9';
  @property() avatar: string | null = null;

  render() {
    const av = this.avatar;
    if (av && av.startsWith('/local/')) {
      return html`
        <div class="avatar" style="background:${this.color}" aria-label="${this.name}'s avatar">
          <img src="${av}" alt="${this.name}" />
        </div>
      `;
    }
    if (av && EMOJI_RE.test(av)) {
      return html`
        <div class="avatar" style="background:${this.color}" aria-label="${this.name}'s avatar">
          <span class="emoji">${av}</span>
        </div>
      `;
    }
    const initial = this.name.trim().charAt(0) || '?';
    return html`
      <div class="avatar" style="background:${this.color}" aria-label="${this.name}'s avatar">
        <span class="initial">${initial}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-member-avatar': LucarneMemberAvatar;
  }
}
