---
status: pending
---

# Phase 3: `lucarne-calendar-card`

The marquee feature. Week view Mon–Sun with hourly grid for the configured visible-hours band, pastel per-person color, inline visibility toggle pills in the header, tap-to-create events, and per-day stubs for out-of-band events. This is the card most likely to need polish iteration; budget 2 review rounds before declaring it done.

## Context

Read [./README.md](./README.md), [./phase-1-foundation.md](./phase-1-foundation.md), and [./phase-2-today-card.md](./phase-2-today-card.md) first. Phase 3 depends on Phase 2 — verify each before starting:
- `~/src/home-assistant-things/ha-projects/ha-lucarne/src/shared/ha-subscriptions.ts` and `src/shared/types.ts` exist (Phase 2 A.1, A.2). Reuse — do not duplicate.
- `src/shared/design-tokens.ts` exports `LUCARNE_PALETTE`, `LUCARNE_SPACING`, `LUCARNE_RADII`, `LUCARNE_TYPE_SCALE`, `LUCARNE_SHADOWS`, and `lucarneStyles` (Phase 2 A.3).
- `src/shared/icons.ts` exists with the inline-SVG subset (Phase 2 A.4).
- `dist/ha-lucarne.js` is loaded as a dashboard resource at `/local/lucarne/ha-lucarne.js` (Phase 2 D.3).
- `custom:lucarne-today-card` is live on the Family tab and rendering without console errors.
- Calendar entity IDs are recorded from Phase 1 baseline. Same set Phase 2 used — re-confirm via `ha_search_entities` with `domain_filter: "calendar"` if uncertain.

**Before any HA write**, re-read `skill://home-assistant-best-practices/SKILL.md`. From its Reference Files table, read:
- `references/dashboard-cards.md` (custom card config patterns)

## Design intent (read before implementing)

This card is the most visible piece of the project. Two design principles, in tension:

1. **Skylight-style polish**: clean week grid, soft pastel events, clear hierarchy, breathing room.
2. **iPad 9 landscape is tiny**: ~1080×810 usable. 7 day columns × ~12 hour rows means each cell is ~150×60 px, just enough for a 2-line event with margins. No wasted pixels.

When these conflict, **polish wins** — better to show fewer details per cell than to cram everything in.

## Structure

```
~/src/home-assistant-things/ha-projects/ha-lucarne/
  src/
    cards/
      lucarne-calendar-card.ts        # NEW: the week-view card
    components/
      calendar-grid.ts                 # NEW: 7-col × N-row grid renderer
      calendar-event-block.ts          # NEW: one event in the grid
      calendar-event-popover.ts        # NEW: details popup
      create-event-popover.ts          # NEW: tap-empty-slot create flow
      visibility-pills.ts              # NEW: per-calendar header toggles
      out-of-band-stub.ts              # NEW: "+N earlier" / "+N tonight" chips
    editors/
      lucarne-calendar-card-editor.ts # NEW: UI editor for this card's config
    shared/
      calendar-layout.ts               # NEW: pure-function layout solver (events → grid cells)
      date-helpers.ts                  # NEW: week boundaries, hour ranges, ISO formatting
    index.ts                           # UPDATE: import the new card
  tests/
    shared/
      calendar-layout.test.ts          # critical: tests the layout solver
      date-helpers.test.ts             # week boundaries, DST transitions
  docs/
    architecture.md                    # UPDATE: add calendar-card data flow section

HA changes (no files; via MCP):
  /wall-ipad Family tab: add the calendar card BELOW the today-card
```

## Implementation Checklist

> **Remember**: Update these checkboxes as you complete each task.

### Baseline Verification (before starting)

- [ ] Phase 2 status is `done`. Today-card is live on the iPad and verified.
- [ ] `npm run lint && npm run typecheck && npm run build && npm test` — green.
- [ ] At least 5 events exist across the configured calendars for the visible week (so the week view has something to render). If sparse, ask user to add test events temporarily.
- [ ] Read `skill://home-assistant-best-practices/SKILL.md` → `references/dashboard-cards.md`.

