"""Config flow and options flow for the Lucarne Family integration."""
from __future__ import annotations

import logging
import re
from typing import Any

_LOGGER = logging.getLogger(__name__)

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector

from .const import (
    CONF_CUSTOM_PRESETS,
    CONF_FAMILY_NAME,
    CONF_MEMBERS,
    CONF_RESET_TIME,
    CONF_ROUND_TRIP,
    CONF_ROUND_TRIP_DEVICE_NAME,
    CONF_ROUND_TRIP_ENABLED,
    CONF_ROUND_TRIP_SECRET,
    CONF_ROUND_TRIP_WEBHOOK_URL,
    CONF_STREAK_CHECK_TIME,
    DEFAULT_RESET_TIME,
    DEFAULT_STREAK_CHECK_TIME,
    DOMAIN,
    PRESET_SCHOOL_AGE,
)
from .models import Member
from .presets import BUILTIN_PRESETS

_HEX_COLOR_RE = re.compile(r"^#[0-9a-fA-F]{6}$")


def _make_slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")


def _validate_name(name: str) -> str | None:
    """Return error key or None."""
    if not name or not name.strip():
        return "name_empty"
    if len(name) > 50:
        return "name_too_long"
    return None


def _validate_color(color: str) -> str | None:
    if not _HEX_COLOR_RE.match(color):
        return "invalid_color"
    return None



def _default_entry_data(family_name: str) -> dict[str, Any]:
    return {
        CONF_FAMILY_NAME: family_name,
        CONF_MEMBERS: [],
        CONF_RESET_TIME: DEFAULT_RESET_TIME,
        CONF_STREAK_CHECK_TIME: DEFAULT_STREAK_CHECK_TIME,
        CONF_ROUND_TRIP: {
            CONF_ROUND_TRIP_ENABLED: False,
            CONF_ROUND_TRIP_WEBHOOK_URL: "",
            CONF_ROUND_TRIP_SECRET: "",
            CONF_ROUND_TRIP_DEVICE_NAME: "Sync device",
        },
        CONF_CUSTOM_PRESETS: [],
    }


class LucarneFamilyConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle the initial config flow (runs once at install)."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        errors: dict[str, str] = {}

        if user_input is not None:
            family_name = user_input.get(CONF_FAMILY_NAME, "").strip()
            err = _validate_name(family_name)
            if err:
                errors[CONF_FAMILY_NAME] = err
            elif self._async_current_entries():
                errors["base"] = "single_family_only"
            else:
                return self.async_create_entry(
                    title=family_name,
                    data=_default_entry_data(family_name),
                )

        schema = vol.Schema(
            {vol.Required(CONF_FAMILY_NAME, default="Family"): str}
        )
        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> LucarneFamilyOptionsFlow:
        return LucarneFamilyOptionsFlow(config_entry)


