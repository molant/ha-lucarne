"""Built-in routine preset definitions for the Lucarne Family integration."""
from __future__ import annotations

from .const import PRESET_ADULT_NONE, PRESET_SCHOOL_AGE, PRESET_TODDLER
from .models import RoutinePreset, RoutineTemplate

BUILTIN_PRESETS: dict[str, RoutinePreset] = {
    PRESET_SCHOOL_AGE: RoutinePreset(
        slug=PRESET_SCHOOL_AGE,
        display_name="School-age kid",
        routines=[
            RoutineTemplate(
                summary="Brush teeth",
                icon="🪥",
                recurrence="FREQ=DAILY",
            ),
            RoutineTemplate(
                summary="Make bed",
                icon="🛏️",
                recurrence="FREQ=DAILY",
            ),
            RoutineTemplate(
                summary="Pack school bag",
                icon="🎒",
                recurrence="FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
            ),
            RoutineTemplate(
                summary="Kindness act",
                icon="💗",
                recurrence="FREQ=DAILY",
            ),
            RoutineTemplate(
                summary="Screen time off",
                icon="📵",
                recurrence="FREQ=DAILY",
            ),
        ],
    ),
    PRESET_TODDLER: RoutinePreset(
        slug=PRESET_TODDLER,
        display_name="Toddler",
        routines=[
            RoutineTemplate(
                summary="Brush teeth",
                icon="🪥",
                recurrence="FREQ=DAILY",
            ),
            RoutineTemplate(
                summary="Get dressed",
                icon="👕",
                recurrence="FREQ=DAILY",
            ),
            RoutineTemplate(
                summary="Put toys away",
                icon="🧸",
                recurrence="FREQ=DAILY",
            ),
        ],
    ),
    PRESET_ADULT_NONE: RoutinePreset(
        slug=PRESET_ADULT_NONE,
        display_name="Adult (none)",
        routines=[],
    ),
}
