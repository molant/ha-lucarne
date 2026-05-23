# Visible Days — Design Rationale & Rolling Window

## Why a rolling window?

The original calendar card showed a fixed Monday-anchored week. On iPad 9 landscape in the
family-tab pane (≈720 px wide), a 7-day fixed week produces columns that are only ~97 px each —
too narrow for multi-person color-coded events. The rolling window solves this by:

1. Anchoring on **today** so the leftmost visible day is always the most relevant.
2. **Auto-fitting the column count** to the available width so columns never go below
   `min_col_width` or above `max_col_width`.
3. Allowing the user to **pan freely** ±90 days rather than jumping a whole week at a time.

## `computeVisibleDays` formula

Source: `src/shared/visible-window.ts`

Given:
- `containerWidth` — the `.grid-area` element's measured CSS width (from `ResizeObserver`)
- `timeColWidth = 40` px — width of the sticky time-gutter column
- `minDays`, `maxDays`, `minColWidth`, `maxColWidth` — from card config (defaults: 3, 7, 140, 220)

Steps:
```
available   = containerWidth − timeColWidth
maxFitting  = floor(available / minColWidth)   // largest N that still respects min col width
minFitting  = ceil(available / maxColWidth)    // smallest N needed to fill without exceeding max col width
// Cap maxFitting at maxDays first, then clamp into [minDays, maxDays]:
capped      = min(maxFitting, maxDays)
visibleCount = clamp(max(minFitting, capped), minDays, maxDays)
dayWidthPx  = available / visibleCount
```

### Worked examples (defaults: minDays=3, maxDays=7, minColWidth=140, maxColWidth=220, timeColWidth=40)

| `containerWidth` | `available` | `maxFitting` | `minFitting` | `visibleCount` | `dayWidthPx` |
|-----------------|-------------|--------------|--------------|----------------|--------------|
| 480 px (portrait) | 440 px | 3 | 2 | **3** | 146.7 px |
| 720 px (iPad 9 family pane) | 680 px | 4 | 4 | **4** | 170 px |
| 1080 px (full-width) | 1040 px | 7 | 5 | **7** | 148.6 px |
| 1366 px (iPad Pro 12.9") | 1326 px | 9→capped | 7 | **7** | 189.4 px |

At 720 px the formula yields 4 columns at 170 px — comfortable for multi-person event blocks.
At 1080 px it yields 7 columns (the `maxDays` cap), keeping each column at ~149 px.

The formula is pure: no side effects, no DOM reads. `ResizeObserver` feeds it the measured width
on every container size change; `RollingWindowController.setVisibleCount(n)` is called when
`n` changes, which triggers a re-fetch if the new range exceeds the cache.

## Rolling-window state machine

```
State: { _dayOffset: int, _visibleCount: int, _anchorToday: Date }

Events that change state:
  pan(deltaDays)       → _dayOffset += deltaDays, clamped to [-90, 90 - _visibleCount]
  goToToday()          → _dayOffset = 0
  setVisibleCount(n)   → _visibleCount = n
  tick()               → if midnight crossed: _anchorToday = new midnight
                          if _dayOffset === 0: re-anchor (scroll view stays at today)

Derived values:
  days[]    = [_anchorToday + _dayOffset, ..., + _dayOffset + _visibleCount - 1]
  isAtToday = _dayOffset === 0
  canPanBack    = _dayOffset > -90
  canPanForward = _dayOffset + _visibleCount < 90

Side effects:
  Any state change calls _opts.onChange() (→ card._recompute()) and _host.requestUpdate()
  pan() + setVisibleCount() also re-fetch if the new window extends past _cachedDayKeys
```

### Cached-day tracking

After each successful fetch for range `[start, end)`, `_cachedDayKeys` is rebuilt as a
`Set<string>` of `YYYY-MM-DD` keys for every day in that range. The grid reads
`cachedDayKeys: Set<string>` (passed down from the card) to decide per-column whether to
render a `<lucarne-skeleton-day-column>` or real events. `isDayCached(day)` is a single
`_cachedDayKeys.has(isoDateKey(day))` lookup; `cachedRange` returns the sorted `Date[]`
derived from `_cacheStart` / `_cacheEnd`.

### Pan bound enforcement

`canPanBack` / `canPanForward` are passed to `<lucarne-calendar-day-pan>` so the rubber-band
starts immediately when the user swipes into a disabled direction. The same booleans disable the
`←` / `→` nav arrows (via `?disabled`), giving the user a visible affordance that the bound
has been reached.