### Sub-Phase A: Date helpers + layout solver (pure logic, fully tested)

Goal: All the gnarly logic that doesn't touch Lit lives here and is unit-tested. The card becomes a thin renderer over this. **Deployable**: helpers + tests committed; no UI change yet.

#### A.1 Date helpers

- [ ] Create `src/shared/date-helpers.ts`. Pure functions:
  - `startOfWeek(date: Date, weekStartsOn: 'monday' | 'sunday'): Date` — returns the date at 00:00 local time of the week's start.
  - `endOfWeek(date: Date, weekStartsOn): Date` — Sun 23:59:59.999 local.
  - `weekDays(weekStart: Date): Date[]` — 7 Date objects, each at 00:00 of its day.
  - `hoursInBand(start: string, end: string): number[]` — given `"07:00"` and `"21:00"`, returns `[7, 8, ..., 21]` (inclusive on both ends; UI decides where to draw the hour lines).
  - `eventOverlapsBand(event: CalendarEvent, day: Date, bandStart: string, bandEnd: string): boolean` — true if the event has any portion within the band on the given day.
  - `eventBandPortion(event, day, bandStart, bandEnd): {start: Date, end: Date} | null` — the clipped portion that falls within the band on that day.
  - `formatRelativeStart(event, now): string` — `"now"`, `"in 30m"`, `"in 2h"`, `"tomorrow"`, `"Fri"`.
- [ ] Time zone awareness: HA reports timestamps as ISO 8601 UTC; the user's TZ is `America/Los_Angeles`. Use `Intl.DateTimeFormat` for display; do arithmetic in UTC but check day-boundary tests against local-time day boundaries. Browsers handle this with `Date` reasonably; verify behavior across the DST transition (March + November) in tests.
- [ ] Write `tests/shared/date-helpers.test.ts`:
  - week boundaries on Mon-start
  - week boundaries spanning a month transition
  - week boundaries on DST forward (March) and DST backward (November) — confirm `weekDays(weekStart).length === 7` even on DST-transition weeks, and the band hour count (e.g. `hoursInBand("07:00", "21:00").length === 15`) is unchanged. (The DST-affected day will still report 7 entries from `weekDays`; what changes is the wall-clock duration of that day, not the count.)
  - event overlapping the band partially, fully outside, fully inside
- [ ] Confirm `package.json`'s `test` script still runs with `TZ=America/Los_Angeles` before `node --import tsx --test`, as added in Phase 2. DST and local-week-boundary assertions depend on that timezone.
- [ ] `npm test` — green.

#### A.2 Layout solver

- [ ] Create `src/shared/calendar-layout.ts`. Pure function `layoutEvents(events, weekStart, bandStart, bandEnd, weekStartsOn)` returns:
  ```ts
  {
    weekDays: Date[];
    perDay: Map<string /* ISO date */, {
      allDay: CalendarEvent[];                          // all-day events (no time component)
      inBand: { event: CalendarEvent; lane: number; topPercent: number; heightPercent: number }[];
      earlier: CalendarEvent[];                         // events before band start
      later: CalendarEvent[];                           // events after band end
    }>;
  }
  ```
  Where `lane` is 0,1,2,... computed via the standard "interval graph coloring" greedy algorithm: sort events by start, assign each to the lowest-numbered lane that's free at its start time. `topPercent` and `heightPercent` are relative to the band's pixel height (computed by the grid component).
- [ ] All-day events bucket is shown above the grid (not laned).
- [ ] Multi-day events: render as a `lane` event in the first day's grid spanning the visible portion, then per-day continuation banners (a single-line strip across the top of subsequent day columns). Defer to v1.1 if it's expensive — for v1 just render as separate per-day clipped blocks.
- [ ] Write `tests/shared/calendar-layout.test.ts`:
  - 1 event, in-band → 1 lane, correct percent
  - 2 events overlapping in time → 2 lanes
  - 3 events overlapping pairwise → 3 lanes
  - event spanning before band start to mid-band → clipped, top at 0%
  - event spanning mid-band to after band end → clipped, bottom at 100%
  - event fully before band start → in `earlier` bucket
  - all-day event (start/end same date, no time) → in `allDay`
  - multi-day event → for v1, present in multiple days' `inBand` arrays

