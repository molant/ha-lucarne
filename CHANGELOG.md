# Changelog

## [Unreleased]

### Added

- `lucarne-calendar-card` — horizontal touch swipe with snap-to-day, flick-velocity bias, and iOS-like 240 ms snap-back easing. Uses Pointer Events for unified mouse/pen/finger support.
- `lucarne-calendar-card` — skeleton-column placeholder for uncached days: a shimmer animation appears while events are loading, replaced by real events once the fetch completes. Shimmer degrades to a static placeholder under `prefers-reduced-motion: reduce`.
- `lucarne-calendar-card` — editor options `min_days`, `max_days`, `min_col_width`, `max_col_width` for the responsive visible-day-count algorithm.

### Changed

- `lucarne-calendar-card` — now uses a rolling N-day window anchored on today (replaces fixed Monday-anchored week). Column count adapts to container width. Navigation arrows step by `visibleCount` days; a "Today" button re-anchors when panned away.
- `lucarne-calendar-card` — layout engine refactored to accept arbitrary day arrays (foundation for rolling-window).

### Deprecated

- `lucarne-calendar-card` — `week_starts_on` config option is silently ignored — the rolling window has no week start. The field is still accepted in YAML so old configs load without errors.

## v0.1.0 — Initial release

Three custom Lovelace cards, an Apple Reminders sync bridge, and three automation blueprints — all
packaged as a HACS custom-repository plugin.

**Cards**
- `lucarne-today-card` — 7-day agenda strip, today's weather + tomorrow's forecast, task-count
  badge, presence pills; visual editor included
- `lucarne-calendar-card` — week-view grid with per-person color coding, visibility toggle pills,
  event-detail popover, create-event flow; visual editor included
- `lucarne-chores-card` — per-kid chore columns backed by `input_boolean` helpers, streak counter
  via `counter.*` helpers, celebration animation, `ha_lucarne_chores_all_done` custom event;
  visual editor included

**Bridge**
- Mac mini Shortcuts.app + launchd bridge syncs Apple Reminders to HA `local_todo` entities
  every 5 minutes, with deduplication by Apple Reminder UID

**Blueprints**
- `lucarne_reminders_sync` — webhook receiver; upserts Apple Reminders payload into HA `local_todo`
  entities, deduplicated by Apple Reminder UID; configured with `list_mappings` JSON input
- `lucarne_chores_daily_reset` — midnight reset of all chore `input_boolean` entities
- `lucarne_chores_streak_advance` — nightly streak check at 21:00; increments or resets
  `counter.*` helpers

**Events**
- `ha_lucarne_chores_all_done` — fired when a kid completes all their chores; carries `kid_slug`,
  `kid_name`, `date`, `chores_completed`, `streak` — locked API in v1

**Design**
- CSS design-token layer (`clamp()`-based typography, spacing, palette custom properties)
- Responsive at 700 / 1080 / 1366 / 1440 px breakpoints
- iPad 9 landscape (1080×810 CSS px) primary target; tested in kiosk mode

## v0.0.1 — Project scaffolded

Initial repo scaffold with Lit + Vite + TypeScript and a placeholder `lucarne-today-card` element.
