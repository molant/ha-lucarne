# Lucarne Family — Integration Guide

## Install

1. Copy (or deploy via `scripts/deploy-integration.sh`) the `custom_components/lucarne_family/` directory to your HA `config/custom_components/` folder.
2. Restart Home Assistant.
3. Go to **Settings → Devices & Services → Add Integration** and search for **Lucarne Family**.
4. Enter your family name (e.g. "The Smiths") and click Submit. The integration is installed.

Only one Lucarne Family integration can be installed per HA instance.

## First run

After install, the integration:
- Creates a config entry with an empty members list.
- Initialises the SQLite database (`lucarne_family_<entry_id>.db` in your config directory) with the task and completion-log schema.
- Registers options-flow listeners for future edits.

No entities, helpers, or automations are created in Phase 1. Those appear starting Phase 2.

## Member management

Open **Settings → Devices & Services → Lucarne Family → Configure** to manage members.

### Add a member

1. Choose **Manage members → Add member**.
2. Fill in:
   - **Name** — displayed in cards (e.g. "Anna"). Must be non-empty and ≤ 50 characters.
   - **Color** — hex color (e.g. `#f5c89c`). Used for visual identification in cards.
   - **Avatar** — emoji (e.g. `🧒`) or a path under `/local/lucarne/avatars/` (Phase 6 adds upload UI).
   - **Routine preset** — choose a starting set of daily routines:
     - **School-age kid** — brush teeth, make bed, pack school bag (weekdays), kindness act, screen time off
     - **Toddler** — brush teeth, get dressed, put toys away
     - **Adult (none)** — empty; adults typically only need household chores
3. Click Submit. The member is saved. A stable **slug** is derived from the name (e.g. "Anna" → `anna`).

### Edit a member

1. Choose **Manage members → Edit member**.
2. Select the member to edit.
3. Update name, color, avatar, or preset.
4. Click Submit.

**Name-change and slug behavior**: If the new name produces the same slug as the old name (e.g. "Anna" → "ANNA"), only the display name changes — no entity rename occurs. If the slug would change (e.g. "Anna" → "Ana"), the flow shows an impact preview listing automations, scripts, scenes, and dashboards that reference the old entity IDs. You must check "I understand" before proceeding.

On confirm: the todo and streak-counter entity IDs are renamed, all SQLite rows (`task_metadata`, `completion_log`) are migrated to the new slug, and the config entry is updated. If entity rename fails, all SQLite changes are rolled back so member data stays consistent.

### Remove a member

1. Choose **Manage members → Remove member**.
2. Select the member.
3. Type the member's exact name to confirm. This is destructive and cannot be undone.

Removing a member deletes the `todo.<slug>` config entry (which removes the todo entity and its stored items) and the `counter.<slug>_streak` helper. The member entry is dropped from the config entry.

SQLite `task_metadata` and `completion_log` rows keyed to the removed member's slug are left in place — no member-level cleanup is performed.

> **Known limitation**: if you re-add a member with the same name (same slug), their orphaned task metadata resurfaces. The new todo list will be empty, but the WebSocket API will report the old task metadata, and preset seeding will be skipped if historical `source="template"` rows exist. A clean re-add flow (with explicit old-data cleanup) is deferred to a future phase.

## Task management

### Managed entities

When a member is added, the integration creates two managed helpers:

| Entity | Pattern | Purpose |
|--------|---------|---------|
| Todo list | `todo.<slug>` | Holds the member's tasks (routines and chores) |
| Counter | `counter.<slug>_streak` | Mirror of the computed streak for use in automations (Phase 3 writes the value; Phase 2 only creates/renames/deletes the helper) |

A shared household todo list (`todo.lucarne_household`) is created once at integration setup and is not tied to any specific member.

### Task types

| Type | Description |
|------|-------------|
| `routine` | Recurring task tied to an RRULE schedule (e.g. "brush teeth daily") |
| `chore` | One-off or non-scheduled task (e.g. "clean bathroom") |

### Recurrence rules

Routines use a strict subset of iCalendar RRULE syntax. Only these six modes are accepted:

| Mode | RRULE template | Example |
|------|---------------|---------|
| One-off | empty string | `""` |
| Daily | `FREQ=DAILY[;INTERVAL=N]` | `FREQ=DAILY` |
| Weekly | `FREQ=WEEKLY;BYDAY=<MO,TU,...>[;INTERVAL=N]` | `FREQ=WEEKLY;BYDAY=MO,WE,FR` |
| Monthly by date | `FREQ=MONTHLY;BYMONTHDAY=<1-31>[;INTERVAL=N]` | `FREQ=MONTHLY;BYMONTHDAY=15;INTERVAL=6` |
| Monthly by Nth weekday | `FREQ=MONTHLY;BYDAY=<+/-N><DAY>[;INTERVAL=N]` | `FREQ=MONTHLY;BYDAY=1SA` |
| Yearly | `FREQ=YEARLY;BYMONTH=<1-12>;BYMONTHDAY=<1-31>[;INTERVAL=N]` | `FREQ=YEARLY;BYMONTH=3;BYMONTHDAY=15` |

