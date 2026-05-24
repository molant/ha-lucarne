"""SQLite-backed store for the Lucarne Family integration."""
from __future__ import annotations

import logging
import sqlite3
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import CONF_MEMBERS, STORAGE_VERSION
from .models import Member

_LOGGER = logging.getLogger(__name__)

_SCHEMA_SQL = Path(__file__).parent / "schema.sql"


def _init_db(db_path: str, schema_sql: str) -> None:
    """Open the database, apply schema, and insert schema_version row."""
    con = sqlite3.connect(db_path)
    try:
        con.executescript(schema_sql)
        con.execute(
            "INSERT OR IGNORE INTO schema_version (version, applied_at) VALUES (?, ?)",
            (STORAGE_VERSION, datetime.now(UTC).isoformat()),
        )
        con.commit()
    finally:
        con.close()


def _read_schema() -> str:
    return _SCHEMA_SQL.read_text(encoding="utf-8")


class LucarneFamilyStore:
    """Thin wrapper around SQLite + config_entry data for the integration."""

    def __init__(self, hass: HomeAssistant, entry_id: str, db_path: str) -> None:
        self._hass = hass
        self._entry_id = entry_id
        self._db_path = db_path

    async def async_init(self) -> None:
        """Open SQLite, apply schema DDL, and record schema version."""
        schema_sql = await self._hass.async_add_executor_job(_read_schema)
        await self._hass.async_add_executor_job(_init_db, self._db_path, schema_sql)
        _LOGGER.debug("LucarneFamilyStore initialised at %s", self._db_path)

    async def async_migrate(self, from_version: int, to_version: int) -> None:
        """Stub for future schema migrations. Phase 1 only supports version 1."""

    async def async_close(self) -> None:
        """Release resources. Phase 1 uses per-call connections; this is a no-op."""

    def _entry(self) -> ConfigEntry:
        return self._hass.config_entries.async_get_entry(self._entry_id)  # type: ignore[return-value]

    def get_members(self) -> list[Member]:
        """Return members from config_entry.data (source of truth for member metadata)."""
        entry = self._entry()
        raw: list[dict[str, Any]] = entry.data.get(CONF_MEMBERS, [])
        return [Member.from_dict(m) for m in raw]

    async def async_save_members(self, members: list[Member]) -> None:
        """Persist members to config_entry.data via HA's config_entries API."""
        entry = self._entry()
        new_data = {**entry.data, CONF_MEMBERS: [m.to_dict() for m in members]}
        self._hass.config_entries.async_update_entry(entry, data=new_data)
