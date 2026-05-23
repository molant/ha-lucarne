---
status: pending
---

# calendar-polish — Post-visible-days bug fixes

> **Progress Tracking**: Update checkboxes in phase files as you complete tasks. Run `implement-feature features/calendar-polish` to execute all phases end-to-end, or `/spec-implement features/calendar-polish/phase-1-pan-fixes.md` to start phase-by-phase.

## Goal

Fix five distinct bugs surfaced by manual testing on the wall iPad and Chrome desktop after the `visible-days` rolling-window feature shipped. The bugs span three independent areas of the card:

1. **New-Event dialog rendering** is broken on iPad iOS Safari (oversized date/time inputs, solid-black checkbox).
2. **No way to delete events** — the detail modal only shows event info; there is no Delete affordance.
3. **Pan / snap interaction bugs** — clicks don't open the detail modal on Chrome desktop, and the snap-after-swipe animation shows a visible content jump.

This is a polish pass on the same `feat/visible-days` branch; `visible-days` itself is `status: done`.

## Issues addressed

| # | Symptom | Where | Phase |
|---|---|---|---|
| 1 | Native `<input type="date">` / `type="time">` render as oversized "fat pill" buttons on iPad, fine on Chrome | `src/components/create-event-popover.ts` | 2 |
| 2 | All-day `<input type="checkbox">` renders solid black when unchecked on iPad with the lucarne theme | `src/components/create-event-popover.ts` | 2 |
| 3 | Detail modal has no Delete button; users cannot remove events they created from the card | new code in `src/shared/ha-subscriptions.ts` + event-detail popover | 3 |
| 4 | On Chrome desktop, clicking an event pill does nothing; iPad tap correctly opens the detail modal | `src/components/calendar-day-pan.ts` (pointer-capture timing) | 1 |
| 5 | After a swipe-pan release, the snapped day visually jumps in from the left rather than continuing smoothly from its drag position | `src/components/calendar-day-pan.ts` (animation target + offset-update timing) | 1 |

**Phase number = implementation order.** Phase 1 (pan fixes) ships first because the Chrome-desktop click fix is needed to end-to-end test the Phase 3 Delete button on a laptop. Phase 2 (event dialog) is independent. Phase 3 (delete events) is the largest code change and goes last.

## Concepts

### Why iOS Safari renders date/time inputs differently

iOS Safari (iPad 9 included) styles `<input type="date">` and `<input type="time">` as button-like controls with a "fat pill" appearance — a tall rounded rectangle with the value centered. Chrome on desktop renders them as text-input-like fields. The fix is to opt out of iOS's native chrome with `appearance: none` so the existing input CSS takes over. The native picker (calendar wheel / clock wheel) still pops up on tap.

### Why the unchecked checkbox is black

Native `<input type="checkbox">` without an `accent-color` falls back to the page's foreground text color on iOS Safari for the box fill/border. The lucarne theme sets `--lucarne-on-surface` to `#3a3a3a` (near-black). At 18×18px, the box reads as fully black. Setting `accent-color: var(--primary-color)` (the theme's light blue `#a8c5e8`) tints both the unchecked border and the checked fill consistently.

### `setPointerCapture` and the lost click

`lucarne-calendar-day-pan` calls `setPointerCapture` on `pointerdown` (before deciding whether the gesture is a drag). With capture active, the browser retargets mouse `mouseup` to the capturing element, so the synthesized `click` fires on the pan-wrapper, not on the underlying `calendar-event-block`. iOS Safari handles touch-derived click synthesis differently for short taps and so isn't affected. Solution: defer `setPointerCapture` to the moment the 10px drag threshold is crossed.

### Snap animation content swap

When the user releases a swipe, two things happen in parallel:

- `_snapBack()` animates `translateX` back to `0` over 240ms with the **current** day content.
- The card receives `pan-snap` and updates `_dayOffset`, scheduling a Lit re-render that replaces the day content within a frame or two.

Result: mid-animation the track has the **new** day content but the animation was queued targeting `0` from the drag offset, so the new content visually "flies in from the side". Fix: animate the OLD content to a position that visually equals the NEW content's translateX(0) state (i.e., to `deltaDays * dayWidthPx`), then atomically reset on `transitionend`.

### Delete-event support detection

Home Assistant's `calendar` domain exposes `calendar.delete_event` but per-integration support varies. The entity carries a `supported_features` attribute bitmask; bit `4` (`CalendarEntityFeature.DELETE_EVENT`) signals delete capability. The card reads this bit to decide whether to render the Delete button at all.

