# Lucarne Family — Integration Guide

## Install

1. Copy (or deploy via `scripts/deploy-integration.sh`) the `custom_components/lucarne_family/` directory to your HA `config/custom_components/` folder.
2. Restart Home Assistant.
3. Go to **Settings → Devices & Services → Add Integration** and search for **Lucarne Family**.
4. Enter your family name (e.g. "The Smiths") and click Submit. The integration is installed.

Only one Lucarne Family integration can be installed per HA instance.

## First run

After install, the integration:
- Creates a config entry with an empty members list.
- Initialises the SQLite database (`lucarne_family_<entry_id>.db` in your config directory) with the task and completion-log schema.
- Registers options-flow listeners for future edits.

No entities, helpers, or automations are created in Phase 1. Those appear starting Phase 2.

## Member management

Open **Settings → Devices & Services → Lucarne Family → Configure** to manage members.

### Add a member

1. Choose **Manage members → Add member**.
2. Fill in:
   - **Name** — displayed in cards (e.g. "Anna"). Must be non-empty and ≤ 50 characters.
   - **Color** — hex color (e.g. `#f5c89c`). Used for visual identification in cards.
   - **Avatar** — emoji (e.g. `🧒`) or a path under `/local/lucarne/avatars/` (Phase 6 adds upload UI).
   - **Routine preset** — choose a starting set of daily routines:
     - **School-age kid** — brush teeth, make bed, pack school bag (weekdays), kindness act, screen time off
     - **Toddler** — brush teeth, get dressed, put toys away
     - **Adult (none)** — empty; adults typically only need household chores
3. Click Submit. The member is saved. A stable **slug** is derived from the name (e.g. "Anna" → `anna`).

### Edit a member

1. Choose **Manage members → Edit member**.
2. Select the member to edit.
3. Update name, color, avatar, or preset.
4. Click Submit.

> **Note**: The slug is frozen at creation. Renaming "Anna" to "Anna-Maria" does not change the slug (`anna`). A full rename flow (with entity-ID update and downstream-impact preview) will be added in Phase 2.

### Remove a member

1. Choose **Manage members → Remove member**.
2. Select the member.
3. Type the member's exact name to confirm. This is destructive and cannot be undone.

> In Phase 1, no entities are deleted (none were created yet). Phase 2 adds entity lifecycle management.

## Schedule settings

Choose **Edit schedule** to adjust:

- **Daily reset time** (default `04:00`) — when routine tasks flip back to `needs_action`.
- **Streak check time** (default `21:00`) — when the streak counter is recomputed.

These times are used by the managed automations created in Phase 3.

## Troubleshooting

- **Integration not visible in Add Integration**: Verify `custom_components/lucarne_family/` is in the right location and `manifest.json` is present.
- **Setup errors**: Check HA logs (`Settings → System → Logs`) and filter for `lucarne_family`.
- **Deploy script**: Run `scripts/deploy-integration.sh` to scp the integration to `ha-vm`.
