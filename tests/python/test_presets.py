"""Tests for presets.py."""
from __future__ import annotations

import pytest
from dateutil.rrule import rrulestr

from custom_components.lucarne_family.const import (
    PRESET_ADULT_NONE,
    PRESET_SCHOOL_AGE,
    PRESET_TODDLER,
)
from custom_components.lucarne_family.presets import BUILTIN_PRESETS


def test_all_named_presets_present() -> None:
    assert PRESET_SCHOOL_AGE in BUILTIN_PRESETS
    assert PRESET_TODDLER in BUILTIN_PRESETS
    assert PRESET_ADULT_NONE in BUILTIN_PRESETS


def test_school_age_has_five_routines() -> None:
    preset = BUILTIN_PRESETS[PRESET_SCHOOL_AGE]
    assert len(preset.routines) == 5


def test_toddler_has_three_routines() -> None:
    preset = BUILTIN_PRESETS[PRESET_TODDLER]
    assert len(preset.routines) == 3


def test_adult_none_is_empty() -> None:
    preset = BUILTIN_PRESETS[PRESET_ADULT_NONE]
    assert preset.routines == []


@pytest.mark.parametrize("slug", [PRESET_SCHOOL_AGE, PRESET_TODDLER])
def test_all_rrules_parse(slug: str) -> None:
    """Every routine's RRULE must be parseable by dateutil."""
    preset = BUILTIN_PRESETS[slug]
    for routine in preset.routines:
        # rrulestr raises ValueError on invalid strings
        rrulestr(routine.recurrence)


def test_school_age_has_required_routines() -> None:
    preset = BUILTIN_PRESETS[PRESET_SCHOOL_AGE]
    summaries = {r.summary for r in preset.routines}
    assert "Brush teeth" in summaries
    assert "Make bed" in summaries
    assert "Pack school bag" in summaries
    assert "Kindness act" in summaries
    assert "Screen time off" in summaries


def test_toddler_has_required_routines() -> None:
    preset = BUILTIN_PRESETS[PRESET_TODDLER]
    summaries = {r.summary for r in preset.routines}
    assert "Brush teeth" in summaries
    assert "Get dressed" in summaries
    assert "Put toys away" in summaries
