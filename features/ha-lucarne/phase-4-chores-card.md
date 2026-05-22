---
status: pending
---

# Phase 4: `lucarne-chores-card` + automations

3-column kid chore grid (configurable to N columns). Each kid: colored-initial avatar + name + checkable chore list + streak counter + "all done today" visual celebration. Daily reset + streak-advance via a shipped HA blueprint. When a kid completes all chores, the card fires a documented HA event for downstream automations to hook into.

## Context

Read [./README.md](./README.md), [./phase-1-foundation.md](./phase-1-foundation.md), [./phase-2-today-card.md](./phase-2-today-card.md), and [./phase-3-calendar-card.md](./phase-3-calendar-card.md). Phase 4 depends on Phase 1–3 — verify each before starting:
- Repo at `~/src/home-assistant-things/ha-projects/ha-lucarne/` with `src/cards/lucarne-today-card.ts` and `src/cards/lucarne-calendar-card.ts` both fully implemented.
- `src/shared/` directory has `types.ts`, `ha-subscriptions.ts`, `design-tokens.ts` (with `LUCARNE_PALETTE`, `LUCARNE_SPACING`, `LUCARNE_RADII`, `LUCARNE_TYPE_SCALE`, `LUCARNE_SHADOWS`, and `lucarneStyles`), `icons.ts`, `date-helpers.ts`, `calendar-layout.ts`.
- `tests/` directory has the Phase 2 + 3 unit tests passing under `npm test`.
- `src/index.ts` imports both card files.
- `dist/ha-lucarne.js` built, committed, loaded as `/local/lucarne/ha-lucarne.js` dashboard resource.
- Both `custom:lucarne-today-card` and `custom:lucarne-calendar-card` are rendering on the iPad without console errors.
- Pattern for cards + editors + tests is set by Phase 2 and 3 — follow it.

**Before any HA write**, re-read `skill://home-assistant-best-practices/SKILL.md`. From its Reference Files table, read:
- `references/helper-selection.md` (input_boolean vs other helpers)
- `references/automation-modes.md` (daily reset + streak-advance modes)

**Phase-4 kickoff questions** (ask user before starting):
- Per-kid chore content. Defaults if user defers: brush teeth, make bed, put away toys, school bag ready, kindness act.
- Should "all done" trigger a side effect right away (Phase 4) or just fire the event for the user to wire up later (recommended for v1)?
- Reset time (default: 00:00 PT) and streak-check time (default: 21:00 PT) — confirm.

## Structure

```
~/src/home-assistant-things/ha-projects/ha-lucarne/
  src/
    cards/
      lucarne-chores-card.ts          # NEW
    components/
      kid-column.ts                    # NEW: one kid's full column
      kid-avatar.ts                    # NEW: colored-initial circle (or image if avatar URL set)
      chore-row.ts                     # NEW: one chore with check
      streak-display.ts                # NEW: streak count + visual
      celebration-overlay.ts           # NEW: CSS-keyframe "all done" animation
    editors/
      lucarne-chores-card-editor.ts   # NEW
    shared/
      chore-helpers.ts                 # NEW: derive "all done" boolean from kid's chore states
  blueprints/
    automation/
      lucarne_chores_daily_reset.yaml    # NEW: at reset_time, flip all configured input_booleans off
      lucarne_chores_streak_advance.yaml # NEW: at streak_check_time, check each kid's all-done, increment/reset counter
  docs/
    events.md                          # POPULATE: ha_lucarne_chores_all_done schema
    architecture.md                    # UPDATE: chores data flow
  tests/
    shared/
      chore-helpers.test.ts            # all-done logic

HA changes (no files; via MCP):
  Per-kid helpers (created via ha_config_set_helper):
    input_boolean.chore_kid1_<slug>      # one per chore per kid (count depends on Phase-4 kickoff answer; default is 5 chores × 3 kids = 15)
    input_boolean.chore_kid2_<slug>
    input_boolean.chore_kid3_<slug>
    counter.streak_kid1
    counter.streak_kid2
    counter.streak_kid3
  Automations (instantiated from blueprints):
    automation.lucarne_chores_daily_reset
    automation.lucarne_chores_streak_advance
  /wall-ipad dashboard: new "Chores" tab with the card
```

