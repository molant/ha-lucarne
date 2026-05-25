"""Tests for entity_manager.py — todo + counter entity lifecycle."""
from __future__ import annotations

from datetime import UTC, datetime
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity_registry import async_get as er_get
from homeassistant.setup import async_setup_component

from custom_components.lucarne_family import _async_reconcile_member_entities
from custom_components.lucarne_family.entity_manager import (
    async_create_member_entities,
    async_delete_member_entities,
    async_ensure_household_entity,
    async_rename_member_entities,
)
from custom_components.lucarne_family.models import Member


def _make_member(slug: str = "anna", name: str = "Anna") -> Member:
    return Member(
        slug=slug,
        name=name,
        color="#ff0000",
        avatar=None,
        created_at=datetime.now(UTC),
        preset="school-age",
    )



def _mock_counter_storage_collection(
    hass: HomeAssistant, item_id: str = "anna_streak"
) -> MagicMock:
    """Return a mock storage collection that simulates counter creation and deletion.

    Registers/removes entries in the entity registry (mirroring what the real counter
    component does) so that er.async_get_entity_id() / er.async_get() reflect reality.
    """
    sc = MagicMock()

    async def _create_item(data: dict):
        obj_id = data["name"]
        er_get(hass).async_get_or_create(
            "counter", "counter", obj_id, suggested_object_id=obj_id
        )
        return {"id": obj_id}

    async def _delete_item(del_item_id: str):
        er = er_get(hass)
        entity_id = er.async_get_entity_id("counter", "counter", del_item_id)
        if entity_id:
            er.async_remove(entity_id)

    sc.async_create_item = AsyncMock(side_effect=_create_item)
    sc.async_delete_item = AsyncMock(side_effect=_delete_item)
    return sc


def _patch_counter_sc(storage_collection: MagicMock):
    """Patch the entity_manager's _get_counter_storage_collection helper."""
    return patch(
        "custom_components.lucarne_family.entity_manager._get_counter_storage_collection",
        return_value=storage_collection,
    )


# ---------------------------------------------------------------------------
# Happy-path: create
# ---------------------------------------------------------------------------


async def test_create_member_entities_registers_todo_and_counter(
    hass: HomeAssistant,
) -> None:
    """Creating entities for a member registers todo and counter in entity registry."""
    await async_setup_component(hass, "local_todo", {})
    await hass.async_block_till_done()

    member = _make_member()
    sc = _mock_counter_storage_collection(hass)

    with _patch_counter_sc(sc):
        todo_id, counter_id = await async_create_member_entities(hass, member)

    assert todo_id == "todo.anna"
    assert counter_id == "counter.anna_streak"

    er = er_get(hass)
    assert er.async_get("todo.anna") is not None

    sc.async_create_item.assert_called_once()
    call_kwargs = sc.async_create_item.call_args[0][0]
    assert call_kwargs["name"] == "anna_streak"
    assert call_kwargs["initial"] == 0
    assert call_kwargs["minimum"] == 0


async def test_create_normalizes_entity_id_to_canonical_slug(
    hass: HomeAssistant,
) -> None:
    """If HA assigns a different entity_id, rename it to the canonical slug form."""
    await async_setup_component(hass, "local_todo", {})
    await hass.async_block_till_done()

    # Member whose display name would HA-slugify to a different id than member.slug
    # e.g. "Anna Marie" → HA would create "todo.anna_marie" but we want "todo.anna_marie"
    # More importantly: slug "anna" but name "ANNA" → local_todo slugifies "ANNA" to "anna"
    # Use a contrived example: name "Anna-Test" → HA slugify → "anna_test" but slug "anna_test"
    # Actually we'll use a name that produces a different slug than our member.slug
    member = Member(
        slug="annatest",
        name="Anna-Test",  # HA would create todo.anna_test (with _), slug="annatest" (no _)
        color="#ff0000",
        avatar=None,
        created_at=datetime.now(UTC),
        preset="school-age",
    )

    sc = _mock_counter_storage_collection(hass, item_id="annatest_streak")

    with _patch_counter_sc(sc):
        todo_id, _ = await async_create_member_entities(hass, member)

    assert todo_id == "todo.annatest"
    er = er_get(hass)
    assert er.async_get("todo.annatest") is not None


