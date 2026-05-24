"""Service handlers for task management in the Lucarne Family integration."""
from __future__ import annotations

import uuid
from typing import Any

import homeassistant.helpers.config_validation as cv
import voluptuous as vol
from homeassistant.components.todo import TodoItem
from homeassistant.components.todo.const import DATA_COMPONENT, TodoItemStatus
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError

from .const import DOMAIN
from .recurrence import is_valid_rrule
from .store import LucarneFamilyStore

_HOUSEHOLD_SLUG = "household"
_HOUSEHOLD_ENTITY_ID = "todo.lucarne_household"
_TASK_TYPES = ("routine", "chore")


def _get_store(hass: HomeAssistant, entry_id: str) -> LucarneFamilyStore:
    return hass.data[DOMAIN][entry_id]["store"]


def _get_todo_entity(hass: HomeAssistant, entity_id: str):
    """Return the todo entity, raising HomeAssistantError if unavailable."""
    todo_component = hass.data.get(DATA_COMPONENT)
    if todo_component is None:
        raise HomeAssistantError("todo component not loaded")
    entity = todo_component.get_entity(entity_id)
    if entity is None:
        raise HomeAssistantError(f"Todo entity {entity_id!r} not found")
    return entity


def _resolve_todo_entity_id(store: LucarneFamilyStore, member_slug: str) -> str:
    """Map member slug → todo entity_id, raising ServiceValidationError for unknowns."""
    if member_slug == _HOUSEHOLD_SLUG:
        return _HOUSEHOLD_ENTITY_ID
    member = next((m for m in store.get_members() if m.slug == member_slug), None)
    if member is None:
        raise ServiceValidationError(f"Unknown member: {member_slug!r}")
    if not member.todo_entity_id:
        raise HomeAssistantError(f"Member {member_slug!r} has no todo entity configured")
    return member.todo_entity_id


def _rrule_validator(value: str) -> str:
    if value and not is_valid_rrule(value):
        raise vol.Invalid(f"Invalid RRULE: {value!r}")
    return value


ADD_TASK_SCHEMA = vol.Schema(
    {
        vol.Required("member"): cv.string,
        vol.Required("summary"): vol.All(cv.string, vol.Length(max=200)),
        vol.Optional("type", default="chore"): vol.In(list(_TASK_TYPES)),
        vol.Optional("recurrence", default=""): _rrule_validator,
        vol.Optional("icon", default=""): cv.string,
        vol.Optional("due"): cv.datetime,
        vol.Optional("source", default="manual"): vol.In(["manual", "template", "apple"]),
        vol.Optional("assignee", default=""): cv.string,
    }
)

UPDATE_METADATA_SCHEMA = vol.Schema(
    {
        vol.Required("uid"): cv.string,
        vol.Optional("icon"): cv.string,
        vol.Optional("recurrence"): _rrule_validator,
        vol.Optional("type"): vol.In(list(_TASK_TYPES)),
        vol.Optional("assignee"): cv.string,
    }
)

DELETE_TASK_SCHEMA = vol.Schema({vol.Required("uid"): cv.string})

TOGGLE_TASK_SCHEMA = vol.Schema({vol.Required("uid"): cv.string})


