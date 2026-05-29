# Reminders Bridge

End-to-end flow: MacOS Shortcuts.app → HA webhook → local_todo entities → iPad dashboard.

## Flow

1. launchd fires `shortcuts run ha-lucarne-sync` every 300 s
2. Shortcut reads configured Apple Reminders lists, applies per-list filters
3. Shortcut builds JSON payload and POSTs to `http://homeassistant.local:8123/api/webhook/<secret>`
4. HA automation receives webhook, diffs items by Apple Reminder UID, upserts into `todo.*` entities
5. Wall-iPad today card displays updated items (task-count badge)

## Log locations

- MacOS: `~/Library/Logs/ha-lucarne-sync.log`
- HA: Settings → Automations & Scenes → `lucarne_reminders_sync` → Traces tab

---

## Troubleshooting FAQ

### "Reminders not syncing — nothing appears in HA"

1. Check launchd is running the agent:
   ```sh
   launchctl list | grep ha-lucarne-sync
   ```
   Expected output: one line with `0` exit code. Non-zero = Shortcut errored.

2. Check the log:
   ```sh
   tail ~/Library/Logs/ha-lucarne-sync.log
   ```
   Quiet log (no output) means the Shortcut runs successfully but the Keychain lookup or
   Shortcuts.app launch hasn't had a problem yet — look for HTTP non-200 responses.

3. Confirm Shortcuts.app has been launched at least once (required for `shortcuts run` CLI after
   each macOS major version upgrade). Launch it from Spotlight, then re-run:
   ```sh
   shortcuts run "ha-lucarne-sync"
   echo "Exit: $?"
   ```

4. If HA is reached via Tailscale (100.x address), open the `lucarne_reminders_sync` automation
   instance and set **Local only** to **off** (disables RFC1918-only restriction).

### "Items appear duplicated in HA"

The blueprint deduplicates by Apple Reminder UID (`id` field from the Shortcut). If you see
duplicates, the Shortcut may be sending empty or malformed UIDs. Check the Shortcut's `id` action:
it must read the `id` property from each Reminder, not the `name`.

To clean up existing duplicates: HA → the todo entity → delete duplicate items manually.

### "Items completed in HA reappear after the next sync"

Expected behavior in v0.1. The bridge is **one-way** (Reminders → HA). Completing an item in HA
does not mark it complete in Apple Reminders, so the next sync re-adds it as incomplete.

Fix in v0.2: the bridge will read HA todo completion state and mark the corresponding Apple
Reminder complete. Until then, complete items in Apple Reminders (on your iPhone/Mac), not in HA.

### "Sync runs but the todo entity is empty"

Confirm the Reminders list names in the Shortcut match your actual iCloud list names exactly
(case-sensitive). Open Shortcuts.app → find `ha-lucarne-sync` → check the "Get Reminders" steps.

Also confirm the iCloud account is signed in on this Mac and the lists are synced: open
Reminders.app and verify the lists appear.

### "Mac mini goes to sleep overnight"

System Settings → Lock Screen → set "Put computer to sleep when display is off" to **Never**.

The mini must stay awake for launchd to fire. Check the current sleep setting:
```sh
pmset -g | grep sleep
```
`sleep 0` = never sleep.

### "launchd agent fires but errors with code 1"

Check the log for the actual error. Common causes:
- Keychain entry missing: re-run `security add-generic-password -a "ha-lucarne" -s "ha-lucarne-webhook-secret" -w "<secret>"`
- HA unreachable: ping `homeassistant.local` from the mini
- Webhook URL changed: verify the URL in the Shortcut matches the blueprint's configured webhook token

### "Adapting the bridge to fewer or more Reminders lists"

Open the Shortcut in Shortcuts.app and add or remove "Get Reminders" + "Repeat with Each" step
pairs — one pair per list. Then open the `lucarne_reminders_sync` automation instance and edit the
**List Mappings** JSON field to add or remove the corresponding key/value pair, e.g.:
```json
{"Family": "todo.ingrid_tasks", "Groceries": "todo.groceries"}
```

### "Using shared iCloud lists vs. private lists"

