export type { HassEntity } from 'home-assistant-js-websocket';
export type { HomeAssistant } from 'custom-card-helpers';

export interface CalendarEvent {
  start: string;
  end: string;
  summary: string;
  description?: string;
  location?: string;
  uid?: string;
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
  label: string;
}
