# HA Community Forum Draft

> **DO NOT POST until all TODOs below are resolved:**
> 1. `img/` directory must exist in the repo (screenshots captured from iPad and committed)
> 2. Community thread URLs filled in (search for `<!-- TODO` below)
> 3. Remove this warning block before posting

**Title**: ha-lucarne — DIY Skylight Calendar for Home Assistant (custom Lovelace cards + Apple Reminders sync)

**Category**: Share your Projects (Lovelace / Frontend)

---

Hey all,

Sharing a project I've been running in my kitchen for a few months: **ha-lucarne**, a set of custom
Lovelace cards that turn a wall-mounted iPad 9 into a Skylight-style family dashboard.

*(screenshot: img/full-dashboard.png — replace with live URL after committing img/)*

## What it does

Three cards with a consistent visual language (soft pastels, `clamp()`-based typography, 44px
touch targets):

- **Today card** — next 7 days of agenda (per-person color dots), today's weather + tomorrow's
  forecast, task-count badge, who's home presence pills
- **Calendar card** — rolling N-day window (auto-fits 3–7 days to the available width) with
  per-person color coding, calendar visibility toggle pills, touch-swipe day navigation,
  tap-to-see-details popover, tap-to-create-event flow
- **Chores card** — per-kid chore columns (each backed by `input_boolean` helpers), tap to toggle,
  streak counter, a 2-second celebration animation, and a custom `ha_lucarne_chores_all_done` event
  you can hook into for TTS / push notifications

Plus an optional **Apple Reminders bridge**: a Mac mini running a Shortcuts.app workflow + launchd
job that pushes Reminders lists to HA `local_todo` entities every 5 minutes. My wife's Family list
shows up on the dashboard without her ever touching the HA app.

## What's different from other DIY Skylight builds

- Fully typed TypeScript + Lit components, built with Vite
- Per-person color coding that follows events across both the Today and Calendar cards (same color
  for the same person everywhere)
- Multi-list Apple Reminders bridge with deduplication by Apple UID (not title matching)
- Designed specifically for iPad 9 landscape (1080×810 CSS px) but scales gracefully to iPad Pro
  via CSS `clamp()` and `auto-fit` grid columns
- Visual editors for all three cards (no YAML required after initial setup)
- Three automation blueprints: Apple Reminders sync (webhook receiver), nightly chore reset, and streak tracking

## Inspired by

This thread: <!-- TODO: paste the HA community Skylight DIY thread URL --> and the
<!-- TODO: paste XDA article URL -->. The layout pattern was adapted from
[@mohesles/my-skylight-calendar](https://github.com/mohesles/my-skylight-calendar) — thanks!
Skylight (the $159 commercial product) inspired the original wall-calendar idea.

## Install (HACS custom repository)

1. HACS → Frontend → ⋮ → Custom repositories → paste
   `https://github.com/molant/ha-lucarne` → Type: Dashboard (plugin)
2. Download Lucarne in HACS
3. Add `/hacsfiles/ha-lucarne/ha-lucarne.js` as a Lovelace resource
4. Add the cards via YAML or visual editor — see the
   [README](https://github.com/molant/ha-lucarne#configuration) for config examples

HACS default index submission is planned for v0.2 after I've validated the install flow with
external users.

## Screenshots

*(Replace the lines below with live `![](https://raw.githubusercontent.com/molant/ha-lucarne/main/img/...)` URLs after committing img/)*

- Today card → `img/today-card.png`
- Calendar card → `img/calendar-card.png`
- Chores card → `img/chores-card.png`

## v0.2 roadmap

- Round-trip Reminders sync (complete in HA → marks complete in Apple Reminders)
- Mealie meal-plan integration (tonight's dinner in the Today card)
- More weather providers (Open-Meteo, Met.no)
- HACS default index submission

Repo: **https://github.com/molant/ha-lucarne**

Happy to answer questions. If you use it, let me know what breaks — issues and PRs welcome.

---

*[Note to self: add actual community thread URLs before posting. Replace placeholder image URLs
with real raw.githubusercontent.com links after pushing the img/ directory. Post to the
"Share your Projects" subcategory under Lovelace/Frontend.]*
