---
status: done
---

# Phase 2: Event dialog UX (iPad rendering fixes)

Pure-CSS phase. Touches one file: `src/components/create-event-popover.ts`. Fixes issues 1 (oversized native date/time inputs on iPad) and 2 (solid-black unchecked checkbox on iPad).

## Context

Read [./README.md](./README.md) for the bug catalog and root-cause analysis.

The New-Event dialog uses native `<input type="date">`, `<input type="time">`, and `<input type="checkbox">` elements. On Chrome desktop they render fine. On iPad iOS Safari:

- Date and time inputs render as oversized "fat pill" button-like controls (iOS's native styling), much taller and visually heavier than the surrounding text inputs.
- The all-day checkbox renders solid black when unchecked because iOS Safari falls back to the page foreground color (`var(--lucarne-on-surface)` ≈ `#3a3a3a`) for the box when no `accent-color` is set.

The fix is two small CSS additions inside the component's styles block. No behavior changes.

## Structure

```
src/components/
  create-event-popover.ts        # MODIFY: extend input rule + add accent-color to checkbox rule
```

No new files. No new tests (pure visual fix; manual verification via browsermcp screenshots).

## Implementation Checklist

> **Remember**: Update these checkboxes as you complete each task!

### Baseline verification

- [ ] On a fresh build, open the New-Event dialog on the wall iPad. Take a `mcp__browsermcp__browser_screenshot` of the dialog as the BEFORE reference.
- [ ] On Chrome desktop, take a matching BEFORE screenshot (should already look correct — confirms Chrome regression check).

### Sub-Phase 2A: Strip iOS native input chrome (issue 1)

Deployable when: date/time inputs on iPad visually match the text inputs (same height, same border-radius, same left-aligned text).

#### Implementation

- [x] Edit `src/components/create-event-popover.ts`, in the shared input rule at lines 93-108. Add `appearance: none; -webkit-appearance: none;` and `text-align: left;`:

  ```css
  input[type='text'],
  input[type='date'],
  input[type='time'],
  select,
  textarea {
    appearance: none;
    -webkit-appearance: none;
    text-align: left;
    width: 100%;
    box-sizing: border-box;
    /* ...rest of existing rules unchanged... */
  }
  ```

- [x] After the shared rule, add WebKit-specific rules to neutralize the iOS date/time inner pieces:

  ```css
  input[type='date']::-webkit-date-and-time-value,
  input[type='time']::-webkit-date-and-time-value {
    text-align: left;
  }
  input[type='date']::-webkit-calendar-picker-indicator,
  input[type='time']::-webkit-calendar-picker-indicator {
    opacity: 0.6;
  }
  ```

  These pseudo-elements only exist on WebKit-based browsers (iOS Safari, desktop Safari, Chromium); on other engines the selectors are silently ignored.

#### Manual verification (2A)

- [ ] Rebuild and deploy (`npm run deploy`).
- [ ] On iPad: open New-Event dialog. Date field is now a single rectangle the same height as the Title input, with `May 26, 2026` left-aligned (or whatever date format iOS shows when stripped of native chrome).
- [ ] Tap the Date field → the native iOS date picker still pops up. Pick a date → returns to the dialog with the new date displayed in the left-aligned field.
- [ ] Same checks for Start and End fields.
- [ ] On Chrome desktop: dialog still looks correct (no regression — the rule was already correct, just adds explicit `appearance: none` which Chrome ignores for these types).
- [ ] Take AFTER screenshots on both devices for the PR description.

### Sub-Phase 2B: Accent-color on the all-day checkbox (issue 2)

Deployable when: the unchecked all-day checkbox shows a light-blue border (not solid black) on iPad.

#### Implementation

- [x] Edit `src/components/create-event-popover.ts`, in the checkbox rule at lines 133-138. Add `accent-color`:

  ```css
  .allday-row input[type='checkbox'] {
    width: 18px;
    height: 18px;
    min-height: unset;
    cursor: pointer;
    accent-color: var(--primary-color, #03a9f4);
  }
  ```

  `var(--primary-color)` resolves to the lucarne theme's `#a8c5e8` (light blue) when the theme is active, and to the HA default otherwise. The fallback `#03a9f4` matches the existing `.btn-create` button color.

#### Manual verification (2B)

- [ ] Rebuild and deploy.
- [ ] On iPad with the lucarne theme: open New-Event dialog. The unchecked all-day checkbox has a light-blue (not black) border.
- [ ] Tap the checkbox → it becomes a light-blue filled square with a white check.
- [ ] On Chrome desktop: same behavior (Chrome already supports `accent-color` since v93).
- [ ] Take AFTER screenshots.

### Sub-Phase 2C: Fallback path (only if needed)

Skip this sub-phase unless manual verification 2B fails. Listed here so an implementer knows the escape hatch.

If `accent-color` does not visibly change the iPad rendering (possible on iPadOS < 15.4, which lacks `accent-color` support — only land this if manual verification 2B fails):

- [ ] Implement a fully custom checkbox: keep the native `<input>` for accessibility, set `appearance: none` on it, give it a 2px border, and use a `:checked` rule with a `background-image: url("data:image/svg+xml,...")` SVG checkmark in the lucarne primary blue.
- [ ] Test on iPad to confirm the custom rendering looks correct.
- [ ] Verify keyboard accessibility (Tab to focus, Space to toggle) is preserved.

This fallback is intentionally not implemented preemptively — it adds code and a maintenance surface. Only land it if needed.

### Final verification

- [x] All four gates green:
  - [x] `npm run typecheck`
  - [x] `npm run lint`
  - [x] `npm test`
  - [x] `npm run build`
- [ ] Side-by-side BEFORE/AFTER screenshots on iPad attached to the commit message or PR description.
- [ ] Commit message format: `fix(calendar-polish): Phase 2 — iPad date/time input + checkbox styling`.

## Out of scope for this phase

- Phase 1 (pan fixes) and Phase 3 (delete events). Each is its own deployable phase.
- Re-theming the entire create-event-popover (only the two specific rules above).
- Replacing native inputs with custom HA components (`ha-textfield`, `ha-selector`, etc.) — the repo deliberately uses raw HTML inputs throughout; do not change that convention.
