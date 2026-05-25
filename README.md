# ha-lucarne — DIY Skylight Calendar for Home Assistant

![ha-lucarne banner](docs/banner.svg)

<a href="https://github.com/hacs/integration"><img src="https://img.shields.io/badge/HACS-Custom-41BDF5.svg" alt="HACS Custom"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
<a href="https://www.home-assistant.io/"><img src="https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue.svg" alt="Home Assistant"></a>

A custom Lovelace card collection that turns a wall-mounted iPad into a Skylight-style family
dashboard: a rolling N-day calendar with per-person colors, a daily agenda + weather strip, a
family chore tracker with streaks, and an Apple Reminders sync bridge — all designed for iPad 9
landscape in kiosk mode.

> **Screenshots coming soon** — once 0.2.0 is stable on the wall iPad, the calendar / today / chores cards will get a screenshots gallery here. The banner above is a placeholder.

---

## What does the integration do?

The **Lucarne Family** integration (`custom_components/lucarne_family/`) is a Home Assistant custom
integration that owns all family configuration in one place:

- **One config, no manual helpers**: Add a family member and the integration automatically creates
  their `todo.<slug>` list, `counter.<slug>_streak` counter, and seeds their initial routine tasks.
- **Centralized family settings**: Name, color, avatar, and routine preset — all in
  **Settings → Devices & Services → Lucarne Family → Configure**, not scattered across Helpers.
- **Managed automations**: Daily routine reset (04:00 default) and streak check (21:00 default)
  run as in-process time listeners. No blueprint instances to maintain.
- **Rename with impact preview**: Renaming a member shows which automations, scripts, and dashboards
  reference the old entity IDs before committing the rename.

The three Lovelace cards are thin views over integration state. Without the integration the chores
card shows an error block; the today and calendar cards continue to work.

---

## Features

- **`lucarne-today-card`** — agenda strip (next 7 days, per-person color dots), today's weather +
  tomorrow's forecast, task-count badge, presence pills. Optional: household task pane from the
  integration (`household_tasks_from_integration: true`) and a family-ready pill showing N/M members
  done with today's routines (`show_family_ready_pill: true`).
- **`lucarne-calendar-card`** — rolling N-day window with touch swipe (auto-fits 3–7 days to
  width), per-person color coding, calendar visibility pills, event-detail popover, create-event
  flow (on calendars that support it)
- **`lucarne-chores-card`** — per-member routine + chore grid, friendly recurrence labels
  (every Monday, every 6 months, …), emoji icons, one-click add via the card, long-press edit/delete,
  streak counter, celebration animation. Requires the Lucarne Family integration.
- **Lucarne Family integration** — centralized family configuration. Add a member and the
  integration creates their todo list, streak counter, and managed automations automatically.
- **Apple Reminders bridge** — Mac mini Shortcut + launchd job syncs Reminders to HA todo entities
  every 5 minutes
- **One blueprint** — `lucarne_reminders_sync` (webhook receiver that upserts Reminders into
  `local_todo`). Daily reset and streak checks are now owned by the integration.
- **Design-token layer** — CSS custom properties for spacing, radii, typography, palette; consistent
  at all 4 breakpoints (700 / 1080 / 1366 / 1440 px)

---

## Install

### Step 1 — Add the cards via HACS (Frontend)

1. Open HA → **HACS** → **Frontend**
2. Click the three-dot menu (⋮) → **Custom repositories**
3. Paste `https://github.com/molant/ha-lucarne` and set Type to **Dashboard** (category: `plugin`)
4. Click **Add**, then search for **Lucarne** and click **Download**

### Step 2 — Add the Lovelace resource

HA → **Settings** → **Dashboards** → **⋮** → **Resources** → **Add resource**:

```
URL:  /hacsfiles/ha-lucarne/ha-lucarne.js
Type: JavaScript Module
```

### Step 3 — Install the Lucarne Family integration via HACS

1. Open HA → **HACS** → **Integrations**
2. Click **⋮** → **Custom repositories**
3. Paste the same URL `https://github.com/molant/ha-lucarne` and set Type to **Integration**
4. Click **Add**, then search for **Lucarne Family** and click **Download**
5. Restart Home Assistant

