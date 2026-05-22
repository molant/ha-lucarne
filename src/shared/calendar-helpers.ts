import type { CalendarConfig, HomeAssistant } from './types.js';

/**
 * Resolve a calendar's display label from HA's entity registry (friendly_name),
 * which the user can edit via the entity modal. Falls back to the entity_id
 * when no friendly_name is set.
 *
 * Note: `CalendarConfig.label` is preserved in the type for backward-compatible
 * YAML parsing but is intentionally NOT preferred here — having the editor
 * silently keep stale per-card labels while offering no UI to edit them led to
 * confusing UX. Users who want per-card display names should rename the
 * underlying calendar entity instead.
 */
export function resolveCalendarLabel(cal: CalendarConfig, hass: HomeAssistant | undefined): string {
  const friendly = hass?.states?.[cal.entity]?.attributes?.['friendly_name'];
  if (typeof friendly === 'string' && friendly) return friendly;
  return cal.entity;
}

/** Return calendars with `label` always populated, so children components don't need hass. */
export function resolveCalendars(
  calendars: CalendarConfig[],
  hass: HomeAssistant | undefined,
): (CalendarConfig & { label: string })[] {
  return calendars.map((cal) => ({ ...cal, label: resolveCalendarLabel(cal, hass) }));
}
