# ha-lucarne — DIY Skylight Calendar for Home Assistant

A custom Lovelace card collection that turns a wall-mounted iPad into a Skylight-style family
dashboard: week-view calendar with per-person colors, a daily agenda + weather strip, a kids'
chore tracker with streaks, and an Apple Reminders sync bridge — all designed for iPad 9
landscape in kiosk mode.

> **Install**: HACS → Custom repositories → `https://github.com/molant/ha-lucarne` → Type: Dashboard (plugin)

---

## What it does

Three Lovelace cards share a consistent visual language (soft pastels, `clamp()`-based typography,
44 px touch targets) and live-subscribe to your HA state. The **Today** card shows the next 7 days
of agenda, today's weather + tomorrow's forecast, and a task-count badge. The **Calendar** card renders a scrollable
week-view with per-person color coding, visibility toggles, and a tap-to-create flow. The **Chores**
card shows each kid's daily to-do list, tracks streaks with a `counter.*` helper, and fires a
`ha_lucarne_chores_all_done` event when a kid completes everything — plug TTS, push notifications, or
other automations into that event.

An optional Mac mini bridge pushes Apple Reminders lists to HA `local_todo` entities every 5 minutes
via a Shortcuts.app + launchd workflow, so Reminders assigned to family members appear in the cards
without manual entry.

## What it isn't

- Not a HA integration — only custom Lovelace cards and blueprints.
- Not a replacement for Google Calendar or Apple Calendar — it reads your existing calendars.
- The Reminders bridge is Mac mini–specific. If you don't have a Mac always-on, use HA's built-in
  todo directly (e.g. via the iOS Companion app) — see [config-recipes.md](docs/config-recipes.md).

---

## Features

- **`lucarne-today-card`** — agenda strip (next 7 days, per-person color dots), today's weather +
  tomorrow's forecast, task-count badge, presence pills
- **`lucarne-calendar-card`** — full week-view grid, per-person color coding, calendar visibility pills,
  event-detail popover, create-event flow (on calendars that support it)
- **`lucarne-chores-card`** — per-kid chore columns, tap to toggle, streak counter, celebration animation,
  `ha_lucarne_chores_all_done` custom event
- **Apple Reminders bridge** — Mac mini Shortcut + launchd job syncs Reminders to HA todo entities
  every 5 minutes
- **Three blueprints** — `lucarne_reminders_sync` (webhook receiver that upserts Reminders into
  `local_todo`), `lucarne_chores_daily_reset` (midnight auto-reset), and
  `lucarne_chores_streak_advance` (nightly streak check at 21:00)
- **Design-token layer** — CSS custom properties for spacing, radii, typography, palette; consistent
  at all 4 breakpoints (700 / 1080 / 1366 / 1440 px)

---

---

## Install

### 1. Add as a HACS custom repository

1. Open HA → **HACS** → **Frontend**
2. Click the three-dot menu (⋮) → **Custom repositories**
3. Paste `https://github.com/molant/ha-lucarne` and set Type to **Dashboard** (backend/action
   category: `plugin`)
4. Click **Add**

### 2. Download Lucarne

In HACS → Frontend, search for **Lucarne** and click **Download**.

### 3. Add the Lovelace resource

HA → **Settings** → **Dashboards** → **⋮** → **Resources** → **Add resource**:

```
URL:  /hacsfiles/ha-lucarne/ha-lucarne.js
Type: JavaScript Module
```

### 4. Add cards to your dashboard

