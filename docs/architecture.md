# Architecture

## Data flow

```
Apple Reminders
      │
      │  Shortcuts.app (ha-lucarne-sync)
      │  every 300 s via launchd
      ▼
    MacOS ──── POST /api/webhook/<secret> ────► Home Assistant
                                                     │
                                              lucarne_reminders_sync
                                              automation (blueprint)
                                                     │ upsert by Apple UID
                                                     ▼
                                            local_todo entities
                                        (todo.<slug>, todo.lucarne_household)
                                                     │ state_changed
                                                     ▼
                                          lucarne_family completion_listener
                                          ┌─────────────────────────────┐
                                          │  snapshot diff (uid→status) │
                                          │  ┌──────────────────────┐   │
                                          │  │ new item appeared?   │   │
                                          │  │ → apple_sentinel_    │   │
                                          │  │   backfill           │   │
                                          │  │   ([apple:UUID] →    │   │
                                          │  │   source=apple meta) │   │
                                          │  └──────────────────────┘   │
                                          │  status transition →        │
                                          │    completion_log row       │
                                          │    (completed/undone/reset) │
                                          │  all routines done? →       │
                                          │    lucarne_family_all_      │
                                          │    routines_done event      │
                                          │    + ha_lucarne_chores_all_ │
                                          │      done (legacy compat)   │
                                          └─────────────────────────────┘
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

lucarne_family integration (time-change listeners)
  ├── reset_time  → perform_daily_reset  → flip type=routine items → needs_action
  └── streak_check_time → evaluate_all_streaks → recompute streak → counter.<slug>_streak
```

## Card subscription model

Each card manages its own HA subscriptions independently.

**lucarne-today-card**
- `fetchCalendarEvents` REST `GET /api/calendars/<entity_id>?start=...&end=...` (via `hass.callApi`) on connect + 5-minute poll (all configured `calendar.*` entities, 7-day window). Returns `{ events: Map<entity_id, CalendarEvent[]>, failed: Set<entity_id> }`. REST is used (not the `calendar.get_events` service-call) so events include `uid`, which is required for the `calendar/event/delete` WS command used by the Delete affordance.
- `weather.get_forecasts` service call (daily type) on connect + on weather entity state change
- `subscribeTodoItems` — `subscribe_trigger` on entity state change + `todo.get_items` re-poll for live task-count badge. Only subscribed when `tasks:` is set and `household_tasks_from_integration` is false.
- `subscribeFamilyState` — subscribed whenever any task surface is enabled (`tasks:`, `household_tasks_from_integration`, or `show_family_ready_pill`). Reuses the same WebSocket subscription as the chores card (`lucarne_family/get_family`). The pill reads `tasksByMember` for each member's routines; the household tasks pane reads `tasksByMember.get('household')`. Raw `tasks:` mode pulls `taskMetadataByUid` from the same state to enrich raw items with the integration's icon + member ownership (so the Today summary mirrors the chores card visually). If the integration is missing, raw rows still render — just without enrichment — and `get_family` failures log at `debug` level since this is an expected fallback.
- **Integration-mode guard**: both the family-ready pill and household task pane are suppressed when `familyState.integrationError !== null` (integration missing or failed) to avoid rendering a misleading empty state.
- **Agenda windowing is render-side**: the fetch stays a 7-day window (above), but `lucarne-agenda-strip` filters to events still ongoing AND starting before the end of the agenda window — today only (`windowDays=1`), or today+tomorrow when `agenda_show_tomorrow` is set (`windowDays=2`). The window boundary is computed in local time so date-only all-day events align with the viewer's day. A long list scrolls within the section rather than using a fixed count.
- **Task ordering / window**: `lucarne-tasks-summary` sorts active tasks by urgency (overdue → due today → due ≤3 days → no due date → due >3 days) and renders up to `max_tasks` (default 5); tasks beyond the limit are not shown (backlog is intentionally hidden, not scrollable). With `refill_tasks_on_complete` false (default), a completed task's slot is burned and not refilled from the backlog — tracked in a session `_burned` set keyed on admitted uids that left the active set, so the burn survives even if the todo provider drops completed items; un-burned only if the uid returns to active. With it true, the window is the first `max_tasks` active by priority (rolling).

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