Any RRULE outside this set is rejected at schema validation time (before the handler runs).

### Preset seeding

When a new member is added with a non-empty preset, the integration seeds their todo list with the preset's routine templates exactly once. A reload of the integration does not re-seed (the idempotency guard checks for existing `source="template"` metadata rows).

### Streak computation

The streak is computed by walking backward from today:
- Days where no routines are scheduled are skipped.
- Days where all scheduled routines are marked completed increment the streak.
- The first day where any scheduled routine is missing stops the walk.
- The walk is capped at 365 days.

**Known limitation**: streak computation uses the *current* routine set for all historical days. If a routine is added or removed, historical streak values may shift. This will be addressed in a future phase by snapshotting the routine set at reset time.

### Avatar upload

Avatars are uploaded via the `lucarne_family.upload_avatar` service. The service:
- Accepts PNG, JPEG, or WebP; max 2 MB; max 16,777,216 total pixels (e.g. 4096 × 4096).
- Validates the file type via magic-byte check (independent of the declared `mime_type`).
- Writes to `<config>/www/lucarne/avatars/<slug>.<ext>` (served at `/local/lucarne/avatars/<slug>.<ext>`).
- Rejects path traversal — the filename is always derived from the member slug, never from user input.

### Rename behavior

**Display-name-only rename** (slug unchanged): only `member.name` is updated. No entity rename, no downstream impact.

**Slug-changing rename**: The options flow shows an impact preview before proceeding. Impact lists:
- YAML-based automations/scripts/scenes that reference the old entity ID.
- Lovelace dashboards (`.storage/lovelace*`) that reference the old entity ID.

> **Limitation (v1)**: UI-created automations stored in `.storage/` are not scanned. Only YAML-based resources are detected. This will be addressed in a future phase.

On confirm:
1. SQLite rows (task_metadata, completion_log) migrated to new slug atomically.
2. Todo entity renamed in entity registry (`todo.<old_slug>` → `todo.<new_slug>`).
3. Streak counter deleted and recreated under new slug (preserving current streak value in initial).
4. Config entry member data updated.

If the SQLite migration (step 1) or entity rename (step 2–3) fails, the partial changes are rolled back before returning. If the final config-entry save (step 4) fails after the entities have already been renamed, the entities remain under the new slug — the config entry will reflect the old slug until the next successful options-flow submission.

## Schedule settings and managed automations

Choose **Edit schedule** to adjust:

- **Daily reset time** (default `04:00`) — when routine tasks flip back to `needs_action`.
- **Streak check time** (default `21:00`) — when the streak counter is recomputed.

### How managed automations work

The integration registers in-process `async_track_time_change` listeners at the configured times.
There are no `automation.*` HA entities to view or edit — the behavior is driven entirely inside
the integration process.

**Daily reset** (`perform_daily_reset` service, fired at `reset_time`):

- For every member, iterates their `todo.<slug>` items.
- Items with `type=routine` that are in `completed` state are flipped back to `needs_action`.
- Idempotent: items already in `needs_action` are untouched (safe to trigger multiple times).
- The completion listener detects the resulting state changes and appends `action="reset"` rows
  to the completion log (distinct from `action="undone"` for user-initiated unchecks).

**Streak check** (`evaluate_all_streaks` service, fired at `streak_check_time`):

- For every member, recomputes the streak by walking backward through the completion log.
- Writes the result to `counter.<slug>_streak` via `counter.set_value`.
- No-routine days are skipped; all-complete days increment; any-missing day stops the walk.
- Cap: 365 days maximum walk.

**Changing the times**: open Settings → Devices & Services → Lucarne Family → Configure →
Edit schedule, enter the new times, and submit. The listeners are re-registered immediately — no
HA restart required.

## Troubleshooting

- **Integration not visible in Add Integration**: Verify `custom_components/lucarne_family/` is in the right location and `manifest.json` is present.
- **Setup errors**: Check HA logs (`Settings → System → Logs`) and filter for `lucarne_family`.
- **Deploy script**: Run `scripts/deploy-integration.sh` to scp the integration to `ha-vm`.
