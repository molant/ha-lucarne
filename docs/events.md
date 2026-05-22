# Custom Events

## ha_lucarne_chores_all_done

Fired by `lucarne-chores-card` when all of a kid's daily chores are toggled on.

Schema (populated in Phase 4):

```yaml
event_type: ha_lucarne_chores_all_done
event_data:
  kid_slug: kid1
  kid_name: "Kid 1"
  date: "2026-05-21"
  chores_completed: 5
  streak: 7
```
