"""Tests for store.py task_metadata and completion_log methods."""
from __future__ import annotations

from datetime import UTC, date, datetime
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.lucarne_family.const import DOMAIN
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


async def _make_store(hass: HomeAssistant, tmp_path: Path) -> LucarneFamilyStore:
    entry = _make_entry(hass)
    db_path = str(tmp_path / "lucarne.db")
    store = LucarneFamilyStore(hass, entry.entry_id, db_path)
    await store.async_init()
    return store


# ---------------------------------------------------------------------------
# Task metadata CRUD
# ---------------------------------------------------------------------------


async def test_add_task_metadata_retrievable(hass: HomeAssistant, tmp_path: Path) -> None:
    store = await _make_store(hass, tmp_path)
    await store.async_add_task_metadata(
        member_slug="anna",
        item_uid="uid-001",
        type="routine",
        recurrence="FREQ=DAILY",
        icon="🪥",
        source="template",
    )
    row = await store.async_get_task_metadata("uid-001")
    assert row is not None
    assert row["item_uid"] == "uid-001"
    assert row["member_slug"] == "anna"
    assert row["type"] == "routine"
    assert row["recurrence"] == "FREQ=DAILY"
    assert row["icon"] == "🪥"
    assert row["source"] == "template"
    assert row["assignee_slug"] == ""


async def test_add_task_metadata_with_assignee(hass: HomeAssistant, tmp_path: Path) -> None:
    store = await _make_store(hass, tmp_path)
    await store.async_add_task_metadata(
        member_slug="household",
        item_uid="uid-hh-001",
        type="chore",
        assignee_slug="anna",
    )
    row = await store.async_get_task_metadata("uid-hh-001")
    assert row is not None
    assert row["member_slug"] == "household"
    assert row["assignee_slug"] == "anna"


async def test_update_metadata_only_allowed_fields(
    hass: HomeAssistant, tmp_path: Path
) -> None:
    store = await _make_store(hass, tmp_path)
    await store.async_add_task_metadata(
        member_slug="anna", item_uid="uid-002", type="routine", icon="🛏️"
    )
    await store.async_update_task_metadata("uid-002", icon="✅", recurrence="FREQ=WEEKLY;BYDAY=MO")
    row = await store.async_get_task_metadata("uid-002")
    assert row is not None
    assert row["icon"] == "✅"
    assert row["recurrence"] == "FREQ=WEEKLY;BYDAY=MO"
    # member_slug and item_uid must not change
    assert row["member_slug"] == "anna"
    assert row["item_uid"] == "uid-002"


async def test_update_metadata_ignores_disallowed_fields(
    hass: HomeAssistant, tmp_path: Path
) -> None:
    store = await _make_store(hass, tmp_path)
    await store.async_add_task_metadata(
        member_slug="anna", item_uid="uid-003", type="routine"
    )
    # Passing disallowed fields should silently do nothing
    await store.async_update_task_metadata("uid-003", member_slug="hack", created_at="fake")
    row = await store.async_get_task_metadata("uid-003")
    assert row is not None
    assert row["member_slug"] == "anna"
    assert row["item_uid"] == "uid-003"


async def test_delete_metadata_leaves_log_rows(hass: HomeAssistant, tmp_path: Path) -> None:
    import sqlite3

    store = await _make_store(hass, tmp_path)
    await store.async_add_task_metadata(
        member_slug="anna", item_uid="uid-004", type="chore"
    )
    await store.async_append_completion(
        member_slug="anna",
        item_uid="uid-004",
        summary="Brush teeth",
        action="completed",
    )
    await store.async_delete_task_metadata("uid-004")

    # Metadata gone
    assert await store.async_get_task_metadata("uid-004") is None

    # Log row preserved
    con = sqlite3.connect(str(tmp_path / "lucarne.db"))
    try:
        count = con.execute(
            "SELECT COUNT(*) FROM completion_log WHERE item_uid = 'uid-004'"
        ).fetchone()[0]
        assert count == 1
    finally:
        con.close()


async def test_get_tasks_for_member(hass: HomeAssistant, tmp_path: Path) -> None:
    store = await _make_store(hass, tmp_path)
    await store.async_add_task_metadata(
        member_slug="anna", item_uid="uid-a1", type="routine"
    )
    await store.async_add_task_metadata(
        member_slug="anna", item_uid="uid-a2", type="chore"
    )
    await store.async_add_task_metadata(
        member_slug="ben", item_uid="uid-b1", type="routine"
    )

    anna_tasks = await store.async_get_tasks_for_member("anna")
    assert len(anna_tasks) == 2
    assert {t["item_uid"] for t in anna_tasks} == {"uid-a1", "uid-a2"}

    ben_tasks = await store.async_get_tasks_for_member("ben")
    assert len(ben_tasks) == 1


# ---------------------------------------------------------------------------
# Completion log
# ---------------------------------------------------------------------------


async def test_append_completion_inserts_row(hass: HomeAssistant, tmp_path: Path) -> None:
    import sqlite3

    store = await _make_store(hass, tmp_path)
    await store.async_append_completion(
        member_slug="anna",
        item_uid="uid-c1",
        summary="Brush teeth",
        action="completed",
        recurrence_at_time="FREQ=DAILY",
    )

    con = sqlite3.connect(str(tmp_path / "lucarne.db"))
    try:
        row = con.execute("SELECT * FROM completion_log WHERE item_uid = 'uid-c1'").fetchone()
        assert row is not None
        assert row[2] == "anna"  # member_slug
        assert row[5] == "completed"  # action
    finally:
        con.close()


