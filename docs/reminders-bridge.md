# Reminders Bridge

End-to-end flow: Mac mini Shortcuts.app → HA webhook → local_todo entities → iPad dashboard.

## Flow

1. launchd fires `shortcuts run ha-lucarne-sync` every 300 s
2. Shortcut reads configured Apple Reminders lists, applies per-list filters
3. Shortcut builds JSON payload and POSTs to `http://homeassistant.local:8123/api/webhook/<secret>`
4. HA automation receives webhook, diffs items by Apple Reminder ID, upserts into `todo.*` entities
5. Wall-iPad stock `todo-list` cards display updated items

## Known failure modes

- Mac mini asleep: launchd won't fire. Fix: System Settings → Lock Screen → disable "Put computer to sleep" when display off.
- Shortcuts.app not launched after macOS upgrade: `shortcuts run` CLI requires the app to have been launched once per major OS version.
- `local_only: true` rejects Tailscale source IPs: if mini reaches HA via Tailscale (100.x), flip to `local_only: false`; shared-secret-in-URL is the auth.
- Network partition between mini and HA: items queue up in Reminders, next successful sync catches up.

## Log locations

- Mac mini: `~/Library/Logs/ha-lucarne-sync.log`
- HA: `ha_get_logs` (filter: `lucarne`)