Open your dashboard in edit mode and add the cards via YAML (see [Configuration](#configuration)).
Each card has a visual editor — click **Visual editor** after adding.

### 5. (Optional) Install the Lucarne theme

A Skylight-inspired pastel theme ships with the repo at `themes/lucarne.yaml`. It pairs the
cards with the calm cream/pastel palette they were designed against, and — critically —
widens HA's `type: sections` views past the default 500 px section cap (via
`ha-view-sections-column-max-width: 1200px`) so the cards can render side-by-side at full
iPad width.

1. Copy `themes/lucarne.yaml` to your HA `<config>/themes/` directory.
   - Samba: drop into `\\homeassistant\config\themes\`.
   - SSH: `scp themes/lucarne.yaml <user>@<host>:/config/themes/lucarne.yaml`.
2. Ensure `configuration.yaml` contains a frontend theme include (most setups already have this):

   ```yaml
   frontend:
     themes: !include_dir_merge_named themes
   ```
3. Reload themes: **Developer tools → Services → `frontend.reload_themes`**.
4. Per-user theme selection: **Profile → Theme → Lucarne** (per HA user).

You can skip this step and use any other light theme — but the sections-view widening
won't apply unless you set the `ha-view-sections-column-*` variables yourself.

### 6. (Optional) Set up the Mac mini Reminders bridge

Follow [bridge/README.md](bridge/README.md) to install the launchd sync job on a Mac mini.
Skip this step if you prefer to manage todo items directly in HA.

> **HACS default index**: Lucarne is distributed via custom-repo install in v0.1. Submission to the
> HACS default index is planned for v0.2 once the install flow has been validated externally.

---

## Configuration

### `lucarne-today-card`

```yaml
type: custom:lucarne-today-card
title: Today            # optional, default "Today"
calendars:
  # Display names come from each calendar's `friendly_name` in HA — rename via
  # Settings → Devices & services → Entities. The `label:` field is deprecated
  # and ignored; safe to remove from existing configs.
  - entity: calendar.family
    color: "#a8d8b9"    # any CSS color; shown as left-border dot on events
  - entity: calendar.ingrid
    color: "#c8b4e0"
weather: weather.forecast_home      # optional; omit and the weather block shows an "add entity" hint
tasks: todo.ingrid_tasks            # optional; shows task-count badge
presence:                           # optional; shows home/away pills in header
  - entity: binary_sensor.molant_home
    name: M
  - entity: binary_sensor.ingrid_home
    name: I
agenda_limit: 5         # optional, default 5; events shown in agenda strip
```

### `lucarne-calendar-card`

```yaml
type: custom:lucarne-calendar-card
title: Calendar         # optional, default "Calendar"
calendars:
  # Display names come from each calendar's `friendly_name`; see note above.
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
show_create_button: true  # optional; shows a + button on empty slots (requires calendar to support event creation)
# week_starts_on is deprecated and silently ignored (rolling window has no week start)
```

### `lucarne-chores-card`

```yaml
type: custom:lucarne-chores-card
title: Chores           # optional, default "Chores"
kids:
  - name: Kid 1
    color: "#f5c89c"
    streak: counter.kid_1_streak   # counter helper — see Blueprints section
    chores:
      - name: Brush teeth
        entity: input_boolean.kid_1_brush_teeth
      - name: Make bed
        entity: input_boolean.kid_1_make_bed
      - name: Put away toys
        entity: input_boolean.kid_1_put_away_toys
      - name: School bag ready
        entity: input_boolean.kid_1_school_bag_ready
      - name: Kindness act
        entity: input_boolean.kid_1_kindness_act
  - name: Kid 2
    color: "#b8e0d2"
    streak: counter.kid_2_streak
    chores:
      - name: Brush teeth
        entity: input_boolean.kid_2_brush_teeth
      # … add more chores
```

Each `input_boolean.*` and `counter.*` helper must be created in HA first (Settings → Helpers).
The card's visual editor lets you pick existing helpers from a dropdown once they're created.

---

## Blueprints

Three automation blueprints live in `blueprints/automation/`. Import them via HA:

**Settings → Automations → Blueprints → Import Blueprint** and paste the raw GitHub URL:

- `lucarne_reminders_sync` — webhook receiver: upserts the Mac mini's Reminders payload into HA
  `local_todo` entities. Inputs: Webhook ID + `list_mappings` JSON (e.g.
  `{"Family": "todo.ingrid_tasks", "Groceries": "todo.groceries"}`). Required for the bridge.
- `lucarne_chores_daily_reset` — resets all `input_boolean` chore entities to `off` at midnight
- `lucarne_chores_streak_advance` — checks each kid's completion at 21:00 and increments or resets
  the `counter.*` streak helper accordingly

After importing, create **one automation instance per blueprint** covering all kids:
- `lucarne_chores_daily_reset`: pass all chore `input_boolean` entity IDs as a comma-separated list
- `lucarne_chores_streak_advance`: pass a JSON array of kid configs (see the blueprint's description)

---

## Custom events

The chores card fires `ha_lucarne_chores_all_done` when a kid completes all their chores. See
[docs/events.md](docs/events.md) for the full schema and a TTS example automation.

---

## Troubleshooting

**Cards show "Custom element not defined"**
The Lovelace resource is not registered. Check Settings → Dashboards → Resources. Make sure the URL
is `/hacsfiles/ha-lucarne/ha-lucarne.js` (not `/local/…`). Hard-refresh the browser (Cmd+Shift+R).

**Reminders not syncing**
1. `launchctl list | grep ha-lucarne-sync` — check exit code is 0
2. `tail ~/Library/Logs/ha-lucarne-sync.log` — non-200 HTTP errors are logged here
3. Shortcuts.app must have been launched manually at least once after each macOS major upgrade

**Items appear duplicated in HA**
The `lucarne_reminders_sync` blueprint uses Apple Reminder UID for deduplication. If you see
duplicates, check the automation traces — it may mean the Shortcut is sending empty or identical
UIDs. Each Reminder has a unique Apple-assigned UID; the Shortcut must read it from the `id` field.

**Google Calendar polling delay (up to 15 min)**
HA's Google Calendar integration polls on a fixed schedule. The cards refresh on a 5-minute timer —
but if Google hasn't polled yet, the data will be stale. This is a HA core limitation, not a card
bug.

**Mac mini sleeps and sync stops**
System Settings → Lock Screen → set "Put computer to sleep when display is off" to **Never**.

**Kid taps wrong chore column on the iPad**
Increase the grid-column min-width by adjusting the `minmax(220px, 1fr)` value in the card source,
or reduce the number of kids shown on this dashboard and link to a second view.

---

## Roadmap (v0.2)

- Round-trip Reminders: completing an item in HA marks it complete in Apple Reminders
- Mealie meal-plan integration: today's dinner shown in the Today card
- iOS Reminders → HA Groceries auto-add via Siri shortcut
- Support for additional weather providers (Open-Meteo, Met.no)
- Submitting to the HACS default index

---

## Credits

- [mohesles/my-skylight-calendar](https://github.com/mohesles/my-skylight-calendar) — original
  Lovelace layout pattern this project adapted
- HA community thread: [Skylight DIY replacement for HA](https://community.home-assistant.io/) —
  the thread that started this
- [Skylight](https://www.skylightcal.com/) — the $159 product that inspired the wall calendar idea

---

## License

[MIT](LICENSE)