# ---------------------------------------------------------------------------
# Collision handling
# ---------------------------------------------------------------------------


async def test_create_raises_on_todo_collision(
    hass: HomeAssistant,
) -> None:
    """If canonical todo entity_id already exists, raise HomeAssistantError and clean up."""
    await async_setup_component(hass, "local_todo", {})
    await hass.async_block_till_done()

    # Pre-seed a todo.anna entry by creating a local_todo with name "anna"
    first_result = await hass.config_entries.flow.async_init(
        "local_todo",
        context={"source": "user"},
        data={"todo_list_name": "anna"},
    )
    await hass.async_block_till_done()
    assert first_result.get("type") == "create_entry"

    member = _make_member()  # slug="anna"
    sc = _mock_counter_storage_collection(hass)

    with _patch_counter_sc(sc):
        with pytest.raises(HomeAssistantError, match=r"todo\.anna"):
            await async_create_member_entities(hass, member)

    # No orphan counter should have been created
    sc.async_create_item.assert_not_called()


# ---------------------------------------------------------------------------
# Delete
# ---------------------------------------------------------------------------


async def test_delete_member_entities_removes_todo_and_counter(
    hass: HomeAssistant,
) -> None:
    """Deleting removes both the todo config entry and counter entity."""
    await async_setup_component(hass, "local_todo", {})
    await hass.async_block_till_done()

    member = _make_member()
    sc = _mock_counter_storage_collection(hass)

    with _patch_counter_sc(sc):
        todo_id, counter_id = await async_create_member_entities(hass, member)

    er = er_get(hass)
    assert er.async_get(todo_id) is not None

    with _patch_counter_sc(sc):
        await async_delete_member_entities(hass, todo_id, counter_id)

    await hass.async_block_till_done()
    assert er.async_get(todo_id) is None


# ---------------------------------------------------------------------------
# Rename
# ---------------------------------------------------------------------------


async def test_rename_member_entities_changes_entity_ids(
    hass: HomeAssistant,
) -> None:
    """Renaming entities updates entity_ids in the entity registry."""
    await async_setup_component(hass, "local_todo", {})
    await async_setup_component(hass, "counter", {})
    await hass.async_block_till_done()

    member = _make_member()
    sc = _mock_counter_storage_collection(hass)

    with _patch_counter_sc(sc):
        todo_id, _ = await async_create_member_entities(hass, member)

    er = er_get(hass)
    assert er.async_get("todo.anna") is not None
    counter_id = "counter.anna_streak"
    assert er.async_get(counter_id) is not None

    with _patch_counter_sc(sc):
        new_todo_id, new_counter_id = await async_rename_member_entities(
            hass, todo_id, "anna2", counter_id
        )

    assert new_todo_id == "todo.anna2"
    assert new_counter_id == "counter.anna2_streak"
    assert er.async_get("todo.anna2") is not None
    assert er.async_get("todo.anna") is None
    # Old counter storage item was deleted and recreated; old entity_id freed.
    assert er.async_get("counter.anna2_streak") is not None
    assert er.async_get("counter.anna_streak") is None


# ---------------------------------------------------------------------------
# Household entity
# ---------------------------------------------------------------------------


async def test_ensure_household_entity_creates_if_absent(
    hass: HomeAssistant,
) -> None:
    """async_ensure_household_entity creates todo.lucarne_household if not present."""
    await async_setup_component(hass, "local_todo", {})
    await hass.async_block_till_done()

    er = er_get(hass)
    assert er.async_get("todo.lucarne_household") is None

    entity_id = await async_ensure_household_entity(hass)

    assert entity_id == "todo.lucarne_household"
    assert er.async_get("todo.lucarne_household") is not None


