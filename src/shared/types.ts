export type { HassEntity } from 'home-assistant-js-websocket';
export type { HomeAssistant } from 'custom-card-helpers';

export type TaskType = 'routine' | 'chore';
export type TaskSource = 'manual' | 'template' | 'apple';

export interface MemberSummary {
  slug: string;
  name: string;
  color: string;
  avatar: string | null;
  todo_entity_id: string;
  streak_counter_id: string;
}

export interface TaskMetadata {
  item_uid: string;
  member_slug: string;
  assignee_slug: string;
  type: TaskType;
  recurrence: string;
  icon: string;
  source: TaskSource;
}

export interface RenderableTask {
  uid: string;
  summary: string;
  status: 'needs_action' | 'completed';
  due: string | null;
  description: string;
  metadata: TaskMetadata;
}

export interface CalendarEvent {
  start: string;
  end: string;
  summary: string;
  description?: string;
  location?: string;
  uid?: string;
  pending?: boolean;
  rrule?: string;
  recurrence_id?: string;
}

export interface WeatherForecast {
  datetime: string;
  temperature: number;
  templow?: number;
  condition: string;
  precipitation?: number;
  precipitation_probability?: number;
}

export interface TodoItem {
  uid: string;
  summary: string;
  status: 'needs_action' | 'completed';
  due?: string;
  description?: string;
}

export interface PersonPresence {
  entity_id: string;
  name: string;
  is_home: boolean;
}

export interface CalendarConfig {
  entity: string;
  color: string;
  /**
   * Deprecated and ignored at display time. Previously a per-card label
   * override; the cards now read the calendar entity's `friendly_name`
   * (editable via Settings → Devices & services → Entities). Kept in the
   * type so old saved configs / YAML still parse without errors.
   */
  label?: string;
}
