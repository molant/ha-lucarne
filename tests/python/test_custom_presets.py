"""Tests for custom preset management (Sub-Phase A of Phase 6)."""
from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant import data_entry_flow
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.lucarne_family.const import (
    CONF_CUSTOM_PRESETS,
    CONF_MEMBERS,
    DEFAULT_RESET_TIME,
    DEFAULT_STREAK_CHECK_TIME,
    DOMAIN,
)
from custom_components.lucarne_family.models import Member, RoutinePreset, RoutineTemplate
from custom_components.lucarne_family.store import LucarneFamilyStore


@pytest.fixture(autouse=True)
def _patch_entity_ops():
    """Stub entity creation so tests focus on preset logic."""
    async def _create(hass, member):
        return (f"todo.{member.slug}", f"counter.{member.slug}_streak")

    with (
        patch(
            "custom_components.lucarne_family.entity_manager.async_create_member_entities",
            side_effect=_create,
        ),
    ):
        yield


def _make_entry(
    hass: HomeAssistant,
    custom_presets: list[dict[str, Any]] | None = None,
    members: list[dict[str, Any]] | None = None,
) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Family",
        data={
            "family_name": "Family",
            CONF_MEMBERS: members or [],
            "reset_time": DEFAULT_RESET_TIME,
            "streak_check_time": DEFAULT_STREAK_CHECK_TIME,
            "round_trip": {
                "enabled": False,
                "webhook_url": "",
                "secret": "",
                "device_name": "Sync device",
            },
            CONF_CUSTOM_PRESETS: custom_presets or [],
        },
    )
    entry.add_to_hass(hass)
    return entry


async def _setup_entry(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    with patch(
        "custom_components.lucarne_family.store.LucarneFamilyStore.async_init",
        return_value=None,
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()


async def _make_store(hass: HomeAssistant, entry_id: str, tmp_path: Path) -> LucarneFamilyStore:
    db_path = str(tmp_path / "lucarne.db")
    store = LucarneFamilyStore(hass, entry_id, db_path)
    await store.async_init()
    return store


# ---------------------------------------------------------------------------
# Custom preset seeding via seed_preset_routines
# ---------------------------------------------------------------------------

async def test_seed_custom_preset_adds_routines(
    hass: HomeAssistant, tmp_path: Path
) -> None:
    """seed_preset_routines seeds routines from a custom preset when passed via extra_presets."""
    await async_setup_component(hass, "local_todo", {})
    await async_setup_component(hass, "todo", {})
    await hass.async_block_till_done()

    entry = _make_entry(hass)
    store = await _make_store(hass, entry.entry_id, tmp_path)
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {"store": store}

    # Create a local_todo entity for "ben"
    result = await hass.config_entries.flow.async_init(
        "local_todo",
        context={"source": "user"},
        data={"todo_list_name": "ben"},
    )
    await hass.async_block_till_done()
    assert result.get("type") == "create_entry"

    from custom_components.lucarne_family import seed_preset_routines

    custom_preset = RoutinePreset(
        slug="custom-morning",
        display_name="Morning routine",
        routines=[
            RoutineTemplate(summary="Yoga", icon="🧘", recurrence="FREQ=DAILY"),
            RoutineTemplate(summary="Journal", icon="📓", recurrence="FREQ=DAILY"),
        ],
    )
    member = Member(
        slug="ben",
        name="Ben",
        color="#aabbcc",
        avatar=None,
        created_at=datetime.now(UTC),
        preset="custom-morning",
        todo_entity_id="todo.ben",
        streak_counter_id="counter.ben_streak",
    )
    await seed_preset_routines(
        hass, store, member, extra_presets={"custom-morning": custom_preset}
    )

    tasks = await store.async_get_tasks_for_member("ben")
    assert len(tasks) == 2
    summaries = {t["summary"] for t in tasks}
    assert summaries == {"Yoga", "Journal"}


async def test_seed_builtin_preset_still_works_without_extra_presets(
    hass: HomeAssistant, tmp_path: Path
) -> None:
    """Calling seed_preset_routines without extra_presets still seeds built-in presets."""
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

    from custom_components.lucarne_family import seed_preset_routines

    member = Member(
        slug="ingrid",
        name="Ingrid",
        color="#112233",
        avatar=None,
        created_at=datetime.now(UTC),
        preset="school-age",
        todo_entity_id="todo.ingrid",
        streak_counter_id="counter.ingrid_streak",
    )
    await seed_preset_routines(hass, store, member)

    tasks = await store.async_get_tasks_for_member("ingrid")
    assert len(tasks) == 5  # school-age has 5 routines


# ---------------------------------------------------------------------------
# Custom preset in options flow
# ---------------------------------------------------------------------------

async def test_add_custom_preset_saved_to_entry_data(hass: HomeAssistant) -> None:
    """Full options-flow add-preset journey saves preset to entry.data."""
    entry = _make_entry(hass)
    await _setup_entry(hass, entry)

    result = await hass.config_entries.options.async_init(entry.entry_id)
    await hass.async_block_till_done()
    assert result["type"] == data_entry_flow.FlowResultType.MENU

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "edit_templates"}
    )
    await hass.async_block_till_done()
    assert result["type"] == data_entry_flow.FlowResultType.MENU
    assert result["step_id"] == "edit_templates"

    # Add a new custom preset
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "add_custom_preset"}
    )
    await hass.async_block_till_done()
    assert result["type"] == data_entry_flow.FlowResultType.FORM
    assert result["step_id"] == "add_custom_preset"

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"display_name": "Evening wind-down"}
    )
    await hass.async_block_till_done()
    # Should advance to the routine-adding step
    assert result["type"] == data_entry_flow.FlowResultType.FORM
    assert result["step_id"] == "add_preset_routine"

    # Add a routine
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "summary": "Read book",
            "icon": "📚",
            "recurrence": "FREQ=DAILY",
            "add_another": False,
        },
    )
    await hass.async_block_till_done()

    # Should have saved and returned to options menu
    assert result["type"] in (
        data_entry_flow.FlowResultType.MENU,
        data_entry_flow.FlowResultType.CREATE_ENTRY,
    )

    # Verify the preset was saved
    custom_presets = entry.data.get(CONF_CUSTOM_PRESETS, [])
    assert len(custom_presets) == 1
    assert custom_presets[0]["display_name"] == "Evening wind-down"
    assert len(custom_presets[0]["routines"]) == 1
    assert custom_presets[0]["routines"][0]["summary"] == "Read book"


