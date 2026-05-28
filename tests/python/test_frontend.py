"""async_setup serves and auto-registers the bundled card frontend."""
from __future__ import annotations

from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

from homeassistant.core import HomeAssistant

import custom_components.lucarne_family as lucarne
from custom_components.lucarne_family.const import FRONTEND_URL


def test_bundle_committed() -> None:
    """The built card bundle must be committed — HACS ships it, it does not build."""
    bundle = Path(lucarne.__file__).parent / "frontend" / "ha-lucarne.js"
    assert bundle.is_file(), f"missing committed bundle at {bundle}"
    assert bundle.stat().st_size > 0


async def test_async_setup_registers_frontend(hass: HomeAssistant) -> None:
    """async_setup serves ha-lucarne.js and registers it as a versioned ES module."""
    hass.http = MagicMock()
    hass.http.async_register_static_paths = AsyncMock()

    with patch.object(lucarne, "add_extra_js_url") as mock_add_js:
        assert await lucarne.async_setup(hass, {}) is True

    # Served as a static path at FRONTEND_URL, pointing at the real bundle file.
    hass.http.async_register_static_paths.assert_awaited_once()
    (configs,) = hass.http.async_register_static_paths.await_args.args
    config = next(iter(configs))
    assert config.url_path == FRONTEND_URL
    assert config.path.endswith("frontend/ha-lucarne.js")
    assert Path(config.path).is_file()

    # Auto-loaded as an ES module with a ?v=<version> cache-buster.
    mock_add_js.assert_called_once()
    registered_url = mock_add_js.call_args.args[1]
    assert registered_url.startswith(f"{FRONTEND_URL}?v=")
    assert registered_url != f"{FRONTEND_URL}?v="  # version is non-empty