The Shortcut reads any list you configure. For shared lists (e.g. a Family list where both adults
can add items), the Shortcut picks up all items regardless of who added them. If you want per-
person filtering (e.g. only Ingrid's assignments), add an Assignee filter in the Shortcut's
"Get Reminders" step: filter by Assignee = "Ingrid".

## Known failure modes

| Symptom | Cause | Fix |
|---------|-------|-----|
| `shortcuts run` hangs | Shortcuts.app not launched | Launch it manually once |
| HTTP 200 but no HA update | Local-only rejecting Tailscale IP | Open automation instance → set **Local only** to **off** |
| List is empty in HA | iCloud not synced on this Mac | Sign in to iCloud, open Reminders.app |
| Sync stops after macOS upgrade | `shortcuts run` CLI reset | Re-launch Shortcuts.app manually |
| Network partition | Mini can't reach HA | Items queue in Reminders; next sync catches up |

---

## Round-trip writeback (designed for v0.2; writeback POST deferred to a future spec)

The integration is ready to fire the round-trip event. The webhook POST from HA → Mac mini is
deferred to a future spec.

### What is ready now

When a task with `source == "apple"` **and a non-empty `apple_uid`** (set by the Apple sentinel
backfill) flips to `completed` **and** `round_trip.enabled == true` in the Options Flow config,
the integration fires:

```yaml
event_type: lucarne_family_apple_writeback_requested
event_data:
  apple_uid: "Apple-UUID-string"   # from [apple:UUID] sentinel in item description
  status: "completed"
  timestamp: "2026-05-25T14:30:00+00:00"   # UTC ISO-8601
  device_name: "Mac mini"          # from Options Flow config
```

`webhook_url` and `secret` are **never** included in the event payload. HA events are visible to
every integration and any user with Developer Tools access; secrets stay in `entry.data` only.

Enable round-trip in the Options Flow:
**Settings → Devices & Services → Lucarne Family → Configure → Apple Reminders sync**

### Accessor contract for future subscribers

Future-spec code that subscribes to `lucarne_family_apple_writeback_requested` and needs to POST
to the webhook **MUST** call:

```python
from custom_components.lucarne_family import get_round_trip_config

config = get_round_trip_config(hass)
# config is None if the integration is not set up or round-trip is disabled.
# config.webhook_url, config.secret, config.device_name are the typed fields.
```

**NEVER read `entry.data["round_trip"]` directly.** The accessor abstracts the storage layout so
a future migration does not break subscribers.

### Full protocol (for the future-spec implementer)

**Trigger**: HA event `lucarne_family_apple_writeback_requested` — subscriber receives it from
the HA bus. Get `webhook_url` and `secret` by calling `get_round_trip_config(hass)`.

**Receiver**: any device with Apple Reminders write access (Mac mini in the current bridge,
or any iCloud-connected automation server).

**Webhook contract** — POST to `webhook_url`:

```json
{
  "apple_uid": "<UUID>",
  "status": "completed",
  "timestamp": "2026-05-23T17:00:00Z",
  "device_name": "Mac mini"
}
```

**Authentication**: HMAC-SHA256 of the raw JSON body using `secret`, sent as `X-Lucarne-Signature`
header. Receiver verifies before acting.

```
X-Lucarne-Signature: sha256=<hex_digest>
```

**Idempotency**: receiver must handle duplicate webhooks (HA may retry on network failure). Use
`apple_uid + status + timestamp` as the dedup key.

**Failure modes (future subscriber requirement)**: the subscriber should catch network errors,
log them, and not retry. Retry queues are out of scope for this design. In v0.2 no HTTP request
is made — the event is fired on the HA bus only.

**Mac mini side** (future spec): add a Shortcuts automation or Python subscriber that receives
the webhook, reads `apple_uid`, calls `EKEventStore.calendarItem(withIdentifier:)` (cast to
`EKReminder`) or `fetchReminders(matching:completion:)`, and marks the Reminder completed.

### Why this design

- **Webhook + HMAC** is symmetric to the inbound bridge — same mental model for both directions.
- **Generic "sync device" naming** keeps the config portable: any Mac or iCloud-connected server
  can receive the webhook, not just the Mac mini.
- **HMAC vs. shared-secret-in-URL**: HMAC chosen because it survives URL logging and proxy caches
  that would expose a plain token in the query string.
- **Secrets stay in entry.data**: firing an HA event with the secret would expose it to any
  automation author, log parser, or Developer Tools user — unacceptable for a credential.
