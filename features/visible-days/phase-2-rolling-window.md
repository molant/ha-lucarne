---
status: done
---

# Phase 2: Rolling window + responsive day count

This phase is where the feature becomes user-visible. The card switches from a fixed Monday-anchored week to a rolling window anchored on today. Day count adapts to container width. Navigation steps by day (not week). A new `RollingWindowController` (Lit ReactiveController) owns the cached event range, fetch lifecycle, day-offset state, and midnight rollover. The editor gains four new numeric inputs. Touch swipe is **NOT** in this phase — that's Phase 3.

## Context

Phase 1 left the layout engine and CSS grid parameterized but still rendering 7 days starting on Monday. Phase 2 replaces that with:

- A `RollingWindowController` instantiated in `setConfig` that owns the cached event range and the day-offset.
- A `ResizeObserver` on the grid wrapper that recomputes `visibleCount` via `computeVisibleDays` whenever the container resizes.
- Day-step navigation: arrows advance by `visibleCount`, "Today" button re-anchors.
- Header label renders a date range (`"May 22 – May 26"`).
- Multi-day events clip at the window edge with a chevron indicator.
- Midnight rollover via a 60s interval.

Phase 2 does **not** yet add the touch swipe gesture or the skeleton-loading shimmer. The user can navigate by buttons; pan operations are not yet possible. Days outside the cached range render as **empty** columns in Phase 2 — the skeleton component lands in Phase 3.

Read [./README.md](./README.md) for the rolling-window concept and the `computeVisibleDays` formula. Read [./phase-1-foundation.md](./phase-1-foundation.md) for the layout signature change.

## Structure

```
src/shared/
  rolling-window.ts                # NEW: RollingWindowController (Lit ReactiveController)
src/cards/
  lucarne-calendar-card.ts         # MAJOR: replace _weekOffset with controller; ResizeObserver; midnight tick
src/components/
  calendar-grid.ts                 # MODIFY: accept dayWidthPx; render --lucarne-day-count CSS var; chevron on clipped all-day pills
src/editors/
  lucarne-calendar-card-editor.ts  # MODIFY: add 4 number inputs with inline validation
tests/shared/
  rolling-window.test.ts           # NEW: controller fetch/buffer logic (with a stub HA + injected clock)
```

## Implementation Checklist

> **Remember**: Update these checkboxes as you complete each task!

### Baseline Test Verification

- [x] Phase 1 is merged and `status: done`.
- [x] All four gates green on the current branch (`npm test`, `npm run lint`, `npm run typecheck`, `npm run build`).
- [ ] Manually verified Phase 1 deploy on the wall iPad — the existing card still works.

### Sub-Phase A: `RollingWindowController` + ResizeObserver wiring

Deployable when: the card uses today as the leftmost column, ResizeObserver picks `visibleCount` from container width, fetches happen for the visible + buffer range. (Navigation in this sub-phase still goes through the existing `_navWeek` / `_weekLabel` — Sub-Phase C replaces them with day-step arrows + Today button + range label. Do NOT delete `_navWeek` / `_weekLabel` here; Sub-Phase C deletes them in the same edit that introduces their replacements. Keeping the old controls live through Sub-Phase A means the card remains usable after each sub-phase ships independently.)

#### Tests first (TDD)

- [x] Create `tests/shared/rolling-window.test.ts`.
- [x] Build a stub `ReactiveControllerHost` — the controller must be constructable in node tests without a real Lit element. A minimal stub looks like:
  ```typescript
  function makeHostStub(): ReactiveControllerHost & { updateCount: number } {
    return {
      updateCount: 0,
      addController() {},
      removeController() {},
      requestUpdate() { this.updateCount++; },
      get updateComplete() { return Promise.resolve(true); },
    };
  }
  ```
  Pass this as the first arg to `new RollingWindowController(host, opts)`. Drive lifecycle manually: call `controller.hostConnected()` / `controller.hostDisconnected()` directly (the stub does not auto-invoke them).