async def async_setup_services(hass: HomeAssistant, entry_id: str) -> None:
    """Register lucarne_family task services. Re-registration replaces the handler."""

    async def handle_add_task(call: ServiceCall) -> None:
        store = _get_store(hass, entry_id)
        known_slugs = {m.slug for m in store.get_members()}
        member_slug: str = call.data["member"]
        summary: str = call.data["summary"]
        task_type: str = call.data.get("type", "chore")
        recurrence: str = call.data.get("recurrence", "")
        icon: str = call.data.get("icon", "")
        due = call.data.get("due")
        source: str = call.data.get("source", "manual")
        assignee: str = call.data.get("assignee", "")

        if member_slug != _HOUSEHOLD_SLUG and member_slug not in known_slugs:
            raise ServiceValidationError(f"Unknown member: {member_slug!r}")
        if assignee and member_slug != _HOUSEHOLD_SLUG:
            raise ServiceValidationError("assignee is only valid for household tasks")
        if assignee and member_slug == _HOUSEHOLD_SLUG and assignee not in known_slugs:
            raise ServiceValidationError(f"Unknown assignee: {assignee!r}")

        todo_entity_id = _resolve_todo_entity_id(store, member_slug)
        entity = _get_todo_entity(hass, todo_entity_id)

        item_uid = str(uuid.uuid4())
        await entity.async_create_todo_item(
            TodoItem(
                uid=item_uid,
                summary=summary,
                status=TodoItemStatus.NEEDS_ACTION,
                due=due,
            )
        )
        try:
            await store.async_add_task_metadata(
                member_slug=member_slug,
                item_uid=item_uid,
                type=task_type,
                recurrence=recurrence,
                icon=icon,
                source=source,
                assignee_slug=assignee,
            )
        except Exception:
            # Best-effort rollback: remove the orphaned todo item.
            await entity.async_delete_todo_items([item_uid])
            raise
        hass.bus.async_fire(
            "lucarne_family_task_added",
            {"member": member_slug, "uid": item_uid, "type": task_type, "summary": summary},
        )

    async def handle_update_task_metadata(call: ServiceCall) -> None:
        store = _get_store(hass, entry_id)
        uid: str = call.data["uid"]

        metadata = await store.async_get_task_metadata(uid)
        if metadata is None:
            raise ServiceValidationError(f"No task found with uid {uid!r}")

        assignee = call.data.get("assignee")
        if assignee is not None and metadata.get("member_slug") != _HOUSEHOLD_SLUG:
            raise ServiceValidationError("assignee can only be set on household tasks")
        if assignee:
            known_slugs = {m.slug for m in store.get_members()}
            if assignee not in known_slugs:
                raise ServiceValidationError(f"Unknown assignee: {assignee!r}")

        update_fields: dict[str, Any] = {}
        for field_name in ("icon", "recurrence", "type"):
            if field_name in call.data:
                update_fields[field_name] = call.data[field_name]
        if "assignee" in call.data:
            update_fields["assignee_slug"] = call.data["assignee"]

        await store.async_update_task_metadata(uid, **update_fields)
        hass.bus.async_fire("lucarne_family_task_metadata_updated", {"uid": uid})

    async def handle_delete_task(call: ServiceCall) -> None:
        store = _get_store(hass, entry_id)
        uid: str = call.data["uid"]

        metadata = await store.async_get_task_metadata(uid)
        if metadata is None:
            raise ServiceValidationError(f"No task found with uid {uid!r}")

        todo_entity_id = _resolve_todo_entity_id(store, metadata["member_slug"])
        entity = _get_todo_entity(hass, todo_entity_id)

        await entity.async_delete_todo_items([uid])
        await store.async_delete_task_metadata(uid)
        hass.bus.async_fire("lucarne_family_task_deleted", {"uid": uid})

    async def handle_toggle_task(call: ServiceCall) -> None:
        store = _get_store(hass, entry_id)
        uid: str = call.data["uid"]

        metadata = await store.async_get_task_metadata(uid)
        if metadata is None:
            raise ServiceValidationError(f"No task found with uid {uid!r}")

        todo_entity_id = _resolve_todo_entity_id(store, metadata["member_slug"])
        entity = _get_todo_entity(hass, todo_entity_id)

        items = entity.todo_items or []
        item = next((i for i in items if i.uid == uid), None)
        if item is None:
            raise HomeAssistantError(f"Todo item {uid!r} not found in {todo_entity_id!r}")

        is_completing = item.status != TodoItemStatus.COMPLETED
        new_status = TodoItemStatus.COMPLETED if is_completing else TodoItemStatus.NEEDS_ACTION
        action = "completed" if is_completing else "undone"

        # Include all existing fields to avoid overwriting due/description with None.
        await entity.async_update_todo_item(
            TodoItem(
                uid=uid,
                summary=item.summary,
                status=new_status,
                due=item.due,
                description=item.description,
            )
        )
        await store.async_append_completion(
            member_slug=metadata["member_slug"],
            item_uid=uid,
            summary=item.summary or "",
            action=action,
            recurrence_at_time=metadata.get("recurrence", ""),
        )
        hass.bus.async_fire("lucarne_family_task_toggled", {"uid": uid, "action": action})

    hass.services.async_register(DOMAIN, "add_task", handle_add_task, schema=ADD_TASK_SCHEMA)
    hass.services.async_register(
        DOMAIN, "update_task_metadata", handle_update_task_metadata, schema=UPDATE_METADATA_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, "delete_task", handle_delete_task, schema=DELETE_TASK_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, "toggle_task", handle_toggle_task, schema=TOGGLE_TASK_SCHEMA
    )


async def async_unload_services(hass: HomeAssistant) -> None:
    """Remove lucarne_family task services."""
    for service in ("add_task", "update_task_metadata", "delete_task", "toggle_task"):
        hass.services.async_remove(DOMAIN, service)
