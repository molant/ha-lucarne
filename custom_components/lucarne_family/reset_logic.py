"""Daily reset logic for the Lucarne Family integration."""
from __future__ import annotations

import logging

from homeassistant.components.todo import TodoItem
from homeassistant.components.todo.const import DATA_COMPONENT, TodoItemStatus
from homeassistant.core import HomeAssistant

from .store import LucarneFamilyStore

_LOGGER = logging.getLogger(__name__)


async def async_perform_daily_reset(hass: HomeAssistant, store: LucarneFamilyStore) -> int:
    """Flip all completed routine items back to needs_action for all members.

    Returns the total number of items reset across all members.
    Idempotent: items already in needs_action are untouched, so a second call
    on the same day returns 0.
    """
    members = store.get_members()
    total_reset = 0

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

            await entity.async_update_todo_item(
                TodoItem(
                    uid=item_uid,
                    summary=item.summary,
                    status=TodoItemStatus.NEEDS_ACTION,
                    due=item.due,
                    description=item.description,
                )
            )
            await store.async_append_completion(
                member_slug=member.slug,
                item_uid=item_uid,
                summary=item.summary or "",
                action="reset",
                recurrence_at_time=metadata.get("recurrence", ""),
            )
            total_reset += 1

    return total_reset
