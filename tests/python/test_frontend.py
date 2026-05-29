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

    # Auto-loaded as an ES module with a ?v=<version>.<bundle-hash> cache-buster.
    mock_add_js.assert_called_once()
    registered_url = mock_add_js.call_args.args[1]
    assert registered_url.startswith(f"{FRONTEND_URL}?v=")
    assert registered_url != f"{FRONTEND_URL}?v="  # version is non-empty

    # The query carries a content hash of the bundle appended to the version, so
    # the URL changes whenever the card is rebuilt (cache-busts without a bump).
    query = registered_url.split("?v=", 1)[1]
    version, _, digest = query.rpartition(".")
    assert version, "version segment present before the hash"
    assert len(digest) == 8 and all(c in "0123456789abcdef" for c in digest), (
        f"expected an 8-char hex bundle hash, got {digest!r}"
    )


def test_bundle_digest_changes_with_content(tmp_path: Path) -> None:
    """The cache-bust hash differs for different bundle contents (stable per content)."""
    a = tmp_path / "a.js"
    b = tmp_path / "b.js"
    a.write_text("console.log(1)")
    b.write_text("console.log(2)")
    assert lucarne._bundle_digest(a) == lucarne._bundle_digest(a)  # stable
    assert lucarne._bundle_digest(a) != lucarne._bundle_digest(b)  # content-sensitive


def test_bundle_digest_missing_file(tmp_path: Path) -> None:
    """A missing bundle degrades to a sentinel instead of raising during setup."""
    assert lucarne._bundle_digest(tmp_path / "nope.js") == "0"