# ---------------------------------------------------------------------------
# Streak computation
# ---------------------------------------------------------------------------


async def test_streak_three_days_complete(hass: HomeAssistant, tmp_path: Path) -> None:
    """3 consecutive days with all routines completed → streak 3."""
    store = await _make_store(hass, tmp_path)
    uid = "routine-1"
    await store.async_add_task_metadata(
        member_slug="anna", item_uid=uid, type="routine", recurrence="FREQ=DAILY"
    )

    today = date(2025, 5, 24)
    # Complete the routine today and the 2 preceding days
    for offset in range(3):
        ts = datetime(2025, 5, 24 - offset, 20, 0, 0, tzinfo=UTC).isoformat()
        import sqlite3
        con = sqlite3.connect(str(tmp_path / "lucarne.db"))
        try:
            con.execute(
                "INSERT INTO completion_log "
                "(timestamp, member_slug, item_uid, summary, action, recurrence_at_time) "
                "VALUES (?, ?, ?, ?, ?, ?)",
                (ts, "anna", uid, "Brush teeth", "completed", "FREQ=DAILY"),
            )
            con.commit()
        finally:
            con.close()

    evaluator = lambda _d: [uid] if True else []  # noqa: E731
    streak = await store.async_get_streak("anna", today, evaluator)
    assert streak == 3


async def test_streak_missed_day_resets(hass: HomeAssistant, tmp_path: Path) -> None:
    """2 days complete, then a missed day → streak stops at 2."""
    store = await _make_store(hass, tmp_path)
    uid = "routine-2"
    today = date(2025, 5, 24)

    # Complete today and yesterday only (not day before yesterday)
    for offset in [0, 1]:
        ts = datetime(2025, 5, 24 - offset, 20, 0, 0, tzinfo=UTC).isoformat()
        import sqlite3
        con = sqlite3.connect(str(tmp_path / "lucarne.db"))
        try:
            con.execute(
                "INSERT INTO completion_log "
                "(timestamp, member_slug, item_uid, summary, action, recurrence_at_time) "
                "VALUES (?, ?, ?, ?, ?, ?)",
                (ts, "anna", uid, "Make bed", "completed", "FREQ=DAILY"),
            )
            con.commit()
        finally:
            con.close()

    evaluator = lambda _d: [uid]  # noqa: E731
    streak = await store.async_get_streak("anna", today, evaluator)
    assert streak == 2


async def test_streak_no_routines_day_skipped(hass: HomeAssistant, tmp_path: Path) -> None:
    """Days with no expected routines are skipped (don't break streak)."""
    store = await _make_store(hass, tmp_path)
    uid = "routine-3"
    today = date(2025, 5, 24)  # Saturday

    # Routine is only on weekdays (Mon-Fri)
    def weekday_evaluator(d: date) -> list[str]:
        return [uid] if d.weekday() < 5 else []  # 0=Mon, 4=Fri, 5=Sat, 6=Sun

    # Complete on the 3 most recent weekdays (Fri May23, Thu May22, Wed May21)
    for day_offset in [1, 2, 3]:  # Fri, Thu, Wed (today=Sat May24, Fri=23, Thu=22, Wed=21)
        day = date(2025, 5, 24 - day_offset)
        if day.weekday() < 5:
            ts = datetime(day.year, day.month, day.day, 20, 0, 0, tzinfo=UTC).isoformat()
            import sqlite3
            con = sqlite3.connect(str(tmp_path / "lucarne.db"))
            try:
                con.execute(
                    "INSERT INTO completion_log "
                    "(timestamp, member_slug, item_uid, summary, action, recurrence_at_time) "
                    "VALUES (?, ?, ?, ?, ?, ?)",
                    (ts, "anna", uid, "Pack school bag", "completed",
                     "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR"),
                )
                con.commit()
            finally:
                con.close()

    # Today is Sat (no routines → skip); walker continues to Fri/Thu/Wed all complete → streak 3
    streak = await store.async_get_streak("anna", today, weekday_evaluator)
    assert streak == 3


async def test_streak_empty_log_returns_zero(hass: HomeAssistant, tmp_path: Path) -> None:
    store = await _make_store(hass, tmp_path)
    today = date(2025, 5, 24)
    evaluator = lambda _d: ["uid-x"]  # noqa: E731
    streak = await store.async_get_streak("anna", today, evaluator)
    assert streak == 0


async def test_get_all_task_metadata(hass: HomeAssistant, tmp_path: Path) -> None:
    store = await _make_store(hass, tmp_path)
    await store.async_add_task_metadata(member_slug="anna", item_uid="uid-x1", type="routine")
    await store.async_add_task_metadata(member_slug="ben", item_uid="uid-x2", type="chore")
    rows = await store.async_get_all_task_metadata()
    assert len(rows) == 2
    uids = {r["item_uid"] for r in rows}
    assert uids == {"uid-x1", "uid-x2"}


async def test_get_task_metadata_returns_none_for_missing(
    hass: HomeAssistant, tmp_path: Path
) -> None:
    store = await _make_store(hass, tmp_path)
    result = await store.async_get_task_metadata("nonexistent-uid")
    assert result is None


async def test_get_task_metadata_sync(hass: HomeAssistant, tmp_path: Path) -> None:
    store = await _make_store(hass, tmp_path)
    await store.async_add_task_metadata(
        member_slug="anna", item_uid="uid-sync-1", type="routine", recurrence="FREQ=DAILY"
    )
    rows = store.get_task_metadata_sync("anna")
    assert len(rows) == 1
    assert rows[0]["item_uid"] == "uid-sync-1"