### User action data flow

```
User taps "complete" on chores card
          │
          │  todo.update_item (HA service)
          ▼
  todo.<slug> entity (local_todo)
          │ state_changed
          ▼
  completion_listener.py
    ├── snapshot diff detects completed transition
    ├── appends completion_log row (action="completed")
    ├── fires lucarne_family_task_completed {member, uid, summary}
    ├── all routines done?
    │     yes → fires lucarne_family_all_routines_done
    │           + ha_lucarne_chores_all_done (compat shim)
    └── (fires nothing extra if already seen this transition)
          │
          │  WebSocket state push (todo entity state changed)
          ▼
  subscribeFamilyState (card)
    ├── todoItemsByEntity updated
    ├── tasksByMember rebuilt
    └── callback → card re-renders
```

**lucarne-chores-card**
- Subscribes to `subscribeFamilyState` (`src/shared/family-subscription.ts`) on first `hass` set; unsubscribes in `disconnectedCallback`
- `subscribeFamilyState` calls `lucarne_family/get_family` (WebSocket) to fetch member list + task metadata, then subscribes to each member's `todo.<slug>` via `subscribeTodoItems` and to `counter.<slug>_streak` via `subscribeEntityState`
- Refreshes task metadata on any `lucarne_family_task_*` or `lucarne_family_all_routines_done` event (debounced ≤ 1/sec)
- Mutations go through `todo.update_item` (HA service) and `lucarne_family.*` services (integration)

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

## Custom integration (lucarne_family)

This repo ships a single **Integration** (`custom_components/lucarne_family/`) that also bundles the **Frontend** (Lovelace card pack, `custom_components/lucarne_family/frontend/ha-lucarne.js`). The integration owns family members, task metadata, managed entities (`todo.<slug>`, `counter.<slug>_streak`), and managed automations — and on setup it serves the card bundle and registers it with the frontend so the cards load with no separate install.

### Data flow — entity-manager + task-service (Phase 2)

```
Options flow (add/edit/remove member)
          │
          │  async_create_member_entities
          │  async_delete_member_entities
          │  async_rename_member_entities
          ▼
   entity_manager.py ───────────────────────────────────────►  HA Entity Registry
          │                                                       todo.<slug>
          │  local_todo config-flow init                          counter.<slug>_streak
          │  counter StorageCollection API
          │
          │  async_setup_entry (on reload)
          │  _async_reconcile_member_entities
          ▼
   Both entities missing → recreate
   Partial state (one missing) → warn, skip (Phase 3 adds per-side recovery)
   Orphaned local_todo entity → warn

Service calls (Developer Tools / automations / cards)
          │
          │  lucarne_family.add_task
          │  lucarne_family.update_task_metadata
          │  lucarne_family.delete_task
          │  lucarne_family.toggle_task
          ▼
   task_service.py ─── calls entity (async_create_todo_item / update / remove)
          │                          todo.<slug> or todo.lucarne_household
          │
          └──► store.py (SQLite) ── task_metadata table
                                    completion_log table

   lucarne_family.upload_avatar
          │
          ▼
   avatar_service.py ─── validates (magic bytes, size, dimensions)
          │               writes <config>/www/lucarne/avatars/<slug>.<ext>
          └──► store.py  updates member.avatar path

WebSocket (chores card Phase 4)
          │
          │  lucarne_family/get_family
          ▼
   websocket_api.py ─── reads store.get_members() + store.async_get_all_task_metadata()
                         returns {members, task_metadata, reset_time, streak_check_time,
                                  household_entity_id}
```

### Config flow shape

The integration uses a single config entry per family. The config flow runs once at install (collects `family_name`). Ongoing edits go through the Options flow ("Configure" button in Settings → Devices & Services).

