"""Daily reset logic for the Lucarne Family integration."""
from __future__ import annotations

import logging

from homeassistant.components.todo import TodoItem
from homeassistant.components.todo.const import DATA_COMPONENT, TodoItemStatus
from homeassistant.core import HomeAssistant

from .completion_listener import _RESET_PENDING_KEY
from .store import LucarneFamilyStore

_LOGGER = logging.getLogger(__name__)


async def async_perform_daily_reset(hass: HomeAssistant, store: LucarneFamilyStore) -> int:
    """Flip all completed routine items back to needs_action for all members.

    Returns the total number of items reset across all members.
    Idempotent: items already in needs_action are untouched, so a second call
    on the same day returns 0.

    Completion logging is delegated to completion_listener via the reset-pending
    mechanism: each UID is added to hass.data[_RESET_PENDING_KEY] before
    async_update_todo_item is called, so the listener classifies the resulting
    COMPLETED→NEEDS_ACTION state change as action="reset" (not "undone").
    """
    members = store.get_members()
    total_reset = 0
    reset_pending: set[str] = hass.data.setdefault(_RESET_PENDING_KEY, set())

    for member in members:
        if not member.todo_entity_id:
            continue

        todo_component = hass.data.get(DATA_COMPONENT)
        if todo_component is None:
            _LOGGER.warning("todo component not loaded; skipping reset for %s", member.slug)
            continue

        entity = todo_component.get_entity(member.todo_entity_id)
        if entity is None:
            _LOGGER.warning(
                "Todo entity %s not found; skipping reset for member %r",
                member.todo_entity_id,
                member.slug,
            )
            continue

        items = entity.todo_items or []

        for item in items:
            if item.status != TodoItemStatus.COMPLETED:
                continue

            item_uid = item.uid
            if not item_uid:
                continue

            metadata = await store.async_get_task_metadata(item_uid)
            if metadata is None or metadata.get("type") != "routine":
                continue

            # Mark as reset-pending BEFORE the update so the completion_listener
            # classifies the resulting state change as action="reset" not "undone".
            # Clean up on failure so a later user-driven undo is not mis-logged.
            reset_pending.add(item_uid)
            try:
                await entity.async_update_todo_item(
                    TodoItem(
                        uid=item_uid,
                        summary=item.summary,
                        status=TodoItemStatus.NEEDS_ACTION,
                        due=item.due,
                        description=item.description,
                    )
                )
            except Exception:
                reset_pending.discard(item_uid)
                raise
            total_reset += 1

    return total_reset
