# Custom Events

## Integration events (lucarne_family)

The `lucarne_family` integration fires the following HA bus events. Subscribe to them in
automations via `trigger: event`.

---

### lucarne_family_task_completed

Fired when any managed todo item transitions from `needs_action` to `completed`, regardless of the
source (card tap, Developer Tools, voice command, another automation, etc.).

**Payload:**

```yaml
event_type: lucarne_family_task_completed
event_data:
  member: anna            # member slug
  uid: "abc-123"          # todo item UID
  summary: "Brush teeth"  # item display name at time of completion
```

---

### lucarne_family_all_routines_done

Fired on every false-to-true transition of the all-routines-done gate per member. If a routine
is later un-completed and the member completes it again, the event fires again. Does not fire if
all routines were already complete before the most recent toggle.

**Payload:**

```yaml
event_type: lucarne_family_all_routines_done
event_data:
  member: anna    # member slug
```

**Example consumer:**

```yaml
alias: "All routines done — celebrate!"
trigger:
  - trigger: event
    event_type: lucarne_family_all_routines_done
    event_data:
      member: anna
action:
  - service: tts.speak
    target:
      entity_id: tts.google_translate_en_com
    data:
      media_player_entity_id: media_player.kitchen_homepod
      message: "Great job Anna! All routines done today!"
```

---

### lucarne_family_task_added

Fired when `lucarne_family.add_task` successfully creates a new task.

**Payload:**

```yaml
event_type: lucarne_family_task_added
event_data:
  member: anna
  uid: "abc-123"
  type: routine       # "routine" or "chore"
  summary: "Make bed"
```

---

### lucarne_family_task_deleted

Fired when `lucarne_family.delete_task` removes a task.

**Payload:**

```yaml
event_type: lucarne_family_task_deleted
event_data:
  uid: "abc-123"
```

---

### lucarne_family_task_metadata_updated

Fired when `lucarne_family.update_task_metadata` modifies a task's metadata row.

**Payload:**

```yaml
event_type: lucarne_family_task_metadata_updated
event_data:
  uid: "abc-123"
```

---

### lucarne_family_task_toggled

Fired when `lucarne_family.toggle_task` flips a task's status. Note: the completion listener also
fires `lucarne_family_task_completed` for the same transition — this event is the service-call
signal, not a replacement for the completion event.

**Payload:**

```yaml
event_type: lucarne_family_task_toggled
event_data:
  uid: "abc-123"
  action: completed   # "completed" or "undone"
```

---

### lucarne_family_avatar_uploaded

Fired when `lucarne_family.upload_avatar` successfully writes an avatar file.

**Payload:**

```yaml
event_type: lucarne_family_avatar_uploaded
event_data:
  member: anna
  avatar: "/local/lucarne/avatars/anna.png"  # URL path served by HA
```

---

## Legacy card event — ha_lucarne_chores_all_done

> **Deprecation notice**: This event is deprecated as of Phase 3 and will be removed in v1.0.
> Migrate automations to `lucarne_family_all_routines_done` (above), which fires from the
> integration and does not require the card to be loaded.

Fired from `lucarne-chores-card` the moment a kid transitions from **not-all-done** to
**all-done** — i.e., when the last chore for that kid is checked off within the current
browser session. The event does NOT replay on page load if a kid was already all-done.

**Also fired by the integration** (Phase 3 compatibility shim) with a simplified payload
(`{member: slug}`) so existing automations continue to receive it even when the card is not
loaded. The integration payload differs from the card's legacy payload (see schemas below).

### Semantics

- Fired from the card via a `fire_event` WebSocket message: `this.hass.connection.sendMessagePromise({ type: 'fire_event', event_type: 'ha_lucarne_chores_all_done', event_data: {...} })`.
- Fires once per `not-all-done → all-done` transition for each kid within the current
  browser session. If a chore is later unchecked and all chores are then re-completed,
  the event fires again. State is held in the card instance, so a full page reload resets
  the tracking.
- The `streak` field reflects the counter value at the moment of the transition, **before** the
  nightly streak check has run. If you have the `lucarne_family` integration installed, it runs
  `lucarne_family.evaluate_all_streaks` at the configured `streak_check_time` (21:00 by default)
  and may set the streak to a different value (increment, leave unchanged, or reset to zero).
  The recompute reads the integration's completion log, not the card's `input_boolean` state.
- **Card firing**: the card fires this event for any not-all-done → all-done transition
  observed **while the card is rendered**, regardless of whether the chore was toggled via
  the card or an external source. If the card is not loaded, the card does not fire.
- **Integration shim**: starting Phase 3, the `lucarne_family` integration also fires
  `ha_lucarne_chores_all_done` (with the simplified `{member}` payload — see schema below)
  whenever all routines for a member transition to done. This fires independent of whether
  the card is loaded.

### Schema (card — legacy payload)

```yaml
event_type: ha_lucarne_chores_all_done
event_data:
  kid_slug: kid_1         # Slugified kid name (name.toLowerCase().replace(/\s+/g, '_'))
  kid_name: "Kid 1"       # Display name from card YAML config
  date: "2026-05-21"      # ISO 8601 local date at the moment of the event
  chores_completed: 5     # Count of chores configured for this kid
  streak: 7               # Current counter state at transition time (before nightly increment)
```

### Schema (integration — compatibility shim payload)

```yaml
event_type: ha_lucarne_chores_all_done
event_data:
  member: anna    # member slug (matches lucarne_family_all_routines_done payload)
```

### Example consumer automation

> **Card-payload only.** `ha_lucarne_chores_all_done` fired by the chores card carries
> `kid_name` and `streak`. The integration's compatibility shim fires the same event type
> but only includes `member`. New automations should use `lucarne_family_all_routines_done`
> (see [Example consumer automation](#example-consumer-automation-1) above).

```yaml
alias: "Chores all done — celebrate! (card payload)"
trigger:
  - trigger: event
    event_type: ha_lucarne_chores_all_done
action:
  - variables:
      kid: "{{ trigger.event.data.kid_name }}"
      streak: "{{ trigger.event.data.streak }}"
  - service: tts.speak
    target:
      entity_id: tts.google_translate_en_com   # replace with your TTS provider entity
    data:
      media_player_entity_id: media_player.kitchen_homepod
      message: >
        Great job {{ kid }}! All chores done today!
        {% if streak | int > 1 %}That's a {{ streak }}-day streak! {% endif %}
  # Or: send a push notification via the Companion app
  # - service: notify.mobile_app_iphone
  #   data:
  #     title: "🎉 {{ kid }} finished their chores!"
  #     message: "Streak: {{ streak }} days"
```

**Recommended migration:**

```yaml
# Replace ha_lucarne_chores_all_done with:
trigger:
  - trigger: event
    event_type: lucarne_family_all_routines_done
    event_data:
      member: anna   # use the member slug
```

### Breaking-change policy

The fields above are locked in v1. Adding new fields is backwards-compatible.
Renaming or removing existing fields is a breaking change and requires a major
version bump (v2.0.0).

`ha_lucarne_chores_all_done` pre-dates this policy and is exempt from the v1
lock. It will be removed in the first stable release (v1.0.0).