The config entry `data` dict has this shape (Phase 2):
```json
{
  "family_name": "Family",
  "members": [
    {
      "slug": "anna",
      "name": "Anna",
      "color": "#f5c89c",
      "avatar": "/local/lucarne/avatars/anna.png",
      "created_at": "2026-05-24T12:00:00+00:00",
      "preset": "school-age",
      "todo_entity_id": "todo.anna",
      "streak_counter_id": "counter.anna_streak"
    }
  ],
  "reset_time": "04:00",
  "streak_check_time": "21:00",
  "round_trip": { "enabled": false, "webhook_url": "", "secret": "", "device_name": "Sync device" },
  "custom_presets": []
}
```

### Storage split

| What | Where | Why |
|------|-------|-----|
| Members | `config_entry.data["members"]` | Bounded (~5), visible in HA backups, easily debuggable via `.storage/core.config_entries` |
| Task metadata | SQLite (`lucarne_family_<entry_id>.db`, table `task_metadata`) | Unbounded — could be thousands; SQLite handles this cleanly |
| Completion history | SQLite (`completion_log` table) | Append-only audit log; foundation for streak computation and future rewards |
| Avatar files | `<config>/www/lucarne/avatars/` | Binary files stay off the database; path reference in member data |

### Members are first-class

Each member has: `slug` (stable ID, used in entity IDs), `name` (display, freely editable), `color` (hex), `avatar` (emoji or `/local/...` path), `preset` (routine template set), `todo_entity_id`, `streak_counter_id`. Members are stored in `config_entry.data` so HA's Configure dialog can render and edit them.

**Entity lifecycle** (Phase 2+): when a member is added, `entity_manager.py` creates `todo.<slug>` via the `local_todo` config flow and `counter.<slug>_streak` via the counter storage collection API. Both entity IDs are normalized to the canonical slug form after creation. On remove, both are deleted through their respective APIs. On rename (slug-changing), both are renamed with rollback logic.

**Reconciliation**: `async_setup_entry` calls `_async_reconcile_member_entities` on every load. If both entities for a member are missing, they are recreated. If only one is missing (partial state), a warning is logged — per-side recovery is deferred to Phase 3.

### SQLite schema versioning

`schema_version` table tracks the applied DDL version. Phase 1 initialises version 1. Future phases add migration logic in `store.async_migrate`.

See [features/chores-card/README.md](../features/chores-card/README.md) for the full design and phase roadmap.

## Blueprints

One automation blueprint ships under `blueprints/automation/`:

- **lucarne_reminders_sync** — webhook receiver, diffs by Apple UID, upserts into `local_todo`

Daily routine reset and streak checks are now managed by the `lucarne_family` integration via
in-process time-change listeners (configured via the integration's Options Flow). The former
`lucarne_chores_daily_reset` and `lucarne_chores_streak_advance` blueprints have been retired.

## Build

Vite bundles `src/index.ts` (which imports all three card entry points) into
`custom_components/lucarne_family/frontend/ha-lucarne.js`. The bundle is a single ES module with no
external runtime dependencies (Lit is bundled in) and is committed to the repo. HACS installs the
integration directory at the tagged GitHub release, so the bundle ships with it; the integration's
`async_setup` serves it at `/lucarne_family_frontend/ha-lucarne.js` and registers it via
`add_extra_js_url`, so no separate HACS plugin or Lovelace resource is needed.

## Breakpoints

| Width | Context | Behavior |
|-------|---------|----------|
| ≤ 700 px | iPad 9 portrait | Single-column stacking; calendar grid collapses |
| 1080 px | iPad 9 landscape | **Primary target** — all three cards tuned here |
| 1366 px | iPad Pro 12.9" landscape | Wider grid columns; font scales up via `clamp()` |
| 1440 px | Large external display | Similar to 1366; clamp values plateau |

Typography uses `clamp(min, preferred, max)` so no media queries are needed for font size.
Grid layout uses `auto-fit minmax()` for chores columns (200 px min per column).
