# iPad 9 Landscape — Sizing Details

## Pixel math

The iPad 9 (9th generation, 2021) has a 2160×1620 screen at 264 PPI (2× Retina).

In landscape kiosk mode (HA Companion + kiosk-mode HACS integration):

| Layer | Height | Width |
|-------|--------|-------|
| Physical screen | 1620 px | 2160 px |
| CSS pixels (÷ 2 device pixel ratio) | 810 px | 1080 px |
| HA chrome (header, sidebar) | 0 (kiosk-mode hides it) | 0 |
| **Available to cards** | **810 px** | **1080 px** |

The Lovelace dashboard therefore renders in an **1080 × 810 px** CSS viewport.

## Dashboard layout

The `/wall-ipad` dashboard uses three tabs (Family, Chores, optional Today-only view). Each tab
uses Lovelace's `panel: false` (default) with a grid layout:

- **Family tab**: `lucarne-today-card` left (span 4) + `lucarne-calendar-card` right (span 8) in a
  12-column grid. At 1080 px total, today card ≈ 360 px wide, calendar ≈ 720 px.
  The calendar pane now auto-fits **4 columns** at 720 px (was 7 fixed). The `computeVisibleDays`
  formula with defaults (`min_col_width=140`, `max_col_width=220`) yields visibleCount=4 at 720 px
  available width (680 px after the 40 px time gutter, 680÷220=3.1→4 min-fitting, 680÷140=4.86→4 max-fitting).
- **Chores tab**: `lucarne-chores-card` full-width. Three kids render in a `auto-fit minmax(220px,
  1fr)` grid → 3 columns at 1080 px (each ≈ 360 px), 4 columns if a fourth kid is added.

## Typography scaling

All font sizes use `clamp()`:

| Token | Formula | At 700 px | At 1080 px | At 1440 px |
|-------|---------|-----------|-----------|-----------|
| `--lucarne-fs-sm` | `clamp(0.75rem, 0.5vw + 0.5rem, 0.875rem)` | 12 px | 13.4 px | 14 px |
| `--lucarne-fs-md` | `clamp(0.875rem, 0.75vw + 0.6rem, 1rem)` | 14 px | 15.85 px | 16 px |
| `--lucarne-fs-lg` | `clamp(1rem, 1vw + 0.75rem, 1.25rem)` | 16 px | 18.8 px | 20 px |
| `--lucarne-fs-xl` | `clamp(1.25rem, 1.5vw + 0.875rem, 1.75rem)` | 20 px | 25.95 px | 28 px |

At 1080 px the heading size (`fs-lg`) is ≈ 18.8 px — comfortable at arm's length.

## Larger display behavior

Lucarne scales gracefully to larger iPads:

- **iPad Pro 11" (1194 × 834 CSS px landscape)**: today card widens to ~398 px, calendar to ~796 px.
  Font clamp values plateau at 1440 px, so headings stop growing above that.
- **iPad Pro 12.9" (1366 × 1024 CSS px landscape)**: chores grid switches to 3 wide columns
  (each ≈ 455 px) — more chore text visible per row.

The cards have no hard-coded `max-width` constraints, so they fill the container naturally.

## Touch targets

All interactive elements (chore checkboxes, calendar nav buttons, visibility pills, create-event
tap zones) use `min-height: 44px; min-width: 44px` per Apple HIG recommendations. This is enforced
in the component CSS, not via JavaScript.

## Kiosk-mode interactions

### Kiosk-mode HACS integration

The `/wall-ipad` dashboard uses [kiosk-mode](https://github.com/NemesisRE/kiosk-mode) to suppress
HA chrome for the `tablet` user. The `kiosk_mode:` block in the dashboard YAML:

```yaml
kiosk_mode:
  user_settings:
    - users:
        - tablet
      kiosk: true        # hides header and sidebar entirely
```

Kiosk mode is applied per-user, so the admin user still sees the full HA UI on the same URL.

### Known iPad-specific gotchas

**HA Companion keyboard bug**: When a text input inside a card gains focus (e.g. the create-event
popover's title field), the iOS soft keyboard may push the viewport up and clip the top of the card.
Workaround: use `position: fixed` for popovers instead of `position: absolute`.

**Kiosk Personal Automations dead-end**: If you try to create a Personal Automation in Shortcuts.app
that triggers on the wall-iPad, iOS may navigate away from kiosk mode. This is an iOS Shortcuts
limitation. Avoid Personal Automations that require HA Companion interaction on the wall iPad.

**Tap-and-hold HA more-info dialog**: In kiosk mode, long-pressing on a card area that contains an
`ha-card` element can still trigger the HA more-info dialog for entities. The lucarne cards do not
wrap entity tiles, so this is unlikely — but if you add standard entity cards alongside them on the
same view, be aware of this behavior.

**Safari cache stale after resource URL change**: After switching the Lovelace resource URL from
`/local/lucarne/ha-lucarne.js` to `/hacsfiles/ha-lucarne/ha-lucarne.js`, a hard refresh
(Cmd+Shift+R on Mac, or clear Safari website data on iPad) is required to purge the old module from
the browser module cache. A soft refresh is not sufficient.