class LucarneFamilyOptionsFlow(config_entries.OptionsFlow):
    """Handle ongoing configuration via the Configure button."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        self._entry = config_entry
        self._selected_member_slug: str | None = None

    def _get_members(self) -> list[Member]:
        raw: list[dict[str, Any]] = self._entry.data.get(CONF_MEMBERS, [])
        return [Member.from_dict(m) for m in raw]

    async def _save_members(self, members: list[Member]) -> None:
        from .const import DOMAIN
        from .store import LucarneFamilyStore

        store: LucarneFamilyStore = self.hass.data[DOMAIN][self._entry.entry_id]["store"]
        await store.async_save_members(members)

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        return self.async_show_menu(
            step_id="init",
            menu_options=["manage_members", "edit_schedule", "edit_round_trip"],
        )

    async def async_step_edit_round_trip(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        # Reserved for Phase 6. Returns immediately to avoid a dead end.
        return await self.async_step_init()

    async def async_step_manage_members(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        members = self._get_members()
        menu: list[str] = ["add_member"]
        if members:
            menu += ["edit_member", "remove_member"]
        return self.async_show_menu(step_id="manage_members", menu_options=menu)

    async def async_step_add_member(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        errors: dict[str, str] = {}

        if user_input is not None:
            name = user_input.get("name", "").strip()
            color = user_input.get("color", "").strip()
            avatar = user_input.get("avatar", "").strip() or None
            preset = user_input.get("preset", PRESET_SCHOOL_AGE)

            err = _validate_name(name)
            if err:
                errors["name"] = err
            color_err = _validate_color(color)
            if color_err:
                errors["color"] = color_err

            if not errors:
                slug = _make_slug(name)
                if not slug:
                    errors["name"] = "empty_slug"
                else:
                    existing = self._get_members()
                    if any(m.slug == slug for m in existing):
                        errors["name"] = "slug_conflict"
                    else:
                        from datetime import UTC, datetime

                        from .entity_manager import async_create_member_entities
                        from .store import LucarneFamilyStore

                        new_member = Member(
                            slug=slug,
                            name=name,
                            color=color,
                            avatar=avatar,
                            created_at=datetime.now(UTC),
                            preset=preset,
                        )

                        # Create managed entities and record their ids
                        from homeassistant.exceptions import HomeAssistantError

                        todo_id: str = ""
                        counter_id: str = ""
                        try:
                            todo_id, counter_id = await async_create_member_entities(
                                self.hass, new_member
                            )
                        except HomeAssistantError as exc:
                            _LOGGER.warning(
                                "Failed to create entities for member %r: %s", slug, exc
                            )
                            errors["base"] = "entity_create_failed"
                        except Exception as exc:
                            _LOGGER.exception(
                                "Unexpected error creating entities for member %r", slug
                            )
                            errors["base"] = "entity_create_failed"

                        if not errors:
                            new_member = Member(
                                slug=slug,
                                name=name,
                                color=color,
                                avatar=avatar,
                                created_at=new_member.created_at,
                                preset=preset,
                                todo_entity_id=todo_id,
                                streak_counter_id=counter_id,
                            )
                            await self._save_members([*existing, new_member])

                            # Seed preset routines exactly once after entity creation
                            store: LucarneFamilyStore = self.hass.data[DOMAIN][
                                self._entry.entry_id
                            ]["store"]
                            from . import seed_preset_routines

                            try:
                                await seed_preset_routines(self.hass, store, new_member)
                            except Exception as exc:
                                _LOGGER.warning(
                                    "Preset seeding failed for member %r: %s; member is still added",
                                    slug, exc,
                                )

                            return await self.async_step_manage_members()

        preset_options = {k: v.display_name for k, v in BUILTIN_PRESETS.items()}
        schema = vol.Schema(
            {
                vol.Required("name"): str,
                vol.Required("color", default="#4a90e2"): str,
                vol.Optional("avatar", default=""): str,
                vol.Required("preset", default=PRESET_SCHOOL_AGE): vol.In(preset_options),
            }
        )
        return self.async_show_form(step_id="add_member", data_schema=schema, errors=errors)

    async def async_step_edit_member(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        errors: dict[str, str] = {}
        members = self._get_members()

        if user_input is not None:
            if self._selected_member_slug is None:
                # First submit: pick the member
                self._selected_member_slug = user_input.get("member_slug", "")
                return await self.async_step_edit_member()

            name = user_input.get("name", "").strip()
            color = user_input.get("color", "").strip()
            avatar = user_input.get("avatar", "").strip() or None
            preset = user_input.get("preset", PRESET_SCHOOL_AGE)

            err = _validate_name(name)
            if err:
                errors["name"] = err
            color_err = _validate_color(color)
            if color_err:
                errors["color"] = color_err

            if not errors:
                updated = [
                    Member(
                        slug=m.slug,
                        name=name if m.slug == self._selected_member_slug else m.name,
                        color=color if m.slug == self._selected_member_slug else m.color,
                        avatar=avatar if m.slug == self._selected_member_slug else m.avatar,
                        created_at=m.created_at,
                        preset=preset if m.slug == self._selected_member_slug else m.preset,
                        todo_entity_id=m.todo_entity_id,
                        streak_counter_id=m.streak_counter_id,
                    )
                    for m in members
                ]
                await self._save_members(updated)
                self._selected_member_slug = None
                return await self.async_step_manage_members()

        if self._selected_member_slug is None:
            # Show member picker
            member_options = {m.slug: m.name for m in members}
            schema = vol.Schema({vol.Required("member_slug"): vol.In(member_options)})
            return self.async_show_form(
                step_id="edit_member", data_schema=schema, errors=errors
            )

        target = next((m for m in members if m.slug == self._selected_member_slug), None)
        if target is None:
            self._selected_member_slug = None
            return await self.async_step_manage_members()

        preset_options = {k: v.display_name for k, v in BUILTIN_PRESETS.items()}
        schema = vol.Schema(
            {
                vol.Required("name", default=target.name): str,
                vol.Required("color", default=target.color): str,
                vol.Optional("avatar", default=target.avatar or ""): str,
                vol.Required("preset", default=target.preset): vol.In(preset_options),
            }
        )
        return self.async_show_form(step_id="edit_member", data_schema=schema, errors=errors)

    async def async_step_remove_member(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        errors: dict[str, str] = {}
        members = self._get_members()

        if user_input is not None:
            if self._selected_member_slug is None:
                self._selected_member_slug = user_input.get("member_slug", "")
                return await self.async_step_remove_member()

            target = next(
                (m for m in members if m.slug == self._selected_member_slug), None
            )
            confirm = user_input.get("confirm_name", "").strip()
            if target is None or confirm != target.name:
                errors["confirm_name"] = "confirm_mismatch"
            else:
                # Delete entities first; only remove member record when deletion succeeds
                # so the user can retry via "remove member" if deletion fails.
                if target.todo_entity_id or target.streak_counter_id:
                    from .entity_manager import async_delete_member_entities

                    try:
                        await async_delete_member_entities(
                            self.hass,
                            target.todo_entity_id,
                            target.streak_counter_id,
                        )
                    except Exception as exc:
                        _LOGGER.warning(
                            "Failed to delete entities for member %r: %s", target.slug, exc
                        )
                        errors["base"] = "entity_delete_failed"

                if not errors:
                    remaining = [m for m in members if m.slug != self._selected_member_slug]
                    await self._save_members(remaining)
                    self._selected_member_slug = None
                    return await self.async_step_manage_members()

        if self._selected_member_slug is None:
            member_options = {m.slug: m.name for m in members}
            schema = vol.Schema({vol.Required("member_slug"): vol.In(member_options)})
            return self.async_show_form(
                step_id="remove_member", data_schema=schema, errors=errors
            )

        schema = vol.Schema({vol.Required("confirm_name"): str})
        return self.async_show_form(
            step_id="remove_member", data_schema=schema, errors=errors
        )

    async def async_step_edit_schedule(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        errors: dict[str, str] = {}

        if user_input is not None:
            from datetime import time as time_type

            from homeassistant.util.dt import parse_time

            def _normalize(t: str) -> str:
                parsed = parse_time(t)
                if isinstance(parsed, time_type):
                    return parsed.strftime("%H:%M")
                return t

            new_data = {
                **self._entry.data,
                CONF_RESET_TIME: _normalize(user_input[CONF_RESET_TIME]),
                CONF_STREAK_CHECK_TIME: _normalize(user_input[CONF_STREAK_CHECK_TIME]),
            }
            self.hass.config_entries.async_update_entry(self._entry, data=new_data)
            return self.async_create_entry(title="", data={})

        current_reset = self._entry.data.get(CONF_RESET_TIME, DEFAULT_RESET_TIME)
        current_streak = self._entry.data.get(CONF_STREAK_CHECK_TIME, DEFAULT_STREAK_CHECK_TIME)
        schema = vol.Schema(
            {
                vol.Required(CONF_RESET_TIME, default=current_reset): selector.TimeSelector(),
                vol.Required(
                    CONF_STREAK_CHECK_TIME, default=current_streak
                ): selector.TimeSelector(),
            }
        )
        return self.async_show_form(
            step_id="edit_schedule", data_schema=schema, errors=errors
        )
