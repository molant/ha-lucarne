# Custom Events

## ha_lucarne_chores_all_done

Fired by `lucarne-chores-card` the moment a kid transitions from **not-all-done** to
**all-done** — i.e., when the last chore for that kid is checked off within the current
browser session. The event does NOT replay on page load if a kid was already all-done.

### Semantics

- Fired from the card via `hass.callService('homeassistant', 'fire_event', {...})`.
- Fires once per `not-all-done → all-done` transition for each kid within the current
  browser session. If a chore is later unchecked and all chores are then re-completed,
  the event fires again. State is held in the card instance, so a full page reload resets
  the tracking.
- The `streak` field reflects the counter value at the moment of the tap, **before** the
  nightly streak-advance automation has run. The nightly automation may increment the
  streak further at `streak_check_time` (21:00 by default).
- If chores are completed outside the card (e.g. via the HA developer tools), this event
  will not fire. The nightly streak-advance automation still runs from HA state, independent
  of whether the card is loaded.

### Schema

```yaml
event_type: ha_lucarne_chores_all_done
event_data:
  kid_slug: kid1          # Slugified kid name (name.toLowerCase().replace(/\s+/g, '_'))
  kid_name: "Kid 1"       # Display name from card YAML config
  date: "2026-05-21"      # ISO 8601 local date at the moment of the event
  chores_completed: 5     # Count of chores configured for this kid
  streak: 7               # Current counter state at tap time (before nightly increment)
```

### Example consumer automation

Listen for this event to trigger a TTS announcement or push notification:

```yaml
alias: "Chores all done — celebrate!"
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

### Breaking-change policy

The fields above are locked in v1. Adding new fields is backwards-compatible.
Renaming or removing existing fields is a breaking change and requires a major
version bump (v2.0.0).