async def test_custom_preset_appears_in_add_member_form(hass: HomeAssistant) -> None:
    """Custom presets stored in entry.data are offered as choices when adding a member."""
    custom_preset = {
        "slug": "custom-test",
        "display_name": "My Custom Preset",
        "routines": [{"summary": "Walk", "icon": "🚶", "recurrence": "FREQ=DAILY"}],
    }
    entry = _make_entry(hass, custom_presets=[custom_preset])
    await _setup_entry(hass, entry)

    with (
        patch(
            "custom_components.lucarne_family.config_flow.seed_preset_routines",
            new_callable=AsyncMock,
        ),
        patch(
            "custom_components.lucarne_family.store.LucarneFamilyStore.async_save_members",
            new_callable=AsyncMock,
        ),
    ):
        result = await hass.config_entries.options.async_init(entry.entry_id)
        await hass.async_block_till_done()
        result = await hass.config_entries.options.async_configure(
            result["flow_id"], {"next_step_id": "manage_members"}
        )
        result = await hass.config_entries.options.async_configure(
            result["flow_id"], {"next_step_id": "add_member"}
        )
        assert result["type"] == data_entry_flow.FlowResultType.FORM
        assert result["step_id"] == "add_member"

        # Submit with the custom preset slug — should succeed (not "invalid choice")
        result = await hass.config_entries.options.async_configure(
            result["flow_id"],
            {
                "name": "Charlie",
                "color": "#aabbcc",
                "avatar": "",
                "preset": "custom-test",
            },
        )
        await hass.async_block_till_done()
        assert result["type"] in (
            data_entry_flow.FlowResultType.MENU,
            data_entry_flow.FlowResultType.CREATE_ENTRY,
        )