async def test_ensure_household_entity_is_idempotent(
    hass: HomeAssistant,
) -> None:
    """Calling async_ensure_household_entity twice doesn't create a second entry."""
    await async_setup_component(hass, "local_todo", {})
    await hass.async_block_till_done()

    entity_id1 = await async_ensure_household_entity(hass)
    entity_id2 = await async_ensure_household_entity(hass)

    assert entity_id1 == entity_id2 == "todo.lucarne_household"
    # Only one local_todo config entry for lucarne_household should exist
    entries = hass.config_entries.async_entries("local_todo")
    household_entries = [
        e for e in entries if e.data.get("todo_list_name") == "Lucarne Household"
    ]
    assert len(household_entries) == 1


# ---------------------------------------------------------------------------
# Reconciliation
# ---------------------------------------------------------------------------


async def test_reconcile_skips_members_with_present_entities(
    hass: HomeAssistant,
) -> None:
    """No recreation attempt when the todo entity is already in the registry."""
    await async_setup_component(hass, "local_todo", {})
    await hass.async_block_till_done()

    sc = _mock_counter_storage_collection(hass)
    member = _make_member()

    with _patch_counter_sc(sc):
        todo_id, _ = await async_create_member_entities(hass, member)

    assert todo_id == "todo.anna"

    mock_store = MagicMock()
    mock_store.get_members.return_value = [
        _make_member().__class__(
            slug="anna",
            name="Anna",
            color="#ff0000",
            avatar=None,
            created_at=datetime.now(UTC),
            preset="school-age",
            todo_entity_id="todo.anna",
            streak_counter_id="counter.anna_streak",
        )
    ]

    with patch(
        "custom_components.lucarne_family.entity_manager.async_create_member_entities",
        new_callable=AsyncMock,
    ) as mock_create:
        await _async_reconcile_member_entities(hass, mock_store)

    mock_create.assert_not_called()


async def test_reconcile_recreates_when_both_entities_missing(
    hass: HomeAssistant,
) -> None:
    """Reconciliation recreates both entities when both are absent from the registry."""
    await async_setup_component(hass, "local_todo", {})
    await hass.async_block_till_done()

    # Member stored with entity IDs but neither entity actually exists in registry.
    member = Member(
        slug="anna",
        name="Anna",
        color="#ff0000",
        avatar=None,
        created_at=datetime.now(UTC),
        preset="school-age",
        todo_entity_id="todo.anna",
        streak_counter_id="counter.anna_streak",
    )

    mock_store = MagicMock()
    mock_store.get_members.return_value = [member]
    mock_store.async_save_members = AsyncMock()

    with patch(
        "custom_components.lucarne_family.entity_manager.async_create_member_entities",
        new_callable=AsyncMock,
        return_value=("todo.anna", "counter.anna_streak"),
    ) as mock_create:
        await _async_reconcile_member_entities(hass, mock_store)

    mock_create.assert_called_once()
    mock_store.async_save_members.assert_called_once()
    saved = mock_store.async_save_members.call_args[0][0]
    assert saved[0].todo_entity_id == "todo.anna"
    assert saved[0].streak_counter_id == "counter.anna_streak"


async def test_reconcile_warns_on_partial_state_todo_missing(
    hass: HomeAssistant,
    caplog: pytest.LogCaptureFixture,
) -> None:
    """Reconciliation warns but does NOT recreate when only todo is missing (counter present)."""
    await async_setup_component(hass, "local_todo", {})
    await hass.async_block_till_done()

    # Pre-seed the counter entity in the registry.
    er = er_get(hass)
    er.async_get_or_create("counter", "counter", "anna_streak", suggested_object_id="anna_streak")

    member = Member(
        slug="anna",
        name="Anna",
        color="#ff0000",
        avatar=None,
        created_at=datetime.now(UTC),
        preset="school-age",
        todo_entity_id="todo.anna",
        streak_counter_id="counter.anna_streak",
    )

    mock_store = MagicMock()
    mock_store.get_members.return_value = [member]
    mock_store.async_save_members = AsyncMock()

    import logging

    with (
        patch(
            "custom_components.lucarne_family.entity_manager.async_create_member_entities",
            new_callable=AsyncMock,
        ) as mock_create,
        caplog.at_level(logging.WARNING, logger="custom_components.lucarne_family"),
    ):
        await _async_reconcile_member_entities(hass, mock_store)

    mock_create.assert_not_called()
    mock_store.async_save_members.assert_not_called()
    assert any("todo.anna" in r.message for r in caplog.records)


