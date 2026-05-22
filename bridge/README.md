# Mac mini Bridge — Install Instructions

Sets up the `ha-lucarne-sync` macOS Shortcut + launchd job that pushes Apple Reminders to HA every 5 minutes.

## Prerequisites

- macOS 13 (Ventura) or later
- Shortcuts.app launched at least once (required for `shortcuts run` CLI)
- iCloud account signed in to Reminders, with access to the Family and Groceries lists
- Mac mini configured to **not sleep** (System Settings → Lock Screen → disable "Put computer to sleep when display is off")

## 1. Generate webhook secret + store in Keychain

On this Mac mini (or any machine, then transfer):

```sh
openssl rand -hex 32
```

Copy the output. Then store it:

```sh
security add-generic-password -a "ha-lucarne" -s "ha-lucarne-webhook-secret" -w "<the-secret>"
```

To retrieve later (used by the Shortcut at runtime):

```sh
security find-generic-password -a "ha-lucarne" -s "ha-lucarne-webhook-secret" -w
```

## 2. Build and install the Shortcut

> **Note**: The `ha-lucarne-sync.shortcut` binary is not committed to the repo (it's user-specific and created locally). `bridge/ha-lucarne-sync.json` in the repo documents the Shortcut's logical structure. You must build it manually in Shortcuts.app following the steps below. The `.shortcut` file is exported after you build it and kept locally on the mini.

Open Shortcuts.app on the Mac mini and create a new Shortcut named `ha-lucarne-sync`. Build the following action sequence (refer to `bridge/ha-lucarne-sync.json` for the full logical structure):

1. **Run Shell Script** → `security find-generic-password -a 'ha-lucarne' -s 'ha-lucarne-webhook-secret' -w` → result: `WEBHOOK_SECRET`
2. **Get Reminders** from "Family" list, optionally filtered by Assignee = "Ingrid"
3. **Repeat with Each** → build `{id, title, due, completed, notes}` dict per reminder → accumulate to `family_items`
4. **Get Reminders** from "Groceries" list (all items)
5. **Repeat with Each** → build dict per reminder → accumulate to `groceries_items`
6. **Make Dictionary** → `{"lists": [{"apple_list_name": "Family", ...}, {"apple_list_name": "Groceries", ...}]}`
7. **Get Contents of URL** → POST to `http://homeassistant.local:8123/api/webhook/[WEBHOOK_SECRET]` with JSON body
8. **If** status ≠ 200 → log a notification

After building, update the list names if they differ from "Family" / "Groceries".

## 3. Test the Shortcut manually

In Shortcuts.app, click the Play (▶) button next to `ha-lucarne-sync`. Check HA — items should appear in `todo.ingrid_tasks` and `todo.groceries` within a few seconds.

Also test from Terminal:

```sh
shortcuts run "ha-lucarne-sync"
echo "Exit code: $?"
```

Exit code 0 = success.

## 4. Install the launchd agent

Copy the plist, substituting your macOS username:

```sh
sed 's/<USERNAME>/'"$(whoami)"'/g' com.molant.ha-lucarne-sync.plist \
  > ~/Library/LaunchAgents/com.molant.ha-lucarne-sync.plist

launchctl load ~/Library/LaunchAgents/com.molant.ha-lucarne-sync.plist
```

Verify it's loaded:

```sh
launchctl list | grep ha-lucarne-sync
```

Should show the label with exit code `0` (or `-` if not yet fired).

## 5. Monitor

```sh
tail -f ~/Library/Logs/ha-lucarne-sync.log
```

Successful runs are silent — the Shortcut only logs on HTTP non-200 errors. An empty or quiet log means the bridge is running correctly. To confirm syncs are firing: check HA's automation traces (`Developer Tools → Traces → automation.lucarne_reminders_sync`) or watch the `last_changed` timestamp on `todo.ingrid_tasks` after a sync cycle.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `shortcuts run` hangs or errors | Launch Shortcuts.app manually once, then retry |
| HTTP 200 but HA items don't update | Check automation trace in HA (`ha_get_automation_traces`). If no trace: `local_only: true` may be rejecting the mini's source IP (Tailscale issue). Set `local_only: false` in the blueprint instance. |
| Shortcut runs but Reminders list is empty | Confirm iCloud account is signed in on this Mac and the list is synced |
| launchd agent not firing | Check `launchctl list | grep ha-lucarne-sync` — non-zero exit code means the Shortcut errored. Check the log. |
| After macOS major upgrade | Re-launch Shortcuts.app manually — the `shortcuts run` CLI requires it |