- [x] Build a stub HA: a fake `hass` object whose shape matches the calls `fetchCalendarEvents` actually makes — it sends `hass.connection.sendMessagePromise({ type: 'call_service', domain: 'calendar', service: 'get_events', service_data: { start_date_time, end_date_time }, target: { entity_id }, return_response: true })`. The stub's `sendMessagePromise` returns `Promise.resolve({ response: { [entityId]: { events: cannedEvents } } })`. Track calls so tests can assert "fetched range X..Y once". To avoid real-network risk in tests, inject the stub by wrapping the controller's fetch in a `fetcher` option (default `fetchCalendarEvents`) — see Implementation below.
- [x] Build an injected clock: the controller must accept a `now: () => Date` for testability (default `() => new Date()`). Use this to test midnight rollover deterministically. **Also disable real timers in tests** — pass `pollIntervalMs: 0` and `tickIntervalMs: 0` (or similar) so `hostConnected` does not start real `setInterval`s during a node test run. Tests then call `controller.tick()` and `controller._poll()` directly.
- [x] Test: `controller.setVisibleCount(5)` with `dayOffset=0` and `now=2026-05-22T10:00` (so today = 2026-05-22) → cached range is `start=2026-05-17T00:00:00` (today − visibleCount), `end=2026-06-01T00:00:00` (today + 2 × visibleCount, exclusive). That is **15 days total**: 5 past buffer (May 17–21) + 5 visible (May 22–26) + 5 future buffer (May 27–31). Assert exact `Date` equality on both endpoints.
- [x] Test: setting `visibleCount` from 5 → 3 does not trigger a re-fetch (buffer covers the smaller range).
- [x] Test: setting `visibleCount` from 3 → 7 triggers a re-fetch (buffer grows; new edge days needed).
- [x] Test: `controller.pan(+5)` shifts the day offset by 5 days; fetch is triggered when the new visible+buffer extends past the cache.
- [x] Test: `controller.goToToday()` resets `dayOffset = 0`.
- [x] Test: `controller.tick()` with `now` advanced past midnight, when `dayOffset === 0`, re-anchors and re-fetches.
- [x] Test: `controller.tick()` with `now` advanced past midnight, when `dayOffset !== 0`, does NOT re-anchor (user has panned away).
- [x] Test: pan bound — with `visibleCount=5` and `panBoundDays=90`:
  - `controller.pan(+100)` from `dayOffset=0` clamps `dayOffset` to `+85` (= `panBoundDays − visibleCount`). The visible window is then `[today + 85, today + 89]` inclusive, with its **exclusive right edge** at `today + 90` (i.e. `dayOffset + visibleCount === panBoundDays`). After the clamp: `canPanForward === false` (`85 + 5 < 90` is false), `canPanBack === true` (`85 > −90`). Assert `controller.dayOffset === 85` and the rightmost element of `controller.days` equals `today + 89` (NOT `today + 90` — that would be off-by-one).
  - `controller.pan(-100)` from `dayOffset=0` clamps `dayOffset` to `−90`. The visible window is then `[today − 90, today − 86]` inclusive (leftmost visible day = `today − 90`). After the clamp: `canPanBack === false` (`−90 > −90` is false), `canPanForward === true` (`−90 + 5 < 90`). Assert `controller.dayOffset === -90` and `controller.days[0]` equals `today − 90`.
  - The clamp range `[−panBound, panBound − visibleCount]` is asymmetric on purpose: `dayOffset` represents the **leftmost** visible day's offset from today, so on the past side we cap the leftmost (`dayOffset >= −90`), on the future side we cap the rightmost (`dayOffset + visibleCount <= panBound`, i.e. exclusive right edge of the visible window sits no further than `today + 90`).
