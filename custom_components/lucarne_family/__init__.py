"""Lucarne Family integration."""
from __future__ import annotations

import dataclasses
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

    # Ensure the shared household todo entity exists.
    from .entity_manager import async_ensure_household_entity

    try:
        await async_ensure_household_entity(hass)
    except Exception as exc:
        _LOGGER.warning("Failed to ensure household entity during setup: %s", exc)

    # Reconcile per-member entities (recreate missing; warn on orphans).
    await _async_reconcile_member_entities(hass, store)

    # Register task services, avatar service, and the WebSocket read command.
    from .avatar_service import async_setup_avatar_service
    from .task_service import async_setup_services
    from .websocket_api import async_register_websocket_commands

    await async_setup_services(hass, entry.entry_id)
    await async_setup_avatar_service(hass, entry.entry_id)
    async_register_websocket_commands(hass)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    domain_data = hass.data.get(DOMAIN, {})
    entry_data = domain_data.pop(entry.entry_id, None)
    if entry_data:
        await entry_data["store"].async_close()

    # Unload services when the last entry is removed.
    remaining_entries = {
        k: v for k, v in domain_data.items() if isinstance(v, dict) and "store" in v
    }
    if not remaining_entries:
        from .avatar_service import async_unload_avatar_service
        from .task_service import async_unload_services

        await async_unload_services(hass)
        await async_unload_avatar_service(hass)

    return True


async def async_options_updated(_hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update."""
    _LOGGER.debug("Options updated: %s", entry.entry_id)


async def _async_reconcile_member_entities(
    hass: HomeAssistant,
    store: LucarneFamilyStore,
) -> None:
    """Reconcile per-member todo+counter entities with stored member data.

    - Member exists in data but todo or counter entity is missing → warn and recreate both.
    - Local-todo entity not tracked by any member → warn (possible orphan from deleted member).

    Does not reseed preset routines for recreated entities — seeding is one-time on member add.
    Phase 3 replaces this with an explicit seven-step setup order.
    """
    from homeassistant.helpers.entity_registry import async_get as er_get

    from .entity_manager import async_create_member_entities

    er = er_get(hass)
    members = store.get_members()
    updated_members = list(members)
    dirty = False

    for i, member in enumerate(members):
        expected_todo = member.todo_entity_id or f"todo.{member.slug}"
        expected_counter = member.streak_counter_id or f"counter.{member.slug}_streak"
        todo_present = er.async_get(expected_todo) is not None
        counter_present = er.async_get(expected_counter) is not None

        if todo_present and counter_present:
            continue

        # Partial state (one entity present, one missing): async_create_member_entities
        # would fail because it guards against existing entity_ids and the IDManager
        # would assign a suffixed id for the missing side. Warn and skip — Phase 3
        # introduces explicit per-side recovery helpers.
        if todo_present and not counter_present:
            _LOGGER.warning(
                "Streak counter %s for member %r is missing but todo entity is present. "
                "Re-add the counter helper manually or re-add the member to restore it.",
                expected_counter,
                member.slug,
            )
            continue
        if not todo_present and counter_present:
            _LOGGER.warning(
                "Todo entity %s for member %r is missing but streak counter is present. "
                "Re-add the todo helper manually or re-add the member to restore it.",
                expected_todo,
                member.slug,
            )
            continue

        # Both missing — safe to call async_create_member_entities.
        _LOGGER.warning(
            "Both entities for member %r are missing; attempting to recreate (todo=%s, counter=%s)",
            member.slug,
            expected_todo,
            expected_counter,
        )
        try:
            new_todo_id, new_counter_id = await async_create_member_entities(hass, member)
            updated_members[i] = dataclasses.replace(
                member,
                todo_entity_id=new_todo_id,
                streak_counter_id=new_counter_id,
            )
            dirty = True
        except Exception as exc:
            _LOGGER.error(
                "Failed to recreate entities for member %r during reconciliation: %s",
                member.slug,
                exc,
            )

    if dirty:
        await store.async_save_members(updated_members)

    # Warn about local_todo entities not tracked by any member (possible orphans).
    # Use the same fallback as the loop above so legacy members without stored entity_ids
    # don't trigger false-positive orphan warnings.
    known_todo_ids = {
        m.todo_entity_id or f"todo.{m.slug}" for m in updated_members
    } | {"todo.lucarne_household"}
    for ce in hass.config_entries.async_entries("local_todo"):
        for er_entry in list(er.entities.values()):
            if er_entry.config_entry_id == ce.entry_id and er_entry.domain == "todo":
                if er_entry.entity_id not in known_todo_ids:
                    _LOGGER.warning(
                        "Todo entity %s is not tracked by any lucarne_family member; "
                        "it may be an orphaned entity from a deleted member",
                        er_entry.entity_id,
                    )


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
