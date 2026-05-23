import type { HomeAssistant, CalendarEvent, TodoItem, HassEntity } from './types.js';

export function subscribeEntityState(
  hass: HomeAssistant,
  entityId: string,
  callback: (entity: HassEntity) => void,
): () => void {
  let unsubFn: (() => void) | undefined;
  let cancelled = false;

  hass.connection
    .subscribeMessage<{ variables: { trigger: { to_state: HassEntity } } }>(
      (result) => {
        if (result.variables?.trigger?.to_state) {
          callback(result.variables.trigger.to_state);
        }
      },
      { type: 'subscribe_trigger', trigger: { platform: 'state', entity_id: entityId } },
    )
    .then((fn) => {
      if (cancelled) fn();
      else unsubFn = fn;
    });

  return () => {
    cancelled = true;
    unsubFn?.();
  };
}

/**
 * Result of `fetchCalendarEvents`.
 * - `events`: per-entity event list. Failed entities still appear here with
 *   `[]` so callers that don't care about failure (e.g. simple "render what
 *   we have") don't need to handle a missing key.
 * - `failed`: entity ids whose calendar fetch threw. Callers that need to
 *   distinguish "really empty" from "fetch failed" (e.g. the optimistic-delete
 *   tombstone prune in `lucarne-calendar-card`) should check this set before
 *   treating an entity's empty list as authoritative.
 */
export interface FetchCalendarEventsResult {
  events: Map<string, CalendarEvent[]>;
  failed: Set<string>;
}

/**
 * Raw event shape returned by `GET /api/calendars/<entity_id>`. HA wraps
 * start/end in `{dateTime}` (timed) or `{date}` (all-day) — the Google
 * Calendar v3 format. We normalise to a flat string in `normaliseEvent`.
 */
interface RawCalendarEventResponse {
  start: string | { dateTime?: string; date?: string };
  end: string | { dateTime?: string; date?: string };
  summary?: string;
  description?: string;
  location?: string;
  uid?: string;
  recurrence_id?: string | null;
  rrule?: string | null;
}

function flattenDateField(field: RawCalendarEventResponse['start'] | undefined): string {
  if (typeof field === 'string') return field;
  if (field && typeof field === 'object') {
    // Prefer dateTime (timed event); fall back to date (all-day, YYYY-MM-DD).
    return field.dateTime ?? field.date ?? '';
  }
  return '';
}

function normaliseEvent(raw: RawCalendarEventResponse): CalendarEvent {
  const event: CalendarEvent = {
    start: flattenDateField(raw.start),
    end: flattenDateField(raw.end),
    summary: raw.summary ?? '',
  };
  if (raw.description) event.description = raw.description;
  if (raw.location) event.location = raw.location;
  if (raw.uid) event.uid = raw.uid;
  // Convert null → undefined to match the CalendarEvent shape.
  if (raw.recurrence_id) event.recurrence_id = raw.recurrence_id;
  if (raw.rrule) event.rrule = raw.rrule;
  return event;
}

/**
 * Fetch calendar events via HA's REST endpoint
 * `GET /api/calendars/<entity_id>?start=<ISO>&end=<ISO>`.
 *
 * Why REST and not the `calendar.get_events` service: the service response
 * deliberately strips `uid`, leaving downstream consumers unable to delete
 * events (the card needs uid for the `calendar/event/delete` WebSocket
 * command — see `deleteCalendarEvent` below; HA exposes no
 * `calendar.delete_event` service). The REST endpoint returns the full
 * event including uid, recurrence_id, and rrule.
 */
export async function fetchCalendarEvents(
  hass: HomeAssistant,
  entityIds: string[],
  start: Date,
  end: Date,
): Promise<FetchCalendarEventsResult> {
  const failed = new Set<string>();
  const startParam = encodeURIComponent(start.toISOString());
  const endParam = encodeURIComponent(end.toISOString());
  const results = await Promise.all(
    entityIds.map((entityId) =>
      hass.callApi<RawCalendarEventResponse[]>(
        'GET',
        `calendars/${encodeURIComponent(entityId)}?start=${startParam}&end=${endParam}`,
      )
        .then((raw) => [entityId, raw.map(normaliseEvent)] as const)
        .catch((err) => {
          console.warn(`[lucarne] GET /api/calendars/${entityId} failed:`, err);
          failed.add(entityId);
          return [entityId, [] as CalendarEvent[]] as const;
        }),
    ),
  );
  return { events: new Map(results), failed };
}

/**
 * Delete a calendar event via the WebSocket `calendar/event/delete` command.
 *
 * HA does NOT expose a `calendar.delete_event` service — only `create_event`
 * and `get_events` exist as services. Deletion (and update) go through the
 * WebSocket API, same as HA's own frontend calendar dashboard. The card's
 * `entitySupportsDelete` capability check is still based on the entity's
 * `supported_features & CalendarEntityFeature.DELETE_EVENT` bit, which
 * remains the authoritative signal for whether the entity supports delete.
 *
 * @param recurrenceId  For recurring events: pass the instance's
 *   `recurrence_id` to scope the delete to a single occurrence (or
 *   together with `recurrenceRange` to a range). Omit for non-recurring.
 * @param recurrenceRange  Omit (the default) to delete only this
 *   instance; pass `'THISANDFUTURE'` to delete this and all future
 *   occurrences. Only relevant when `recurrenceId` is set.
 */
export async function deleteCalendarEvent(
  hass: HomeAssistant,
  entityId: string,
  uid: string,
  recurrenceId?: string,
  recurrenceRange?: string,
): Promise<void> {
  await hass.connection.sendMessagePromise({
    type: 'calendar/event/delete',
    entity_id: entityId,
    uid,
    recurrence_id: recurrenceId,
    recurrence_range: recurrenceRange,
  });
}

// HA's CalendarEntityFeature: CREATE_EVENT=1, DELETE_EVENT=2, UPDATE_EVENT=4
const CALENDAR_DELETE_EVENT_FEATURE = 2;

export function entitySupportsDelete(hass: HomeAssistant, entityId: string): boolean {
  const features = hass.states[entityId]?.attributes?.['supported_features'];
  if (typeof features !== 'number') return false;
  return (features & CALENDAR_DELETE_EVENT_FEATURE) !== 0;
}

export function subscribeTodoItems(
  hass: HomeAssistant,
  entityId: string,
  callback: (items: TodoItem[]) => void,
): () => void {
  const fetchItems = async () => {
    try {
      const result = await hass.connection.sendMessagePromise<{
        response: Record<string, { items: TodoItem[] }>;
      }>({
        type: 'call_service',
        domain: 'todo',
        service: 'get_items',
        service_data: {},
        target: { entity_id: entityId },
        return_response: true,
      });
      callback(result?.response?.[entityId]?.items ?? []);
    } catch (err) {
      console.warn(`[lucarne] todo.get_items failed for ${entityId}:`, err);
      callback([]);
    }
  };

  fetchItems();
  return subscribeEntityState(hass, entityId, () => fetchItems());
}
