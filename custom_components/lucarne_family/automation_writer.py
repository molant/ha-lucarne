"""Managed time-change listeners for the Lucarne Family integration.

HA has no stable in-process automation upsert API. The standard path
(write to automations.yaml + call automation.reload) requires configuration.yaml
to be present and set up with `automation: !include automations.yaml`. This is
not available in the test environment or in integrations loaded without the HTTP
frontend. Therefore this module uses async_track_time_change as the primary
scheduling mechanism. Verified absent on HA 2026.4.3 — see the gate test in
tests/python/test_automation_writer.py::test_automation_reload_requires_configuration_yaml.

Reference: homeassistant.helpers.event.async_track_time_change
Source verified: homeassistant/components/config/automation.py + view.py
              homeassistant/helpers/entity_component.py (async_prepare_reload)
"""
from __future__ import annotations

import logging
from datetime import datetime

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.event import async_track_time_change

from .const import CONF_RESET_TIME, CONF_STREAK_CHECK_TIME, DOMAIN

_LOGGER = logging.getLogger(__name__)


def _parse_hhmm(time_str: str) -> tuple[int, int]:
    """Parse 'HH:MM' into (hour, minute). Raises ValueError on bad input."""
    parts = time_str.split(":", 1)
    if len(parts) != 2:
        raise ValueError(f"Expected HH:MM, got {time_str!r}")
    return int(parts[0]), int(parts[1])


async def async_write_managed_automations(
    hass: HomeAssistant, entry: ConfigEntry
) -> CALLBACK_TYPE:
    """Register in-process time-change listeners for daily reset and streak check.

    Returns a combined unsubscribe callback. Store it so the listeners can be
    cancelled when the config entry is unloaded or options change.

    Steps to reproduce why YAML-based automation management is not used:
    1. async_setup_component(hass, "automation", {}) sets up component with empty config.
    2. component.async_prepare_reload() calls conf_util.async_hass_config_yaml() which
       reads configuration.yaml. In test environments and integration-only installs,
       configuration.yaml either does not exist or does not include automations.
    3. async_prepare_reload() returns None → automation.reload is a no-op.
    4. Conclusion: no stable in-process upsert path on this HA version.
    """
    reset_time: str = entry.data.get(CONF_RESET_TIME, "04:00")
    streak_check_time: str = entry.data.get(CONF_STREAK_CHECK_TIME, "21:00")

    reset_hour, reset_minute = _parse_hhmm(reset_time)
    streak_hour, streak_minute = _parse_hhmm(streak_check_time)

    @callback
    def _on_reset_time(_now: datetime) -> None:
        hass.async_create_task(
            hass.services.async_call(DOMAIN, "perform_daily_reset", {}, blocking=False),
            name="lucarne_family_daily_reset",
        )

    @callback
    def _on_streak_check_time(_now: datetime) -> None:
        hass.async_create_task(
            hass.services.async_call(DOMAIN, "evaluate_all_streaks", {}, blocking=False),
            name="lucarne_family_streak_check",
        )

    unsub_reset = async_track_time_change(
        hass, _on_reset_time, hour=reset_hour, minute=reset_minute, second=0
    )
    unsub_streak = async_track_time_change(
        hass, _on_streak_check_time, hour=streak_hour, minute=streak_minute, second=0
    )

    _LOGGER.debug(
        "Registered time-change listeners: daily reset at %s, streak check at %s",
        reset_time,
        streak_check_time,
    )

    @callback
    def unsub() -> None:
        unsub_reset()
        unsub_streak()

    return unsub


async def async_remove_managed_automations(
    hass: HomeAssistant, entry: ConfigEntry
) -> None:
    """Remove managed time-change listeners on integration uninstall.

    The actual unsubscription is handled by the stored callback in
    hass.data[DOMAIN][entry.entry_id]["unsub_automations"]. This function
    exists for explicit call-site clarity during uninstall flows.
    """
    entry_data = hass.data.get(DOMAIN, {}).get(entry.entry_id, {})
    unsub = entry_data.pop("unsub_automations", None)
    if unsub is not None:
        unsub()
