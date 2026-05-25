"""Service handler for member metadata updates (avatar, etc.)."""
from __future__ import annotations

import logging
import re

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import ServiceValidationError

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

# Matches an emoji or emoji sequence (e.g. compound emoji with ZWJ skin-tone modifiers).
# Requires at least one "base" emoji character so invisible-only inputs (bare ZWJ U+200D,
# bare VS-16 U+FE0F, bare keycap combiner U+20E3) are rejected.
# Also rejects plain ASCII text (U+0000-U+22FF) — those ranges are not included.
_BASE_EMOJI = (
    r"[\U0001F000-\U0001FAFF"   # Supplementary emoji planes (emoticons, symbols)
    r"\U00002300-\U000027FF"    # Misc Technical / Misc Symbols / Dingbats
    r"\U00002B00-\U00002BFF"    # Misc Symbols and Arrows (\u2b50 ⭐, etc.)
    r"\U0001F1E0-\U0001F1FF]"   # Regional indicator symbols (flag pairs)
)
_EMOJI_MOD = (
    r"[\U0000FE00-\U0000FE0F"   # Variation selectors (VS-1..VS-16)
    r"\u200D"                    # ZWJ (zero-width joiner for compound emoji)
    r"\u20E3"                    # Combining enclosing keycap
    r"\U0001F3FB-\U0001F3FF]"   # Skin-tone modifiers
)
# An emoji sequence: one or more (base emoji + optional modifiers) pairs.
_EMOJI_RE = re.compile(
    rf"^{_BASE_EMOJI}{_EMOJI_MOD}*(?:\u200D{_BASE_EMOJI}{_EMOJI_MOD}*)*$"
)
_AVATAR_PATH_RE = re.compile(r"^/local/lucarne/avatars/[^/\\]+$")


def _validate_avatar(value: str) -> str:
    """Accept a single emoji or a safe /local/lucarne/avatars/<filename> path."""
    if not value or not value.strip():
        raise vol.Invalid("Avatar must not be empty")
    v = value.strip()
    # Allow emoji
    if _EMOJI_RE.match(v):
        return v
    # Allow approved avatar path
    if _AVATAR_PATH_RE.match(v):
        # Extra safety: no ".." traversal inside the filename
        filename = v.split("/")[-1]
        if ".." in filename or "/" in filename or "\\" in filename:
            raise vol.Invalid("Avatar path contains unsafe characters")
        return v
    raise vol.Invalid(
        "Avatar must be an emoji or a /local/lucarne/avatars/<filename> path"
    )


SET_MEMBER_AVATAR_SCHEMA = vol.Schema(
    {
        vol.Required("member"): str,
        vol.Required("avatar"): vol.All(str, _validate_avatar),
    }
)


async def async_setup_member_service(hass: HomeAssistant, entry_id: str) -> None:
    """Register lucarne_family.set_member_avatar."""

    async def handle_set_member_avatar(call: ServiceCall) -> None:
        from .store import LucarneFamilyStore

        store: LucarneFamilyStore = hass.data[DOMAIN][entry_id]["store"]
        member_slug: str = call.data["member"]
        avatar: str = call.data["avatar"]

        members = store.get_members()
        member = next((m for m in members if m.slug == member_slug), None)
        if member is None:
            raise ServiceValidationError(f"Unknown member: {member_slug!r}")

        updated = [
            m if m.slug != member_slug else _with_avatar(m, avatar) for m in members
        ]
        await store.async_save_members(updated)

        hass.bus.async_fire(
            "lucarne_family_member_updated",
            {"member": member_slug, "field": "avatar"},
        )
        _LOGGER.debug("Avatar updated for member %r → %r", member_slug, avatar)

    hass.services.async_register(
        DOMAIN, "set_member_avatar", handle_set_member_avatar, schema=SET_MEMBER_AVATAR_SCHEMA
    )


async def async_unload_member_service(hass: HomeAssistant) -> None:
    """Remove the set_member_avatar service."""
    hass.services.async_remove(DOMAIN, "set_member_avatar")


def _with_avatar(member, avatar: str):  # type: ignore[no-untyped-def]
    d = member.to_dict()
    d["avatar"] = avatar
    from .models import Member
    return Member.from_dict(d)
