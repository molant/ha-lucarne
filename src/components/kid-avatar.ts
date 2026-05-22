import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lucarne-kid-avatar')
export class LucarneKidAvatar extends LitElement {
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
    .avatar .initial {
      font-size: clamp(1.25rem, 2.5vw, 2rem);
      font-weight: 700;
      color: rgba(0, 0, 0, 0.7);
      line-height: 1;
      text-transform: uppercase;
      font-family: var(--primary-font-family, sans-serif);
    }
  `;

  @property() name = '';
  @property() color = '#a8d8b9';
  @property({ attribute: 'avatar-url' }) avatarUrl = '';

  render() {
    if (this.avatarUrl) {
      return html`
        <div class="avatar" style="background:${this.color}">
          <img src="${this.avatarUrl}" alt="${this.name}" />
        </div>
      `;
    }
    const initial = this.name.trim().charAt(0) || '?';
    return html`
      <div class="avatar" style="background:${this.color}">
        <span class="initial">${initial}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-kid-avatar': LucarneKidAvatar;
  }
}
