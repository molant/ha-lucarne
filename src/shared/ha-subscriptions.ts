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
 * - `failed`: entity ids whose `calendar.get_events` call threw. Callers
 *   that need to distinguish "really empty" from "fetch failed" (e.g. the
 *   optimistic-delete tombstone prune in `lucarne-calendar-card`) should
 *   check this set before treating an entity's empty list as authoritative.
 */
export interface FetchCalendarEventsResult {
  events: Map<string, CalendarEvent[]>;
  failed: Set<string>;
}

export async function fetchCalendarEvents(
  hass: HomeAssistant,
  entityIds: string[],
  start: Date,
  end: Date,
): Promise<FetchCalendarEventsResult> {
  const failed = new Set<string>();
  const results = await Promise.all(
    entityIds.map((entityId) =>
      hass.connection
        .sendMessagePromise<{ response: Record<string, { events: CalendarEvent[] }> }>({
          type: 'call_service',
          domain: 'calendar',
          service: 'get_events',
          service_data: {
            start_date_time: start.toISOString(),
            end_date_time: end.toISOString(),
          },
          target: { entity_id: entityId },
          return_response: true,
        })
        .then((result) => [entityId, result?.response?.[entityId]?.events ?? []] as const)
        .catch((err) => {
          console.warn(`[lucarne] calendar.get_events failed for ${entityId}:`, err);
          failed.add(entityId);
          return [entityId, [] as CalendarEvent[]] as const;
        }),
    ),
  );
  return { events: new Map(results), failed };
}

export async function deleteCalendarEvent(
  hass: HomeAssistant,
  entityId: string,
  uid: string,
): Promise<void> {
  await hass.callService('calendar', 'delete_event', { uid }, { entity_id: entityId });
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
