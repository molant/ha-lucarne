"""Tests for lucarne_family_apple_writeback_requested event (Phase 6-C).

Verifies that completing an apple-sourced task fires the writeback event when
round_trip.enabled is True, and does not fire otherwise.
"""
from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from homeassistant.components.todo import TodoItem
from homeassistant.components.todo.const import DATA_COMPONENT, TodoItemStatus
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.lucarne_family.completion_listener import (
    async_start_completion_listener,
)
from custom_components.lucarne_family.const import DOMAIN, EVENT_APPLE_WRITEBACK_REQUESTED
from custom_components.lucarne_family.models import Member
from custom_components.lucarne_family.store import LucarneFamilyStore

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _make_entry(
    hass: HomeAssistant,
    slug: str = "anna",
    round_trip_enabled: bool = False,
    device_name: str = "Sync device",
) -> MockConfigEntry:
    member = Member(
        slug=slug,
        name=slug.capitalize(),
        color="#ff0000",
        avatar=None,
        created_at=datetime.now(UTC),
        preset="school-age",
        todo_entity_id=f"todo.{slug}",
        streak_counter_id=f"counter.{slug}_streak",
    )
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Family",
        data={
            "family_name": "Family",
            "members": [member.to_dict()],
            "reset_time": "04:00",
            "streak_check_time": "21:00",
            "round_trip": {
                "enabled": round_trip_enabled,
                "webhook_url": "https://example.com/webhook",
                "secret": "s" * 32,
                "device_name": device_name,
            },
            "custom_presets": [],
        },
    )
    entry.add_to_hass(hass)
    return entry


async def _setup_member_todo(hass: HomeAssistant, slug: str = "anna") -> None:
    await async_setup_component(hass, "local_todo", {})
    await async_setup_component(hass, "todo", {})
    await hass.async_block_till_done()
    result = await hass.config_entries.flow.async_init(
        "local_todo",
        context={"source": "user"},
        data={"todo_list_name": slug},
    )
    await hass.async_block_till_done()
    assert result.get("type") == "create_entry"


async def _make_store(
    hass: HomeAssistant, entry_id: str, tmp_path: Path
) -> LucarneFamilyStore:
    db_path = str(tmp_path / "lucarne.db")
    store = LucarneFamilyStore(hass, entry_id, db_path)
    await store.async_init()
    return store


def _get_entity(hass: HomeAssistant, entity_id: str) -> Any:
    todo_component = hass.data[DATA_COMPONENT]
    entity = todo_component.get_entity(entity_id)
    assert entity is not None, f"Entity {entity_id} not found"
    return entity


async def _add_apple_item(
    hass: HomeAssistant,
    store: LucarneFamilyStore,
    entity_id: str,
    uid: str,
    summary: str,
    apple_uid: str,
    member_slug: str = "anna",
) -> None:
    entity = _get_entity(hass, entity_id)
    await entity.async_create_todo_item(
        TodoItem(uid=uid, summary=summary, status=TodoItemStatus.NEEDS_ACTION)
    )
    await store.async_add_task_metadata(
        member_slug=member_slug,
        item_uid=uid,
        type="chore",
        recurrence="",
        source="apple",
        apple_uid=apple_uid,
    )
    await hass.async_block_till_done()


async def _add_regular_item(
    hass: HomeAssistant,
    store: LucarneFamilyStore,
    entity_id: str,
    uid: str,
    summary: str,
    member_slug: str = "anna",
) -> None:
    entity = _get_entity(hass, entity_id)
    await entity.async_create_todo_item(
        TodoItem(uid=uid, summary=summary, status=TodoItemStatus.NEEDS_ACTION)
    )
    await store.async_add_task_metadata(
        member_slug=member_slug,
        item_uid=uid,
        type="chore",
        recurrence="",
        source="manual",
    )
    await hass.async_block_till_done()


async def _complete_item(
    hass: HomeAssistant, entity_id: str, uid: str, summary: str
) -> None:
    entity = _get_entity(hass, entity_id)
    await entity.async_update_todo_item(
        TodoItem(uid=uid, summary=summary, status=TodoItemStatus.COMPLETED)
    )
    await hass.async_block_till_done()


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


async def test_apple_writeback_event_fires_when_enabled(
    hass: HomeAssistant, tmp_path: Path
) -> None:
    """Apple-tagged item completes + round_trip.enabled=True → writeback event fires."""
    await _setup_member_todo(hass, "anna")
    entry = _make_entry(hass, round_trip_enabled=True, device_name="Mac mini")
    store = await _make_store(hass, entry.entry_id, tmp_path)
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {"store": store}

    await _add_apple_item(hass, store, "todo.anna", "uid-1", "Buy milk", apple_uid="apple-abc-123")

    events: list[dict[str, Any]] = []
    hass.bus.async_listen(EVENT_APPLE_WRITEBACK_REQUESTED, lambda e: events.append(e.data))

    unsub = async_start_completion_listener(
        hass, store, {"todo.anna"}, entry_id=entry.entry_id
    )
    await _complete_item(hass, "todo.anna", "uid-1", "Buy milk")
    unsub()

    assert len(events) == 1, f"Expected 1 event, got {len(events)}"
    assert events[0]["apple_uid"] == "apple-abc-123"
    assert events[0]["status"] == "completed"
    assert "timestamp" in events[0]
    assert events[0]["device_name"] == "Mac mini"
    # Webhook URL and secret must NOT be in the event payload.
    assert "webhook_url" not in events[0]
    assert "secret" not in events[0]


async def test_apple_writeback_event_suppressed_when_disabled(
    hass: HomeAssistant, tmp_path: Path
) -> None:
    """Apple-tagged item completes + round_trip.enabled=False → no writeback event."""
    await _setup_member_todo(hass, "anna")
    entry = _make_entry(hass, round_trip_enabled=False)
    store = await _make_store(hass, entry.entry_id, tmp_path)
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {"store": store}

    await _add_apple_item(hass, store, "todo.anna", "uid-1", "Buy milk", apple_uid="apple-abc-123")

    events: list[dict[str, Any]] = []
    hass.bus.async_listen(EVENT_APPLE_WRITEBACK_REQUESTED, lambda e: events.append(e.data))

    unsub = async_start_completion_listener(
        hass, store, {"todo.anna"}, entry_id=entry.entry_id
    )
    await _complete_item(hass, "todo.anna", "uid-1", "Buy milk")
    unsub()

    assert len(events) == 0, "Writeback event must not fire when round-trip is disabled"


async def test_non_apple_item_no_writeback_event(
    hass: HomeAssistant, tmp_path: Path
) -> None:
    """Non-apple item completing with round_trip.enabled=True → no writeback event."""
    await _setup_member_todo(hass, "anna")
    entry = _make_entry(hass, round_trip_enabled=True)
    store = await _make_store(hass, entry.entry_id, tmp_path)
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {"store": store}

    await _add_regular_item(hass, store, "todo.anna", "uid-1", "Take out trash")

    events: list[dict[str, Any]] = []
    hass.bus.async_listen(EVENT_APPLE_WRITEBACK_REQUESTED, lambda e: events.append(e.data))

    unsub = async_start_completion_listener(
        hass, store, {"todo.anna"}, entry_id=entry.entry_id
    )
    await _complete_item(hass, "todo.anna", "uid-1", "Take out trash")
    unsub()

    assert len(events) == 0, "Writeback event must not fire for non-apple tasks"
