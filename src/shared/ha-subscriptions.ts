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
      hass
        .callWS<{ events: CalendarEvent[] }>({
          type: 'calendar/list_events',
          entity_id: entityId,
          start_date_time: start.toISOString(),
          end_date_time: end.toISOString(),
        })
        .then((result) => [entityId, result?.events ?? []] as const)
        .catch(() => [entityId, [] as CalendarEvent[]] as const),
    ),
  );
  return new Map(results);
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
    } catch {
      callback([]);
    }
  };

  fetchItems();
  return subscribeEntityState(hass, entityId, () => fetchItems());
}