async def test_reconcile_warns_on_partial_state_counter_missing(
    hass: HomeAssistant,
    caplog: pytest.LogCaptureFixture,
) -> None:
    """Reconciliation warns but does NOT recreate when only counter is missing (todo present)."""
    await async_setup_component(hass, "local_todo", {})
    await hass.async_block_till_done()

    # Create the todo entity but NOT the counter.
    result = await hass.config_entries.flow.async_init(
        "local_todo",
        context={"source": "user"},
        data={"todo_list_name": "anna"},
    )
    await hass.async_block_till_done()
    assert result.get("type") == "create_entry"

    member = Member(
        slug="anna",
        name="Anna",
        color="#ff0000",
        avatar=None,
        created_at=datetime.now(UTC),
        preset="school-age",
        todo_entity_id="todo.anna",
        streak_counter_id="counter.anna_streak",
    )

    mock_store = MagicMock()
    mock_store.get_members.return_value = [member]
    mock_store.async_save_members = AsyncMock()

    import logging

    with (
        patch(
            "custom_components.lucarne_family.entity_manager.async_create_member_entities",
            new_callable=AsyncMock,
        ) as mock_create,
        caplog.at_level(logging.WARNING, logger="custom_components.lucarne_family"),
    ):
        await _async_reconcile_member_entities(hass, mock_store)

    mock_create.assert_not_called()
    mock_store.async_save_members.assert_not_called()
    assert any("counter.anna_streak" in r.message for r in caplog.records)


async def test_reconcile_logs_error_on_recreate_failure(
    hass: HomeAssistant,
    caplog: pytest.LogCaptureFixture,
) -> None:
    """When recreation fails, an error is logged and setup continues."""
    await async_setup_component(hass, "local_todo", {})
    await hass.async_block_till_done()

    member = Member(
        slug="anna",
        name="Anna",
        color="#ff0000",
        avatar=None,
        created_at=datetime.now(UTC),
        preset="school-age",
        todo_entity_id="todo.anna",
        streak_counter_id="counter.anna_streak",
    )

    mock_store = MagicMock()
    mock_store.get_members.return_value = [member]
    mock_store.async_save_members = AsyncMock()

    import logging

    with (
        patch(
            "custom_components.lucarne_family.entity_manager.async_create_member_entities",
            new_callable=AsyncMock,
            side_effect=Exception("counter component not loaded"),
        ),
        caplog.at_level(logging.ERROR, logger="custom_components.lucarne_family"),
    ):
        await _async_reconcile_member_entities(hass, mock_store)

    assert any("Failed to recreate" in r.message for r in caplog.records)
    # No save should happen when recreation failed
    mock_store.async_save_members.assert_not_called()


async def test_reconcile_warns_on_orphaned_entity(
    hass: HomeAssistant,
    caplog: pytest.LogCaptureFixture,
) -> None:
    """Reconciliation warns about local_todo entities not tracked by any member."""
    await async_setup_component(hass, "local_todo", {})
    await hass.async_block_till_done()

    # Create a local_todo entry that lucarne doesn't know about
    result = await hass.config_entries.flow.async_init(
        "local_todo",
        context={"source": "user"},
        data={"todo_list_name": "orphan"},
    )
    await hass.async_block_till_done()
    assert result.get("type") == "create_entry"

    mock_store = MagicMock()
    mock_store.get_members.return_value = []  # No members

    import logging

    with caplog.at_level(logging.WARNING, logger="custom_components.lucarne_family"):
        await _async_reconcile_member_entities(hass, mock_store)

    assert any("orphaned" in r.message for r in caplog.records)
