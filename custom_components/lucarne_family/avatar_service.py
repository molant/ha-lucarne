"""Service handler for member avatar uploads."""
from __future__ import annotations

import base64
import binascii
import io
import logging
import os
from pathlib import Path

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import ServiceValidationError

from .const import AVATAR_ALLOWED_MIME, AVATAR_MAX_BYTES, AVATAR_MAX_PIXELS, DOMAIN
from .models import Member

_LOGGER = logging.getLogger(__name__)

_MIME_TO_EXT = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
}

UPLOAD_AVATAR_SCHEMA = vol.Schema(
    {
        vol.Required("member"): str,
        vol.Required("image_data"): str,
        vol.Required("mime_type"): vol.In(list(AVATAR_ALLOWED_MIME)),
    }
)


def _detect_image_mime(data: bytes) -> str | None:
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if data.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if len(data) >= 12 and data[0:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    return None


def _check_dimensions(raw: bytes) -> None:
    """Raise ServiceValidationError if pixel count exceeds AVATAR_MAX_PIXELS or image is corrupt.

    Calls img.load() to force a full decode so truncated/corrupt bodies are caught here
    rather than persisted to disk as broken files.
    """
    from PIL import Image, UnidentifiedImageError

    try:
        with Image.open(io.BytesIO(raw)) as img:
            w, h = img.size
            # Reject oversized dimensions BEFORE loading pixels to prevent decompression bombs.
            if w * h > AVATAR_MAX_PIXELS:
                raise ServiceValidationError(
                    f"Image dimensions {w}x{h} exceed the maximum "
                    f"({AVATAR_MAX_PIXELS // 4096} x 4096 pixels)"
                )
            img.load()  # force full decode after size is known safe — catches truncated bodies
    except ServiceValidationError:
        raise
    except (UnidentifiedImageError, OSError) as exc:
        raise ServiceValidationError(f"Image could not be decoded: {exc}") from exc


def _write_avatar(dest: Path, raw: bytes) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(raw)


async def async_setup_avatar_service(hass: HomeAssistant, entry_id: str) -> None:
    """Register the lucarne_family.upload_avatar service."""

    async def handle_upload_avatar(call: ServiceCall) -> None:
        from .store import LucarneFamilyStore

        store: LucarneFamilyStore = hass.data[DOMAIN][entry_id]["store"]
        member_slug: str = call.data["member"]
        image_data_b64: str = call.data["image_data"]
        declared_mime: str = call.data["mime_type"]

        members = store.get_members()
        member = next((m for m in members if m.slug == member_slug), None)
        if member is None:
            raise ServiceValidationError(f"Unknown member: {member_slug!r}")

        # Slug must be path-safe (enforced by model, but verify defensively).
        if (
            not member_slug
            or "/" in member_slug
            or "\\" in member_slug
            or ".." in member_slug
            or member_slug.startswith(".")
        ):
            raise ServiceValidationError(f"Member slug is not safe for filenames: {member_slug!r}")

        # Pre-check encoded length to avoid decoding an arbitrarily large payload on the event loop.
        _max_encoded = AVATAR_MAX_BYTES * 4 // 3 + 4
        if len(image_data_b64) > _max_encoded:
            raise ServiceValidationError(
                f"Image size exceeds maximum {AVATAR_MAX_BYTES} bytes (2 MB)"
            )

        try:
            raw = base64.b64decode(image_data_b64, validate=True)
        except (binascii.Error, ValueError) as exc:
            raise ServiceValidationError(f"Invalid base64 image data: {exc}") from exc

        if len(raw) > AVATAR_MAX_BYTES:
            raise ServiceValidationError(
                f"Image size {len(raw)} bytes exceeds maximum {AVATAR_MAX_BYTES} bytes (2 MB)"
            )

        detected_mime = _detect_image_mime(raw)
        if detected_mime is None:
            raise ServiceValidationError(
                "Could not identify image format from magic bytes. "
                "Only PNG, JPEG, and WebP are accepted."
            )
        if detected_mime != declared_mime:
            raise ServiceValidationError(
                f"Declared mime_type {declared_mime!r} does not match "
                f"detected format {detected_mime!r}"
            )

        await hass.async_add_executor_job(_check_dimensions, raw)

        ext = _MIME_TO_EXT[declared_mime]
        avatar_dir = Path(hass.config.path("www", "lucarne", "avatars"))
        dest = avatar_dir / f"{member_slug}.{ext}"

        # Remove any stale avatars with a different extension before writing.
        await hass.async_add_executor_job(_cleanup_old_avatar, avatar_dir, member_slug, ext)
        await hass.async_add_executor_job(_write_avatar, dest, raw)

        avatar_url = f"/local/lucarne/avatars/{member_slug}.{ext}"
        # Re-read members immediately before saving to avoid clobbering concurrent edits.
        current = store.get_members()
        if not any(m.slug == member_slug for m in current):
            raise ServiceValidationError(f"Member {member_slug!r} was removed during upload")
        updated = [m if m.slug != member_slug else _with_avatar(m, avatar_url) for m in current]
        await store.async_save_members(updated)

        hass.bus.async_fire(
            "lucarne_family_avatar_uploaded",
            {"member": member_slug, "avatar": avatar_url},
        )
        _LOGGER.debug("Avatar uploaded for member %r → %s", member_slug, avatar_url)

    hass.services.async_register(
        DOMAIN, "upload_avatar", handle_upload_avatar, schema=UPLOAD_AVATAR_SCHEMA
    )


def _cleanup_old_avatar(avatar_dir: Path, slug: str, new_ext: str) -> None:
    """Remove any existing avatar files for the slug with a different extension."""
    for ext in _MIME_TO_EXT.values():
        if ext != new_ext:
            old = avatar_dir / f"{slug}.{ext}"
            try:
                os.remove(old)
            except FileNotFoundError:
                pass


def _with_avatar(member: Member, avatar_url: str) -> Member:
    """Return a new Member with the avatar field updated."""
    d = member.to_dict()
    d["avatar"] = avatar_url
    return Member.from_dict(d)


async def async_unload_avatar_service(hass: HomeAssistant) -> None:
    """Remove the upload_avatar service."""
    hass.services.async_remove(DOMAIN, "upload_avatar")
