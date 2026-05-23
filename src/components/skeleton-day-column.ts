import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { lucarneStyles } from '../shared/design-tokens.js';

/** Deterministic "random" height for fake event rectangles, based on column index. */
function fakeEventHeight(index: number): number {
  return 20 + ((index * 37 + 11) % 30);
}

/** Deterministic top % position for fake event rectangles. */
function fakeEventTop(index: number): number {
  return 10 + ((index * 53 + 7) % 60);
}

@customElement('lucarne-skeleton-day-column')
export class LucarneSkeletonDayColumn extends LitElement {
  static styles = [
    lucarneStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
      /*
       * Wrapper with an explicit pixel height derived from bandStart/bandEnd
       * and hourHeightPx. Avoids height:100% on :host because the parent
       * wrapper in calendar-grid is a flex column with no fixed height — on
       * the initial render (cachedDayKeys empty, no real day-col anywhere to
       * establish a row height), 100% of nothing collapsed the skeleton to
       * 0px and the shimmer was invisible.
       */
      .sk-host {
        position: relative;
        width: 100%;
        overflow: hidden;
      }
      .fake-event {
        position: absolute;
        left: 6px;
        right: 6px;
        border-radius: 3px;
        background: var(--lucarne-skeleton-base);
        overflow: hidden;
      }
      .shimmer-sweep {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          var(--lucarne-skeleton-highlight) 50%,
          transparent 100%
        );
        animation: shimmer-sweep 3s ease-in-out infinite;
      }
      @keyframes shimmer-sweep {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }
      @media (prefers-reduced-motion: reduce) {
        .shimmer-sweep {
          display: none;
        }
        .fake-event {
          background: var(--lucarne-skeleton-base);
        }
      }
    `,
  ];

  @property({ type: String }) bandStart = '07:00';
  @property({ type: String }) bandEnd = '21:00';
  @property({ type: Number }) hourHeightPx = 60;

  render() {
    const [sh] = this.bandStart.split(':').map(Number);
    const [eh] = this.bandEnd.split(':').map(Number);
    const bandH = Math.max(1, eh - sh);
    const bandPx = bandH * this.hourHeightPx;

    return html`
      <div class="sk-host" style="height:${bandPx}px">
        ${[0, 1].map((i) => {
          const topFrac = fakeEventTop(i) / 100;
          const topPx = topFrac * bandPx;
          const heightPx = fakeEventHeight(i);
          return html`
            <div
              class="fake-event"
              style="top: ${topPx}px; height: ${heightPx}px;"
            >
              <div class="shimmer-sweep"></div>
            </div>
          `;
        })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-skeleton-day-column': LucarneSkeletonDayColumn;
  }
}
