# Configuration Recipes

Per-household examples for common setups. Start from the closest recipe and adapt.

---

## Recipe 1: 2-adult, no-kids household

**Skip the chores card.** Use Today + Calendar only.

### Helpers to create

None required (no chores tracking).

### Dashboard YAML

```yaml
# /wall-ipad dashboard — Family tab only (no Chores tab needed)
views:
  - title: Family
    path: family
    cards:
      # Calendar display names come from each calendar entity's friendly_name in HA.
      # The `label:` field is deprecated and ignored — rename via Settings →
      # Devices & services → Entities.
      - type: custom:lucarne-today-card
        title: Today
        calendars:
          - entity: calendar.family
            color: "#a8d8b9"
          - entity: calendar.partner_a
            color: "#a8c5e8"
          - entity: calendar.partner_b
            color: "#c8b4e0"
        weather: weather.forecast_home
        tasks: todo.shared_tasks
        presence:
          - entity: binary_sensor.partner_a_home
            name: A
          - entity: binary_sensor.partner_b_home
            name: B

      - type: custom:lucarne-calendar-card
        title: Calendar
        calendars:
          - entity: calendar.family
            color: "#a8d8b9"
          - entity: calendar.partner_a
            color: "#a8c5e8"
          - entity: calendar.partner_b
            color: "#c8b4e0"
        visible_hours:
          start: "07:00"
          end:   "22:00"
        # Rolling window options (all optional — defaults shown):
        min_days: 3        # never show fewer columns than this
        max_days: 7        # cap at this many columns even on wide screens
        min_col_width: 140 # refuse to make columns narrower than this (px)
        max_col_width: 220 # show more days if columns would be wider than this (px)
```

---

## Recipe 2: Large family (5+ kids)

The chores card uses `auto-fit minmax(220px, 1fr)` columns. At 1080 px wide, 4 kids fill 4×220 px
= 880 px comfortably; 5 kids wrap to a second row (no horizontal scroll — the grid reflowing is the
default browser behavior). Options:

**Option A — accept the wrap**: The default. At 1080 px wide, `minmax(220px, 1fr)` yields 4
columns; 5 kids → 4 on row 1, 1 on row 2. Slightly uneven but functional. The lone kid on row 2
may be partially below the fold at 810 px viewport height.

**Option B — split into two chores cards**: Put 3 kids in one card, 2+ in a second, and stack
them vertically. Each card has its own title ("Morning Chores — Group A", etc.).

**Option C — use a wider display**: iPad Pro 12.9" at 1366 CSS px wide shows 6 columns of 220 px
each comfortably, so all 5 kids fit on one row.

### Example: 5-kid split layout

```yaml
- type: custom:lucarne-chores-card
  title: "Chores — A B C"
  kids:
    - name: Kid A
      color: "#f5c89c"
      streak: counter.kid_a_streak
      chores:
        - name: Brush teeth
          entity: input_boolean.kid_a_brush_teeth
        - name: Make bed
          entity: input_boolean.kid_a_make_bed
        - name: School bag
          entity: input_boolean.kid_a_school_bag
    - name: Kid B
      color: "#b8e0d2"
      streak: counter.kid_b_streak
      chores:
        - { name: Brush teeth, entity: input_boolean.kid_b_brush_teeth }
        - { name: Make bed,    entity: input_boolean.kid_b_make_bed }
        - { name: School bag,  entity: input_boolean.kid_b_school_bag }
    - name: Kid C
      color: "#f0b8c8"
      streak: counter.kid_c_streak
      chores:
        - { name: Brush teeth, entity: input_boolean.kid_c_brush_teeth }
        - { name: Make bed,    entity: input_boolean.kid_c_make_bed }
        - { name: School bag,  entity: input_boolean.kid_c_school_bag }

- type: custom:lucarne-chores-card
  title: "Chores — D E"
  kids:
    - name: Kid D
      color: "#d4cfc4"
      streak: counter.kid_d_streak
      chores:
        - { name: Brush teeth, entity: input_boolean.kid_d_brush_teeth }
        - { name: Make bed,    entity: input_boolean.kid_d_make_bed }
    - name: Kid E
      color: "#f0dca0"
      streak: counter.kid_e_streak
      chores:
        - { name: Brush teeth, entity: input_boolean.kid_e_brush_teeth }
        - { name: Make bed,    entity: input_boolean.kid_e_make_bed }
```

For each new kid, create the corresponding `input_boolean.*` helpers (one per chore) and a
`counter.*` helper for the streak. Then update the single `lucarne_chores_streak_advance` automation
instance: add the new kid to the `kid_configs` JSON array input. Similarly, add the new kid's chore
entities to the `chore_entities` list in `lucarne_chores_daily_reset`.

---

## Recipe 3: Apartment without a Mac — HA todo only

**Skip the Reminders bridge.** Use HA's built-in `local_todo` directly.

Create todo lists in HA: Settings → Helpers → + (plus) → To-do list. Name them (e.g.
"Shared Tasks", "Groceries"). Add items via the HA app, the iOS Companion widget, or a voice
assistant.

The `lucarne-today-card` can show any `todo.*` entity in its task badge:

```yaml
type: custom:lucarne-today-card
calendars:
  - entity: calendar.personal
    color: "#a8c5e8"
tasks: todo.shared_tasks    # any local_todo entity — no bridge needed
```

The `lucarne-calendar-card` has no dependency on the bridge at all.

### Adding items via iOS Companion

1. Open HA Companion → choose the todo list → tap +
2. Or say "Hey Siri, add milk to Groceries" if you have a Siri shortcut set up that calls
   `ha_call_service` for `todo.add_item`

### Groceries without a Mac

You can replicate the Reminders → HA flow without a Mac by using a Focus Mode automation in iOS
that calls the HA Companion app action when you add a Reminders item — but this is complex to
set up. The no-Mac simplest approach is direct HA todo input.
