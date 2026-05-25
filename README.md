# ha-lucarne — DIY Skylight Calendar for Home Assistant

![ha-lucarne banner](docs/banner.svg)

<a href="https://github.com/hacs/integration"><img src="https://img.shields.io/badge/HACS-Custom-41BDF5.svg" alt="HACS Custom"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
<a href="https://www.home-assistant.io/"><img src="https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue.svg" alt="Home Assistant"></a>

A custom Lovelace card collection that turns a wall-mounted iPad into a Skylight-style family
dashboard: a rolling N-day calendar with per-person colors, a daily agenda + weather strip, a kids'
chore tracker with streaks, and an Apple Reminders sync bridge — all designed for iPad 9
landscape in kiosk mode.

> **Install**: HACS → Custom repositories → `https://github.com/molant/ha-lucarne` → Type: Dashboard (plugin)

> **Screenshots coming soon** — once 0.2.0 is stable on the wall iPad, the calendar / today / chores cards will get a screenshots gallery here. The banner above is a placeholder.

---

## What it does

Three Lovelace cards share a consistent visual language (soft pastels, `clamp()`-based typography,
44 px touch targets) and live-subscribe to your HA state. The **Today** card shows the next 7 days
of agenda, today's weather + tomorrow's forecast, and a task-count badge. The **Calendar** card renders a
rolling N-day window (auto-fits 3–7 days to width) with per-person color coding, visibility toggles, touch-swipe
navigation, and a tap-to-create flow. The **Chores**
card shows each member's daily routine + chore list, tracks streaks, "+ Add task" and long-press
edit flow, and the `lucarne_family` integration fires a `lucarne_family_all_routines_done` event
when all of a member's routines complete — plug TTS, push notifications, or other automations
into that event.

An optional Mac mini bridge pushes Apple Reminders lists to HA `local_todo` entities every 5 minutes
via a Shortcuts.app + launchd workflow, so Reminders assigned to family members appear in the cards
without manual entry.

## What it isn't

- Not a replacement for HA's built-in todo or calendar integrations.
- Not a replacement for Google Calendar or Apple Calendar — it reads your existing calendars.
- The Reminders bridge is Mac mini–specific. If you don't have a Mac always-on, use HA's built-in
  todo directly (e.g. via the iOS Companion app) — see [config-recipes.md](docs/config-recipes.md).

---

## Features

- **`lucarne-today-card`** — agenda strip (next 7 days, per-person color dots), today's weather +
  tomorrow's forecast, task-count badge, presence pills
- **`lucarne-calendar-card`** — rolling N-day window with touch swipe (auto-fits 3–7 days to width), per-person color coding, calendar visibility pills,
  event-detail popover, create-event flow (on calendars that support it)
- **`lucarne-chores-card`** — per-member routine + chore columns (requires `lucarne_family` integration), tap to toggle, streak counter, celebration animation, `+ Add task` popover, long-press edit flow
- **Apple Reminders bridge** — Mac mini Shortcut + launchd job syncs Reminders to HA todo entities
  every 5 minutes
- **One blueprint** — `lucarne_reminders_sync` (webhook receiver that upserts Reminders into
  `local_todo`). Daily reset and streak checks are now owned by the `lucarne_family` integration.
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

### 5. Install the Lucarne Family integration

The `lucarne_family` integration manages family members, tasks, daily routine reset, and streak
checks. The `lucarne-chores-card` requires it — without it the card shows an error block.
See [docs/integration.md](docs/integration.md) for installation and configuration steps.
Once installed, go to Settings → Devices & Services → Add Integration → Lucarne Family.

### 6. (Optional) Install the Lucarne theme

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

### 7. (Optional) Set up the Mac mini Reminders bridge

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
# NOTE: week_starts_on is deprecated and silently ignored — remove from your config
```

### `lucarne-chores-card`

> **Requires the Lucarne Family integration.** Install it first (step 5 above). The card
> subscribes to `todo.<slug>` entities managed by the integration. Mutations are split:
> summary/due changes go through `todo.update_item` (HA service); add/delete/metadata changes
> go through `lucarne_family.*` integration services. Without the integration it renders an
> error block.

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

Member slugs are derived from the names you entered in the integration (e.g. "Anna" → `anna`).
The special slug `household` always resolves to the shared `todo.lucarne_household` list.

The visual editor populates the member list from the integration automatically — open the card
editor and check the members you want to show.

---

## Blueprints

One automation blueprint lives in `blueprints/automation/`. Import it via HA:

**Settings → Automations → Blueprints → Import Blueprint** and paste the raw GitHub URL:

- `lucarne_reminders_sync` — webhook receiver: upserts the Mac mini's Reminders payload into HA
  `local_todo` entities. Inputs: Webhook ID + `list_mappings` JSON (e.g.
  `{"Family": "todo.ingrid_tasks", "Groceries": "todo.groceries"}`). Required for the bridge.

> **Note**: The `lucarne_chores_daily_reset` and `lucarne_chores_streak_advance` blueprints have
> been retired. Daily routine reset and streak checks are now managed by the `lucarne_family`
> integration using in-process time-change listeners. The `lucarne-chores-card` requires the
> integration as of Phase 4 — the old `input_boolean.*`-only workflow is no longer supported.
> If you had automation instances of the old blueprints, delete them — no replacement needed
> when using the integration. The retired blueprints are no longer available.

---

## Custom events

The `lucarne_family` integration fires `lucarne_family_all_routines_done` when all of a member's
routines complete for the day. The legacy `ha_lucarne_chores_all_done` event is also fired during
v0.x for backwards compatibility. See [docs/events.md](docs/events.md) for the full schema and a
TTS example automation.

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
Increase the grid-column min-width by adjusting the `minmax(200px, 1fr)` value in the card source,
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
