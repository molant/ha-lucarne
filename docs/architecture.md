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
- `fetchCalendarEvents` WebSocket `calendar/list_events` call on connect + 5-minute poll (all configured `calendar.*` entities,
  7-day window)
- `weather.get_forecasts` service call (daily type) on connect + on weather entity state change
- `subscribeTodoItems` — `subscribe_trigger` on entity state change + `todo.get_items` re-poll for live task-count badge

**lucarne-calendar-card**
- `fetchCalendarEvents` WebSocket `calendar/list_events` call on connect + 5-minute poll for the current week window
- Re-fetches on week navigation (prev/next buttons)
- Optimistic UI: newly created events are injected into local state immediately; real data clears
  them on the next poll

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
Grid layout uses `auto-fit minmax()` for chores columns (220 px min per column).
