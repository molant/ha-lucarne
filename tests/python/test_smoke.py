"""Smoke test: verifies the test harness can load and set up the integration."""
from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component


async def test_setup(hass: HomeAssistant) -> None:
    """Integration loads without error and async_setup returns True."""
    assert await async_setup_component(hass, "lucarne_family", {})
