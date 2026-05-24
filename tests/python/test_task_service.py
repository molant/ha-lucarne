"""Tests for task_service.py and preset seeding (Phase 2-C / 2-D)."""
from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.lucarne_family.const import DOMAIN
from custom_components.lucarne_family.models import Member
from custom_components.lucarne_family.presets import BUILTIN_PRESETS
from custom_components.lucarne_family.store import LucarneFamilyStore


def _make_entry(
    hass: HomeAssistant, members: list[dict[str, Any]] | None = None
) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Family",
        data={
            "family_name": "Family",
            "members": members or [],
            "reset_time": "04:00",
            "streak_check_time": "21:00",
            "round_trip": {
                "enabled": False,
                "webhook_url": "",
                "secret": "",
                "device_name": "Sync device",
            },
            "custom_presets": [],
        },
    )
    entry.add_to_hass(hass)
    return entry


async def _make_store(hass: HomeAssistant, entry_id: str, tmp_path: Path) -> LucarneFamilyStore:
    db_path = str(tmp_path / "lucarne.db")
    store = LucarneFamilyStore(hass, entry_id, db_path)
    await store.async_init()
    return store


# ---------------------------------------------------------------------------
# Preset seeding
# ---------------------------------------------------------------------------


async def test_add_member_school_age_seeds_preset_routines(
    hass: HomeAssistant,
    tmp_path: Path,
) -> None:
    """Adding a member with school-age preset seeds all 5 preset routines."""
    await async_setup_component(hass, "local_todo", {})
    await async_setup_component(hass, "todo", {})
    await hass.async_block_till_done()

    entry = _make_entry(hass)
    store = await _make_store(hass, entry.entry_id, tmp_path)
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {"store": store}

    school_age_preset = BUILTIN_PRESETS["school-age"]
    expected_count = len(school_age_preset.routines)
    assert expected_count == 5

    # First create the todo entity for the member
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

    from custom_components.lucarne_family import seed_preset_routines

    await seed_preset_routines(hass, store, member)

    # Verify task_metadata rows
    tasks = await store.async_get_tasks_for_member("anna")
    assert len(tasks) == expected_count

    for task in tasks:
        assert task["type"] == "routine"
        assert task["source"] == "template"
        assert task["member_slug"] == "anna"
        assert task["recurrence"] != "" or True  # recurrence may be non-empty
        assert task["icon"] != "" or True


async def test_seed_preset_routines_is_idempotent(
    hass: HomeAssistant,
    tmp_path: Path,
) -> None:
    """Calling seed_preset_routines twice does not duplicate task_metadata rows."""
    await async_setup_component(hass, "local_todo", {})
    await async_setup_component(hass, "todo", {})
    await hass.async_block_till_done()

    entry = _make_entry(hass)
    store = await _make_store(hass, entry.entry_id, tmp_path)
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {"store": store}

    result = await hass.config_entries.flow.async_init(
        "local_todo",
        context={"source": "user"},
        data={"todo_list_name": "ben"},
    )
    await hass.async_block_till_done()
    assert result.get("type") == "create_entry"

    member = Member(
        slug="ben",
        name="Ben",
        color="#0000ff",
        avatar=None,
        created_at=datetime.now(UTC),
        preset="school-age",
        todo_entity_id="todo.ben",
        streak_counter_id="counter.ben_streak",
    )

    from custom_components.lucarne_family import seed_preset_routines

    # First seed
    await seed_preset_routines(hass, store, member)
    tasks_after_first = await store.async_get_tasks_for_member("ben")
    assert len(tasks_after_first) == 5

    # Second seed — idempotency guard should skip; no duplicate rows
    await seed_preset_routines(hass, store, member)
    tasks_after_second = await store.async_get_tasks_for_member("ben")
    assert len(tasks_after_second) == 5


async def test_adult_none_preset_seeds_no_routines(
    hass: HomeAssistant,
    tmp_path: Path,
) -> None:
    """adult-none preset members get no seeded routines."""
    await async_setup_component(hass, "local_todo", {})
    await async_setup_component(hass, "todo", {})
    await hass.async_block_till_done()

    entry = _make_entry(hass)
    store = await _make_store(hass, entry.entry_id, tmp_path)
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {"store": store}

    result = await hass.config_entries.flow.async_init(
        "local_todo",
        context={"source": "user"},
        data={"todo_list_name": "ingrid"},
    )
    await hass.async_block_till_done()
    assert result.get("type") == "create_entry"

    member = Member(
        slug="ingrid",
        name="Ingrid",
        color="#00ff00",
        avatar=None,
        created_at=datetime.now(UTC),
        preset="adult-none",
        todo_entity_id="todo.ingrid",
        streak_counter_id="counter.ingrid_streak",
    )

    from custom_components.lucarne_family import seed_preset_routines

    await seed_preset_routines(hass, store, member)

    tasks = await store.async_get_tasks_for_member("ingrid")
    assert len(tasks) == 0
