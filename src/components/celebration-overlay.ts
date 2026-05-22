import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lucarne-celebration-overlay')
export class LucarneCelebrationOverlay extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      border-radius: inherit;
    }
    .dot {
      position: absolute;
      bottom: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      animation: float-up 2s ease-out forwards;
    }
    @keyframes float-up {
      0%   { transform: translateY(0) scale(1);   opacity: 0.9; }
      60%  { opacity: 0.7; }
      100% { transform: translateY(-110%) scale(0.6); opacity: 0; }
    }
  `;

  @property({ attribute: 'kid-slug' }) kidSlug = '';
  @property({ type: Boolean }) active = false;

  private _dots: { left: string; color: string; delay: string; size: string }[] = [];

  connectedCallback() {
    super.connectedCallback();
    this._generateDots();
  }

  private _generateDots() {
    const palette = ['#f5c89c', '#b8e0d2', '#f0b8c8', '#a8d8b9', '#c8b4e0', '#f0dca0'];
    this._dots = Array.from({ length: 18 }, (_, i) => ({
      left: `${(i / 17) * 90 + 5}%`,
      color: palette[i % palette.length],
      delay: `${(i * 0.08).toFixed(2)}s`,
      size: `${8 + Math.round(Math.random() * 6)}px`,
    }));
  }

  render() {
    if (!this.active) return html``;
    return html`
      ${this._dots.map(
        (d) => html`
          <div
            class="dot"
            style="left:${d.left};background:${d.color};animation-delay:${d.delay};width:${d.size};height:${d.size}"
          ></div>
        `,
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-celebration-overlay': LucarneCelebrationOverlay;
  }
}
