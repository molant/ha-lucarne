"""WebSocket API commands for the Lucarne Family integration."""
from __future__ import annotations

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from .const import DOMAIN

_WS_REGISTERED_KEY = "__ws_registered__"


@websocket_api.websocket_command({vol.Required("type"): "lucarne_family/get_family"})  # type: ignore[attr-defined]
@websocket_api.async_response  # type: ignore[attr-defined]
async def ws_get_family(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,  # type: ignore[name-defined]
    msg: dict[str, object],
) -> None:
    """Return the full family state for cards to subscribe to."""
    domain_data = hass.data.get(DOMAIN, {})
    entry_data = next(
        (v for k, v in domain_data.items() if isinstance(v, dict) and "store" in v),
        None,
    )
    if entry_data is None:
        connection.send_error(msg["id"], "not_found", "Lucarne Family integration not set up")
        return

    store = entry_data["store"]
    entry_id = next(
        k for k, v in domain_data.items() if isinstance(v, dict) and "store" in v
    )
    entry = hass.config_entries.async_get_entry(entry_id)

    members = [m.to_dict() for m in store.get_members()]
    tasks = await store.async_get_all_task_metadata()

    payload = {
        "members": members,
        "task_metadata": tasks,
        "reset_time": (
            (entry.options or entry.data).get("reset_time", "04:00") if entry else "04:00"
        ),
        "streak_check_time": (
            (entry.options or entry.data).get("streak_check_time", "21:00") if entry else "21:00"
        ),
        "household_entity_id": "todo.lucarne_household",
    }
    connection.send_result(msg["id"], payload)


def async_register_websocket_commands(hass: HomeAssistant) -> None:
    """Register WebSocket commands once per HA process."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    if domain_data.get(_WS_REGISTERED_KEY):
        return
    websocket_api.async_register_command(hass, ws_get_family)
    domain_data[_WS_REGISTERED_KEY] = True
