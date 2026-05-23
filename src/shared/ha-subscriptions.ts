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

export async function fetchCalendarEvents(
  hass: HomeAssistant,
  entityIds: string[],
  start: Date,
  end: Date,
): Promise<Map<string, CalendarEvent[]>> {
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
          return [entityId, [] as CalendarEvent[]] as const;
        }),
    ),
  );
  return new Map(results);
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
