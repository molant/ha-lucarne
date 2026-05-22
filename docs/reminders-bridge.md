# Reminders Bridge

End-to-end flow: Mac mini Shortcuts.app → HA webhook → local_todo entities → iPad dashboard.

## Flow

1. launchd fires `shortcuts run ha-lucarne-sync` every 300 s
2. Shortcut reads configured Apple Reminders lists, applies per-list filters
3. Shortcut builds JSON payload and POSTs to `http://homeassistant.local:8123/api/webhook/<secret>`
4. HA automation receives webhook, diffs items by Apple Reminder UID, upserts into `todo.*` entities
5. Wall-iPad today card displays updated items (task-count badge)

## Log locations

- Mac mini: `~/Library/Logs/ha-lucarne-sync.log`
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