## Requirements

### Pan interaction (Phase 1)

- On Chrome desktop, a click on an event pill opens the detail modal (currently it does not).
- A click-and-drag that crosses the 10px threshold pans the grid (and does NOT open the modal).
- Swipe release snaps smoothly with no visible content jump or "fly-in from left" effect, on both iPad and Chrome.
- `prefers-reduced-motion: reduce` still works (snap is instant, no animation, no jump).
- The ±90-day pan bound and rubber-band resistance are unchanged.

### Event dialog (Phase 2)

- Date and time inputs render the same on iPad and Chrome (no iOS native "fat pill").
- Tapping a date/time input still opens the native picker — strip only the resting appearance, not the picker integration.
- All-day checkbox: light-blue border when unchecked, light-blue fill with a white check when checked, on both iPad and Chrome.

### Delete events (Phase 3)

- The event-detail modal shows a Delete button only when the underlying calendar entity supports delete.
- Tapping Delete shows an inline confirm step (no second modal); a second tap commits.
- On successful delete: the event disappears from the grid immediately (optimistic removal); the modal closes.
- On service error: the inline error slot shows the message; modal stays open.
- Recurring events: Delete button is hidden (recurring delete is out of scope for this phase).

### Non-goals (explicitly OUT of scope)

- Recurring event delete (single instance / this-and-future / all variants).
- Custom-styled All-day toggle component — only set `accent-color`. If `accent-color` proves insufficient on a specific iPadOS version, full custom checkbox styling can be added in a follow-up.
- Pan momentum / inertia.
- Editing existing events (only delete + create stay in scope).
- Any change to the `lucarne-today-card`, `lucarne-chores-card`, or Reminders bridge.

### Authorization

Phase 3 adds one new HA service call: `calendar.delete_event`. No new entities, permissions, or storage are introduced. Authorization is enforced by Home Assistant per the user's existing HA session, identical to how `calendar.create_event` is already used.

## Phases

| Phase | Title | Description |
|---|---|---|
| 1 | Pan interaction fixes | Defer `setPointerCapture` to drag threshold (fixes Chrome click). Re-target snap animation + defer offset update to `transitionend` (fixes snap jump). |
| 2 | Event dialog UX | iPad date/time input appearance + all-day checkbox accent-color. Pure CSS in `create-event-popover.ts`. |
| 3 | Delete events | Add `deleteCalendarEvent` helper, supported-features detection, Delete button + confirm step in event-detail modal, optimistic cache removal, error handling. |

## Related Documentation

- [Phase 1: Pan interaction fixes](./phase-1-pan-fixes.md)
- [Phase 2: Event dialog UX](./phase-2-event-dialog.md)
- [Phase 3: Delete events](./phase-3-delete-events.md)
- [visible-days spec (predecessor)](../visible-days/README.md)
- [Architecture](../../docs/architecture.md)
- [Visible-days design rationale](../../docs/visible-days.md)

## Testing Tools

| MCP Server | Tool Prefix | Use For |
|---|---|---|
| browsermcp | `mcp__browsermcp__*` | Visual before/after screenshots of the New-Event dialog, event-detail modal with/without Delete, and the swipe-snap animation. Toggle `prefers-reduced-motion` in devtools to verify Phase 1 fallback. |
| home-assistant | `mcp__home-assistant__*` | Read `calendar.*` entity `supported_features` to verify the bit-4 detection logic. Create a test event via `ha_config_set_calendar_event`, delete it from the card, confirm via `ha_config_get_calendar_events` that it's gone server-side. Useful for Phase 3 end-to-end verification. |

## Logging & Diagnostics

| Log Source | Location | Format | What to Check |
|---|---|---|---|
| Card runtime | Browser DevTools console | Plain text, `[lucarne]` prefix | `calendar.delete_event` service errors; pointer-event-related warnings from the day-pan component |
| Test output | stdout from `npm test` | node:test TAP | `not ok` lines for `pan-math`, `rolling-window`, and any new `delete-events` tests |
| HA Core log | `mcp__home-assistant__ha_get_logs` | HA log format | Calendar integration errors when `delete_event` fails (e.g., uid not found, integration doesn't actually support delete despite the bit) |

## Access Control

Phase 3 introduces one new `calendar.delete_event` call via `hass.callService`. Authorization is enforced by Home Assistant per the user's existing HA session. The card never bypasses or elevates HA permissions. The Delete button is hidden client-side when `supported_features` lacks the DELETE_EVENT bit (a UX courtesy — even if shown, the service call would fail at the HA layer).
