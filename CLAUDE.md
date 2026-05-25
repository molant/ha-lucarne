# CLAUDE.md — ha-lucarne

Working guide for AI sessions. Covers what you'd get wrong without it.

## Project overview

Dual-distribution HACS repo:

- **Frontend** (`dist/ha-lucarne.js`) — three Lit-based Lovelace cards: `lucarne-today-card`, `lucarne-calendar-card`, `lucarne-chores-card`. Single ESM bundle; no code splitting.
- **Integration** (`custom_components/lucarne_family/`) — Python HA integration that owns family members, managed entities (`todo.<slug>`, `counter.<slug>_streak`), SQLite task/completion storage, and in-process time-change listeners for daily reset and streak check.

Two test runners, two deploy targets.

## Layout

```
src/                          TypeScript sources (Lit cards + components)
  cards/                      lucarne-today-card.ts, lucarne-calendar-card.ts, lucarne-chores-card.ts
  components/                 Lit sub-components (member-column, task-row, family-ready-pill, avatar-upload-modal, ...)
  editors/                    Visual editor elements for each card
  shared/                     types, design-tokens, ha-subscriptions, recurrence, family-subscription, ...
custom_components/
  lucarne_family/             Python integration
    manifest.json             HACS integration metadata
    config_flow.py            Config + Options flow (family name → add/edit/remove members)
    store.py                  SQLite access layer (task_metadata, completion_log tables)
    entity_manager.py         Creates/renames/deletes todo + counter entities
    rename.py                 Slug-changing rename: entity rename + SQLite migration + rollback
    task_service.py           Implements lucarne_family.* HA services
    recurrence.py             RRULE engine (dateutil.rrule wrapper; use it, never hand-roll)
    completion_listener.py    State-change listener → logs completions + fires events
    automation_writer.py      Registers async_track_time_change listeners (daily reset + streak check)
    reset_logic.py            Performs the daily routine reset (flips routine items → needs_action)
    streak_logic.py           Recomputes per-member streaks from completion_log
    avatar_service.py         Avatar upload: validates, writes to /local/lucarne/avatars/, fires event
    member_service.py         set_member_avatar service: emoji or path avatar, fires member_updated
    websocket_api.py          WS handler for lucarne_family/get_family command
    apple_sentinel_backfill.py Extracts [apple:UUID] from item descriptions → source=apple metadata
    presets.py                Routine preset definitions (school-age kid, toddler, adult)
    models.py, const.py       Dataclasses and constants
blueprints/automation/
  lucarne_reminders_sync.yaml Only remaining blueprint (webhook receiver for Reminders bridge)
bridge/                       Mac mini launchd bridge setup instructions
docs/                         Architecture, integration, services, events docs
tests/                        Node test suites (components + shared), pytest suites (Python)
  setup/ha-mock.mjs           Shared HA stub for Lit component tests
scripts/
  deploy.sh                   rsync dist/ to ha-vm
  deploy-integration.sh       rsync custom_components/lucarne_family/ to ha-vm
```

## Build & test

### TypeScript (cards)

```bash
npm run build         # Vite build → dist/ha-lucarne.js (single ESM)
npm test              # node:test runner (NOT vitest — see pitfalls)
npm run typecheck     # tsc --noEmit
npm run lint          # eslint src
```

### Python (integration)

```bash
# From repo root (pyproject.toml is here)
ruff check custom_components/lucarne_family/
mypy custom_components/lucarne_family/
pytest tests/python/
```

pytest requires `pytest-homeassistant-custom-component`. Install dev deps:
```bash
pip install -e ".[dev]"
```

### Both (baseline gate before any commit)

```bash
npm test && npm run lint && npm run typecheck && npm run build
pytest tests/python/
```

## Deploy

Both scripts bypass HACS for fast iteration. HACS is the install path for end users only.

```bash
# Cards (hot-reload via cache-busted URL — no HA restart needed)
# Requires: HA_SSH_HOST, HA_REMOTE_PATH (must end in /www/lucarne)
./scripts/deploy.sh

# Integration (requires HA restart after deploy)
# Requires: HA_SSH_HOST, HA_INTEGRATION_PATH (must end in /custom_components/lucarne_family)
./scripts/deploy-integration.sh
```

Set env vars in `.env` at the project root (see `.env.example`). After deploying the integration,
restart HA (`ha core restart` or Settings → System → Restart).

## Test runner conventions

