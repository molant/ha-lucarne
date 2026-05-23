# Changelog

## [Unreleased]

### Changed

- `lucarne-calendar-card` — layout engine refactored to accept arbitrary day arrays (no user-visible change in v0.1; foundation for rolling-window in v0.2).

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
