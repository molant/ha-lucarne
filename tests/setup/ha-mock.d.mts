/** TypeScript declarations for ha-mock.mjs */
import type { HassEntity } from 'home-assistant-js-websocket';

export interface FakeHassCalls {
  subscribeMessage: Array<{ callback: Function; payload: unknown }>;
  sendMessagePromise: Array<{ payload: unknown }>;
  subscribeEvents: Array<{ callback: Function; eventType?: string }>;
  callApi: Array<{ method: string; path: string; body?: unknown }>;
  callService: Array<{ domain: string; service: string; payload?: unknown; target?: unknown }>;
  callWS: Array<{ payload: unknown }>;
}

export interface FakeHass {
  states: Record<string, HassEntity>;
  connection: {
    subscribeMessage(callback: Function, payload: unknown): Promise<() => void>;
    sendMessagePromise(payload: unknown): Promise<unknown>;
    subscribeEvents(callback: Function, eventType?: string): Promise<() => void>;
  };
  callApi(method: string, path: string, body?: unknown): Promise<unknown>;
  callService(domain: string, service: string, payload?: unknown, target?: unknown): Promise<unknown>;
  callWS(payload: unknown): Promise<unknown>;
  calls: FakeHassCalls;
}

export function makeFakeHass(overrides?: Partial<FakeHass>): FakeHass;