> **HACS dual-category note**: Adding the same repository URL under both Frontend and Integration
> is how HACS 2.x handles multi-category repos. If your HACS version does not support this, you
> can install the integration manually: copy `custom_components/lucarne_family/` from the repo to
> your HA config's `custom_components/` directory and restart HA.

### Step 4 — Configure the Lucarne Family integration

1. Go to **Settings → Devices & Services → Add Integration**
2. Search for **Lucarne Family** and click it
3. Enter your family name (e.g. "The Smiths") and click **Submit**
4. Open the integration's **Configure** dialog to add family members (see [Family configuration](#family-configuration) below)

### Step 5 — Add cards to your dashboard

Open your dashboard in edit mode and add the cards via YAML (see [Configuration](#configuration)).
Each card has a visual editor — click **Visual editor** after adding.

### Step 6 — (Optional) Install the Lucarne theme

A Skylight-inspired pastel theme ships at `themes/lucarne.yaml`. It pairs the cards with the calm
cream/pastel palette they were designed against and widens HA's `type: sections` views past the
default 500 px cap (via `ha-view-sections-column-max-width: 1200px`) so cards render side-by-side
at full iPad width.

1. Copy `themes/lucarne.yaml` to your HA `<config>/themes/` directory.
2. Ensure `configuration.yaml` has:
   ```yaml
   frontend:
     themes: !include_dir_merge_named themes
   ```
3. Reload themes: **Developer tools → Services → `frontend.reload_themes`**.
4. Per-user: **Profile → Theme → Lucarne**.

### Step 7 — (Optional) Set up the Mac mini Reminders bridge

Follow [bridge/README.md](bridge/README.md) to install the launchd sync job on a Mac mini.
Skip this step if you prefer to manage todo items directly in HA.

---

## Family configuration

Open **Settings → Devices & Services → Lucarne Family → Configure** to manage members.

### Add a member

1. Choose **Manage members → Add member**
2. Fill in name, color, avatar (emoji or `/local/...` image path), and routine preset:
   - **School-age kid** — brush teeth, make bed, pack school bag (weekdays), screen time off
   - **Toddler** — brush teeth, get dressed, put toys away
   - **Adult (none)** — empty
3. Click **Submit**. The integration creates `todo.<slug>`, `counter.<slug>_streak`, and seeds
   preset routines.

### Edit schedule

Choose **Edit schedule** to adjust the daily reset time (default `04:00`) and streak check time
(default `21:00`). Changes take effect immediately — no HA restart needed.

See [docs/integration.md](docs/integration.md) for the full member management, rename, and
remove workflows.

---

## Configuration

### `lucarne-today-card`

```yaml
type: custom:lucarne-today-card
title: Today            # optional, default "Today"
calendars:
  # Display names come from each calendar's friendly_name in HA — rename via
  # Settings → Devices & services → Entities. The label: field is deprecated
  # and ignored; safe to remove from existing configs.
  - entity: calendar.family
    color: "#a8d8b9"    # any CSS color; shown as left-border dot on events
  - entity: calendar.ingrid
    color: "#c8b4e0"
weather: weather.forecast_home      # optional
tasks: todo.ingrid_tasks            # optional; shows task-count badge (raw todo entity mode)
presence:                           # optional; shows home/away pills in header
  - entity: binary_sensor.molant_home
    name: M
  - entity: binary_sensor.ingrid_home
    name: I
agenda_limit: 5                     # optional, default 5

# Lucarne Family integration toggles (both default false; require the integration)
household_tasks_from_integration: false   # if true, ignores tasks: and shows household tasks from integration
show_family_ready_pill: false             # if true, shows N/M ready pill in header
```

> **Backward compat**: `tasks: todo.ingrid_tasks` (raw entity mode) continues to work. Setting
> `household_tasks_from_integration: true` replaces it with the integration-backed household list.

### `lucarne-calendar-card`

```yaml
type: custom:lucarne-calendar-card
title: Calendar         # optional, default "Calendar"
calendars:
  - entity: calendar.family
    color: "#a8d8b9"
  - entity: calendar.ingrid
    color: "#c8b4e0"
  - entity: calendar.anton
    color: "#a8c5e8"
visible_hours:          # optional; crop the time grid to these hours
  start: "07:00"
  end:   "21:00"
# Rolling window options (all optional — defaults shown):
min_days: 3             # never show fewer day columns than this
max_days: 7             # cap at this many columns even on wide screens
min_col_width: 140      # refuse to make columns narrower than this (px)
max_col_width: 220      # show more days if columns would be wider than this (px)
show_create_button: true  # optional; shows a + button on empty slots
# NOTE: week_starts_on is deprecated and silently ignored
```

### `lucarne-chores-card`

> **Requires the Lucarne Family integration.** Install it first (Steps 3–4 above). Without it the
> card shows an error block. Old YAML configs with a `kids:` array also show an upgrade block.

```yaml
type: custom:lucarne-chores-card
title: Chores           # optional, default "Chores"
members:                # slugs of members to show — must match integration members
  - anna
  - bob
  - household           # optional; shows the shared todo.lucarne_household list
show_routines: true     # optional, default true
show_tasks: true        # optional, default true
show_streak: true       # optional, default true
```

Member slugs are derived from names entered in the integration (e.g. "Anna" → `anna`).
The visual editor populates the member list from the integration automatically.

---

## Blueprints

One automation blueprint lives in `blueprints/automation/`. Import it via HA:

**Settings → Automations → Blueprints → Import Blueprint** and paste the raw GitHub URL:

- `lucarne_reminders_sync` — webhook receiver: upserts the Mac mini's Reminders payload into HA
  `local_todo` entities. Inputs: Webhook ID + `list_mappings` JSON (e.g.
  `{"Family": "todo.anna", "Groceries": "todo.groceries"}`).

> **Note**: The `lucarne_chores_daily_reset` and `lucarne_chores_streak_advance` blueprints have
> been retired. Daily reset and streak checks are now managed by the `lucarne_family` integration.
> If you had instances of the old blueprints, delete them — no replacement needed.

---

## Custom events

The `lucarne_family` integration fires `lucarne_family_all_routines_done` when all of a member's
routines complete for the day. The legacy `ha_lucarne_chores_all_done` event is also fired during
v0.x for backwards compatibility (will be removed in v1.0).

See [docs/events.md](docs/events.md) for the full schema and a TTS example automation.

---

## Troubleshooting

**Cards show "Custom element not defined"**
The Lovelace resource is not registered. Check Settings → Dashboards → Resources. Make sure the URL
is `/hacsfiles/ha-lucarne/ha-lucarne.js` (not `/local/…`). Hard-refresh the browser (Cmd+Shift+R).

**Chores card shows "Lucarne Family integration not set up"**
Install and configure the integration (Steps 3–4 above). The card requires it; other cards do not.

**Reminders not syncing**
1. `launchctl list | grep ha-lucarne-sync` — check exit code is 0
2. `tail ~/Library/Logs/ha-lucarne-sync.log` — non-200 HTTP errors are logged here
3. Shortcuts.app must have been launched manually at least once after each macOS major upgrade

**Items appear duplicated in HA**
The `lucarne_reminders_sync` blueprint uses Apple Reminder UID for deduplication. If you see
duplicates, check the automation traces — the Shortcut must send unique `id` values.

**Google Calendar polling delay (up to 15 min)**
HA's Google Calendar integration polls on a fixed schedule. This is a HA core limitation.

**Mac mini sleeps and sync stops**
System Settings → Lock Screen → set "Put computer to sleep when display is off" to **Never**.

---

## Roadmap (v0.2)

- Round-trip Reminders: completing an item in HA marks it complete in Apple Reminders
- Avatar upload UI in the integration's Options Flow
- Submitting to the HACS default index

---

## Credits

- [mohesles/my-skylight-calendar](https://github.com/mohesles/my-skylight-calendar) — original
  Lovelace layout pattern this project adapted
- [Skylight](https://www.skylightcal.com/) — the $159 product that inspired the wall calendar idea

---

## License

[MIT](LICENSE)
