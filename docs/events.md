# Custom Events

## ha_lucarne_chores_all_done

Fired by `lucarne-chores-card` the moment a kid transitions from **not-all-done** to
**all-done** — i.e., when the last chore for that kid is checked off within the current
browser session. The event does NOT replay on page load if a kid was already all-done.

### Semantics

- Fired from the card via a `fire_event` WebSocket message: `this.hass.connection.sendMessagePromise({ type: 'fire_event', event_type: 'ha_lucarne_chores_all_done', event_data: {...} })`.
- Fires once per `not-all-done → all-done` transition for each kid within the current
  browser session. If a chore is later unchecked and all chores are then re-completed,
  the event fires again. State is held in the card instance, so a full page reload resets
  the tracking.
- The `streak` field reflects the counter value at the moment of the transition, **before** the
  nightly streak check has run. The `lucarne_family` integration runs
  `lucarne_family.evaluate_all_streaks` at the configured `streak_check_time` (21:00 by default)
  and may set the streak to a different value (increment, leave unchanged, or reset to zero).
  The recompute reads the integration's completion log, not the card's `input_boolean` state.
- The event fires for any not-all-done → all-done transition observed **while the card is
  rendered**, regardless of whether the chore was toggled via the card's tap target or an
  external source (developer tools, another automation, etc.). If the card is not loaded,
  no event fires. The streak-advance check always runs against the integration's completion log,
  independent of whether the card is loaded.

### Schema

```yaml
event_type: ha_lucarne_chores_all_done
event_data:
  kid_slug: kid_1         # Slugified kid name (name.toLowerCase().replace(/\s+/g, '_'))
  kid_name: "Kid 1"       # Display name from card YAML config
  date: "2026-05-21"      # ISO 8601 local date at the moment of the event
  chores_completed: 5     # Count of chores configured for this kid
  streak: 7               # Current counter state at transition time (before nightly increment)
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
