"""Rename impact preview and member rename orchestration."""
from __future__ import annotations

import json
import logging
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant

from .models import Member

_LOGGER = logging.getLogger(__name__)


@dataclass
class RenameImpact:
    automations: list[str] = field(default_factory=list)
    scripts: list[str] = field(default_factory=list)
    scenes: list[str] = field(default_factory=list)
    dashboards: list[dict[str, str]] = field(default_factory=list)

    @property
    def is_empty(self) -> bool:
        return not (self.automations or self.scripts or self.scenes or self.dashboards)


def slug_from_name(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")


def _entity_id_pattern(entity_id: str) -> re.Pattern[str]:
    """Return a regex that matches entity_id only at token boundaries."""
    return re.compile(r"(?<![a-z0-9_.])" + re.escape(entity_id) + r"(?![a-z0-9_.])")


def _entity_id_in_value(entity_id: str, node: Any) -> bool:
    pattern = _entity_id_pattern(entity_id)
    return _entity_id_in_value_with_pattern(pattern, entity_id, node)


def _entity_id_in_value_with_pattern(
    pattern: re.Pattern[str], entity_id: str, node: Any
) -> bool:
    if isinstance(node, str):
        return bool(pattern.search(node))
    if isinstance(node, dict):
        return any(
            (k == entity_id) or _entity_id_in_value_with_pattern(pattern, entity_id, v)
            for k, v in node.items()
        )
    if isinstance(node, list):
        return any(_entity_id_in_value_with_pattern(pattern, entity_id, item) for item in node)
    return False


def _walk_for_paths(
    entity_id: str, node: Any, source: str, path: str, results: list[dict[str, str]]
) -> None:
    pattern = _entity_id_pattern(entity_id)
    _walk_for_paths_with_pattern(pattern, entity_id, node, source, path, results)


def _walk_for_paths_with_pattern(
    pattern: re.Pattern[str],
    entity_id: str,
    node: Any,
    source: str,
    path: str,
    results: list[dict[str, str]],
) -> None:
    if isinstance(node, str):
        if pattern.search(node):
            results.append({"source": source, "path": path})
    elif isinstance(node, dict):
        for k, v in node.items():
            if isinstance(k, str) and (k == entity_id or bool(pattern.search(k))):
                results.append({"source": source, "path": f"{path}.{k}" if path else k})
            _walk_for_paths_with_pattern(
                pattern, entity_id, v, source, f"{path}.{k}" if path else k, results
            )
    elif isinstance(node, list):
        for i, item in enumerate(node):
            _walk_for_paths_with_pattern(
                pattern, entity_id, item, source, f"{path}[{i}]", results
            )


def _scan_impact_sync(config_dir: str, entity_id: str) -> RenameImpact:
    import yaml

    impact = RenameImpact()
    base = Path(config_dir)

    automations_file = base / "automations.yaml"
    if automations_file.exists():
        try:
            data = yaml.safe_load(automations_file.read_text()) or []
            if isinstance(data, list):
                for automation in data:
                    if isinstance(automation, dict) and _entity_id_in_value(entity_id, automation):
                        label = automation.get("id") or automation.get("alias", "unknown")
                        impact.automations.append(str(label))
        except (yaml.YAMLError, OSError) as exc:
            _LOGGER.exception("Failed to scan automations.yaml: %s", exc)

    scripts_file = base / "scripts.yaml"
    if scripts_file.exists():
        try:
            data = yaml.safe_load(scripts_file.read_text()) or {}
            if isinstance(data, dict):
                for script_id, config in data.items():
                    if _entity_id_in_value(entity_id, config):
                        impact.scripts.append(f"script.{script_id}")
        except (yaml.YAMLError, OSError) as exc:
            _LOGGER.exception("Failed to scan scripts.yaml: %s", exc)

    scenes_file = base / "scenes.yaml"
    if scenes_file.exists():
        try:
            data = yaml.safe_load(scenes_file.read_text()) or []
            if isinstance(data, list):
                for scene in data:
                    if isinstance(scene, dict) and _entity_id_in_value(entity_id, scene):
                        label = scene.get("id") or scene.get("name", "unknown")
                        impact.scenes.append(str(label))
        except (yaml.YAMLError, OSError) as exc:
            _LOGGER.exception("Failed to scan scenes.yaml: %s", exc)

    storage_dir = base / ".storage"
    if storage_dir.exists():
        for storage_file in storage_dir.glob("lovelace*"):
            try:
                raw = storage_file.read_text()
                if entity_id not in raw:
                    continue
                data = json.loads(raw)
                paths: list[dict[str, str]] = []
                _walk_for_paths(entity_id, data, storage_file.name, "", paths)
                impact.dashboards.extend(paths)
            except (json.JSONDecodeError, OSError) as exc:
                _LOGGER.exception("Failed to scan lovelace storage %s: %s", storage_file.name, exc)

    return impact


async def async_compute_rename_impact(
    hass: HomeAssistant, entity_id: str
) -> RenameImpact:
    """Scan HA config for all references to entity_id. Runs in executor."""
    return await hass.async_add_executor_job(
        _scan_impact_sync, hass.config.config_dir, entity_id
    )


async def async_rename_member(
    hass: HomeAssistant, member: Member, new_name: str
) -> RenameImpact:
    """Return rename impact for the proposed rename. Returns empty impact if slug unchanged.

    Does NOT perform any rename — the caller (options flow) decides after reviewing impact.
    """
    if slug_from_name(new_name) == member.slug:
        return RenameImpact()

    todo_id = member.todo_entity_id or f"todo.{member.slug}"
    counter_id = member.streak_counter_id or f"counter.{member.slug}_streak"

    todo_impact = await async_compute_rename_impact(hass, todo_id)
    counter_impact = await async_compute_rename_impact(hass, counter_id)

    return RenameImpact(
        automations=sorted({*todo_impact.automations, *counter_impact.automations}),
        scripts=sorted({*todo_impact.scripts, *counter_impact.scripts}),
        scenes=sorted({*todo_impact.scenes, *counter_impact.scenes}),
        dashboards=[*todo_impact.dashboards, *counter_impact.dashboards],
    )