- [x] Test: 5-min poll calls `_fetchRange` with the **full** visible+buffer range, not just visible.
- [x] Test: stale fetch responses (controller's sequence number bumped during fetch) are discarded.
- [x] Test: `setHass` first-arrival fetch — construct controller without ever calling `setHass` (hass is not part of `RollingWindowOptions`; it always arrives via `setHass`), call `controller.hostConnected()`, assert fetcher was NOT called (no hass yet), then call `controller.setHass(stubHass)` and assert fetcher IS called once. Subsequent calls to `setHass` with the same or another hass instance must NOT trigger a re-fetch (only the first-arrival transition does).
- [x] Test: event uid tagging — the canned fetcher returns events with bare `uid: 'abc'`; after a successful fetch, `controller.cachedEvents.get('calendar.foo')![0].uid === 'calendar.foo::abc'`. Also assert events with `uid: undefined` get tagged as `'calendar.foo::'`. This guards the color-lookup contract in `calendar-grid.ts:197-204`.

#### Implementation

- [x] Create `src/shared/rolling-window.ts`:
  ```typescript
  import type { ReactiveController, ReactiveControllerHost } from 'lit';
  import type { HomeAssistant, CalendarEvent, CalendarConfig } from './types.js';
  import { fetchCalendarEvents } from './ha-subscriptions.js';

  export interface RollingWindowOptions {
    calendars: CalendarConfig[];
    visibleCount: number;
    onFetchStart?: (range: { start: Date; end: Date }) => void;
    onFetchComplete?: (events: Map<string, CalendarEvent[]>) => void;
    /**
     * Fires whenever `dayOffset`, `visibleCount`, or the anchor day (midnight tick)
     * changes — even when no fetch is triggered (e.g. in-buffer pan, shrinking
     * visibleCount that the buffer already covers, midnight tick while panned
     * away). The card MUST hook this to `_recompute()` — otherwise `_layout`
     * stays stale and `requestUpdate` re-renders with old day labels.
     * See "Re-layout discipline" under Technical Details.
     */
    onChange?: () => void;
    now?: () => Date;
    panBoundDays?: number;   // default 90
    /** Injected fetcher for tests; default re-exports `fetchCalendarEvents`. */
    fetcher?: (hass: HomeAssistant, entityIds: string[], start: Date, end: Date) => Promise<Map<string, CalendarEvent[]>>;
    /** Set to 0 in tests to suppress the real-time poll. Default: 5 * 60_000. */
    pollIntervalMs?: number;
    /** Set to 0 in tests to suppress the real-time midnight tick. Default: 60_000. */
    tickIntervalMs?: number;
  }

  export class RollingWindowController implements ReactiveController {
    constructor(host: ReactiveControllerHost, opts: RollingWindowOptions) {
      // REQUIRED by Lit's ReactiveController contract: register with the host
      // so hostConnected/hostDisconnected fire automatically.
      this._host = host;
      host.addController(this);
      // ...store opts...
    }
    hostConnected(): void { /* setup interval timers, initial fetch */ }
    hostDisconnected(): void { /* clear timers */ }

    // Method/getter shapes (provide real bodies in the implementation):
    setVisibleCount(n: number): void { /* fires onChange when n changes; fetches only if range grows past cache */ }
    setHass(hass: HomeAssistant): void { /* ... */ }
    updateCalendars(calendars: CalendarConfig[]): void { /* re-fetch if entity list changed */ }
    pan(deltaDays: number): void { /* ... */ }
    goToToday(): void { /* ... */ }
    tick(): void { /* midnight check; exposed for tests */ }
    get days(): Date[] { /* visible days (length = visibleCount) */ return []; }
    get dayOffset(): number { return 0; }
    get isAtToday(): boolean { return this.dayOffset === 0; }
    get canPanBack(): boolean { /* dayOffset > -panBoundDays */ return true; }
    get canPanForward(): boolean { /* dayOffset + visibleCount < panBoundDays */ return true; }
    get cachedEvents(): Map<string, CalendarEvent[]> { return new Map(); }
    get cachedRange(): Date[] { /* every date currently covered by a successful fetch (Phase 3) */ return []; }
    isDayCached(day: Date): boolean { return false; }
  }
  ```
  (The bodies above are placeholders to keep the TypeScript class shape valid in a snippet; replace with real implementations per the bullets below. Don't ship the placeholders.)
- [x] Implement:
  - On `hostConnected`: if `tickIntervalMs > 0`, set up `setInterval(() => this.tick(), tickIntervalMs)` for midnight check; if `pollIntervalMs > 0`, set up `setInterval(() => this._poll(), pollIntervalMs)` for the 5-min refresh. Trigger the initial fetch (no waiting for the interval). On `hostDisconnected`, clear both intervals. **Do not assume `hostConnected` is called before `setHass` / `setVisibleCount`** — guard fetches with `if (!this._hass) return;`.
  - **`setHass(hass)` must trigger an initial fetch when `hass` transitions from undefined to defined** (the host may connect before `hass` is wired up — see the existing `updated()` handshake at `lucarne-calendar-card.ts:204-212` which uses `if (!prevHass && this.hass)` to detect the first-arrival case). Concretely: store `const wasUnset = !this._hass; this._hass = hass; if (wasUnset && this._isConnected) this._fetchRange(...);`. Without this, the card silently never fetches when `hass` arrives after `connectedCallback`.
  - Track `_isConnected` via `hostConnected` / `hostDisconnected` so `setHass` knows whether to fetch immediately or wait.
  - `_fetchRange(start, end)`: increments sequence, calls `fetchCalendarEvents`, then on a non-stale response **tags every event's `uid` with its source entity** (see "Event uid tagging" below — this is REQUIRED for color lookup in `calendar-grid.ts:197-204` and must not be skipped) and **replaces** `_cachedEvents` wholesale with the tagged response (do NOT merge with prior `_cachedEvents` — each fetch covers the full current `[today + dayOffset − vc, today + dayOffset + 2vc)` range, so a partial-merge would keep stale events from a prior window after a pan). Phase 3 fleshes out the `cachedRange` / `isDayCached` getters (which read a `Set<string>` of `isoDateKey(day)` populated here at the tail of `_fetchRange`) — in Phase 2, the placeholder getter bodies are sufficient. Finally call `onFetchComplete` (host should `requestUpdate`).
    ```typescript
    // Tagging — same shape the deleted `_fetchEvents` produced before Phase 2.
    // Without this, `calendar-grid._eventColor` (line 197) cannot find the entity
    // id in `event.uid` and every event falls back to the default `#a8d8b9` green.
    const tagged = new Map<string, CalendarEvent[]>();
    for (const [entityId, events] of map.entries()) {
      tagged.set(
        entityId,
        events.map((e) => ({ ...e, uid: `${entityId}::${e.uid ?? ''}` })),
      );
    }
    this._cachedEvents = tagged;
    // Replace _cachedDayKeys wholesale too (do NOT merge). Phase 3 reads this
    // Set via `isDayCached` / `cachedRange`; leaving stale keys from a prior
    // range would make `isDayCached` return true for days that are no longer
    // in the cache, causing the grid to skip skeleton rendering on days that
    // actually have no events. `isoDateKey` is not yet exported in Phase 2 (the
    // Phase 3 consolidation handles that) — declare a local copy in
    // `rolling-window.ts` matching the body in `calendar-layout.ts:34-39`; the
    // Phase 3 consolidation step will delete this local copy along with the
    // others.
    this._cachedDayKeys = new Set();
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      this._cachedDayKeys.add(isoDateKey(d));
    }
    ```
  - Cached range: `[ today + dayOffset − visibleCount, today + dayOffset + 2 × visibleCount )`. Decomposed: `visibleCount` days of past buffer + `visibleCount` days of visible window + `visibleCount` days of future buffer = `3 × visibleCount` total. Matches the README's "±visibleCount buffer around the visible range".
  - `pan(delta)`: clamp to `[−panBound, panBound − visibleCount]`; if the new visible window extends past the cached range, trigger a fetch for the new full range. **Always fire `opts.onChange?.()` and then `this._host.requestUpdate()`** after mutating `dayOffset` — even when no fetch is needed. `onChange` is what re-runs the card's `_recompute` to rebuild `_layout` with the new `controller.days`; `requestUpdate` then triggers the re-render. Without `onChange`, the host re-renders with a stale `_layout` and the day labels don't move.
  - `setVisibleCount(n)`: same rule — if `n` differs from the current count, update it; if buffer covers the new range, no fetch is needed, but still call `opts.onChange?.()` + `this._host.requestUpdate()`. (The buffer-shrinks-to-fit case is the easy trap: 5 → 3 covers itself, but the card must still re-layout with 3 days.)
  - `goToToday()`: set `dayOffset = 0`; if not already there, fire `opts.onChange?.()`; fetch if needed; `this._host.requestUpdate()`.
  - `tick()`: compare stored `today` to `now()`; if changed AND `dayOffset === 0`, re-anchor, fire `opts.onChange?.()`, and re-fetch. If changed but `dayOffset !== 0`, the visible range hasn't shifted — no re-anchor, no `onChange`, but DO update the internal "today" so the next `goToToday()` lands on the right day. **`tick` is public** so tests can drive it deterministically (advance the injected `now()` then call `controller.tick()`).
- [x] Modify `src/cards/lucarne-calendar-card.ts`:
  - Delete `_weekOffset`, the inline `_currentDays()` from Phase 1, `_setup`, `_teardown`, `_intervalId`, `_fetchSeq`, `_rawEvents`, the inline `_fetchEvents`. (Note: `_weekStart`/`_weekEnd` were already deleted in Phase 1 Sub-Phase C.) The controller now owns the fetch lifecycle, the interval, the sequence number, and the cached event map. **Keep `_weekLabel` and `_navWeek` for now** — they are deleted in Sub-Phase C in the same edit that introduces the day-step arrows + range label, so the card always has working navigation between sub-phase deploys. In this sub-phase:
    - `_navWeek(delta)` becomes `this._rolling.pan(delta * 7)` (legacy week-step semantics; positive `delta` advances into the future, matching the existing API).
    - `_weekLabel()` becomes a simple range string from `controller.days[0]` to `controller.days[controller.days.length - 1]` using the same `month: 'short', day: 'numeric'` `toLocaleDateString('en-US')` formatter as today. Drop the `"This week" / "Last week" / "Next week"` branches — they no longer have a stable meaning once the offset is in days instead of weeks, and Sub-Phase C deletes the method entirely anyway.
  - **Update every call site of the deleted lifecycle methods**:
    - `setConfig` (currently calls `this._teardown(); this._setup();` on re-config): replace with `this._rolling.updateCalendars(normalizedConfig.calendars)` (see the `updateCalendars` bullet below). On the FIRST `setConfig` call (when `this._rolling` is undefined), instantiate the controller as described below — do NOT call `updateCalendars` on a non-existent controller.
    - `connectedCallback` (currently calls `this._setup()`): remove the call. Lit auto-invokes `RollingWindowController.hostConnected()` because the controller registered itself via `host.addController(this)` in its constructor. (Note: the ResizeObserver setup lives in `firstUpdated`, NOT `connectedCallback` — see the ResizeObserver bullet below.)
    - `disconnectedCallback` (currently calls `this._teardown()`): remove the call. Lit auto-invokes `hostDisconnected()`. Add the `_resizeObserver?.disconnect()` cleanup here.
    - `updated` (currently has `if (!prevHass && this.hass && !this._intervalId) { this._setup(); }`): replace with `this._rolling.setHass(this.hass)` (covered by the bullet below). The first-arrival fetch is now handled inside `setHass` (see the controller's `setHass` implementation).
  - **Keep** `_pendingEvents` (line 118 in source) and the optimistic-create flow (`_onEventCreated`, `_recompute` reading from `_pendingEvents`) — these are unrelated to the week→rolling change. In `_recompute`, read events from `this._rolling.cachedEvents` (typed `Map<string, CalendarEvent[]>`, same shape as the current `_rawEvents`) instead of `this._rawEvents`, and continue merging `_pendingEvents` for optimistic display. The existing visibility-filter loop at `lucarne-calendar-card.ts:261-272` works unchanged — substitute `this._rolling.cachedEvents` for `this._rawEvents` in the `for...of` loop.
  - **MUST clear `_pendingEvents` when a real fetch arrives** — the deleted `_fetchEvents` did this at line 255 (`this._pendingEvents = [];`). The new code path must reproduce it: change the `onFetchComplete` callback to `onFetchComplete: () => { this._pendingEvents = []; this._recompute(); }`. Without this, an optimistically-created event stays in `_pendingEvents` forever and renders as a duplicate alongside the real server event after the next 5-min poll. (The `onChange` callback does NOT clear pending events — it fires on pan / setVisibleCount / midnight tick when no fetch happens, and pending events should survive those.)
  - Instantiate `this._rolling = new RollingWindowController(this, { calendars: this._config.calendars, visibleCount: this._effectiveConfig().minDays, onFetchComplete: () => { this._pendingEvents = []; this._recompute(); }, onChange: () => this._recompute() })` in `setConfig`. **Both callbacks must be wired** — `onFetchComplete` clears the optimistic-create queue (replicating the deleted `_fetchEvents` behavior, see `_pendingEvents` bullet above) and re-layouts after new events arrive; `onChange` re-layouts after a pan / visibleCount change / midnight tick that did not trigger a fetch. (See `RollingWindowOptions.onChange` JSDoc.) The initial `visibleCount` is the `minDays` floor — the ResizeObserver fires shortly after `connectedCallback` and replaces it with the real container-derived value. Hard-coding `7` would cause an out-of-spec initial fetch on narrow viewports. **If `setConfig` is called again** (HA re-applies config on edit), do not reinstantiate the controller in place — call `this._rolling.updateCalendars(newConfig.calendars)` (add this method: it diffs the entity list and triggers a re-fetch only when entities changed). The controller's other state (dayOffset, cached range) is preserved. **Also re-run `_onResize()` at the end of `setConfig`** if any of `min_days`, `max_days`, `min_col_width`, `max_col_width` changed between the old and new config — the ResizeObserver does NOT fire on its own when only config changes (container width is unchanged), so without this manual kick the new bounds won't take effect until the next real resize.
  - On `hass` property change in `updated`, call `this._rolling.setHass(this.hass)`.
  - Add `private _resizeObserver?: ResizeObserver`. **Create the observer in `firstUpdated` (NOT `connectedCallback`)** and `observe(this._gridAreaEl!)` there — `@query('.grid-area')` returns `undefined` during `connectedCallback` because the shadow root has not rendered yet, so an `observe()` call there is a silent no-op and the responsive day-count never actually updates. In `firstUpdated`, also call `this._onResize()` once manually to seed `_lastVisibleCount` / `_dayWidthPx` from the initial container width (ResizeObserver's first callback is fired automatically by the browser when `observe()` is called on an element with non-zero size, but relying on that alone leaves a frame of "wrong visibleCount" rendering). On resize, the callback calls `computeVisibleDays(width, cfg)` and `this._rolling.setVisibleCount(visibleCount)`. Set the `--lucarne-day-count` CSS custom property on `this.style`. Disconnect in `disconnectedCallback`.
  - In `_recompute`, build the days array from `this._rolling.days`; call `layoutEvents(allEvents, days, bandStart, bandEnd)`.
  - Pass `dayWidthPx` from `computeVisibleDays` down to `<lucarne-calendar-grid>` as a property.
  - **Crash debounce**: ResizeObserver can fire in a loop if you set a CSS property in the callback. Guard with `requestAnimationFrame` and only update if `visibleCount` actually changed.
- [x] Extend `LucarneCalendarCardConfig` **in `src/cards/lucarne-calendar-card.ts`** (where the interface is already defined and already imported by the editor — keep it co-located, do not move to `types.ts`):
    ```typescript
    export interface LucarneCalendarCardConfig {
      // ...existing fields...
      min_days?: number;        // default 3
      max_days?: number;        // default 7
      min_col_width?: number;   // px, default 140
      max_col_width?: number;   // px, default 220
      /** @deprecated silently ignored; rolling window has no week start. Kept in
       *  the type so old saved configs / YAML still parse without errors. */
      week_starts_on?: 'monday' | 'sunday';
    }
    ```
  - The `@deprecated` tag here must match the comment added in Phase 1 Sub-Phase C — single source of truth.
- [x] Modify `src/components/calendar-grid.ts`:
  - Add `@property({ type: Number }) dayWidthPx = 0;` — currently informational; consumed in Phase 3 by the skeleton column and pan math. The grid itself uses CSS `1fr` for the day columns; `dayWidthPx` does not need to be wired into the grid's own CSS.
  - Apply the day-count CSS var on the `.grid-wrapper` element so the existing `grid-template-columns: 40px repeat(var(--lucarne-day-count, 7), minmax(0, 1fr))` rule picks up the live count. Use Lit's `styleMap` (`import { styleMap } from 'lit/directives/style-map.js'`) — plain inline `style="..."` interpolation in Lit does not reliably re-apply custom-property values across re-renders:
    ```typescript
    import { styleMap } from 'lit/directives/style-map.js';
    // ...inside render():
    html`<div class="grid-wrapper" style=${styleMap({ '--lucarne-day-count': String(this.layout.days.length) })}>...</div>`
    ```
    This is in addition to the card-host-level set in `_onResize`; the wrapper style guards against stale renders where the host attribute has not flushed yet.
  - Update `min-width: 480px` rule to use the dynamic count: drop it (the parent's ResizeObserver handles the width contract).
- [x] Run `npm test` — controller tests pass, layout tests still pass.

### Sub-Phase B: Editor — 4 new number inputs

Deployable when: editor exposes `min_days`, `max_days`, `min_col_width`, `max_col_width` as number inputs with inline validation; setting them changes the live card behavior.

#### Tests

- [x] Editor has no existing unit tests in this project; manual verification only. (If you add tests, follow the pure-function pattern — extract a `validateEditorConfig(cfg)` helper and test it.)

#### Implementation

- [x] Add to `src/editors/lucarne-calendar-card-editor.ts`:
  - Four `<input type="number" min="X" max="Y" step="Z">` fields under a new section labeled "Visible day window".
  - Bounds: `min_days` 1–14 step 1; `max_days` 1–14 step 1; `min_col_width` 60–400 step 10; `max_col_width` 100–600 step 10.
  - Inline validation: if `min_days > max_days` or `min_col_width > max_col_width`, show a red `.editor-error` message under the offending row. **Do not block save** — invalid values fall back to defaults at runtime (the controller's `computeVisibleDays` already swaps inverted bounds).
  - Add the `.editor-error` class to `src/shared/editor-styles.ts`. Match the existing `button.remove` rule's error styling (`color: var(--error-color, #f44336);`) and use the design-token font size:
    ```css
    .editor-error {
      color: var(--error-color, #f44336);
      font-size: var(--lucarne-fs-sm);
      margin-top: var(--lucarne-spacing-xs);
    }
    ```
    Track which row is invalid in editor `@state() private _invalid: { days?: boolean; cols?: boolean } = {};` — render the `<div class="editor-error">…</div>` directly under the offending `<label class="field">` block.
- [x] **Default handling**: do NOT rewrite the four fields in `setConfig` — leave them `undefined` on the config object as the user wrote it (so the editor can show empty inputs for unset fields). Default resolution happens centrally in `_effectiveConfig()` (see Technical Details > ResizeObserver loop guard). `setConfig` must not throw for missing/zero/negative values on these four fields (the calendar card's existing throws apply only to `calendars` and `visible_hours`).
- [x] Update `getStubConfig` to include the four new fields with default values (`min_days: 3, max_days: 7, min_col_width: 140, max_col_width: 220`) and to drop `week_starts_on`, so the visual editor's "Add card" preview shows the rolling window working from the start.

### Sub-Phase C: Header label, day-step navigation, chevron, midnight tick

Deployable when: the header shows the date range, arrows step by `visibleCount`, "Today" button appears when not at the today anchor, multi-day events show chevrons on clipped edges, midnight rollover works.

#### Tests

- [x] Add to `tests/shared/calendar-layout.test.ts`: a test that an all-day event spanning 10 days, intersected with a 3-day visible window, has `allDay` entries with `clipLeft` / `clipRight` boolean hints on the layout output. (Yes, this means `PerDayLayout` gains optional clip hints — see Technical Details.)
- [x] Add to `tests/shared/rolling-window.test.ts`: midnight tick re-anchor case (already covered in Sub-Phase A; verify it still passes after wiring is complete).

#### Implementation

- [x] In `src/cards/lucarne-calendar-card.ts`:
  - **Delete the placeholder `_weekLabel` and `_navWeek` methods kept alive in Sub-Phase A.** They are replaced by `_rangeLabel()` and direct `controller.pan(±this._lastVisibleCount)` calls below.
  - Header label: compute via a `_rangeLabel()` method using `Intl.DateTimeFormat`. Format:
    - Same month: `"May 22 – 26"`
    - Cross-month: `"May 28 – Jun 1"`
    - Cross-year: `"Dec 28, 2026 – Jan 1, 2027"`
  - Replace the `<button>← / This week / →</button>` controls with:
    - `←` (calls `this._rolling.pan(-this._lastVisibleCount)`); disabled when `!canPanBack`.
    - "Today" button (calls `this._rolling.goToToday()`); only rendered when `!isAtToday`.
    - `→` (calls `this._rolling.pan(+this._lastVisibleCount)`); disabled when `!canPanForward`.
  - aria-labels: `"Previous ${this._lastVisibleCount} days"`, `"Today"`, `"Next ${this._lastVisibleCount} days"` (use the `_lastVisibleCount` field declared in Technical Details > ResizeObserver loop guard; it's the most recent value computed by `_onResize` and is the single source of truth for the current visible-count in the card).
- [x] In `src/shared/calendar-layout.ts`:
  - Extend `PerDayLayout` to add an optional `allDayClipped: Map<string, { left: boolean; right: boolean }>` keyed by event uid. Populate it for all-day events whose `[eventStart, eventEnd)` extends past the `days[0]` or `days[days.length - 1]` boundary.
  - For timed events that span multiple days, do **not** chevron — the existing band-clipping already handles them visually within a day.
- [x] In `src/components/calendar-grid.ts`:
  - When rendering an `.allday-event`, check the clip map for this day + event; if `left`, prepend a `‹` glyph; if `right`, append `›`. Use a span with a small CSS class so it can be styled without breaking the text ellipsis.
- [x] Verify the midnight tick (already in the controller) actually fires by manually advancing system time during a dev build, or by injecting a faster `now()` in a debug build. Document a one-time manual test.

#### Documentation (End of Sub-Phase)

- [x] `docs/architecture.md` — update the **Card subscription model** section's `lucarne-calendar-card` bullet to describe the rolling-window fetch (visible + buffer, day-anchored).
- [x] `docs/config-recipes.md` — show a recipe with the new options under `lucarne-calendar-card`. **Also remove the stale `week_starts_on: monday` line at `config-recipes.md:55`** (the option is silently ignored now; leaving it in a recipe would mislead users into thinking it does something).
- [x] `docs/ipad-landscape.md` — note that the calendar pane now auto-fits 4–5 columns at 720px width (was 7).
- [x] `CHANGELOG.md` — under `[Unreleased]`, `### Changed`: `lucarne-calendar-card` now uses a rolling N-day window anchored on today (replaces fixed Monday-anchored week). `### Added`: editor options `min_days`, `max_days`, `min_col_width`, `max_col_width`. `### Deprecated`: `week_starts_on` (silently ignored from old configs; the rolling window has no week start; field kept in the schema so old YAML still loads).
- [x] `README.md` — update the `lucarne-calendar-card` YAML example: drop `week_starts_on`, add the four new options with their defaults.

### Build Verification (required before marking phase complete)

- [x] `npm run lint` — zero warnings.
- [x] `npm run typecheck` — zero errors.
- [x] `npm test` — all tests pass. Scan stdout for warnings.
- [x] `npm run build` — produces `dist/ha-lucarne.js`.
- [x] `package-lock.json` — should not have changed in this phase. If it did, investigate.
- [x] Mark this phase `status: done` only after all gates pass.

### Manual Verification with MCP Tools

Phase 2 is user-visible. Verification matters.

- [ ] Build and deploy `dist/ha-lucarne.js` to the dev HA instance (see `memory/deploy_ha_lucarne.md`).
- [ ] Use `mcp__browsermcp__browser_navigate` to open the wall-iPad dashboard.
- [ ] Confirm responsive day-count at four widths: 480 / 720 / 1080 / 1366 px. browsermcp does not expose a viewport-resize tool — verify by either (a) navigating to the dashboard inside a desktop Chrome window the user manually resizes, then `mcp__browsermcp__browser_screenshot` at each width, or (b) appending `?kiosk` and using device-emulation via Chrome DevTools (manual). Confirm:
  - 480px → 3 columns
  - 720px → 4 columns
  - 1080px → 7 columns (capped)
  - 1366px → 7 columns, wider
- [ ] At 1080px: confirm column 0 is today, the header shows the date range, the "Today" button is hidden (or properly hidden when at the today anchor).
- [ ] Click `→` once: window advances by 7 days (visible count). Header label updates. Today highlight disappears. "Today" button appears.
- [ ] Click "Today": window snaps back to today as column 0.
- [ ] Click `←` 13 times (90 / 7 ≈ 13): on the 13th click, the `←` button becomes disabled (hit the −90 day bound).
- [ ] Use `mcp__home-assistant__ha_config_set_calendar_event` to create an all-day event spanning 10 days that crosses the visible window. Refresh the card — confirm chevrons appear on the clipped edges.
- [ ] `mcp__browsermcp__browser_get_console_logs` — no ResizeObserver loop warnings, no fetch errors.
- [ ] Take a final screenshot of the rolling-window view for the PR description.

## Technical Details

### Event uid tagging (preserved from the deleted `_fetchEvents`)

The pre-Phase-2 card tagged every event's `uid` with its source entity ID (`${entityId}::${event.uid ?? ''}`) before storing it in `_rawEvents` — see the deleted block at `lucarne-calendar-card.ts:247-253`. Downstream code depends on this format:

- `calendar-grid.ts:197-204` splits `event.uid` on `'::'` to look up the calendar color. Without the prefix, every event falls back to the default `#a8d8b9` green.
- The optimistic-create flow's visibility filter at `lucarne-calendar-card.ts:268-271` reads `e.uid?.split('::')[0]` to decide whether a pending event is currently visible.

When the controller takes over fetching in Phase 2, it MUST reproduce this tagging at the tail of `_fetchRange` (before storing into `_cachedEvents`). The card's `_recompute()` reads `controller.cachedEvents` and expects already-tagged events — no re-tagging happens downstream.

### `PerDayLayout` extension for chevrons

```typescript
export interface PerDayLayout {
  allDay: CalendarEvent[];
  allDayClipped?: Map<string, { left: boolean; right: boolean }>;  // NEW
  inBand: InBandBlock[];
  earlier: CalendarEvent[];
  later: CalendarEvent[];
}
```

`allDayClipped` is populated only for events whose `[start, end)` extends past `days[0]` (left chevron) or `days[days.length - 1] + 1d` (right chevron). The key is the event's `uid`.

### Re-layout discipline (controller `onChange` contract)

`@state() private _layout` is only rebuilt when `_recompute()` runs. `_recompute()` reads `controller.days` and `controller.cachedEvents` and calls `layoutEvents(...)`. The host's `requestUpdate()` triggers a re-render but does NOT re-run `_recompute` — Lit's `render()` just consumes `this._layout` as-is.

Therefore any controller state change that affects `controller.days` (pan, setVisibleCount, midnight re-anchor) must call `opts.onChange?.()`, and the card must wire `onChange: () => this._recompute()`. Otherwise:

- Pan in-buffer → `dayOffset` updates → host re-renders → grid receives the same stale `_layout` → day labels don't move. Bug.
- ResizeObserver shrinks visibleCount 5 → 3 → buffer covers it, no fetch → grid still shows 5 columns. Bug.
- Midnight tick while panned away → controller updates internal "today" → user sees yesterday's date in the today highlight after they navigate back. Bug.

Add a test in `tests/shared/rolling-window.test.ts`: construct the controller with `onChange: spy`; call `pan(+2)` with a `dayOffset` that stays inside the cache; assert the spy was called exactly once. Repeat for `setVisibleCount(3)` from 5 (in-buffer shrink) and for `tick()` with midnight crossed at `dayOffset === 0`.

### ResizeObserver loop guard

```typescript
// Private fields the snippet relies on (declare on the card class):
//   @query('.grid-area') private _gridAreaEl?: HTMLElement;
//   private _resizeFrame?: number;
//   // Initialize to the controller's starting visibleCount (minDays floor) so
//   // arrow-button handlers in Sub-Phase C don't pan by 0 if the user clicks
//   // before ResizeObserver first fires. Set in setConfig right after the
//   // controller is instantiated: this._lastVisibleCount = this._effectiveConfig().minDays;
//   private _lastVisibleCount = 3;
//   @state() private _dayWidthPx = 0;   // reactive: passed to <lucarne-calendar-grid>

private _effectiveConfig(): VisibleWindowConfig {
  const cfg = this._config!;
  return {
    minDays:       cfg.min_days       && cfg.min_days       > 0 ? cfg.min_days       : 3,
    maxDays:       cfg.max_days       && cfg.max_days       > 0 ? cfg.max_days       : 7,
    minColWidth:   cfg.min_col_width  && cfg.min_col_width  > 0 ? cfg.min_col_width  : 140,
    maxColWidth:   cfg.max_col_width  && cfg.max_col_width  > 0 ? cfg.max_col_width  : 220,
    timeColWidth:  40,
  };
}

private _onResize() {
  if (this._resizeFrame !== undefined) return;
  this._resizeFrame = requestAnimationFrame(() => {
    this._resizeFrame = undefined;
    const w = this._gridAreaEl?.getBoundingClientRect().width ?? 0;
    const { visibleCount, dayWidthPx } = computeVisibleDays(w, this._effectiveConfig());
    if (visibleCount !== this._lastVisibleCount) {
      this._lastVisibleCount = visibleCount;
      this._rolling.setVisibleCount(visibleCount);
      this.style.setProperty('--lucarne-day-count', String(visibleCount));
    }
    this._dayWidthPx = dayWidthPx;
  });
}
```

Without the `requestAnimationFrame` guard and the `visibleCount` change check, modifying the CSS custom property inside the observer callback triggers another resize → loop.

`_gridAreaEl` resolves to the existing `<div class="grid-area">` wrapper at `src/cards/lucarne-calendar-card.ts:373` — use Lit's `@query('.grid-area')` decorator (imported from `lit/decorators.js`) rather than `querySelector`, so the reference updates correctly across re-renders. The ResizeObserver is created in `firstUpdated` (NOT `connectedCallback` — the shadow root has not rendered yet at `connectedCallback` time, so `@query('.grid-area')` returns `undefined` and `observe(undefined!)` is a silent no-op), guarded against double-creation, and disconnected in `disconnectedCallback`. Also call `this._onResize()` once at the end of `firstUpdated` to seed `_lastVisibleCount` / `_dayWidthPx` from the initial container width.

### Header label formatting

```typescript
private _rangeLabel(): string {
  const days = this._rolling.days;
  if (days.length === 0) return '';
  const start = days[0];
  const end = days[days.length - 1];
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const sameYear = start.getFullYear() === end.getFullYear();
  const mdy = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-US', opts);
  if (sameMonth) {
    return `${mdy(start, { month: 'short', day: 'numeric' })} – ${mdy(end, { day: 'numeric' })}`;
  }
  if (sameYear) {
    return `${mdy(start, { month: 'short', day: 'numeric' })} – ${mdy(end, { month: 'short', day: 'numeric' })}`;
  }
  return `${mdy(start, { month: 'short', day: 'numeric', year: 'numeric' })} – ${mdy(end, { month: 'short', day: 'numeric', year: 'numeric' })}`;
}
```

The existing convention in this project (e.g. `date-helpers.ts:115`, `lucarne-calendar-card.ts:340`, and the agenda strip) is to pass `'en-US'` explicitly to `toLocaleDateString`. Match that here for consistency — the headline date range should look the same regardless of HA frontend locale. If you later want to honor the HA locale, do it project-wide as a separate change, not silently in this header.

### Controller fetch sequence

```
setConfig → instantiate controller
  ↓
hostConnected (Lit calls this) → initial fetch for [today − vc, today + 2vc)
  ↓
ResizeObserver fires → setVisibleCount(n)
  ↓ if range changed → fetch for new range, bump sequence
  ↓ if not → no-op
  ↓
User clicks → / ← / Today → pan / goToToday → fetch if needed → bump sequence
  ↓
5-min poll → fetch full current range → bump sequence
  ↓
60-s tick → if midnight crossed AND dayOffset === 0 → re-anchor → fetch
```

## Constraints

- **No regression in Phase 1 behavior.** The card must continue to render events correctly, with the same visual style.
- **No new dependencies.** `package.json` should not change.
- **ResizeObserver is mandatory.** Do not use `window.matchMedia` or `@media` queries — they react to viewport, not to the card's container, which can be a sidebar or panel.
- **Defensive defaults.** Any of `min_days`, `max_days`, `min_col_width`, `max_col_width` that is missing, zero, negative, or non-numeric → fall back to the default. Never throw from `setConfig` for these (the calendar card has stricter validation only for required fields).
- **Tick interval is 60s.** Don't use `setTimeout(..., msUntilMidnight)` — clock drift, sleep/wake, and DST can produce off-by-one days. A 60s poll catches all transitions within a minute.
- **Pan bound is ±90 days, configurable in the controller constructor but not exposed in editor.** If experimentation reveals the need to change it, change it in code, not config.
- **Performance: smooth on iPad 9.** No layout thrash in `_onResize`. No N² loops over cached events when re-rendering. Keep the rendered-event count bounded by visible-day count × events-per-day.
