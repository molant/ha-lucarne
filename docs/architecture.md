# Architecture

## Data flow

```
Apple Reminders
      │
      │  Shortcuts.app (ha-lucarne-sync)
      │  every 300 s via launchd
      ▼
Mac mini ──── POST /api/webhook/<secret> ────► Home Assistant
                                                     │
                                              lucarne_reminders_sync
                                              automation (blueprint)
                                                     │ upsert by Apple UID
                                                     ▼
                                            local_todo entities
                                          (todo.ingrid_tasks, etc.)
                                                     │
                                        WebSocket subscription
                                                     ▼
                                          Wall iPad (kiosk mode)
                                        ┌──────────────────────┐
                                        │  lucarne-today-card  │
                                        │  lucarne-calendar-   │
                                        │    card              │
                                        │  lucarne-chores-card │
                                        └──────────────────────┘
```

## Card subscription model

Each card manages its own HA subscriptions independently.

**lucarne-today-card**
- `fetchCalendarEvents` WebSocket `call_service` for `calendar.get_events` with `return_response: true` on connect + 5-minute poll (all configured `calendar.*` entities,
  7-day window)
- `weather.get_forecasts` service call (daily type) on connect + on weather entity state change
- `subscribeTodoItems` — `subscribe_trigger` on entity state change + `todo.get_items` re-poll for live task-count badge

**lucarne-calendar-card**
- `RollingWindowController` (Lit ReactiveController) owns the fetch lifecycle: fetches `visible + ±visibleCount buffer` days on connect, on `setHass` first-arrival, on day-step navigation (pan), and on a 5-minute background poll
- Fetch range: `[today + dayOffset − visibleCount, today + dayOffset + 2×visibleCount)` — 3×visibleCount days total (past buffer + visible + future buffer)
- ResizeObserver on `.grid-area` computes `visibleCount` from container width using `computeVisibleDays(width, cfg)` and calls `controller.setVisibleCount(n)` on change
- Navigation: `←` / `→` arrows step by `visibleCount` days; "Today" button re-anchors to today as column 0
- Midnight rollover: 60-second tick compares stored "today" to current local date; re-anchors and re-fetches when the user is at the today anchor
- Optimistic UI: newly created events injected into local state immediately; real data clears them on the next fetch via `onFetchComplete` callback

### RollingWindowController

`RollingWindowController` (`src/shared/rolling-window.ts`) is a Lit `ReactiveController` that owns the calendar-event fetch lifecycle and maintains the sliding day window. It stores a `_dayOffset` (integer, steps of one day), an `_anchorToday` (local midnight `Date`), and a `_visibleCount`. When `pan(deltaDays)` is called, the offset is clamped to ±90 days; if the new range extends past the event cache, a fresh fetch is issued. The event cache is keyed by calendar entity ID (`Map<string, CalendarEvent[]>`); a parallel `_cachedDayKeys: Set<string>` (ISO `YYYY-MM-DD` strings) lets the grid decide per-column whether to render real events or a skeleton placeholder. `cachedRange` returns a sorted array of cached `Date` objects; `isDayCached(day)` is a single Set lookup. See [visible-days.md](visible-days.md) for the formula and state machine.

### `calendar-day-pan` wrapper

`LucarneCalendarDayPan` (`src/components/calendar-day-pan.ts`) is a thin Lit element that wraps `<lucarne-calendar-grid>` via a `<slot>` and translates Pointer Events into a `pan-snap` CustomEvent carrying a `deltaDays` count. It uses the Pointer Events API (`pointerdown / pointermove / pointerup / pointercancel`) so that mouse, pen, and touch are handled uniformly without fighting the browser's native scroll. Direction lock: the first 10 px of movement decide the axis — if vertical movement dominates, pointer capture is released immediately and the browser's native vertical scroll takes over. During a horizontal pan the slotted grid's inner `.day-cols-track` elements receive a `transform: translateX(...)`, while the time-column gutter (grid column 1, outside `.day-cols-track`) remains stationary. When the pointer is released, `snapToDay(dx, dayWidthPx, velocity)` (from `pan-math.ts`) computes the day count with a flick-velocity bias (≥500 px/s overcomes the half-column threshold), and `rubberBand(dx, 0)` provides resistance when panning into a disabled direction. The snap-back animation uses the `--lucarne-pan-easing` and `--lucarne-pan-duration` tokens; under `prefers-reduced-motion: reduce`, the transform is applied instantly.

**lucarne-chores-card**
- No subscriptions — reads `hass.states` reactively via Lit's `@property` mechanism
- HA pushes state updates over the existing WebSocket; Lovelace propagates them down as prop changes
- Fires `ha_lucarne_chores_all_done` via `hass.connection.sendMessagePromise` on `not-all-done →
  all-done` transition

## Design-token layer

All three cards import `lucarneStyles` from `src/shared/design-tokens.ts`. This block defines CSS
custom properties on `:host` for spacing, radii, font-size scale, palette, and shadow. Cards use
the properties (`var(--lucarne-spacing-lg)` etc.) and never hard-code values. Typography uses
`clamp()` to scale between breakpoints without media queries.

```
src/shared/design-tokens.ts   ← single source of truth
   └─► lucarneStyles (CSSResult)
         └─► imported by every card and component
```

See [visible-days.md](visible-days.md) for the `computeVisibleDays` formula, worked examples,
and the `RollingWindowController` state machine.

## Blueprints

Three automations ship as blueprints under `blueprints/automation/`:

- **lucarne_reminders_sync** — webhook receiver, diffs by Apple UID, upserts into `local_todo`
- **lucarne_chores_daily_reset** — midnight reset of all chore `input_boolean` entities
- **lucarne_chores_streak_advance** — 21:00 nightly check; increments `counter.*` on full
  completion, resets on any miss

## Build

Vite bundles `src/index.ts` (which imports all three card entry points) into `dist/ha-lucarne.js`.
The bundle is a single ES module with no external runtime dependencies (Lit is bundled in). HACS
reads `hacs.json` → `filename: "ha-lucarne.js"` and serves `dist/ha-lucarne.js` from the tagged
GitHub release.

## Breakpoints

| Width | Context | Behavior |
|-------|---------|----------|
| ≤ 700 px | iPad 9 portrait | Single-column stacking; calendar grid collapses |
| 1080 px | iPad 9 landscape | **Primary target** — all three cards tuned here |
| 1366 px | iPad Pro 12.9" landscape | Wider grid columns; font scales up via `clamp()` |
| 1440 px | Large external display | Similar to 1366; clamp values plateau |

Typography uses `clamp(min, preferred, max)` so no media queries are needed for font size.
Grid layout uses `auto-fit minmax()` for chores columns (200 px min per column).