## Implementation Checklist

> **Remember**: Update these checkboxes as you complete each task.

### Baseline Verification (before starting)

- [ ] Phase 3 status is `done`. Calendar card is live on iPad and verified.
- [ ] `npm run lint && npm run typecheck && npm run build && npm test` — green.
- [ ] **Phase-4 kickoff questions answered by user** (per-kid chore content, side effects yes/no, reset times).
- [ ] Confirm no existing `input_boolean.chore_*` or `counter.streak_*` entities via `ha_search_entities` (we don't want to collide).
- [ ] Read `skill://home-assistant-best-practices/SKILL.md` → helper-selection and automation-modes references.

### Sub-Phase A: HA helpers + blueprints

Goal: data layer + automations exist. Card not yet built, but you can toggle helpers via HA UI and see the daily reset / streak advance fire correctly. **Deployable**: usable from HA's built-in UI even without the card.

#### A.1 Create per-kid helpers

- [ ] For each kid (k = 1, 2, 3) and each chore slug from the answered question:
  - Create `input_boolean.chore_kid<k>_<chore_slug>` via `ha_config_set_helper`. Name: `"Kid <k> — <chore display>"`.
  - Verify creation via `ha_get_state`. Default state should be `off`.
- [ ] For each kid, create `counter.streak_kid<k>` via `ha_config_set_helper`. Use `domain: "counter"` and pass these config keys (HA's `counter` helper schema): `name: "Kid <k> streak"`, `initial: 0`, `step: 1`, `minimum: 0`, `restore: true` (the field is literally `restore`, NOT `restore_on_restart` — `restore: true` persists the value across HA restarts). Do NOT set `maximum` (a streak has no ceiling).
- [ ] Record the exact entity IDs in a temporary scratch file or this checklist — the card YAML config references them.

#### A.2 Daily reset blueprint

- [ ] Write `blueprints/automation/lucarne_chores_daily_reset.yaml`. Structure:
  ```yaml
  blueprint:
    name: Lucarne Chores Daily Reset
    description: |
      At the configured reset time, flip every listed input_boolean to off.
    domain: automation
    input:
      reset_time:
        name: Reset Time
        description: Local time when daily chores reset (e.g. "00:00")
        selector: { time: {} }
      chore_entities:
        name: Chore Entities
        description: Comma-separated list of input_boolean entity IDs to reset
        selector: { text: { multiline: true } }
  trigger:
    - platform: time
      at: !input reset_time
  variables:
    entities_csv: !input chore_entities
    entity_list: "{{ entities_csv.split(',') | map('trim') | list }}"
  action:
    - service: input_boolean.turn_off
      target:
        entity_id: "{{ entity_list }}"
  mode: single
  ```
- [ ] Tell the user to place the blueprint at `<config>/blueprints/automation/molant/lucarne_chores_daily_reset.yaml` (via Samba/SFTP/File Editor — no MCP tool writes to the HA host). Then reload via `ha_reload_core` (or equivalently `ha_call_service` with `domain="automation", service="reload"` — `automation.reload` alone is sufficient for blueprint pickup). Alternatively, if the repo is on GitHub, use `ha_import_blueprint` with the GitHub raw URL.
- [ ] Instantiate via `ha_config_set_automation` with inputs:
  - `reset_time`: `"00:00"` (or user-confirmed alternative)
  - `chore_entities`: comma-joined list of EVERY `input_boolean.chore_*` entity created in A.1 (3 kids × N chores per kid, where N is whatever count came out of the Phase-4 kickoff answer — do not hard-code a count)
- [ ] Verify the automation exists and is `on`.

#### A.3 Streak-advance blueprint

This one is more complex — it needs to check all-done per kid and advance/reset that kid's counter. The card fires the documented `ha_lucarne_chores_all_done` event immediately when the last chore is checked off; this automation does not fire that event.

- [ ] Write `blueprints/automation/lucarne_chores_streak_advance.yaml`. Inputs:
  - `check_time` (time selector)
  - `kid_configs` (multiline text — JSON: `[{kid_slug, kid_name, streak_counter, chore_entities: [...]}]`)
- [ ] At `check_time`, iterate kids using HA's `repeat.for_each` action (the standard YAML loop construct — NOT a Python list comprehension and NOT a `for:` block which doesn't exist in HA actions). Skeleton:
  ```yaml
  variables:
    kid_configs_parsed: "{{ kid_configs | from_json }}"
  action:
    - repeat:
        for_each: "{{ kid_configs_parsed }}"
        sequence:
          - variables:
              kid: "{{ repeat.item }}"
              all_done: "{{ kid.chore_entities | map('is_state', 'on') | list | min }}"
              # `min` over a list of booleans returns False if any False is present, True only if all True.
              # `all` is NOT available as a Jinja filter in HA; use `min` on the boolean list as the idiomatic equivalent.
          - choose:
              - conditions: "{{ all_done }}"
                sequence:
                  # increment counter — see syntax block below
              - conditions: "{{ not all_done }}"
                sequence:
                  - service: counter.reset
                    target:
                      entity_id: "{{ kid.streak_counter }}"
  ```
  - The all-done branch increments the kid's streak counter. The not-done branch resets that counter.
- [ ] **`kid_configs` field convention**: each kid object has `kid_slug`, `kid_name`, `streak_counter` (the FULL entity_id, e.g. `"counter.streak_kid1"` — NOT the suffix), and `chore_entities` (an array of full input_boolean entity_ids). The blueprint templates use these as-is via `states(kid.streak_counter)`; do NOT re-prefix `counter.` inside templates.
- [ ] **Streak action syntax**: exact syntax to use (inside the per-kid loop, in the all-done branch):
  ```yaml
  - service: counter.increment
    target:
      entity_id: "{{ kid.streak_counter }}"
  ```
  The reset branch uses `service: counter.reset` with the same target and does NOT fire the event. Verify in a fresh automation trace (`ha_get_automation_traces`) that the increment/reset branch ran as expected.
- [ ] Mode: `single`. (Multiple kids handled within a single run via a per-kid loop, not parallel triggers.)
- [ ] Tell user to drop file at `<config>/blueprints/automation/molant/lucarne_chores_streak_advance.yaml`. Reload via `ha_reload_core` (or `ha_call_service(domain="automation", service="reload")` — equivalent for blueprint pickup). Then instantiate via `ha_config_set_automation` with `check_time: "21:00"` and the JSON for 3 kids.
- [ ] Verify automation exists and is `on`. To force-run for verification: call `ha_call_service` with `domain="automation", service="trigger", target={entity_id: "automation.lucarne_chores_streak_advance"}, service_data={skip_condition: true}` (the `skip_condition: true` bypasses the time-of-day trigger check so the run fires immediately). Pre-flight: set one kid's chores all to `on` via `ha_call_service` `domain="input_boolean", service="turn_on"` for each chore entity. After the trigger call, fetch the run via `ha_get_automation_traces` and confirm the counter incremented (`ha_get_state` on `counter.streak_kid<n>`).

#### A.4 Document the event schema

- [ ] Write `docs/events.md` in the repo. Document the `ha_lucarne_chores_all_done` event with full schema (from README), an example automation that listens for it (TTS via HomePod or Companion app notification), and the event semantics ("fires from the card when a kid transitions from not-all-done to all-done by checking the last chore; does not replay on page load if the kid was already all-done").

### Sub-Phase B: lucarne-chores-card

Goal: card renders the 3-kid grid, taps update HA state, "all done" celebration animates, and the card fires the documented event. **Deployable**: replace any chore-related stock surface; this card IS the chores surface.

> **Design decision**: the card fires `ha_lucarne_chores_all_done` the moment a kid taps the last chore done. This matches README.md's north-star success criterion and gives immediate automation hooks. The streak-advance automation remains responsible only for nightly counter increment/reset.

#### B.1 Card shell

- [ ] Create `src/shared/chore-helpers.ts` exporting the pure function `isAllDone(chores: { state: string }[]): boolean`. Returns `false` for an empty array, `false` if any chore's state is not exactly `'on'` (this also treats `unavailable`/`unknown` as not-done), and `true` only when every chore's state is `'on'`. This is the single source of truth for the "all done" derivation; both the card (for the celebration overlay) and the streak-advance blueprint logic in A.3 conceptually agree with this rule.
- [ ] Create `src/cards/lucarne-chores-card.ts`. Config:
  ```ts
  interface LucarneChoresCardConfig {
    type: 'custom:lucarne-chores-card';
    title?: string;                     // default 'Chores'
    kids: {
      name: string;                     // display name
      color: string;                    // pastel color
      avatar?: string;                  // optional URL; if absent, colored initial
      streak: string;                   // counter entity_id
      chores: { name: string; entity: string }[];
    }[];
  }
  ```
- [ ] `setConfig` validates: `kids` is non-empty, each kid has at least 1 chore.
- [ ] `getCardSize` returns ~5.
- [ ] `getStubConfig` returns a default with 3 placeholder kids (Kid 1 / Kid 2 / Kid 3) and 5 placeholder chores each.

#### B.2 Kid column subcomponent

- [ ] Create `src/components/kid-column.ts`. Renders:
  - Top: avatar (`kid-avatar` subcomponent) + name
  - Middle: chore list (one `chore-row` per chore)
  - Bottom: streak display

#### B.3 Avatar (colored initial)

- [ ] Create `src/components/kid-avatar.ts`. Props: `name`, `color`, `avatarUrl?`.
- [ ] If `avatarUrl` set, render an `<img>` clipped to a circle.
- [ ] Else, render a colored circle with the first letter of `name` centered, using the kid's pastel color as background and contrasting text color.
- [ ] Circle size scales via `clamp()` for responsiveness.

#### B.4 Chore row

- [ ] Create `src/components/chore-row.ts`. Props: `name`, `entityId`, `isDone`.
- [ ] Renders a large tap target (≥ 60 px tall — bigger than the 44 px minimum because kids tap with imprecision).
- [ ] Left: checkbox-shaped circle (filled when done).
- [ ] Right: chore name (struck through when done).
- [ ] Tap → calls `hass.callService('input_boolean', 'toggle', { entity_id: entityId })`. NO optimistic UI — wait for state update via the existing subscription on `hass`.

#### B.5 Streak display

- [ ] Create `src/components/streak-display.ts`. Props: `streak: number`.
- [ ] Renders a flame icon + number (`"🔥 7"`). Flame size scales with streak (subtle, e.g. 5 milestones).
- [ ] On streak > 0, add a small label ("day streak"); on streak = 0, label "start a streak today".

#### B.6 Celebration overlay + event firing

- [ ] Create `src/components/celebration-overlay.ts`. CSS keyframe animation triggered when a kid transitions to all-done within this session.
- [ ] **Trigger tracking** (be explicit; don't replay on page-load if a kid was already all-done): keep card-instance state `private _lastAllDoneByKid: Map<string /*kid_slug*/, boolean> = new Map();`. On every Lit `updated(changedProps)` pass that touches `hass`:
  1. For each configured kid, build the chore-state array by reading each chore's entity from `this.hass.states[chore.entity]` and mapping to `{ state: this.hass.states[chore.entity]?.state ?? 'unavailable' }`. Then compute `current = isAllDone(choreStates)` via `chore-helpers.ts` (signature is `isAllDone(chores: { state: string }[]): boolean` per B.1 — pass the state array, NOT the kid config object). Use `kid.name` (slugified, e.g. `kid.name.toLowerCase().replace(/\s+/g, '_')`) as the map key since the config interface in B.1 has no `slug` field.
  2. Read `previous = this._lastAllDoneByKid.get(kidSlug) ?? null`.
  3. If `previous === null` → first observation; set the map entry, do NOT animate (this is the initial page-load state).
  4. If `previous === false && current === true` → fire local celebration via `<lucarne-celebration-overlay kid-slug=...>` and call `homeassistant.fire_event` with `event_type: "ha_lucarne_chores_all_done"` and the event data from README.md. `streak` is the current counter state at tap time; the nightly automation may increment it later at `streak_check_time`. Update the map.
  5. If `previous === true && current === false` → reset; update the map; no animation.
- [ ] Animation: pastel confetti dots floating up from the bottom of the kid's column, fading out. 2-second duration. No JS animation loop — pure CSS keyframes.
- [ ] Before coding the event call, verify the service schema with `ha_list_services` for `domain: "homeassistant"` and `detail_level: "full"`. Expected service: `homeassistant.fire_event` with `event_type` and `event_data`. The card call should be `hass.callService('homeassistant', 'fire_event', { event_type: 'ha_lucarne_chores_all_done', event_data: { ... } })`. If that service is unavailable, stop and surface it; do not substitute a non-HA event that automations cannot subscribe to.

#### B.7 Compose

- [ ] Card render: title row at top, then a CSS Grid with `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`. Each kid is one cell. On iPad 9 landscape, 3 kids = 3 columns. On a narrower viewport, fewer columns (responsive).
- [ ] Container queries / media queries: if width < 600 px, stack to 1 column. Test at the 4 breakpoints from Phase 2.

### Sub-Phase C: Editor + Chores tab + verification

#### C.1 Editor

- [ ] `src/editors/lucarne-chores-card-editor.ts`. Fields:
  - Title
  - Kids (repeating): name (text), color (color-picker — use `<ha-color-picker>` if available, else hex text), avatar URL (text), streak (entity-picker filtered to `counter`), chores (sub-repeating: name + entity-picker filtered to `input_boolean`).
- [ ] Wire via `getConfigElement`. Import from `src/index.ts`.

#### C.2 Tests

- [ ] `tests/shared/chore-helpers.test.ts`:
  - `isAllDone([])` → false (no chores configured = nothing to celebrate)
  - `isAllDone([{state: 'on'}, {state: 'on'}])` → true
  - `isAllDone([{state: 'on'}, {state: 'off'}])` → false
  - `isAllDone([{state: 'unavailable'}])` → false (treat unavailable as not-done)
- [ ] `npm test` — green.

#### C.3 Build + push

- [ ] `npm run lint && npm run typecheck && npm run build && npm test` — green.
- [ ] Bundle size: `dist/ha-lucarne.js` ≤ 280 KB. If above, audit (this is the 3rd card; should still be reasonable with shared subcomponents).
- [ ] Push. CI green.

#### C.4 Add Chores tab

- [ ] `ha_config_get_dashboard` → confirm current view list.
- [ ] `ha_config_set_dashboard` with python_transform: add a new view "Chores" AFTER Family. Single section, single `custom:lucarne-chores-card` card with the YAML config bound to the actual entity IDs from A.1.
- [ ] Refresh iPad. Verify:
  - Chores tab visible
  - 3 kid columns render
  - Tap a chore → toggles to done with visual feedback
  - Tap again → toggles back to undone
  - At reset_time (00:00), all chores flip to undone (verify next morning OR temporarily set reset_time to 1 min from now for a quick test, then revert)
  - When the last chore is checked, the celebration plays and `ha_lucarne_chores_all_done` fires (verify with the temporary debug automation from Manual Verification)
  - At streak_check_time, if a kid has all done, their counter increments (verify with `ha_get_automation_traces`)

#### C.5 Wiki

- [ ] Update `~/src/Tower/home-automation/dashboards/wall-ipad.md`: add Chores tab.
- [ ] Update `~/src/Tower/home-automation/projects/ha-lucarne.md`: mark Phase 4 complete, link to repo's `docs/events.md`.
- [ ] Optional: create `~/src/Tower/home-automation/automations/chores-reset-and-streak.md` documenting the daily reset + streak-advance automations and the custom event.
- [ ] Append change-log.

### Build Verification (required before marking phase complete)

- [ ] All `npm` commands green.
- [ ] No HA log errors after a full 24h cycle (reset + streak check both fired).
- [ ] Custom event `ha_lucarne_chores_all_done` was observed at least once by a temporary debug automation that triggers on that event and writes to `system_log.write`; inspect with `ha_get_logs`.
- [ ] Mark phase `status: done`.

### Manual Verification

- [ ] **Golden path — kid POV**: a 5-year-old can find their column and tap their chore done. If they can't, the avatar/name needs to be more prominent — fix.
- [ ] **Reset works**: at midnight, all chores reset to undone.
- [ ] **Streak advances**: at 21:00, a kid with all chores done has their counter increment.
- [ ] **Streak resets on miss**: at 21:00, a kid with any chore undone has their counter reset to 0.
- [ ] **Celebration animation**: when the LAST chore for a kid is checked off, the celebration plays.
- [ ] **Event fires**: `ha_get_logbook` is not a registered MCP tool on this server (genuinely doesn't exist — not just disallowed). Verify event firing by creating a temporary debug automation that triggers on `event_type: ha_lucarne_chores_all_done` and calls `system_log.write` with the event payload; then inspect via `ha_get_logs`. Confirm the payload matches the schema documented in `docs/events.md`. Remove the temporary debug automation after verification.
- [ ] **No regressions**: Family tab and the 5 other tabs all still work.

## Technical Details

### Event-fire-from-card vs from-automation

The card fires `ha_lucarne_chores_all_done` immediately when a kid transitions from not-all-done to all-done. This is intentional: the README's north-star criterion is that a done tap exposes an immediate automation hook. The nightly streak automation does not fire the event; it only advances or resets counters at `streak_check_time`.

Known tradeoff: if someone completes chores outside this card, the immediate event will not fire. That is acceptable for v1 because the kids' iPad card is the intended input surface. The nightly counter still advances from HA state, independent of whether the card is loaded.

### Why counter (not input_number) for streaks

`counter` has built-in `increment` / `decrement` / `reset` services and a `restore: true` config for surviving HA restarts. `input_number` would require template math + `set_value` calls. Counter is the right primitive.

### `local_todo` cells vs `input_boolean` for chores — why not local_todo

Chores aren't tasks; they're a fixed list with daily reset. `input_boolean` per chore gives:
- Stable entity IDs the card can hard-bind to
- Trivial bulk reset (`input_boolean.turn_off` on a list)
- HA-native automation triggers if any kid's individual chore needs side effects

A `todo` list would force chores to be created/destroyed daily, complicating both the card and the reset logic.

### Avatar choice

User signed off on colored-initial circle for v1 (no images). Each kid gets a pastel color from `LUCARNE_PALETTE`. If `avatar:` URL is set in YAML later, the card uses the image instead. Avatar URL points at `/local/lucarne/avatars/<slug>.png` by convention; we don't ship sample images.

## Constraints

- No HACS install.
- No edits to configuration.yaml.
- Chore helpers must be created via `ha_config_set_helper`, not by editing YAML.
- Event schema is locked at the version we ship — adding new fields is OK; renaming or removing existing ones is a breaking change requiring major version bump.
- Card must not crash if a kid's `streak` counter is `unavailable` or doesn't exist (show `?` for streak).
- Card must not toggle chores in response to streak-advance automation runs (avoid feedback loops — automation only reads, never writes booleans).