### Sub-Phase B: Card + grid + event blocks (the renderer)

Goal: card renders the week view, with visibility pills + tap-to-detail. No create flow yet (that's sub-phase C). **Deployable**: read-only week view on the Family tab.

#### B.1 Card shell

- [ ] Create `src/cards/lucarne-calendar-card.ts`. Config interface:
  ```ts
  interface LucarneCalendarCardConfig {
    type: 'custom:lucarne-calendar-card';
    title?: string;                        // default: 'Calendar'
    calendars: CalendarConfig[];           // required, non-empty
    visible_hours?: { start: string; end: string };  // default { start: "07:00", end: "21:00" }
    week_starts_on?: 'monday' | 'sunday';  // default: 'monday'
    show_create_button?: boolean;          // default: true
  }
  ```
- [ ] `setConfig`, `getCardSize` (return ~6), `getConfigElement`, `getStubConfig` (auto-discover first 3 calendars, defaults for the rest).
- [ ] Register on `window.customCards`.

#### B.2 Subscriptions

- [ ] On mount: fetch events for the configured calendars over [weekStart, weekEnd]. Re-fetch every 5 min.
- [ ] Track `visibleCalendarIds: Set<string>` in card state, defaulted to all configured. Pills toggle entries in this set; events from hidden calendars are filtered out before layout.
- [ ] Track `weekOffset: number` (0 = current, -1 = prev, +1 = next) to support a small "← →" navigator below the title (NOT in default visible — add only if there's space, defer otherwise).

#### B.3 Visibility pills

- [ ] Create `src/components/visibility-pills.ts`. Renders one pill per configured calendar. Pill shows the calendar's color dot + label. Tap toggles the calendar in `visibleCalendarIds`. Hidden = greyed/struck-through label.
- [ ] Place at the card top, below title, above the grid.

#### B.4 Calendar grid

- [ ] Create `src/components/calendar-grid.ts`. Renders:
  - All-day row at top (one row across all 7 day columns). Each day's all-day events stacked.
  - Hour labels column on the left (e.g. `7 AM`, `8 AM`, ...).
  - 7 day columns. Each day column is a relatively-positioned container; events are absolutely positioned with top/height from the layout solver.
  - Hour grid lines (subtle, low-contrast).
  - "Now" line (red, thin) across today's column if today is in the visible week and now is in the band.
- [ ] Out-of-band stubs: at the top of each day column (above the band), show `+N earlier` chip if `earlier.length > 0`. Below the band, `+N tonight` chip.
- [ ] Day-column header: weekday short name + day-of-month number, with "today" highlighted (pastel background).

#### B.5 Event blocks

- [ ] Create `src/components/calendar-event-block.ts`. Props: `event`, `color`, `lane`, `laneCount`, `topPercent`, `heightPercent`.
- [ ] Renders an absolute-positioned block. Width = `100 / laneCount`%; left = `lane / laneCount * 100`%. Background = pastel color. Text: summary on top, time on bottom (e.g. `"9:00–10:00"`).
- [ ] Tap → fires `lucarne-event-tap` custom event with the event data. Card listens, opens popover.

#### B.6 Event popover

- [ ] Create `src/components/calendar-event-popover.ts`. Shows event summary, time range, calendar (with color dot), description, location, "Edit in Google Calendar" link (deep link to `https://calendar.google.com/event?eid=...` — Google's `id` field on events maps to this; verify in current API response shape).
- [ ] Tap outside → close.
- [ ] Edit + delete actions: out of v1 scope (Google API write requires more permissions; HA's `calendar.create_event` is supported but `update_event` / `delete_event` are NOT in all versions — verify via `ha_list_services` before deciding). For v1, popover is read-only with the external link.

#### B.7 Out-of-band stub popover

- [ ] Tapping `+N earlier` / `+N tonight` opens a small list showing those events. Tap an event → opens the event popover.

#### B.8 Wire to dashboard

- [ ] `npm run build && npm test`. Push.
- [ ] `ha_config_set_dashboard` to add the calendar card BELOW the today-card on the Family tab. Use the same `calendars: [...]` block from Phase 2 (consider extracting to a YAML anchor if HA supports it; if not, copy).
- [ ] Refresh iPad. Verify:
  - Week grid renders with 7 columns
  - Events show in correct colors
  - "Now" line is present on today's column
  - Visibility pills hide/show calendars
  - Tap event → popover with details
  - Out-of-band stubs render when events fall outside 7am–9pm
  - No console errors

### Sub-Phase C: Create-event flow

Goal: tap empty slot → form → create via HA → event appears. **Deployable**: full read-write calendar (within HA's `calendar.create_event` limits).

#### C.1 Detect tap on empty slot

- [ ] In the calendar-grid component, add a transparent overlay layer that captures clicks. Convert click coordinates to (day, hour) using the grid's bounding rect.
- [ ] Round hour to nearest 30 min (event default duration 1h).
- [ ] Fire `lucarne-create-event-tap` with `{ day: Date, startHour: number }`.

#### C.2 Create-event popover

- [ ] Create `src/components/create-event-popover.ts`. Fields:
  - Title (required)
  - Calendar (dropdown, defaults to first configured calendar in YAML; calendar.family is the user's default per their direction)
  - Start date (default: tapped day)
  - Start time (default: tapped hour)
  - End time (default: +1h from start)
  - All-day toggle
  - Description (optional, multiline)
  - Location (optional)
  - "Create" button + "Cancel" button
- [ ] On Create: call `hass.callService('calendar', 'create_event', { ... })` with target.entity_id = selected calendar. Show inline error on failure.
- [ ] On success: close popover, optimistically add a "pending" event block to the grid (with reduced opacity) until the next 5-min refetch confirms it (Google polling cadence).
- [ ] Tap outside or Cancel → close, discard.

#### C.3 Verify `calendar.create_event` works

- [ ] Use `ha_list_services` with `domain: "calendar"` and `detail_level: "full"` to confirm the action's exact schema. Expected fields (HA 2024.x):
  - `summary` (required, string)
  - `description` (optional, string)
  - `location` (optional, string)
  - For timed events: `start_date_time` + `end_date_time` (ISO 8601 strings with timezone)
  - For all-day events: `start_date` + `end_date` (date strings, no time)
  - Target: `{ entity_id: "calendar.<id>" }`
  - The two pairs are MUTUALLY EXCLUSIVE — sending both will error. Branch on the all-day toggle in the create-event form.
- [ ] **If `create_event` is NOT exposed as an action** on the user's configured calendar (Google Calendar via the legacy `google` integration may not expose write), surface this to the user and disable the create button on those calendars. Read-only events are still rendered. Do not silently swallow create failures.
- [ ] Inspect `calendar.<id>` entity's `supported_features` attribute (`ha_get_state`) — if it has `CREATE_EVENT` (bit 1) set, create is supported on that specific calendar.
- [ ] Test from the popover: create an event titled "ha-lucarne smoke test" on calendar.family at +1h. Confirm in Google Calendar within 15 min.
- [ ] Delete the test event from Google Calendar manually after verifying.

### Sub-Phase D: Editor + responsive pass + wiki

#### D.1 UI editor

- [ ] `src/editors/lucarne-calendar-card-editor.ts` — fields:
  - title (text)
  - calendars (repeating: entity + color + label)
  - visible_hours.start + end (time pickers)
  - week_starts_on (select: monday / sunday)
  - show_create_button (toggle)
- [ ] Wire into card via `getConfigElement`. Import from `src/index.ts`.

#### D.2 Responsive pass

- [ ] Test the card at four widths in Safari (resize browser):
  - ~700 px (iPad 9 portrait — unlikely surface but verify graceful collapse)
  - ~1080 px (iPad 9 landscape — primary)
  - ~1440 px (iPad Pro 11" landscape)
  - ~1366 px (iPad Pro 12.9" landscape)
- [ ] Below ~700 px: collapse 7-column grid to 1-column day view with day-picker chips at top. Or hide the calendar card entirely on narrow widths via `<700px → display: none` (Phase 5 makes this decision; for now, just don't crash).
- [ ] At all 4 sizes: tap targets ≥ 44 px, no horizontal scrolling, no text overflow.

#### D.3 Tests + build

- [ ] `npm run lint && npm run typecheck && npm run build && npm test` — green.
- [ ] Bundle size: `dist/ha-lucarne.js` should be ≤ 220 KB (Lit + 2 cards + components). If above, audit.
- [ ] Commit + push. CI green.

#### D.4 Wiki

- [ ] Update `~/src/Tower/home-automation/dashboards/wall-ipad.md`: Family tab now has today + calendar.
- [ ] Update `~/src/Tower/home-automation/projects/ha-lucarne.md`: mark Phase 3 complete, screenshot.
- [ ] Append change-log.

### Build Verification (required before marking phase complete)

- [ ] All `npm` commands green.
- [ ] No HA log errors.
- [ ] No browser console errors on iPad.
- [ ] Calendar card visible, functional, read AND write paths work.
- [ ] User has used the calendar card for at least 24 hours and reported no blockers. (This is a polish-heavy phase; expect at least one card-mod tweak round before marking done.)
- [ ] Mark phase `status: done`.

### Manual Verification

- [ ] **Golden path**: from the iPad, create an event for tomorrow at 3pm. Verify it appears within 15 min and shows in the correct color.
- [ ] **Visibility toggle**: hide one calendar via the pill. Confirm its events disappear instantly. Re-show. Confirm they return.
- [ ] **Out-of-band event**: create an event at 5am tomorrow. Confirm it's NOT in the main grid, but a "+1 earlier" stub shows at the top of tomorrow's column. Tap → popover lists it.
- [ ] **Multi-calendar overlap**: create overlapping events on two different calendars. Confirm they render side-by-side in the same time slot (lanes work).
- [ ] **DST safety**: if implementing near a DST transition, manually verify the week spanning the transition still has 7 columns and 15 hour labels for the default 07:00–21:00 visible band.
- [ ] **Wife test**: ask Ingrid to create an event from the iPad. If she gets confused at any step, that's a Phase 5 polish item — record it.

## Technical Details

### Why subscribe via `calendar/list_events` per entity instead of one batch call

HA's WS API exposes `calendar/list_events` per entity. There's no single batch call. Promise.all over the 6 calendars × 7-day window is fast enough (typically < 1s on LAN); cached for 5 min.

### Lane algorithm reference

Standard greedy interval graph coloring:
```ts
function assignLanes(events: TimedEvent[]): TimedEvent[] {
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  const lanes: number[] = []; // lanes[i] = end time of last event in lane i
  return sorted.map(e => {
    const startMs = e.start.getTime();
    let lane = lanes.findIndex(endMs => endMs <= startMs);
    if (lane === -1) {
      lane = lanes.length;
      lanes.push(e.end.getTime());
    } else {
      lanes[lane] = e.end.getTime();
    }
    return { ...e, lane, laneCount: lanes.length };
  });
}
```
Note: `laneCount` is set to `lanes.length` AT THE TIME of assignment but the final laneCount needs to be the max across all events. A second pass fixes this: take `Math.max(...events.map(e => e.lane)) + 1` and apply to all.

### Calendar event deep-link to Google

Google Calendar events have a base64-encoded `id` field. The deep link format:
```
https://calendar.google.com/calendar/u/0/r/eventedit/<id>
```
Verify HA's `calendar/list_events` response includes the Google `id` (it may be in `uid` field instead). If not present, skip the deep link.

## Constraints

- No new HA entities.
- No HACS install.
- Edit/delete event NOT in v1 — verify the HA action availability and document the gap in `docs/architecture.md`.
- Bundle size budget ≤ 220 KB after this phase.
- All event titles must be HTML-escaped (Lit's default rendering does this automatically with template literals; do NOT use `unsafeHTML`).