- **TypeScript**: `node:test` (Node's built-in). Import: `import { describe, it, afterEach } from 'node:test'`. **Not vitest** — `import { describe } from 'vitest'` will fail silently.
- **Run a single TS test file**: `TZ=America/Los_Angeles node --import tsx --import ./tests/setup/dom-globals.mjs --test tests/path/file.test.ts`. The `TZ`, `tsx` loader, and `dom-globals.mjs` are load-bearing; bare `node --test` will fail.
- **Python**: `pytest` with `pytest-homeassistant-custom-component`. Fixtures: `hass`, `enable_custom_integrations`. Tests live in `tests/python/`.

## HACS distribution

| Surface | Category | Source |
|---------|----------|--------|
| Frontend (cards) | `plugin` | `dist/ha-lucarne.js` (declared in `hacs.json`) |
| Integration | `integration` | `custom_components/lucarne_family/` |

Both surfaces ship from the same GitHub repo via HACS custom-repository registration (once as Dashboard, once as Integration).

## Common pitfalls

- **`node:test` not vitest**: Writing vitest imports silently prevents tests from running.
- **No HA automation entities from this integration**: `automation_writer.py` registers in-process `async_track_time_change` listeners — it does **not** create `automation.*` HA entities. There are no `automation.lucarne_*` entities in the UI. To change reset/streak times, use the integration's Options flow (`CONF_RESET_TIME`, `CONF_STREAK_CHECK_TIME`), not the Automations UI.
- **No blocking I/O in async HA code**: Use `hass.async_add_executor_job(...)` for blocking calls (heavy SQLite migrations, file I/O). Never block the event loop.
- **Entity rename has downstream impact**: Slug-changing renames go through `rename.py` which shows an impact preview before proceeding; never rename entities outside that flow.
- **Integration uses `lucarne_family.*` services and `lucarne_family_*` events**: The older `ha_lucarne_chores_all_done` event is a deprecated compat shim still fired by `completion_listener.py` in v0.x alongside `lucarne_family_all_routines_done`. Migrate consumers to the new event; see `docs/events.md`.
- **RRULE math**: Use `dateutil.rrule` via `recurrence.py` (Python) and `parseRRule`/`isRoutineDueToday` from `src/shared/recurrence.ts` (JS). Never hand-roll date arithmetic.
- **Avatar writes**: Only permitted write path under `<config>/www/` is `/local/lucarne/avatars/`. `avatar_service.py` enforces this; tests must cover path-traversal cases.
- **SQLite file in `<config>/` root**: Name pattern: `lucarne_family_<entry_id>.db`. Never hardcode the entry ID.
- **Avatar center-square crop is deferred**: The upload modal accepts any aspect ratio; `avatar_service.py` stores raw uploaded bytes. A future spec should add `PIL ImageOps.fit` centering in `_write_avatar`. Do not add it without a spec.
- **Round-trip event vs POST**: `completion_listener.py` fires `lucarne_family_apple_writeback_requested` when `round_trip.enabled == true` but does **not** POST to the webhook. The POST is deferred to a future spec. Future subscribers **must** call `get_round_trip_config(hass)` from `__init__.py` — never read `entry.data["round_trip"]` directly, to survive storage layout changes.
- **`set_member_avatar` emoji validation**: Uses explicit Unicode block ranges (U+1F000–U+1FAFF, U+2300–U+27FF, U+2B00–U+2BFF, U+1F1E0–U+1F1FF). Requires at least one base-emoji codepoint; allows ZWJ-joined compound emoji (e.g., family/profession glyphs); rejects ASCII text, invisible-only strings, and unjoined back-to-back emoji.

## Don'ts

- **Don't** write HA automations for the time-based triggers — the integration's listeners own these.
- **Don't** hand-roll RRULE date math — use `recurrence.py` (Python) or `recurrence.ts` (JS).
- **Don't** write files to `<config>/www/` outside `/local/lucarne/avatars/`.
- **Don't** add `contributing.md`, `code_of_conduct.md`, or other meta docs unless asked.
- **Don't** generate vitest imports in test files.
- **Don't** split the ESM bundle or add a second HACS manifest.
- **Don't** implement the round-trip webhook POST without a spec — only the HA event is fired in v0.2.
- **Don't** add server-side center-square crop to `avatar_service.py` without a spec — the deferred design is documented in CLAUDE.md and the phase-6 spec.

## Pointers

- Feature spec and phase files: `features/chores-card/README.md` + `features/chores-card/phase-*.md`
- Architecture overview: `docs/architecture.md`
- Integration user guide: `docs/integration.md`
- Service reference: `docs/services.md`
- Event reference: `docs/events.md`
- Reminders bridge setup: `bridge/README.md`
