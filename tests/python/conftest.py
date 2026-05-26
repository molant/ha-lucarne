"""Pytest configuration for lucarne_family integration tests."""
from __future__ import annotations

import asyncio
import logging
import threading
from collections.abc import Generator
from pathlib import Path

import pytest


@pytest.fixture
def hass_config_dir(tmp_path: Path) -> str:
    """Per-test config dir, overriding the upstream shared default.

    The upstream `hass_config_dir` fixture in pytest-homeassistant-custom-
    component defaults to a single bundled `testing_config/` directory in
    site-packages. Anything a test (or the integration) writes there via
    `hass.config.path()` leaks into later tests in the same session, and
    reused entity slugs (anna, ben, lucarne_household) surface as phantom
    rename-impact refs.

    Returns `tmp_path` directly rather than going through the upstream
    `hass_tmp_config_dir` (which copies the bundle in) — the bundle ships
    yaml fixtures with leftover entity references that would re-pollute
    each copy. `.storage/` is seeded so local_todo can write its ICS
    files. The override fires before HA bootstrap so registries/recorder
    land in the per-test dir from the start.
    """
    (tmp_path / ".storage").mkdir(parents=True, exist_ok=True)
    return str(tmp_path)


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Enable custom integrations for all tests in this suite."""


@pytest.fixture(autouse=True)
def verify_cleanup(
    expected_lingering_tasks: bool,
    expected_lingering_timers: bool,
) -> Generator[None]:
    """Override verify_cleanup to allow executor threads and _run_safe_shutdown_loop.

    pytest-asyncio 1.x removed the `event_loop` fixture; access the running
    loop via asyncio directly, matching the upstream package's own pattern.
    """
    import respx
    from homeassistant.core import HassJob
    from homeassistant.util import dt as dt_util
    from pytest_homeassistant_custom_component.plugins import (
        INSTANCES,
        get_scheduled_timer_handles,
        long_repr_strings,
    )

    event_loop = asyncio.get_event_loop()
    threads_before = frozenset(threading.enumerate())
    tasks_before = asyncio.all_tasks(event_loop)
    yield

    event_loop.run_until_complete(event_loop.shutdown_default_executor())

    if len(INSTANCES) >= 2:
        count = len(INSTANCES)
        for inst in INSTANCES:
            inst.stop()
        pytest.exit(f"Detected non stopped instances ({count}), aborting test run")

    tasks = asyncio.all_tasks(event_loop) - tasks_before
    for task in tasks:
        if expected_lingering_tasks:
            logging.getLogger(__name__).warning("Lingering task after test %r", task)
        else:
            pytest.fail(f"Lingering task after test {task!r}")
        task.cancel()
    if tasks:
        event_loop.run_until_complete(asyncio.wait(tasks))

    for handle in get_scheduled_timer_handles(event_loop):
        if not handle.cancelled():
            with long_repr_strings():
                if expected_lingering_timers:
                    logging.getLogger(__name__).warning("Lingering timer after test %r", handle)
                elif handle._args and isinstance(job := handle._args[-1], HassJob):
                    if job.cancel_on_shutdown:
                        continue
                    pytest.fail(f"Lingering timer after job {job!r}")
                else:
                    pytest.fail(f"Lingering timer after test {handle!r}")
                handle.cancel()

    threads = frozenset(threading.enumerate()) - threads_before
    for thread in threads:
        assert (
            isinstance(thread, threading._DummyThread)
            or thread.name.startswith("waitpid-")
            or "_run_safe_shutdown_loop" in thread.name
        ), f"Thread still running after test: {thread!r}"

    try:
        assert dt_util.DEFAULT_TIME_ZONE is dt_util.UTC
    finally:
        dt_util.DEFAULT_TIME_ZONE = dt_util.UTC

    try:
        assert not respx.mock.routes, (
            "respx.mock routes not cleaned up, maybe the test needs @respx.mock"
        )
    finally:
        respx.mock.clear()
