"""Tests for const.py."""
from __future__ import annotations

from custom_components.lucarne_family.const import (
    AVATAR_ALLOWED_MIME,
    AVATAR_MAX_BYTES,
    AVATAR_MAX_PIXELS,
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
    PRESET_ADULT_NONE,
    PRESET_CUSTOM,
    PRESET_SCHOOL_AGE,
    PRESET_TODDLER,
    STORAGE_VERSION,
)


def test_domain() -> None:
    assert DOMAIN == "lucarne_family"


def test_storage_version() -> None:
    assert STORAGE_VERSION == 1


def test_default_times() -> None:
    assert DEFAULT_RESET_TIME == "04:00"
    assert DEFAULT_STREAK_CHECK_TIME == "21:00"


def test_conf_keys_exist() -> None:
    assert CONF_FAMILY_NAME == "family_name"
    assert CONF_MEMBERS == "members"
    assert CONF_RESET_TIME == "reset_time"
    assert CONF_STREAK_CHECK_TIME == "streak_check_time"
    assert CONF_ROUND_TRIP == "round_trip"
    assert CONF_ROUND_TRIP_ENABLED == "enabled"
    assert CONF_ROUND_TRIP_WEBHOOK_URL == "webhook_url"
    assert CONF_ROUND_TRIP_SECRET == "secret"
    assert CONF_ROUND_TRIP_DEVICE_NAME == "device_name"


def test_preset_slugs() -> None:
    assert PRESET_SCHOOL_AGE == "school-age"
    assert PRESET_TODDLER == "toddler"
    assert PRESET_ADULT_NONE == "adult-none"
    assert PRESET_CUSTOM == "custom"


def test_avatar_limits() -> None:
    assert AVATAR_MAX_BYTES == 2 * 1024 * 1024
    assert AVATAR_MAX_PIXELS == 4096 * 4096
    assert "image/png" in AVATAR_ALLOWED_MIME
    assert "image/jpeg" in AVATAR_ALLOWED_MIME
    assert "image/webp" in AVATAR_ALLOWED_MIME
