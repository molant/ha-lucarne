"""Lucarne Family integration."""
from __future__ import annotations

import logging
import os
import uuid
from typing import Any

from homeassistant.components.todo import TodoItem
from homeassistant.components.todo.const import TodoItemStatus
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN, PRESET_ADULT_NONE
from .models import Member
from .presets import BUILTIN_PRESETS
from .store import LucarneFamilyStore

_LOGGER = logging.getLogger(__name__)


async def async_setup(_hass: HomeAssistant, _config: dict[str, Any]) -> bool:
    """Set up the Lucarne Family integration."""
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Lucarne Family from a config entry."""
    db_path = os.path.join(hass.config.config_dir, f"lucarne_family_{entry.entry_id}.db")
    store = LucarneFamilyStore(hass, entry.entry_id, db_path)
    await store.async_init()

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {"store": store}

    entry.async_on_unload(entry.add_update_listener(async_options_updated))

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    domain_data = hass.data.get(DOMAIN, {})
    entry_data = domain_data.pop(entry.entry_id, None)
    if entry_data:
        await entry_data["store"].async_close()
    return True


async def async_options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update."""
    _LOGGER.debug("Options updated: %s", entry.entry_id)


# ---------------------------------------------------------------------------
# Preset seeding
# ---------------------------------------------------------------------------


async def seed_preset_routines(
    hass: HomeAssistant,
    store: LucarneFamilyStore,
    member: Member,
) -> None:
    """Add preset routine items to a member's todo entity and insert task_metadata rows.

    Called exactly once after a new member's entities are created. Never called
    during reload / reconciliation to prevent duplicate rows.
    """
    preset = BUILTIN_PRESETS.get(member.preset)
    if preset is None or member.preset == PRESET_ADULT_NONE or not preset.routines:
        return

    if not member.todo_entity_id:
        _LOGGER.warning(
            "seed_preset_routines called for member %r without todo_entity_id", member.slug
        )
        return

    from homeassistant.components.todo.const import DATA_COMPONENT

    todo_component = hass.data.get(DATA_COMPONENT)
    if todo_component is None:
        _LOGGER.warning("todo component not loaded; skipping preset seeding for %s", member.slug)
        return

    entity = todo_component.get_entity(member.todo_entity_id)
    if entity is None:
        _LOGGER.warning(
            "Todo entity %s not found; skipping preset seeding for %s",
            member.todo_entity_id,
            member.slug,
        )
        return

    # Idempotency guard: skip if template rows already exist for this member.
    existing = await store.async_get_tasks_for_member(member.slug)
    if any(t["source"] == "template" for t in existing):
        return

    for template in preset.routines:
        item_uid = str(uuid.uuid4())
        await entity.async_create_todo_item(
            TodoItem(
                uid=item_uid,
                summary=template.summary,
                status=TodoItemStatus.NEEDS_ACTION,
            )
        )
        await store.async_add_task_metadata(
            member_slug=member.slug,
            item_uid=item_uid,
            type="routine",
            recurrence=template.recurrence,
            icon=template.icon,
            source="template",
        )
