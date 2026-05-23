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
 *
 * `pan-snap` is dispatched after the snap CSS transition completes (via
 * `transitionend`), not synchronously on pointerup. This lets the OLD day
 * content animate smoothly to the snap target before Lit replaces it with new
 * content. When `prefers-reduced-motion: reduce` is active, the dispatch is
 * immediate (no animation).
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
  private _pendingSnapTarget?: HTMLElement;
  private _pendingTransitionEnd?: () => void;

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

  private _cancelPendingSnap() {
    if (this._pendingTransitionEnd && this._pendingSnapTarget) {
      this._pendingSnapTarget.removeEventListener('transitionend', this._pendingTransitionEnd);
    }
    this._pendingTransitionEnd = undefined;
    this._pendingSnapTarget = undefined;
  }

  private _snapAndCommit(deltaDays: number) {
    const targets = this._cachedTargets;
    if (targets.length === 0) {
      if (deltaDays !== 0) this._dispatchPanSnap(deltaDays);
      return;
    }
    this._cancelPendingSnap();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      for (const el of targets) {
        el.style.transition = '';
        el.style.transform = 'translateX(0px)';
      }
      if (deltaDays !== 0) this._dispatchPanSnap(deltaDays);
      return;
    }

    const duration = getComputedStyle(this).getPropertyValue('--lucarne-pan-duration').trim() || '240ms';
    const easing = getComputedStyle(this).getPropertyValue('--lucarne-pan-easing').trim() || 'cubic-bezier(0.32, 0.72, 0, 1)';
    const transition = `transform ${duration} ${easing}`;

    // Animate OLD content to where NEW content's translateX(0) will appear.
    // deltaDays=0 → snap back to 0 (unchanged behavior).
    const targetPx = deltaDays * this.dayWidthPx;

    for (const el of targets) {
      el.style.transition = transition;
      el.style.transform = `translateX(${targetPx}px)`;
    }

    const onEnd = () => {
      this._pendingTransitionEnd = undefined;
      targets[0].removeEventListener('transitionend', onEnd);
      // Atomic swap: reset transform so the OLD content sits at translateX(0),
      // then dispatch pan-snap. Lit renders NEW content at translateX(0) — the
      // positions are identical so the swap is visually invisible.
      for (const el of targets) {
        el.style.transition = '';
        el.style.transform = 'translateX(0px)';
      }
      // Flush the layout before the Lit re-render so the transform reset is applied.
      void targets[0].offsetWidth;
      if (deltaDays !== 0) this._dispatchPanSnap(deltaDays);
    };
    this._pendingSnapTarget = targets[0];
    this._pendingTransitionEnd = onEnd;
    targets[0].addEventListener('transitionend', onEnd, { once: true });
  }

  private _dispatchPanSnap(deltaDays: number) {
    this.dispatchEvent(
      new CustomEvent('pan-snap', {
        detail: { deltaDays },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onPointerDown(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // Ignore second pointer while a gesture is in progress
    if (this._pointerId !== undefined) return;
    this._cancelPendingSnap();
    this._pointerId = e.pointerId;
    this._startX = e.clientX;
    this._startY = e.clientY;
    this._startTime = performance.now();
    this._isDragging = false;
    this._cachePanTargets();
    // NOTE: setPointerCapture is intentionally deferred to _onPointerMove.
    // Capturing on pointerdown would steal the synthesized click event on
    // Chrome desktop, preventing event-pill clicks from opening the detail modal.
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
      // Defer capture to here: first horizontal drag event past the threshold.
      // This allows a click (pointerdown→pointerup with no drag) to reach
      // descendant elements normally.
      try {
        (e.currentTarget as Element).setPointerCapture(e.pointerId);
      } catch {
        /* capture failed; events will still arrive on the wrapper */
      }
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
      this._snapAndCommit(deltaDays);
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
