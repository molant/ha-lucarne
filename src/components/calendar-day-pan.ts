import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { snapToDay, rubberBand } from '../shared/pan-math.js';

/**
 * Wraps a <lucarne-calendar-grid> slot with horizontal pan-to-day gestures.
 *
 * Sign convention:
 *   - deltaPx (raw pointer displacement): positive = finger moved right.
 *   - snapToDay returns px-direction count (positive = dragged right = past).
 *   - The card's pan-snap handler inverts the sign before calling controller.pan()
 *     (positive controller.pan() = advance into the future).
 */
@customElement('lucarne-calendar-day-pan')
export class LucarneCalendarDayPan extends LitElement {
  static styles = css`
    :host {
      display: block;
      overflow: hidden;
      position: relative;
    }
    .pan-wrapper {
      touch-action: pan-y;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      position: relative;
    }
    ::slotted(*) {
      display: block;
    }
  `;

  /** Width of one day column, supplied by the card's ResizeObserver. */
  @property({ type: Number }) dayWidthPx = 0;
  /** Whether the user can pan backwards into the past. */
  @property({ type: Boolean }) canPanBack = true;
  /** Whether the user can pan forwards into the future. */
  @property({ type: Boolean }) canPanForward = true;

  @query('slot') private _slot!: HTMLSlotElement;

  private _pointerId?: number;
  private _startX = 0;
  private _startY = 0;
  private _startTime = 0;
  private _isDragging = false;
  private _cachedTargets: HTMLElement[] = [];

  /** All .day-cols-track elements inside the slotted calendar-grid's shadow root. */
  private get _panTargets(): HTMLElement[] {
    const grid = this._slot?.assignedElements()[0];
    if (!grid) return [];
    return Array.from(
      (grid as Element).shadowRoot?.querySelectorAll('.day-cols-track') ?? []
    ) as HTMLElement[];
  }

  /** Cache targets on gesture start so pointermove does not re-query every frame. */
  private _cachePanTargets(): void {
    this._cachedTargets = this._panTargets;
  }

  private _applyRubberBand(dx: number): number {
    if (dx > 0 && !this.canPanBack) {
      return rubberBand(dx, 0);
    }
    if (dx < 0 && !this.canPanForward) {
      return rubberBand(dx, 0);
    }
    return dx;
  }

  private _setTranslate(effective: number) {
    for (const el of this._cachedTargets) {
      el.style.transition = '';
      el.style.transform = `translateX(${effective}px)`;
    }
  }

  private _snapBack() {
    const targets = this._cachedTargets;
    if (targets.length === 0) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      for (const el of targets) {
        el.style.transform = 'translateX(0)';
        el.style.transition = '';
      }
    } else {
      const duration = getComputedStyle(this).getPropertyValue('--lucarne-pan-duration').trim() || '240ms';
      const easing = getComputedStyle(this).getPropertyValue('--lucarne-pan-easing').trim() || 'cubic-bezier(0.32, 0.72, 0, 1)';
      const transition = `transform ${duration} ${easing}`;
      for (const el of targets) {
        el.style.transition = transition;
        el.style.transform = 'translateX(0)';
      }
      // Clean up transition after it ends (listen on the first target)
      const onEnd = () => {
        for (const el of targets) {
          el.style.transition = '';
        }
        targets[0].removeEventListener('transitionend', onEnd);
      };
      targets[0].addEventListener('transitionend', onEnd, { once: true });
    }
  }

  private _onPointerDown(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // Ignore second pointer while a gesture is in progress
    if (this._pointerId !== undefined) return;
    this._pointerId = e.pointerId;
    this._startX = e.clientX;
    this._startY = e.clientY;
    this._startTime = performance.now();
    this._isDragging = false;
    this._cachePanTargets();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }

  private _onPointerMove(e: PointerEvent) {
    if (e.pointerId !== this._pointerId) return;
    const dx = e.clientX - this._startX;
    const dy = e.clientY - this._startY;

    if (!this._isDragging) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        // Vertical scroll wins — abort horizontal gesture and release capture
        try { (e.currentTarget as Element).releasePointerCapture(e.pointerId); } catch { /* already released */ }
        this._pointerId = undefined;
        return;
      }
      this._isDragging = true;
    }

    const effective = this._applyRubberBand(dx);
    this._setTranslate(effective);
  }

  private _onPointerUp(e: PointerEvent) {
    // Guard covers both pointerup and pointercancel bound to this handler.
    // Clearing _pointerId after the first fires ensures the second (rare duplicate
    // from some Safari scroll-interception scenarios) is dropped here.
    if (e.pointerId !== this._pointerId) return;
    try { (e.currentTarget as Element).releasePointerCapture(e.pointerId); } catch { /* already released */ }

    if (this._isDragging) {
      const dx = e.clientX - this._startX;
      const dt = performance.now() - this._startTime;
      const velocity = dt > 0 ? (dx / dt) * 1000 : 0;
      // Use rubber-banded dx so snap math sees the same magnitude as the visual
      const effective = this._applyRubberBand(dx);
      const deltaDays = snapToDay(effective, this.dayWidthPx, velocity);
      // Animate back to translateX(0) regardless of whether we advance days
      this._snapBack();
      // Only dispatch if there's something to snap to (suppresses no-op at bounds)
      if (deltaDays !== 0) {
        this.dispatchEvent(
          new CustomEvent('pan-snap', {
            detail: { deltaDays },
            bubbles: true,
            composed: true,
          }),
        );
      }
    }
    this._pointerId = undefined;
    this._isDragging = false;
    this._cachedTargets = [];
  }

  render() {
    return html`
      <div
        class="pan-wrapper"
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucarne-calendar-day-pan': LucarneCalendarDayPan;
  }
}
