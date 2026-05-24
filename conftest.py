"""Root conftest: normalise the custom_components namespace package path.

pytest-homeassistant-custom-component pre-imports `custom_components` from its own
testing_config before pytest adds our project root to sys.path. Editable installs can
also inject non-directory path-hook entries. We normalise __path__ here: keep only real
directories and ensure the project's custom_components directory comes first, so that
HA's _get_custom_components loader can iterate and discover lucarne_family.
"""
from __future__ import annotations

from pathlib import Path


def pytest_configure() -> None:
    """Normalise custom_components.__path__ for the test session."""
    import custom_components

    project_cc = str(Path(__file__).parent / "custom_components")
    real_dirs = [p for p in custom_components.__path__ if Path(p).is_dir()]
    if project_cc not in real_dirs:
        real_dirs.insert(0, project_cc)
    custom_components.__path__ = real_dirs
